from flask import Blueprint, request, jsonify
from models import User

users = Blueprint('users', __name__, url_prefix='/users')

@users.route('/', methods=['GET'])
def list():
    users = User.query.all()
    return jsonify({"users": [u.as_json() for u in users]})

@users.route('/nearby', methods=['GET'])
def nearby():
    return jsonify({"users": [{"username": "test", "name": "test"}]})

@users.route('/<username>', methods=['GET'])
def get(username):
    return jsonify({"username": username})
