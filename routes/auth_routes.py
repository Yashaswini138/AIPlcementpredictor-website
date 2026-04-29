from flask import Blueprint, request, jsonify
from db import users_collection
import bcrypt
import jwt
import os
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "name": name,
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "profile": {
            "cgpa": 0,
            "skills": [],
            "projects": 0,
            "internships": 0,
            "certifications": 0,
            "aptitude_score": 0
        },
        "prediction": {
            "probability": 0,
            "category": "Low",
            "confidence": 0
        },
        "created_at": datetime.datetime.utcnow()
    }

    result = users_collection.insert_one(new_user)
    
    # Generate token
    token = jwt.encode({
        'user_id': str(result.inserted_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, os.getenv('JWT_SECRET'), algorithm="HS256")

    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    user = users_collection.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, os.getenv('JWT_SECRET'), algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email'],
            "profile": user.get('profile', {}),
            "prediction": user.get('prediction', {})
        }
    }), 200
