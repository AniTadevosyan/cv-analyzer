from datetime import datetime

from pydantic import BaseModel, Field


class CandidateScoreBreakdown(BaseModel):
    label: str
    score: float


class CandidateResultResponse(BaseModel):
    filename: str
    candidate_name: str
    score: float
    recommendation: str
    strengths: list[str]
    missing_skills: list[str]
    score_breakdown: list[CandidateScoreBreakdown]
    text_preview: str


class AnalysisResponse(BaseModel):
    analysis_id: int
    overall_score: float
    recommendation: str
    top_strengths: list[str]
    top_weaknesses: list[str]
    preferred_skills: list[str]
    candidates: list[CandidateResultResponse]


class AnalysisHistoryItem(BaseModel):
    id: int
    job_description: str = Field(..., description="Truncated job description preview")
    preferred_skills: list[str]
    overall_score: float
    recommendation: str
    created_at: datetime
    candidate_count: int


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
