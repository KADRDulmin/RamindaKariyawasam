# Targeted resume sources

These sources regenerate the three targeted one-page A4 resumes while preserving the original resume's visual system: cream wave header, circular portrait, orange Cormorant Garamond headings, Manrope body text, two-column layout, and compact linked contact row.

The immutable original is read only to extract its portrait. It is never rewritten.

## Regenerate

From the portfolio root, using Python 3.12:

```powershell
python -m pip install -r "uploads/resume-sources/requirements.txt"
npm install
python "uploads/resume-sources/build_resumes.py"
python "scripts/verify-resumes.py"
```

Pass a variant ID to build one file only: `nodejs-typescript`, `ai-full-stack`, or `java-enterprise`.

Each variant directory contains its editable `content.json` and a small `resume.py` convenience entry point.
