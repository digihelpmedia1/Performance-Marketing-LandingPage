"""Build a Hostinger-ready zip of the website.

Usage (from the project folder):
    python tools/build-hostinger.py

Creates dist/digihelpmedia-hostinger.zip containing only the files that belong
in public_html. Upload it in hPanel > File Manager > public_html and extract it.
"""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    ".htaccess",
    "index.html",
    "privacy.html",
    "404.html",
    "styles.css",
    "script.js",
    "config.js",
    "robots.txt",
    "sitemap.xml",
]
FOLDERS = ["assets"]

out_dir = ROOT / "dist"
out_dir.mkdir(exist_ok=True)
out = out_dir / "digihelpmedia-hostinger.zip"

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for name in FILES:
        z.write(ROOT / name, name)
    for folder in FOLDERS:
        for p in sorted((ROOT / folder).rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(ROOT).as_posix())

with zipfile.ZipFile(out) as z:
    names = z.namelist()
print(f"Built {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB, {len(names)} files)")
for n in names:
    print("  " + n)
