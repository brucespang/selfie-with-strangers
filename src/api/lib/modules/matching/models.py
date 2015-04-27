import uuid
import bcrypt
from app import db
from datetime import datetime

class Proposal(db.Model):

    __tablename__ = 'proposals'
    id = db.Column(db.String(), primary_key=True)
    user1_id = db.Column(db.String(), nullable=False)
    user2_id = db.Column(db.String(), nullable=False)
    location = db.Column(db.String(), nullable=False)
    tile = db.Column(db.String(), nullable=False)
    delay = db.Column(db.SmallInteger(), nullable=False)
    user1_accepted = db.Column(db.Boolean())
    user2_accpeted = db.Column(db.Boolean())
    created = db.Column(db.DateTime(), default=db.func.current_timestamp())

    def __init__(self, user1_id, user2_id, location, tile, delay):
        self.id = str(uuid.uuid1())
        self.user1_id = user1_id
        self.user2_id = user2_id
        self.location = location
        self.tile = tile
        self.delay = delay
        self.user1_accepted = None
        self.user2_accepted = None

    def update_accepted(accepted):
        self.accepted = accepted

    def as_json():
        return{
            'id': self.id,
            'user1_id': self.user1_id,
            'user2_id': self.user2_id,
            'location': self.location,
            'tile': self.tile,
            'delay': self.delay,
            'user1_accepted': self.user1_accepted,
            'user2_accepted': self.user1_accepted,
            'created': self.created
        }
