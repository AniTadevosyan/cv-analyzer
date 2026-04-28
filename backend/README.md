# CV Analyzer Backend

FastAPI backend for the uploaded CV Analyzer frontend.

## Features
- Resume upload endpoint for PDF, DOCX, and TXT files
- Text extraction from resumes
- Job-description matching using TF-IDF + cosine similarity
- Preferred skill matching
- Candidate ranking and recommendation labels
- SQLite persistence for analysis history
- OpenAPI docs via Swagger UI

## Project structure
```
backend/
  app/
    api/
    core/
    db/
    models/
    schemas/
    services/
    main.py
  tests/
  requirements.txt
```

## Run locally
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API base URL:
- `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

## Main endpoints
- `GET /api/health`
- `POST /api/analyze`
- `GET /api/analyses`
- `GET /api/analyses/{analysis_id}`

## Example analyze request
Use `multipart/form-data`:
- `job_description`: string
- `preferred_skills`: comma-separated string
- `files`: one or more files

Example with cURL:
```bash
curl -X POST "http://127.0.0.1:8000/api/analyze" \
  -F "job_description=We need a Python backend developer with FastAPI and Docker" \
  -F "preferred_skills=Python,FastAPI,Docker,SQL" \
  -F "files=@./sample_resume.pdf"
```

## Frontend integration idea
The current frontend is still mock-based. Replace the fake upload logic in `AnalyzePage.tsx` with a real `FormData` submission to `/api/analyze`, then render the response in `ResultsPage.tsx`.
