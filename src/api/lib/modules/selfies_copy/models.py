import uuid
from app import db, ApiError
from datetime import datetime
from sqlalchemy.orm import validates

class Selfie_Users(db.Model):
    __tablename__ = 'selfie_users'
    selfie_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.Text(), nullable=False)

    @validates("answer")
    def validate_answer(self, key, answer):
        if not answer:
            raise ApiError("Missing answer")

        if len(answer) <= 1:
            raise ApiError("Answer is too Short")

        return answer

    def __init__(self, selfie_id, user_id, answer):
        self.selfie_id = selfie_id
        self.user_id = user_id
        self.answer = answer

    def as_json(self):
        return {
            "selfie_id": self.selfie_id,
            "user_id": self.user_id, 
            "answer": self.answer
        }
