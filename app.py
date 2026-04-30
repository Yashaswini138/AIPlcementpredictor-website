from flask import Flask, jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv
import os
# Import the collection from your db.py file
from db import users_collection 

# Define the logic function so the 'predict' route can use it
def calculate_probability(profile):
    # This is a simple formula; you can replace it with your ML model later
    score = (profile['cgpa'] * 8) + (len(profile['skills']) * 2) + (profile['internships'] * 7)
    return min(99, round(score, 2)) # Caps at 99%
# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Import Routes
from routes.auth_routes import auth_bp
from routes.predict_routes import predict_bp
from routes.resume_routes import resume_bp
from routes.user_routes import user_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(predict_bp, url_prefix='/api/predict')
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(user_bp, url_prefix='/api/user')

@app.route('/')
def health_check():
    return jsonify({"status": "healthy", "message": "AI Placement Predictor API is running."})
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    email = data.get('email') # Use email or ID to find the user
    
    # 1. Get data from the frontend form
    new_profile = {
        'cgpa': float(data.get('cgpa', 0)),
        'skills': data.get('skills', []),
        'projects': int(data.get('projects', 0)),
        'internships': int(data.get('internships', 0)),
        'aptitude_score': int(data.get('aptitude_score', 0))
    }

    # 2. Run your AI/Math logic here
    # Example: probability = (cgpa * 10) + (internships * 5) ...
    probability = calculate_probability(new_profile) 
    category = "High" if probability > 70 else "Medium" if probability > 40 else "Low"

    # 3. UPDATE the database
    users_collection.update_one(
        {'email': email},
        {'$set': {
            'profile': new_profile,
            'prediction': {
                'probability': probability,
                'category': category,
                'confidence': 95 # placeholder
            }
        }}
    )

    return jsonify({"status": "success", "probability": probability})
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)