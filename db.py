import os
from dotenv import load_dotenv
from pymongo import MongoClient
import uuid

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/placement_predictor')

client = MongoClient(MONGO_URI)
db = client.get_database() # This uses the database name specified in the URI

users_collection = db['users']

# Optional: Add indexes for performance
users_collection.create_index("email", unique=True)
