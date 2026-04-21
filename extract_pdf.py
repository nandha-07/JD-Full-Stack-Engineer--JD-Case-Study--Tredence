import pdfplumber

with pdfplumber.open("JD Full Stack Engineer -JD+ Case Study -Tredence.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"\n--- PAGE {i+1} ---")
        text = page.extract_text()
        if text:
            print(text)
