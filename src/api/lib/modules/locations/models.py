import uuid
import bcrypt
from math import radians, sin, cos, atan2
from app import db
from datetime import datetime

class Location(db.Model):

    __tablename__ = 'locations'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    lat = db.Column(db.Float(), nullable=False)
    lon = db.Column(db.Float(), nullable=False)

    def __init__(self, name, lat, lon):
        self.id = str(uuid.uuid1())
        self.name = name
        self.lat = lat
        self.lon = lon

    def as_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'lat': self.lat,
            'lon': self.lon
        }
