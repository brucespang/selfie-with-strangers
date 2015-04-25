from flask import Blueprint, request, jsonify, redirect, abort
from users.models import User, AvailableUser
import json
from app import db
from itertools import groupby

matching = Blueprint('matching', __name__, url_prefix='/matching')

@matching.route('/', methods=['POST'])
def enter_pool():
    data = request.get_json(force=True)
    location = (float(data['lat']), float(data['lon']))
    username = data['username']
    available_user = AvailableUser(username, location)
    db.session.add(available_user)
    db.session.commit()

    return jsonify({"tile": "test"})

def get_matches(pool):
    groups = groupby(enumerate(pools),
                     lambda x: x[0] % 2)
    lists = [list(users)
             for key, users in groups]
    first = (lists[0], []) \
            if len(lists[0]) <= lists[1] else \
            (lists[0][:-1], [lists[0][-1]])
    second = (lists[1], []) \
             if len(lists[1]) == lists else \
             (lists[1][:-1], [lists[1][-1]])

    return (zip(first[0],second[0]), first[1]+second[1]) 
