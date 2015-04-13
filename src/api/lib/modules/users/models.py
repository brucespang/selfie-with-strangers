from app import db

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

    def as_json(self):
        return {
            "id": id,
            "created": created,
            "updated": updated,
            "name": name,
            "username": username,
            "email": email
        }
