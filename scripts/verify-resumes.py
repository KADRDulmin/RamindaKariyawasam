"""Verify immutable baseline and generated resume acceptance criteria."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
UPLOADS = ROOT / "uploads"
ORIGINAL = UPLOADS / "Resume - Raminda Kariyawasam.pdf"
ORIGINAL_SHA256 = "F185F90DE4CF709EFEADE67C89B1593A1D06FB2747D5A0CF6685AF3E466954D0"
GENERATED = [
    ("nodejs-typescript", "Resume - Raminda Kariyawasam - NodeJS TypeScript.pdf"),
    ("ai-full-stack", "Resume - Raminda Kariyawasam - AI Full Stack.pdf"),
    ("nodejs-typescript-ai-full-stack", "Resume - Raminda Kariyawasam - NodeJS TypeScript and AI Full Stack.pdf"),
    ("java-enterprise", "Resume - Raminda Kariyawasam - Java Enterprise.pdf"),
]
REQUIRED_LINKS = {
    "mailto:raminda5575@gmail.com",
    "https://www.ramindak.com/",
    "https://www.linkedin.com/in/raminda-dulmin/",
    "tel:+94758702922",
}
PORTRAIT_CLIP = "n 155 751.5 m 155 785.4655 127.4655 813 93.5 813 c 59.53449 813 32 785.4655 32 751.5 c 32 717.5345 59.53449 690 93.5 690 c 127.4655 690 155 717.5345 155 751.5 c W* n"
PORTRAIT_MATRIX = "142.3611 0 0 195.0544 21.92141 618.3413 cm"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def links(page) -> set[str]:
    result: set[str] = set()
    for reference in page.get("/Annots", []):
        annotation = reference.get_object()
        action = annotation.get("/A")
        if action and action.get("/URI"):
            result.add(str(action.get("/URI")))
    return result


def main() -> int:
    failures: list[str] = []
    baseline_hash = sha256(ORIGINAL)
    if baseline_hash != ORIGINAL_SHA256:
        failures.append(f"Immutable original hash changed: {baseline_hash}")

    results = {"original_sha256": baseline_hash, "files": []}
    for variant, filename in GENERATED:
        path = UPLOADS / filename
        if not path.exists():
            failures.append(f"Missing generated resume: {filename}")
            continue
        reader = PdfReader(str(path))
        if len(reader.pages) != 1:
            failures.append(f"{filename}: expected one page, found {len(reader.pages)}")
            continue
        page = reader.pages[0]
        page_width = float(page.mediabox.width)
        page_height = float(page.mediabox.height)
        text = page.extract_text() or ""
        normalized = " ".join(text.split())
        page_links = links(page)
        page_stream = page.get_contents().get_data().decode("latin-1", errors="replace")
        image_count = len(page.images)
        resources = page.get("/Resources", {})
        if hasattr(resources, "get_object"):
            resources = resources.get_object()
        fonts = resources.get("/Font", {})
        if hasattr(fonts, "get_object"):
            fonts = fonts.get_object()
        font_count = len(fonts)
        if (page_width, page_height) != (595.0, 842.0):
            failures.append(f"{filename}: expected 595x842 points, found {page_width}x{page_height}")
        for required in ("Raminda Kariyawasam", "Professional Profile", "Education", "MSc Cyber Security and Forensics", "2026 - Present", "Skills", "Experience", "Highlighted Projects", "NSBM University"):
            if required not in normalized:
                failures.append(f"{filename}: missing extractable text {required!r}")
        if len(normalized) < 1500:
            failures.append(f"{filename}: too little extractable text ({len(normalized)} characters)")
        if page_links != REQUIRED_LINKS:
            failures.append(
                f"{filename}: links must be contact-only; "
                f"missing={sorted(REQUIRED_LINKS - page_links)}, "
                f"unexpected={sorted(page_links - REQUIRED_LINKS)}"
            )
        if image_count != 1:
            failures.append(f"{filename}: expected one portrait image, found {image_count}")
        if PORTRAIT_CLIP not in page_stream or PORTRAIT_MATRIX not in page_stream:
            failures.append(f"{filename}: portrait crop no longer matches the immutable original")
        if font_count < 3:
            failures.append(f"{filename}: expected embedded text fonts, found {font_count}")

        source = ROOT / "uploads" / "resume-sources" / variant / "content.json"
        content = json.loads(source.read_text(encoding="utf-8"))
        for project in content["projects"]:
            if project["name"] not in normalized:
                failures.append(f"{filename}: missing project {project['name']!r}")
        results["files"].append({
            "file": filename,
            "pages": len(reader.pages),
            "points": [page_width, page_height],
            "text_characters": len(normalized),
            "links": sorted(page_links),
            "images": image_count,
            "fonts": font_count,
            "sha256": sha256(path),
        })

    print(json.dumps(results, indent=2))
    if failures:
        print("\nFAILURES")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("\nAll resume checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
