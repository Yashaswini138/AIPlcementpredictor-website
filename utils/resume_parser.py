import pdfplumber
import re

# Comprehensive list of common technical skills
COMMON_SKILLS = [
    "python", "java", "c++", "c", "javascript", "typescript", "html", "css",
    "react", "angular", "vue", "node.js", "express", "django", "flask",
    "spring boot", "sql", "mysql", "postgresql", "mongodb", "aws", "docker",
    "kubernetes", "git", "machine learning", "data science", "nlp", "tensorflow",
    "pytorch", "pandas", "numpy", "excel", "tableau", "power bi", "agile",
    "scrum", "c#", ".net", "ruby", "ruby on rails", "php", "laravel"
]

def extract_text_from_pdf(file_stream):
    """Extracts text from a PDF file stream."""
    text = ""
    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def parse_resume(file_stream):
    """
    Parses a resume PDF and extracts matching skills.
    Returns found skills and missing common skills.
    """
    text = extract_text_from_pdf(file_stream).lower()
    
    # Remove punctuation for better matching
    text_clean = re.sub(r'[^\w\s\+#\.]', ' ', text)
    words = set(text_clean.split())
    
    found_skills = []
    
    for skill in COMMON_SKILLS:
        # Exact match or substring match for multi-word skills
        if " " in skill:
            if skill in text_clean:
                found_skills.append(skill)
        else:
            if skill in words:
                found_skills.append(skill)
                
    missing_skills = list(set(COMMON_SKILLS[:15]) - set(found_skills)) # Show top 15 missing if not found
    
    return {
        "extracted_skills": found_skills,
        "suggested_skills": missing_skills[:5] # Top 5 to suggest
    }
