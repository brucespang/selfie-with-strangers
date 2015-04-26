from flask import Blueprint, request, jsonify, abort, redirect
from models import User
import json
from app import db

locations = Blueprint('locations', __name__, url_prefix='/locations')

@locations.route('/', methods=['GET'])
def list():
    locations = Location.query.all()
    return jsonify({"data": [location.as_json() for location in locations]})

@locations.route('/nearby', methods=['GET'])
def nearby(tile):
    nearby_locs = Location.query.filter(Location.tile == tile)
    nearby_ids = {location.id for location in nearby_locs}

    return Location.query.filter(Location.id in nearby_ids)
