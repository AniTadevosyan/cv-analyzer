# CV Analyzer Project

This project currently contains:
- a Vite + React frontend
- a new FastAPI backend in the `backend/` folder

## Frontend
```bash
npm install
npm run dev
```

## Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Backend docs
After starting the API:
- Swagger UI: `http://127.0.0.1:8000/docs`

## Environment
For the frontend, you can create a `.env` file in the root with:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
