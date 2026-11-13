"""Build the Word (.docx) submission documents from the Markdown files in docs/.

Usage: python3 scripts/build-docs.py   (needs: pip install python-docx)

Supports the small Markdown subset used in docs/: headings (#, ##, ###), paragraphs,
bullet and numbered lists, tables, block quotes, **bold**, *italic* and [links](url).
"> [!FILL] ..." becomes a highlighted note to delete before submitting, and every
"[Fill in...]" placeholder is highlighted yellow.
"""
import re
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
NAVY = RGBColor(0x14, 0x34, 0x61)
BLUE = RGBColor(0x22, 0x53, 0x96)
FONT = "Calibri"

FILES = [
    ("part-1-customer-research.md", "Part-1-Customer-Conversations-Man-Matters.docx"),
    ("part-2-solution.md", "Part-2-Solution-Kab-Tak.docx"),
]

INLINE = re.compile(r"(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|\[Fill in[^\]]*\])")


def shade(cell, hex_fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    tc_pr.append(shd)


def shade_paragraph(paragraph, hex_fill):
    p_pr = paragraph._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    p_pr.append(shd)


def add_hyperlink(paragraph, text, url, bold=False):
    r_id = paragraph.part.relate_to(
        url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True
    )
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), r_id)
    run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "225396")
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    r_pr.append(color)
    r_pr.append(underline)
    if bold:
        r_pr.append(OxmlElement("w:b"))
    run.append(r_pr)
    t = OxmlElement("w:t")
    t.text = text
    t.set(qn("xml:space"), "preserve")
    run.append(t)
    link.append(run)
    paragraph._p.append(link)


def add_inline(paragraph, text, bold=False, color=None):
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("[Fill in"):
            run = paragraph.add_run(part)
            run.bold = True
            run.font.highlight_color = WD_COLOR_INDEX.YELLOW
        elif part.startswith("**") and part.endswith("**"):
            inner = part[2:-2]
            if INLINE.search(inner):
                add_inline(paragraph, inner, bold=True, color=color)
            else:
                run = paragraph.add_run(inner)
                run.bold = True
                if color:
                    run.font.color.rgb = color
        elif part.startswith("[") and "](" in part:
            label, url = re.match(r"\[([^\]]+)\]\(([^)]+)\)", part).groups()
            add_hyperlink(paragraph, label, url, bold=bold)
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            run = paragraph.add_run(part[1:-1])
            run.italic = True
            run.bold = bold
        else:
            run = paragraph.add_run(part)
            run.bold = bold
            if color:
                run.font.color.rgb = color


def split_row(line):
    cells = line.strip().strip("|").split("|")
    return [c.strip() for c in cells]


def add_table(doc, rows):
    header, body = rows[0], rows[1:]
    table = doc.add_table(rows=1, cols=len(header))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    small = len(header) >= 6
    for i, text in enumerate(header):
        cell = table.rows[0].cells[i]
        cell.text = ""
        add_inline(cell.paragraphs[0], text, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
        shade(cell, "143461")
    for r, row in enumerate(body):
        cells = table.add_row().cells
        for i in range(len(header)):
            text = row[i] if i < len(row) else ""
            cells[i].text = ""
            add_inline(cells[i].paragraphs[0], text)
            if r % 2 == 1:
                shade(cells[i], "F2F7FC")
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_after = Pt(2)
                for run in p.runs:
                    run.font.size = Pt(8 if small else 10)
    doc.add_paragraph()


def style_document(doc):
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(11)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    for name, size, color in (("Title", 24, NAVY), ("Heading 1", 16, NAVY), ("Heading 2", 13, BLUE), ("Heading 3", 12, NAVY)):
        style = doc.styles[name]
        style.font.name = FONT
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = color
    for section in doc.sections:
        section.left_margin = section.right_margin = Cm(2)
        section.top_margin = section.bottom_margin = Cm(1.8)


def convert(md_path, out_path):
    doc = Document()
    style_document(doc)
    lines = md_path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                if not re.match(r"^\|\s*-", lines[i]):
                    rows.append(split_row(lines[i]))
                i += 1
            add_table(doc, rows)
            continue
        if line.startswith("# "):
            doc.add_heading(line[2:], level=0)
        elif line.startswith("## "):
            doc.add_heading(line[3:], level=1)
        elif line.startswith("### "):
            doc.add_heading(line[4:], level=2)
        elif line.startswith("> "):
            text = line[2:]
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.6)
            if text.startswith("[!FILL]"):
                run = p.add_run("To do before submitting: ")
                run.bold = True
                add_inline(p, text[len("[!FILL]"):].strip())
                shade_paragraph(p, "FFF3B0")
            else:
                add_inline(p, text)
                shade_paragraph(p, "EAF1FB")
        elif re.match(r"^- ", line):
            add_inline(doc.add_paragraph(style="List Bullet"), line[2:])
        elif re.match(r"^\d+\. ", line):
            # Write the number as text: Word's "List Number" style keeps counting across separate lists.
            number, text = re.match(r"^(\d+)\. (.*)$", line).groups()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.9)
            p.paragraph_format.first_line_indent = Cm(-0.6)
            p.paragraph_format.space_after = Pt(3)
            p.add_run(f"{number}.\t")
            add_inline(p, text)
        else:
            add_inline(doc.add_paragraph(), line)
        i += 1
    doc.save(out_path)


if __name__ == "__main__":
    for src, out in FILES:
        convert(DOCS / src, DOCS / out)
        print("wrote", DOCS / out)
