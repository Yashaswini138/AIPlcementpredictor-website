from flask import Blueprint, request, jsonify
from middlewares.auth import token_required
from utils.resume_parser import parse_resume

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/analyze', methods=['POST'])
@token_required
def analyze_resume(current_user):
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
        
    if file and file.filename.endswith('.pdf'):
        try:
            # Parse the resume directly from the file stream
            result = parse_resume(file)
            return jsonify({
                "message": "Resume analyzed successfully",
                "extracted_skills": result["extracted_skills"],
                "suggested_skills": result["suggested_skills"]
            }), 200
        except Exception as e:
            return jsonify({"message": "Error parsing resume", "error": str(e)}), 500
    else:
        return jsonify({"message": "Invalid file type. Only PDF is allowed."}), 400
