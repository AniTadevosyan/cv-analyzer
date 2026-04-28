import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Award,
  ThumbsUp,
  Loader2,
  ArrowRight,
  Clock3,
} from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import ScoreCard from "@/components/ScoreCard";
import CandidateCard from "@/components/CandidateCard";
import { Button } from "@/components/ui/button";
import {
  AnalysisHistoryItem,
  AnalysisResponse,
  getAnalysisById,
  getAnalysisHistory,
  getStoredLastAnalysisId,
} from "@/lib/api";

const ResultsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(
    (location.state as { analysis?: AnalysisResponse } | null)?.analysis ?? null,
  );
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(!analysis);
  const [error, setError] = useState<string | null>(null);

  const analysisId = useMemo(() => {
    const fromQuery = searchParams.get("analysisId");
    if (fromQuery && Number.isFinite(Number(fromQuery))) {
      return Number(fromQuery);
    }
    return analysis?.analysis_id ?? getStoredLastAnalysisId();
  }, [analysis?.analysis_id, searchParams]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        setError(null);
        const [loadedAnalysis, loadedHistory] = await Promise.all([
          analysis ? Promise.resolve(analysis) : analysisId ? getAnalysisById(analysisId) : Promise.resolve(null),
          getAnalysisHistory().catch(() => []),
        ]);

        if (ignore) {
          return;
        }

        setAnalysis(loadedAnalysis);
        setHistory(loadedHistory);

        if (!loadedAnalysis) {
          setError("No saved analysis was found yet. Run a new CV analysis first.");
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Could not load the analysis results.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [analysis, analysisId]);

  const topCandidate = analysis?.candidates[0] ?? null;
  const categories = topCandidate?.score_breakdown ?? [];
  const recentHistory = history.slice(0, 5);

  if (isLoading) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Loading analysis results</h2>
            <p className="text-muted-foreground">Pulling the latest saved analysis from the backend.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !analysis) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <h2 className="text-2xl font-semibold">No analysis to show</h2>
            <p className="mt-3 text-muted-foreground">{error ?? "Run a CV analysis and the results will appear here."}</p>
            <Button asChild className="mt-6">
              <Link to="/analyze">Go to Analyze Page</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <SectionHeader
          badge="Analysis Complete"
          title="Resume Analysis Results"
          subtitle="Here's a detailed breakdown of the analysis across all uploaded candidates."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mb-10 max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-elevated"
        >
          <p className="mb-2 text-sm font-medium text-muted-foreground">Overall Match Score</p>
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${analysis.overall_score * 3.27} 327`}
                transform="rotate(-90 60 60)"
                initial={{ strokeDasharray: "0 327" }}
                animate={{ strokeDasharray: `${analysis.overall_score * 3.27} 327` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <span className="text-3xl font-bold text-primary">{analysis.overall_score}%</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {analysis.recommendation}
          </span>
          {analysis.preferred_skills.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {analysis.preferred_skills.map((skill) => (
                <span key={skill} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {categories.length > 0 && (
          <div className="mx-auto mb-12 max-w-5xl">
            <h3 className="mb-4 text-lg font-semibold">Top Candidate Score Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <ScoreCard key={category.label} label={category.label} score={category.score} />
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-4 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {analysis.top_strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {analysis.top_weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {topCandidate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-5xl rounded-xl border border-primary/20 bg-accent p-6"
          >
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Final Recommendation</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Based on the analysis, the strongest current fit is <span className="font-semibold text-foreground">{topCandidate.candidate_name}</span>.
                  Their score is <span className="font-semibold text-foreground">{topCandidate.score}/100</span> with a recommendation of <span className="font-semibold text-foreground">{topCandidate.recommendation}</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Candidate Rankings</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.candidates.map((candidate, index) => (
              <CandidateCard
                key={`${candidate.filename}-${candidate.candidate_name}`}
                name={candidate.candidate_name}
                score={candidate.score}
                strengths={candidate.strengths}
                missing={candidate.missing_skills}
                recommendation={candidate.recommendation as "Strong Match" | "Good Match" | "Moderate Match" | "Low Match"}
                filename={candidate.filename}
                preview={candidate.text_preview}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {recentHistory.length > 0 && (
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Recent Analyses</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recentHistory.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Analysis #{item.id}</p>
                      <p className="mt-1 line-clamp-2 font-medium">{item.job_description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{item.overall_score}</div>
                      <div className="text-xs text-muted-foreground">/100</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.preferred_skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.candidate_count} candidate(s)</span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/results?analysisId=${item.id}`}>
                        Open <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResultsPage;
