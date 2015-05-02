import uuid
from app import db, ApiError
from datetime import datetime
from sqlalchemy.orm import validates

class Selfie(db.Model):
    __tablename__ = 'selfies'
    id = db.Column(db.Integer, primary_key=True)
    picture = db.Column(db.Text(), nullable=False)
    qid = db.Column(db.Integer, nullable=False)

    # @validates("question")
    # def validate_question(self, key, question):
    #     if not question:
    #         raise ApiError("Missing question")

    #     if len(question) <= 1:
    #         raise ApiError("Question is too short")

    #     if question[-1] != "?":
    #         raise ApiError("Question doesn't end with a question mark")

    #     return question

    def __init__(self, picture, qid):
        self.id = str(uuid.uuid1())
        self.picture = picture
        self.qid = qid

    def as_json(self):
        return {
            "id": self.id,
            "picture": self.picture, 
            "qid": self.qid
        }
