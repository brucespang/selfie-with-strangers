from flask import Blueprint, request, jsonify, abort, redirect
from models import User
import json
from app import db

users = Blueprint('users', __name__, url_prefix='/users')

@users.route('/', methods=['GET'])
def list():
    users = User.query.all()
    return jsonify({"data": [u.as_json() for u in users]})

@users.route('/', methods=['POST'])
def create():
    data = request.get_json(force=True)
    user = User(name=data['name'], username=data['username'],
                email=data['email'], password=data['password'])
    db.session.add(user)
    db.session.commit()
    return redirect("/users/%s"%data['username'])

@users.route('/nearby', methods=['GET'])
def nearby():
    return jsonify({"users": [{"username": "test", "name": "test"}]})

@users.route('/<username>', methods=['GET'])
def get(username):
    user = User.query.filter(User.username == username).first()
    if not user:
        abort(404)
    else:
        return jsonify(user.as_json())
