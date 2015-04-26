from flask import Blueprint, request, jsonify, abort, redirect
from models import Location
import json
from app import db

locations = Blueprint('locations', __name__, url_prefix='/locations')

@locations.route('/', methods=['GET'])
def list():
    locations = Location.query.all()
    return jsonify({"data": [location.as_json() for location in locations]})

@locations.route('/nearby', methods=['GET'])
def nearby(tile):
    nearby_locs = Location.query.filter(Location.tile == tile).all()

    return jsonify([loc.as_json() for loc in nearby_locs])
