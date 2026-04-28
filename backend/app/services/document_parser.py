from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PyPDF2 import PdfReader
from docx import Document


class UnsupportedFileTypeError(ValueError):
    pass


SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def extract_text(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileTypeError(f"Unsupported file type: {suffix}")

    if suffix == ".pdf":
        reader = PdfReader(BytesIO(content))
        pages = [(page.extract_text() or "") for page in reader.pages]
        return "\n".join(pages).strip()

    if suffix == ".docx":
        document = Document(BytesIO(content))
        paragraphs = [paragraph.text for paragraph in document.paragraphs]
        return "\n".join(paragraphs).strip()

    return content.decode("utf-8", errors="ignore").strip()
