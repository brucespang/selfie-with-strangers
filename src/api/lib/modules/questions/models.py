import uuid
from app import db, ApiError
from datetime import datetime
from sqlalchemy.orm import validates

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text(), nullable=False)

    @validates("question")
    def validate_question(self, key, question):
        if not question:
            raise ApiError("Missing question")

        if len(question) <= 1:
            raise ApiError("Question is too short")

        if question[-1] != "?":
            raise ApiError("Question doesn't end with a question mark")

        return question

    def __init__(self, question):
        self.id = str(uuid.uuid1())
        self.question = question

    def as_json(self):
        return {
            "id": self.id,
            "question": self.question
        }
