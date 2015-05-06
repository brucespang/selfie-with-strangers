from flask import Blueprint, request, jsonify, redirect, abort
from modules.users.models import User, AvailableUser
from modules.locations.models import Location
from app import db
from itertools import groupby
from modules.locations.util import distance_between, haversine_distance
from models import Proposal
import json, math
import operator

matching = Blueprint('matching', __name__, url_prefix='/matching')

@matching.route('/', methods=['POST'])
def enter_pool():
    data = request.get_json(force=True)
    lat = float(data['lat'])
    lon = float(data['lon'])
    user_id = data['user_id']

    available_user = AvailableUser(user_id, lat, lon)
    db.session.add(available_user)
    status = 'waiting'

    proposal = match_with_user(available_user)
    if proposal:
        db.session.add(proposal)
        status = 'matched'

    db.session.commit()

    return jsonify({'status': status})

@matching.route('/', methods=['DELETE'])
def remove_from_pool():
    data = request.get_json(force=True)
    user = AvailableUser.query.filter(AvailableUser.id == data['uid']).first()

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message':'Successfully removed from matching pool'})

@matching.route('/statuses/<user_id>', methods=['GET'])
def get_status(user_id):
    proposal = Proposal.query.filter(
        Proposal.user1_id == user_id or Proposal.user2_id == user_id
    ).order_by(Proposal.created).first()

    if not proposal:
        abort(404)
    else:
        return jsonify(proposal.as_json())

@matching.route('/proposals/<id>', methods=['GET'])
def get_proposal(id):
    proposal = Proposal.query.filter(Proposal.id == id).first()

    if not proposal:
        abort(404)
    else:
        return jsonify(proposal.as_json())

@matching.route('/status/<user_id>', methods=['POST'])
def update(user_id):
    proposal = Proposal.query.filter(
        Proposal.user1_id == user_id or Proposal.user2_id == user_id
    ).order_by(Proposal.created)

    if not proposal.first():
        abort(404)
    else:
        data = request.get_json(force=True)

        if proposal.user1_id == user_id:
            proposal.user1_accepted = data['accepted']
        else:
            proposal.user2_accepted = data['accepted']

        db.session.commit()
        return jsonify({"status": "ok"})

@matching.route('/update_proposals', methods=['POST'])
def update_proposals():
    # TODO: filter out already matched people
    users = AvailableUser.query.all()
    print users

    matches = []
    matched = set()
    for u1 in users:
        for u2 in users:
            if u1 in matched: next
            if u2 in matched: next
            if u1 == u2: next
            if distance_between(u1, u2) < 1:
                matches.append((u1, u2))
                matched.add(u1)
                matched.add(u2)

    proposals = [build_proposal(u1, u2) for (u1, u2) in matches]

    for prop in proposals:
        db.session.add(prop)
        db.session.commit()

    return jsonify({"proposals": [p.as_json() for p in proposals],
                    "unmatched": [u.as_json() for u in set(users) - matched]})

def match_with_user(user):
    users = AvailableUser.query.all()
    print users

    for u2 in users:
        if u2 == user: continue
        if distance_between(user, u2) < 1:
            return build_proposal(user, u2)
    return None

def build_proposal(user1, user2):
    (location, delay) = get_ranked_locations(user1, user2)[0]

    return Proposal(user1.user_id, user2.user_id, location.id, delay)

def get_ranked_locations(user1, user2):
    locations = Location.query.all()

    scored_locs = [(loc, get_delay(user1, user2, loc))
                   for loc in locations]

    return sorted(scored_locs, key=operator.itemgetter(1))

def get_delay(user1, user2, location):
    loc_lat, loc_lon = (location.lat, location.lon)
    d1 = haversine_distance(user1.lat, user1.lon, loc_lat, loc_lon)
    d2 = haversine_distance(user2.lat, user2.lon, loc_lat, loc_lon)

    return math.ceil(max([d1, d2])/(1.4*60))
