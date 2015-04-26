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
    user = User(name=data.get('name'), username=data.get('username'),
                email=data.get('email'), password=data.get('password'))
    db.session.add(user)
    db.session.commit()
    return redirect("x/users/%s"%data['username'])

@users.route('/nearby', methods=['GET'])
def nearby(tile):
    nearby_users = AvailableUser.query.filter(AvailableUser.tile == tile)
    nearby_ids = {user.id for user in nearby_users}

    return User.query.filter(User.id in nearby_ids)

@users.route('/<username>', methods=['POST'])
def update(username):
    data = request.get_json(force=True)
    user = User.query.filter(User.username == username)
    if not user.first():
        abort(404)
    else:
        if 'password' in data:
            User.validate_password(data['password'])
        user.update(data)
        db.session.commit()
        return jsonify({"status": "ok"})

@users.route('/<username>', methods=['GET'])
def get(username):
    user = User.query.filter(User.username == username).first()
    if not user:
        abort(404)
    else:
        return jsonify(user.as_json())
