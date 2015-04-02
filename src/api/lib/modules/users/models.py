from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated = db.Column(db.DateTime, default=db.func.current_timestamp(),
                        onupdate=db.func.current_timestamp())
    name = db.Column(db.Text(), nullable=False)
    username = db.Column(db.Text(), nullable=False)
    email = db.Column(db.Text(), nullable=False, unique=True)
    password_hash = db.Column(db.String(192), nullable=False)
    role = db.Column(db.SmallInteger, nullable=False)
