def calculate_placement_probability(profile):
    """
    Mock ML Model (Logistic Regression style)
    Weights are assigned to different features to calculate a probability score.
    """
    def safe_float(val):
        try:
            return float(val) if val else 0.0
        except ValueError:
            return 0.0

    def safe_int(val):
        try:
            return int(val) if val else 0
        except ValueError:
            return 0

    cgpa = safe_float(profile.get('cgpa', 0))
    skills = profile.get('skills', [])
    projects = safe_int(profile.get('projects', 0))
    internships = safe_int(profile.get('internships', 0))
    certifications = safe_int(profile.get('certifications', 0))
    aptitude_score = safe_float(profile.get('aptitude_score', 0)) # out of 100

    # Base score
    score = 0
    
    # CGPA Contribution (max ~40 points)
    # e.g., 9.0 cgpa -> 36 points, 6.0 cgpa -> 12 points
    if cgpa >= 6.0:
        score += (cgpa - 5) * 10
    
    # Skills Contribution (max ~20 points)
    # Assume 10 skills is great. Max 20 points.
    skill_score = min(len(skills) * 2, 20)
    score += skill_score
    
    # Projects Contribution (max ~15 points)
    # Assume 3+ projects is great. 5 points per project.
    project_score = min(projects * 5, 15)
    score += project_score
    
    # Internships Contribution (max ~15 points)
    # 7.5 points per internship
    internship_score = min(internships * 7.5, 15)
    score += internship_score
    
    # Certifications Contribution (max ~10 points)
    cert_score = min(certifications * 5, 10)
    score += cert_score
    
    # Aptitude Score Contribution (max ~10 points)
    apt_score = min((aptitude_score / 100) * 10, 10)
    score += apt_score
    
    # Normalize score between 10% and 99%
    probability = max(10, min(99, int(score)))
    
    # Determine Category
    category = "Low"
    if probability >= 75:
        category = "High"
    elif probability >= 50:
        category = "Medium"
        
    # Mock confidence score
    confidence = min(95, probability + 5) if probability > 50 else max(70, 95 - probability)
    
    return {
        "probability": probability,
        "category": category,
        "confidence": confidence
    }

def generate_recommendations(profile, prediction):
    recommendations = {
        "skills_to_learn": [],
        "projects_suggested": False,
        "internships_suggested": False,
        "general_advice": ""
    }
    
    if len(profile.get('skills', [])) < 5:
        recommendations['skills_to_learn'] = ["Data Structures", "Algorithms", "System Design", "Cloud Computing (AWS/GCP)"]
        
    if int(profile.get('projects', 0)) < 2:
        recommendations['projects_suggested'] = True
        
    if int(profile.get('internships', 0)) == 0:
        recommendations['internships_suggested'] = True
        
    if prediction['probability'] < 50:
        recommendations['general_advice'] = "Focus on improving your core CS fundamentals and try to build at least one full-stack project."
    elif prediction['probability'] < 75:
        recommendations['general_advice'] = "You have a solid foundation. Work on getting an internship or contributing to open source to boost your chances."
    else:
        recommendations['general_advice'] = "Excellent profile! Practice mock interviews and keep refining your problem-solving skills."
        
    return recommendations
