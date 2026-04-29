from flask import Blueprint, jsonify
from middlewares.auth import token_required
from db import users_collection

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        "user": {
            "id": str(current_user['_id']),
            "name": current_user['name'],
            "email": current_user['email'],
            "profile": current_user.get('profile', {}),
            "prediction": current_user.get('prediction', {}),
            "recommendations": current_user.get('recommendations', {})
        }
    }), 200

@user_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    # Fetch top 10 users sorted by prediction probability
    # Exclude passwords
    top_users_cursor = users_collection.find({}, {"password": 0}).sort("prediction.probability", -1).limit(10)
    
    leaderboard = []
    for user in top_users_cursor:
        leaderboard.append({
            "id": str(user['_id']),
            "name": user['name'],
            "probability": user.get('prediction', {}).get('probability', 0),
            "category": user.get('prediction', {}).get('category', 'Low')
        })
        
    return jsonify({"leaderboard": leaderboard}), 200
