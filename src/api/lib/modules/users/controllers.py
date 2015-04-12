# Import flask dependencies
from flask import Blueprint, request, jsonify

users = Blueprint('users', __name__, url_prefix='/users')

@users.route('/', methods=['GET'])
def list():
    return jsonify({"users": [{"username": "test"}]})

@users.route('/nearby', methods=['GET'])
def nearby():
    return jsonify({"users": [{"username": "test", "name": "test"}]})

@users.route('/<username>', methods=['GET'])
def get(username):
    return jsonify({"username": username})
