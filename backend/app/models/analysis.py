from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    job_description: Mapped[str] = mapped_column(Text, nullable=False)
    preferred_skills: Mapped[str | None] = mapped_column(Text, nullable=True)
    overall_score: Mapped[float] = mapped_column(Float, default=0)
    recommendation: Mapped[str] = mapped_column(String(50), default="No Match")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    candidates: Mapped[list["CandidateResult"]] = relationship(
        back_populates="analysis_run", cascade="all, delete-orphan"
    )


class CandidateResult(Base):
    __tablename__ = "candidate_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    analysis_run_id: Mapped[int] = mapped_column(ForeignKey("analysis_runs.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    candidate_name: Mapped[str] = mapped_column(String(255), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0)
    recommendation: Mapped[str] = mapped_column(String(50), default="No Match")
    strengths: Mapped[str] = mapped_column(Text, default="")
    missing_skills: Mapped[str] = mapped_column(Text, default="")
    extracted_text_preview: Mapped[str] = mapped_column(Text, default="")

    analysis_run: Mapped[AnalysisRun] = relationship(back_populates="candidates")
