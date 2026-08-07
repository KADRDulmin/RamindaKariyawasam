"""Deterministically build Raminda Kariyawasam's targeted one-page resumes."""

from __future__ import annotations

import io
import json
import sys
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont as VariableFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

PAGE = (595, 842)
CREAM = HexColor("#FFEBCB")
ORANGE = HexColor("#D16A0B")
INK = HexColor("#28231F")
SOFT = HexColor("#68615B")
LINE = HexColor("#D9C7AB")
ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = Path(__file__).resolve().parent
ORIGINAL = ROOT / "uploads" / "Resume - Raminda Kariyawasam.pdf"

VARIANTS = {
    "nodejs-typescript": SOURCE_ROOT / "nodejs-typescript" / "content.json",
    "ai-full-stack": SOURCE_ROOT / "ai-full-stack" / "content.json",
    "java-enterprise": SOURCE_ROOT / "java-enterprise" / "content.json",
}


def load_content(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def static_font(source: Path, weight: int, output: Path) -> Path:
    font = VariableFont(source)
    font.flavor = None
    instance = instantiateVariableFont(font, {"wght": weight}, inplace=False)
    instance.save(output)
    return output


def register_fonts(work: Path) -> None:
    fonts = ROOT / "node_modules" / "@fontsource-variable"
    cormorant = fonts / "cormorant-garamond" / "files" / "cormorant-garamond-latin-wght-normal.woff2"
    manrope = fonts / "manrope" / "files" / "manrope-latin-wght-normal.woff2"
    if not cormorant.exists() or not manrope.exists():
        raise FileNotFoundError("Run npm install so the local resume font assets are available.")
    definitions = [
        ("Cormorant", cormorant, 500),
        ("CormorantSemi", cormorant, 650),
        ("Manrope", manrope, 400),
        ("ManropeBold", manrope, 700),
    ]
    for name, source, weight in definitions:
        destination = work / f"{name}.ttf"
        static_font(source, weight, destination)
        pdfmetrics.registerFont(TTFont(name, destination))


def portrait() -> Image.Image:
    page = PdfReader(str(ORIGINAL)).pages[0]
    if not page.images:
        raise RuntimeError("The immutable original no longer contains its portrait image.")
    return page.images[0].image.convert("RGB")


def width(text: str, font: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font, size)


def wrap(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if width(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_lines(canvas: Canvas, text: str, x: float, y: float, max_width: float, *, font: str = "Manrope", size: float = 8.1, leading: float = 10.6, color=INK) -> float:
    canvas.setFillColor(color)
    canvas.setFont(font, size)
    for line in wrap(text, font, size, max_width):
        canvas.drawString(x, y, line)
        y -= leading
    return y


def draw_bullets(canvas: Canvas, bullets: list[str], x: float, y: float, max_width: float, *, size: float = 7.35, leading: float = 9.3, gap: float = 2.0) -> float:
    for bullet in bullets:
        lines = wrap(bullet, "Manrope", size, max_width - 13)
        canvas.setFillColor(SOFT)
        canvas.circle(x + 2.4, y + 2.3, 1.05, fill=1, stroke=0)
        canvas.setFont("Manrope", size)
        for line in lines:
            canvas.drawString(x + 11, y, line)
            y -= leading
        y -= gap
    return y


def heading(canvas: Canvas, title: str, x: float, y: float, *, size: float = 16.5) -> float:
    canvas.setFillColor(ORANGE)
    canvas.setFont("CormorantSemi", size)
    canvas.drawString(x, y, title)
    return y - size - 6


def icon_circle(canvas: Canvas, kind: str, x: float, y: float) -> None:
    canvas.setFillColor(ORANGE)
    canvas.circle(x, y, 6.2, fill=1, stroke=0)
    canvas.setStrokeColor(white)
    canvas.setFillColor(white)
    canvas.setLineWidth(1)
    if kind == "mail":
        canvas.rect(x - 3.2, y - 2.3, 6.4, 4.6, fill=0, stroke=1)
        canvas.line(x - 3.2, y + 2.3, x, y - .2)
        canvas.line(x, y - .2, x + 3.2, y + 2.3)
    elif kind == "web":
        canvas.circle(x, y, 3.3, fill=0, stroke=1)
        canvas.line(x - 3.2, y, x + 3.2, y)
        canvas.ellipse(x - 1.4, y - 3.3, x + 1.4, y + 3.3, fill=0, stroke=1)
    elif kind == "linkedin":
        canvas.setFont("ManropeBold", 5.2)
        canvas.drawCentredString(x, y - 1.8, "in")
    else:
        canvas.setFont("ManropeBold", 5)
        canvas.drawCentredString(x, y - 1.6, "+")


def contact(canvas: Canvas, kind: str, text: str, url: str, x: float, y: float) -> None:
    icon_circle(canvas, kind, x, y + 2.8)
    text_x = x + 13
    canvas.setFillColor(INK)
    canvas.setFont("Manrope", 8.6)
    canvas.drawString(text_x, y, text)
    line_width = width(text, "Manrope", 8.6)
    canvas.setStrokeColor(INK)
    canvas.setLineWidth(.45)
    canvas.line(text_x, y - 1.2, text_x + line_width, y - 1.2)
    canvas.linkURL(url, (text_x, y - 2, text_x + line_width, y + 10), relative=0)


def draw_header(canvas: Canvas, image: Image.Image, role: str) -> None:
    path = canvas.beginPath()
    path.moveTo(0, 842)
    path.lineTo(595, 842)
    path.lineTo(595, 685)
    path.curveTo(520, 713, 420, 716, 305, 681)
    path.curveTo(190, 645, 87, 640, 0, 682)
    path.close()
    canvas.setFillColor(CREAM)
    canvas.drawPath(path, fill=1, stroke=0)

    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG", optimize=False)
    image_bytes.seek(0)
    canvas.saveState()
    clip = canvas.beginPath()
    clip.circle(87.5, 752.5, 62.5)
    canvas.clipPath(clip, fill=0, stroke=0)
    canvas.drawImage(ImageReader(image_bytes), 25, 669, width=125, height=166.7, preserveAspectRatio=False, mask="auto")
    canvas.restoreState()

    canvas.setFillColor(ORANGE)
    role_size = min(12.5, 12.5 * 192 / max(width(role, "CormorantSemi", 12.5), 1))
    canvas.setFont("CormorantSemi", role_size)
    canvas.drawString(165, 792, role)
    canvas.setFillColor(INK)
    canvas.setFont("Cormorant", 28)
    canvas.drawString(165, 755, "Raminda")
    canvas.drawString(165, 722, "Kariyawasam")

    contact(canvas, "mail", "raminda5575@gmail.com", "mailto:raminda5575@gmail.com", 375, 803)
    contact(canvas, "web", "www.ramindak.com", "https://www.ramindak.com/", 375, 782)
    contact(canvas, "linkedin", "linkedin.com/in/raminda-dulmin", "https://www.linkedin.com/in/raminda-dulmin/", 375, 761)
    contact(canvas, "phone", "+94 75-870 29 22", "tel:+94758702922", 375, 740)


def draw_profile(canvas: Canvas, content: dict, x: float, y: float, max_width: float) -> float:
    y = heading(canvas, "Professional Profile", x, y)
    return draw_lines(canvas, content["profile"], x, y, max_width, size=9.0, leading=13.2, color=INK) - 15


def draw_education(canvas: Canvas, x: float, y: float) -> float:
    y = heading(canvas, "Education", x, y)
    entries = [
        ("BSc (Hons) in Software Engineering", "University of Plymouth, UK", "2022 - 2025"),
        ("IT Foundation Programme", "NSBM Green University, Sri Lanka", "2020 - 2021"),
    ]
    for title, place, period in entries:
        canvas.setFillColor(INK)
        canvas.setFont("CormorantSemi", 11.1)
        canvas.drawString(x, y, title)
        y -= 12.2
        canvas.setFillColor(SOFT)
        canvas.setFont("Cormorant", 9.5)
        canvas.drawString(x, y, place)
        y -= 11.1
        canvas.drawString(x, y, period)
        y -= 18
    return y


def draw_skills(canvas: Canvas, groups: list[dict], x: float, y: float, max_width: float) -> float:
    y = heading(canvas, "Skills", x, y)
    column_gap = 14
    column_width = (max_width - column_gap) / 2
    starts = [y, y]
    for index, group in enumerate(groups):
        column = index % 2
        group_x = x + column * (column_width + column_gap)
        group_y = starts[column]
        canvas.setFillColor(INK)
        canvas.setFont("ManropeBold", 8.7)
        canvas.drawString(group_x, group_y, group["title"])
        group_y -= 14
        group_y = draw_bullets(canvas, group["items"], group_x, group_y, column_width, size=8.35, leading=12.1, gap=1.5)
        starts[column] = group_y - 14
    return min(starts)


def draw_experience(canvas: Canvas, content: dict, x: float, y: float, max_width: float) -> float:
    y = heading(canvas, "Experience", x, y)
    for job in content["experience"]:
        title = f'{job["company"]} - {job["title"]}'
        canvas.setFillColor(INK)
        canvas.setFont("CormorantSemi", 10.8)
        canvas.drawString(x, y, title)
        period_width = width(job["period"], "Cormorant", 7.2)
        canvas.setFillColor(SOFT)
        canvas.setFont("Cormorant", 7.7)
        canvas.drawRightString(x + max_width, y, job["period"])
        y -= 14
        y = draw_bullets(canvas, job["bullets"], x + 2, y, max_width - 2, size=8.05, leading=11.4, gap=2.3)
        y -= 6
    return y - 8


def draw_projects(canvas: Canvas, projects: list[dict], x: float, y: float, max_width: float) -> float:
    y = heading(canvas, "Highlighted Projects", x, y)
    for project in projects:
        title = f'{project["name"]} - {project["stack"]}'
        title_lines = wrap(title, "CormorantSemi", 10.3, max_width)
        canvas.setFillColor(INK)
        canvas.setFont("CormorantSemi", 10.3)
        first_y = y
        for line in title_lines:
            canvas.drawString(x, y, line)
            y -= 12.2
        if project.get("url"):
            title_width = min(max_width, width(title_lines[0], "CormorantSemi", 10.3))
            canvas.setStrokeColor(INK)
            canvas.setLineWidth(.4)
            canvas.line(x, first_y - 1, x + title_width, first_y - 1)
            canvas.linkURL(project["url"], (x, y, x + max_width, first_y + 9), relative=0)
        y -= 3
        y = draw_bullets(canvas, project["bullets"], x + 2, y, max_width - 2, size=8.35, leading=12.5, gap=2.5)
        y -= 10
    return y


def build_variant(content: dict, image: Image.Image) -> Path:
    output = ROOT / "uploads" / content["output"]
    canvas = Canvas(str(output), pagesize=PAGE, pageCompression=1, invariant=1)
    canvas.setTitle(content["document_title"])
    canvas.setAuthor("Raminda Kariyawasam")
    canvas.setSubject(content["document_subject"])
    canvas.setCreator("Deterministic ReportLab resume builder")
    draw_header(canvas, image, content["role"])

    left_x, left_width = 25, 265
    right_x, right_width = 315, 255
    left_y = draw_profile(canvas, content, left_x, 622, left_width)
    left_y = draw_education(canvas, left_x, left_y)
    draw_skills(canvas, content["skills"], left_x, left_y, left_width)

    right_y = draw_experience(canvas, content, right_x, 622, right_width)
    final_y = draw_projects(canvas, content["projects"], right_x, right_y, right_width)
    if final_y < 10:
        raise RuntimeError(f'{content["variant"]} overflowed the one-page design: y={final_y:.2f}')

    canvas.showPage()
    canvas.save()
    return output


def main() -> int:
    selected = sys.argv[1:] or list(VARIANTS)
    unknown = [name for name in selected if name not in VARIANTS]
    if unknown:
        raise SystemExit(f"Unknown variant(s): {', '.join(unknown)}")
    with tempfile.TemporaryDirectory(prefix="raminda-resume-") as temp:
        register_fonts(Path(temp))
        image = portrait()
        for name in selected:
            output = build_variant(load_content(VARIANTS[name]), image)
            print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
