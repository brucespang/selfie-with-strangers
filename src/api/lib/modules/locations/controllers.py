from flask import Blueprint, request, jsonify, redirect
from models import Location
from app import db
from  sqlalchemy.sql.expression import func

locations = Blueprint('locations', __name__, url_prefix='/locations')

@locations.route('/', methods=['GET'])
def list():
    locations = Location.query.all()
    return jsonify({"data": [q.as_json() for q in locations]})

@locations.route('/', methods=['POST'])
def create():
    data = request.get_json(force=True)
    location = Location(name=data['name'], lat=data['lat'], lon=data['lon'])
    db.session.add(location)
    db.session.commit()
    return redirect("/locations/%s"%location.id)

@locations.route('/<id>', methods=['GET'])
def get(id):
    location = Location.query.filter(Location.id == id).first()
    if not location:
        abort(404)
    else:
        return jsonify(location.as_json())

@locations.route('/<id>', methods=['POST'])
def update(id):
    data = request.get_json(force=True)
    location = Location.query.filter(Location.id == id)
    if not location.first():
        abort(404)
    else:
        location.update(data)
        db.session.commit()
        return jsonify({"status": "ok"})

@locations.route('/<id>', methods=['DELETE'])
def delete(id):
    location = Location.query.filter(Location.id == id).first()
    if not location:
        abort(404)
    else:
        db.session.delete(location)
        db.session.commit()
        return jsonify({"status": "ok"})
