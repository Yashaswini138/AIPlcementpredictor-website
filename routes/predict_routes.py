from flask import Blueprint, request, jsonify
from middlewares.auth import token_required
from utils.ml_simulator import calculate_placement_probability, generate_recommendations
from db import users_collection

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/', methods=['POST'])
@token_required
def predict_placement(current_user):
    data = request.get_json()
    
    # Extract profile data from request or use existing if not provided
    profile_data = {
        "cgpa": data.get('cgpa', current_user.get('profile', {}).get('cgpa', 0)),
        "skills": data.get('skills', current_user.get('profile', {}).get('skills', [])),
        "projects": data.get('projects', current_user.get('profile', {}).get('projects', 0)),
        "internships": data.get('internships', current_user.get('profile', {}).get('internships', 0)),
        "certifications": data.get('certifications', current_user.get('profile', {}).get('certifications', 0)),
        "aptitude_score": data.get('aptitude_score', current_user.get('profile', {}).get('aptitude_score', 0))
    }
    
    # Calculate Prediction
    prediction = calculate_placement_probability(profile_data)
    
    # Generate Recommendations
    recommendations = generate_recommendations(profile_data, prediction)
    
    # Save the updated profile and prediction to user document
    users_collection.update_one(
        {"_id": current_user['_id']},
        {"$set": {
            "profile": profile_data,
            "prediction": prediction,
            "recommendations": recommendations
        }}
    )
    
    return jsonify({
        "message": "Prediction calculated successfully",
        "profile": profile_data,
        "prediction": prediction,
        "recommendations": recommendations
    }), 200

@predict_bp.route('/simulate', methods=['POST'])
def simulate_placement():
    """
    What-if simulation endpoint without saving to DB. Doesn't require auth.
    """
    data = request.get_json()
    
    profile_data = {
        "cgpa": data.get('cgpa', 0),
        "skills": data.get('skills', []),
        "projects": data.get('projects', 0),
        "internships": data.get('internships', 0),
        "certifications": data.get('certifications', 0),
        "aptitude_score": data.get('aptitude_score', 0)
    }
    
    prediction = calculate_placement_probability(profile_data)
    
    return jsonify({
        "prediction": prediction
    }), 200
