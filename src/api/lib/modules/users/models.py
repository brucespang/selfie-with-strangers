import uuid
import bcrypt
from app import db
from datetime import datetime
from location.models import Tile

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated = db.Column(db.DateTime, default=db.func.current_timestamp(),
                        onupdate=db.func.current_timestamp())
    name = db.Column(db.Text(), nullable=False)
    username = db.Column(db.Text(), nullable=False)
    email = db.Column(db.Text(), nullable=False, unique=True)
    password_hash = db.Column(db.String(192), nullable=False)
    password_salt = db.Column(db.String(192), nullable=False)
    role = db.Column(db.SmallInteger, nullable=False)

    user_role = 1
    admin_role = 2

    def __init__(self, name, username, email, password):
        self.id = str(uuid.uuid1())
        self.name = name
        self.username = username
        self.email = email
        self.password_salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), self.password_salt)
        self.created = datetime.now()
        self.role = User.user_role

    def as_json(self):
        return {
            "id": self.id,
            "created": self.created,
            "updated": self.updated,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "admin": self.role == User.admin_role
        }

    def check_password(self, password):
        hashed = bcrypt.hashpw(password.encode('utf-8'), self.password_salt.encode('utf-8'))
        return self.secure_equals(self.password_hash.encode('ascii'), hashed.encode('ascii'))

    def secure_equals(self, a, b):
        """check if a == b without being exposed to timing attacks.
        see http://codahale.com/a-lesson-in-timing-attacks/ for more information."""
        if len(a) != len(b):
            return False

        result = 0
        for x, y in zip(bytearray(a), bytearray(b)):
            result |= x ^ y
        return result == 0


class AvailableUser(db.Model):
    __tablename__ = 'available_users'
    username = db.Column(db.String(), primary_key=True)
    joined = db.Column(db.DateTime())
    tile_id = db.Column(db.String())
    tile_name = db.Column(db.String())
    lat = db.Column(db.Float())
    lon = db.Column(db.Float())

    def __init__(self, username, lat, lon):
        self.username = username
        self.joined = db.func.current_timestamp()
        self.tile = get_tile(lat, lon)
        self.lat = lat
        self.lon = lon

    def get_tile(lat, lon):

        return 1

    def as_json(self):
        return {
            "id": self.id,
            "joined": self.joined,
            "tile": self.tile
        }
