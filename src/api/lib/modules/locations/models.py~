import uuid
import bcrypt
from app import db
from datetime import datetime

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
    role = db.Column(db.SmallInteger, nullable=False)

    user_role = 1
    admin_role = 2

    def __init__(self, name, username, email, password):
        self.id = str(uuid.uuid1())
        self.name = name
        self.username = username
        self.email = email
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.created = datetime.now()
        self.role = User.user_role

    def as_json(self):
        return {
            "id": self.id,
            "created": self.created,
            "updated": self.updated,
            "name": self.name,
            "username": self.username,
            "email": self.email
        }
