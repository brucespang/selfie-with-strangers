from flask import Blueprint, request, jsonify, redirect, abort
from users.models import User, AvailableUser
from locations.models import Location
from app import db
from itertools import groupby
from locations.util import get_distance
import json, math

matching = Blueprint('matching', __name__, url_prefix='/matching')
locations = Location.query.all()

@matching.route('/add', methods=['POST'])
def enter_pool():
    data = request.get_json(force=True)
    lat = float(data['lat'])
    lon = float(data['lon']))
    username = data['username']
    available_user = AvailableUser(username, lat, lon)

    db.session.add(available_user)
    db.session.commit()

    return jsonify({'tile': 'test'})

@matching.route('/remove', methods=['POST'])
def remove_from_pool():
    data = request.get_json(force=True)
    user = AvailableUser.query.filter(AvailableUser.id == data['uid']).first()

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message':'Successfully removed from matching pool'})

@matching.route('/update_status', methods=['GET'])
def get_status():
    data = request.get_json(force=True)
    proposal = Proposal.query.filter(
        (Proposal.user1_id == data['uid'] 
         or Proposal.user2_id == data['uid']) and \
         not (Proposal.user1_accepted == False
         or Proposal.user2_accepted == False)
    ).first()

    return jsonify(proposal.as_json()) 

@matching.route('/accept_or_decline', methods=['POST'])
def make_proposal_decision():
    data = request.get_json(force=True)
    

@matching.route('/update_prososals', methods=['POST'])
def update_proposals():
    #Need to decide how to deal with people who are too far away from existing meeting locations
    users = AvailableUser.query.all() 
    tile2users = groupby(users,
                         lambda x: x.tile)
    add_matches = lambda x,y: x + match_pool(list(y))[0]
    matches = reduce(add_matches,
                     tile2users,
                     [])
    proposals = [get_proposal(match)
                 for match in matches]
    for prop in proposals:
        db.session.add(prop)
        db.commit()

def get_proposal(match):
    user1, user2 = match
    (location, delay) = get_location(match)
    
    return Proposal(
        user1.id,
        user2.id,
        location.id,
        location.tile,
        delay
    )

def get_ranked_locations(match):
    scored_locs = [(loc, get_delay(match, loc))
                   for loc in locations] 

    return sorted(scored_locs, key=lambda loc: loc[1])

def get_delay(match, location):
    user1, user2 = match
    loc_lat, loc_lon = (location.lat, location.lon)
    d1 = get_distance(user1.lat, user1.lon, loc_lat, loc_lon)
    d2 = get_distance(user2.lat, user2.lon, loc_lat, loc_lon)

    return math.ceil(max([d1, d2])/(1.4*60))

def match_pool(pool):
    groups = groupby(enumerate(pool),
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
