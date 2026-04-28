from app.services.analyzer import analyze_resumes


def test_analyze_resumes_orders_best_match_first() -> None:
    job = "Python backend developer with FastAPI, SQL, Docker and API design experience"
    resumes = [
        ("alice_resume.txt", "Python FastAPI SQL Docker REST APIs 5 years experience"),
        ("bob_resume.txt", "Graphic design branding illustration figma"),
    ]

    result = analyze_resumes(job, ["Python", "FastAPI", "Docker"], resumes)

    assert len(result["candidates"]) == 2
    assert result["candidates"][0].candidate_name == "Alice Resume"
    assert result["candidates"][0].score >= result["candidates"][1].score
