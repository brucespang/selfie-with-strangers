import uuid
import bcrypt
from math import radians, sin, cos, atan2
from app import db
from datetime import datetime

class Tile(db.Model):

    __tablename__ = 'tiles'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    lat = db.Column(db.Float(), nullable=False)
    lon = db.Column(db.Float(), nullable=False)

    def __init__(self, name, lat, lon):
        self.id = str(uuid.uuid1())
        self.name = name
        self.lat = lat
        self.lon = lon

    def get_distance(self, lat, lon):

        return get_distance(self.lat, self.lon, lat, lon)

class Location(db.Model):

    __tablename__ = 'locations'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    lat = db.Column(db.Float(), nullable=False)
    lon = db.Column(db.Float(), nullabl=False)

    def __init__(self, name, lat, lon):
        self.id = str(uuid.uuid1())
        self.name = name
        self.lat = lat
        self.lon = lon
