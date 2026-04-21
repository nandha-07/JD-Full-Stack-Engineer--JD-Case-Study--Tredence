import sys
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with pdfplumber.open("JD Full Stack Engineer -JD+ Case Study -Tredence.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"\n=== PAGE {i+1} ===")
        words = page.extract_words()
        if words:
            lines = {}
            for w in words:
                y = round(w['top'], 0)
                if y not in lines:
                    lines[y] = []
                lines[y].append(w)
            
            for y in sorted(lines.keys()):
                line_words = sorted(lines[y], key=lambda w: w['x0'])
                print(' '.join(w['text'] for w in line_words))
