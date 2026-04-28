from __future__ import annotations

import json
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.analysis import AnalysisRun, CandidateResult
from app.schemas.analysis import AnalysisHistoryItem, AnalysisResponse, CandidateResultResponse, HealthResponse
from app.services.analyzer import analyze_resumes
from app.services.document_parser import UnsupportedFileTypeError, extract_text

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", app=settings.app_name, version=settings.app_version)


@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_candidates(
    job_description: Annotated[str, Form(...)],
    preferred_skills: Annotated[str | None, Form()] = None,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
) -> AnalysisResponse:
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    if not files:
        raise HTTPException(status_code=400, detail="At least one resume file is required.")

    preferred_skill_list = [skill.strip() for skill in (preferred_skills or "").split(",") if skill.strip()]
    parsed_resumes: list[tuple[str, str]] = []

    max_bytes = settings.max_upload_size_mb * 1024 * 1024

    for file in files:
        content = await file.read()
        if len(content) > max_bytes:
            raise HTTPException(status_code=413, detail=f"{file.filename} exceeds upload limit.")
        try:
            text = extract_text(file.filename, content)
        except UnsupportedFileTypeError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        if not text.strip():
            raise HTTPException(status_code=400, detail=f"Could not extract readable text from {file.filename}.")

        parsed_resumes.append((file.filename, text))

    analysis = analyze_resumes(
        job_description=job_description,
        preferred_skills=preferred_skill_list,
        resumes=parsed_resumes,
    )

    analysis_run = AnalysisRun(
        job_description=job_description,
        preferred_skills=json.dumps(preferred_skill_list),
        overall_score=analysis["overall_score"],
        recommendation=analysis["recommendation"],
    )
    db.add(analysis_run)
    db.flush()

    response_candidates: list[CandidateResultResponse] = []

    for candidate in analysis["candidates"]:
        db_candidate = CandidateResult(
            analysis_run_id=analysis_run.id,
            filename=candidate.filename,
            candidate_name=candidate.candidate_name,
            score=candidate.score,
            recommendation=candidate.recommendation,
            strengths=json.dumps(candidate.strengths),
            missing_skills=json.dumps(candidate.missing_skills),
            extracted_text_preview=candidate.text_preview,
        )
        db.add(db_candidate)
        response_candidates.append(
            CandidateResultResponse(
                filename=candidate.filename,
                candidate_name=candidate.candidate_name,
                score=candidate.score,
                recommendation=candidate.recommendation,
                strengths=candidate.strengths,
                missing_skills=candidate.missing_skills,
                score_breakdown=candidate.score_breakdown,
                text_preview=candidate.text_preview,
            )
        )

    db.commit()
    db.refresh(analysis_run)

    return AnalysisResponse(
        analysis_id=analysis_run.id,
        overall_score=analysis["overall_score"],
        recommendation=analysis["recommendation"],
        top_strengths=analysis["top_strengths"],
        top_weaknesses=analysis["top_weaknesses"],
        preferred_skills=preferred_skill_list,
        candidates=response_candidates,
    )


@router.get("/analyses", response_model=list[AnalysisHistoryItem])
def list_analyses(db: Session = Depends(get_db)) -> list[AnalysisHistoryItem]:
    runs = db.query(AnalysisRun).order_by(AnalysisRun.created_at.desc()).all()
    result: list[AnalysisHistoryItem] = []

    for run in runs:
        skills = json.loads(run.preferred_skills) if run.preferred_skills else []
        result.append(
            AnalysisHistoryItem(
                id=run.id,
                job_description=(run.job_description[:120] + "...") if len(run.job_description) > 120 else run.job_description,
                preferred_skills=skills,
                overall_score=round(run.overall_score, 2),
                recommendation=run.recommendation,
                created_at=run.created_at,
                candidate_count=len(run.candidates),
            )
        )

    return result


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)) -> AnalysisResponse:
    run = db.query(AnalysisRun).filter(AnalysisRun.id == analysis_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    candidates = sorted(run.candidates, key=lambda item: item.score, reverse=True)
    response_candidates = [
        CandidateResultResponse(
            filename=item.filename,
            candidate_name=item.candidate_name,
            score=round(item.score, 2),
            recommendation=item.recommendation,
            strengths=json.loads(item.strengths) if item.strengths else [],
            missing_skills=json.loads(item.missing_skills) if item.missing_skills else [],
            score_breakdown=[],
            text_preview=item.extracted_text_preview,
        )
        for item in candidates
    ]

    weakness_counts: dict[str, int] = {}
    for candidate in response_candidates:
        for skill in candidate.missing_skills:
            weakness_counts[skill] = weakness_counts.get(skill, 0) + 1

    top_weaknesses = [k for k, _ in sorted(weakness_counts.items(), key=lambda x: x[1], reverse=True)[:4]]

    return AnalysisResponse(
        analysis_id=run.id,
        overall_score=round(run.overall_score, 2),
        recommendation=run.recommendation,
        top_strengths=response_candidates[0].strengths[:4] if response_candidates else [],
        top_weaknesses=top_weaknesses,
        preferred_skills=json.loads(run.preferred_skills) if run.preferred_skills else [],
        candidates=response_candidates,
    )
