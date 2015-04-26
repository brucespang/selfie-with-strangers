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
    meeting_time = db.Column(db.DateTime(), nullable=False)
    accepted = db.Column(db.Boolean())
    created = db.Column(db.DateTime(), default=db.func.current_timestamp())

    def __init__(self, user1_id, user2_id, location, meeting_time, accepted=None):
        self.id = str(uuid.uuid1())
        self.user1_id = user1_id
        self.user2_id = user2_id
        self.location = location
        self.meeting_time = meeting_time
        self.accepted = accepted

    def update_accepted(accepted):
        self.accepted = accepted

    def as_json():
        return{
            'id': self.id,
            'user1_id': self.user1_id,
            'user2_id': self.user2_id,
            'location': self.location,
            'meeting_time': self.meeting_time,
            'accepted': self.accepted,
            'created': self.created
        }
