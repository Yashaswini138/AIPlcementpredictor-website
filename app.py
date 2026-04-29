from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
