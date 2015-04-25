import uuid
from app import db
from datetime import datetime

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text(), nullable=False)

    def __init__(self, question):
        self.id = str(uuid.uuid1())
        self.question = question

    def as_json(self):
        return {
            "id": self.id,
            "question": self.question
        }
