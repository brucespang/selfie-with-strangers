from flask import Blueprint, request, jsonify, redirect, abort
from users.models import User, AvailableUser
import json
from app import db

matching = Blueprint('matching', __name__, url_prefix='/matching')

@matching.route('/', methods=['POST'])
def enter_pool(location):
    data = request.get_json(force=True)
    location = (float(data['lat']), float(data['lon']))
    username = data['username']
    available_user = AvailableUser(username, location)
    db.session.add(available_user)
    db.session.commit()

    return redirect("/matching/%s" % username)
