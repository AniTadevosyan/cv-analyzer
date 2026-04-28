from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

WORD_RE = re.compile(r"[A-Za-z][A-Za-z+#.\-/]{1,}")


@dataclass
class CandidateAnalysis:
    filename: str
    candidate_name: str
    score: float
    recommendation: str
    strengths: list[str]
    missing_skills: list[str]
    score_breakdown: list[dict]
    text_preview: str


def normalize_name(filename: str) -> str:
    stem = Path(filename).stem
    clean = re.sub(r"[_\-]+", " ", stem).strip()
    return clean.title() or "Unknown Candidate"


def tokenize(text: str) -> list[str]:
    return [match.group(0).lower() for match in WORD_RE.finditer(text)]


def extract_keywords(text: str, limit: int = 20) -> list[str]:
    tokens = [token for token in tokenize(text) if token not in ENGLISH_STOP_WORDS and len(token) > 2]
    counts = Counter(tokens)
    return [word for word, _ in counts.most_common(limit)]


def score_to_recommendation(score: float) -> str:
    if score >= 85:
        return "Strong Match"
    if score >= 70:
        return "Good Match"
    if score >= 55:
        return "Moderate Match"
    return "Low Match"


def compute_candidate_score(resume_text: str, job_description: str, preferred_skills: list[str]) -> tuple[float, list[dict], list[str], list[str]]:
    documents = [job_description, resume_text]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(documents)
    similarity_score = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0] * 100)

    job_keywords = set(extract_keywords(job_description, limit=30))
    resume_keywords = set(extract_keywords(resume_text, limit=40))
    overlap = len(job_keywords & resume_keywords)
    keyword_score = min(100.0, (overlap / max(1, len(job_keywords))) * 100)

    normalized_resume = resume_text.lower()
    normalized_skills = [skill.strip().lower() for skill in preferred_skills if skill.strip()]
    matched_skills = [skill for skill in normalized_skills if skill in normalized_resume]
    missing_skills = [skill for skill in normalized_skills if skill not in normalized_resume]
    skills_score = 100.0 if not normalized_skills else (len(matched_skills) / len(normalized_skills)) * 100

    experience_hints = ["years", "experience", "led", "managed", "developed", "built", "delivered"]
    exp_hits = sum(1 for token in experience_hints if token in normalized_resume)
    experience_score = min(100.0, exp_hits / len(experience_hints) * 100)

    education_hints = ["bachelor", "master", "phd", "university", "certification", "degree"]
    edu_hits = sum(1 for token in education_hints if token in normalized_resume)
    education_score = min(100.0, edu_hits / max(1, len(education_hints)) * 100)

    weighted_score = (
        similarity_score * 0.4
        + skills_score * 0.3
        + keyword_score * 0.15
        + experience_score * 0.1
        + education_score * 0.05
    )

    breakdown = [
        {"label": "Job Similarity", "score": round(similarity_score, 2)},
        {"label": "Skills Match", "score": round(skills_score, 2)},
        {"label": "Keywords", "score": round(keyword_score, 2)},
        {"label": "Experience Signals", "score": round(experience_score, 2)},
        {"label": "Education Signals", "score": round(education_score, 2)},
    ]

    strengths = matched_skills[:5] or list(resume_keywords & job_keywords)[:5]
    if not strengths:
        strengths = ["General relevance to the role"]

    if not missing_skills:
        missing_skills = list(job_keywords - resume_keywords)[:5]

    return round(weighted_score, 2), breakdown, strengths, missing_skills[:5]


def analyze_resumes(job_description: str, preferred_skills: list[str], resumes: list[tuple[str, str]]) -> dict:
    results: list[CandidateAnalysis] = []

    for filename, text in resumes:
        score, breakdown, strengths, missing_skills = compute_candidate_score(
            resume_text=text,
            job_description=job_description,
            preferred_skills=preferred_skills,
        )
        candidate = CandidateAnalysis(
            filename=filename,
            candidate_name=normalize_name(filename),
            score=score,
            recommendation=score_to_recommendation(score),
            strengths=[item.title() for item in strengths],
            missing_skills=[item.title() for item in missing_skills],
            score_breakdown=breakdown,
            text_preview=text[:400].replace("\n", " ").strip(),
        )
        results.append(candidate)

    results.sort(key=lambda item: item.score, reverse=True)
    overall_score = round(float(np.mean([item.score for item in results])) if results else 0.0, 2)
    top_strengths = results[0].strengths[:4] if results else []

    weakness_counter = Counter(skill for item in results for skill in item.missing_skills)
    top_weaknesses = [skill for skill, _ in weakness_counter.most_common(4)]

    return {
        "overall_score": overall_score,
        "recommendation": score_to_recommendation(results[0].score if results else 0.0),
        "top_strengths": top_strengths,
        "top_weaknesses": top_weaknesses,
        "candidates": results,
    }
