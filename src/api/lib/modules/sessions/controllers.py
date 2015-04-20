# Import flask dependencies
from flask import Blueprint, request, render_template, \
    flash, g, session, redirect, url_for, abort, jsonify
from helpers import current_user
from app import db
from modules.users.models import User

sessions = Blueprint('sessions', __name__, url_prefix='/sessions')

@sessions.route('/', methods=['POST'])
def new():
    data = request.get_json(force=True)

    # TODO: handle facebook auth

    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify(user.as_json())
    else:
        abort(401)

@sessions.route('/current', methods=['GET'])
def current():
    user = current_user()
    if user:
        return jsonify(user.as_json())
    else:
        abort(404)
