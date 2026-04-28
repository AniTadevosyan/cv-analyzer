export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const LAST_ANALYSIS_ID_STORAGE_KEY = "cv_analyzer_last_analysis_id";

export interface CandidateResult {
  filename: string;
  candidate_name: string;
  score: number;
  recommendation: string;
  strengths: string[];
  missing_skills: string[];
  score_breakdown: { label: string; score: number }[];
  text_preview: string;
}

export interface AnalysisResponse {
  analysis_id: number;
  overall_score: number;
  recommendation: string;
  top_strengths: string[];
  top_weaknesses: string[];
  preferred_skills: string[];
  candidates: CandidateResult[];
}

export interface AnalysisHistoryItem {
  id: number;
  job_description: string;
  preferred_skills: string[];
  overall_score: number;
  recommendation: string;
  created_at: string;
  candidate_count: number;
}

async function parseJsonOrNull(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function analyzeCvFiles(params: {
  jobDescription: string;
  preferredSkills: string[];
  files: File[];
}): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("job_description", params.jobDescription);
  formData.append("preferred_skills", params.preferredSkills.join(","));

  params.files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await parseJsonOrNull(response);
    throw new Error(errorBody?.detail || "Analysis failed.");
  }

  const data = (await response.json()) as AnalysisResponse;
  localStorage.setItem(LAST_ANALYSIS_ID_STORAGE_KEY, String(data.analysis_id));
  return data;
}

export async function getAnalysisById(analysisId: number | string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}`);

  if (!response.ok) {
    const errorBody = await parseJsonOrNull(response);
    throw new Error(errorBody?.detail || "Could not load analysis.");
  }

  return response.json();
}

export async function getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/analyses`);

  if (!response.ok) {
    const errorBody = await parseJsonOrNull(response);
    throw new Error(errorBody?.detail || "Could not load analysis history.");
  }

  return response.json();
}

export function getStoredLastAnalysisId(): number | null {
  const rawValue = localStorage.getItem(LAST_ANALYSIS_ID_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}
