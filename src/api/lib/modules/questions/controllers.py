from flask import Blueprint, request, jsonify, redirect
from models import Question
from app import db

questions = Blueprint('questions', __name__, url_prefix='/questions')

@questions.route('/', methods=['GET'])
def list():
    questions = Question.query.all()
    return jsonify({"data": [q.as_json() for q in questions]})

@questions.route('/', methods=['POST'])
def create():
    data = request.get_json(force=True)
    question = Question(question=data['question'])
    db.session.add(question)
    db.session.commit()
    return redirect("/questions/%s"%question.id)

@questions.route('/<id>', methods=['GET'])
def get(id):
    question = Question.query.filter(Question.id == id).first()
    if not question:
        abort(404)
    else:
        return jsonify(question.as_json())

@questions.route('/<id>', methods=['POST'])
def update(id):
    data = request.get_json(force=True)
    question = Question.query.filter(Question.id == id).first()
    if not question:
        abort(404)
    else:
        question.question = data['question']
        db.session.commit()
        return jsonify({"status": "ok"})

@questions.route('/<id>', methods=['DELETE'])
def delete(id):
    question = Question.query.filter(Question.id == id).first()
    if not question:
        abort(404)
    else:
        db.session.delete(question)
        db.session.commit()
        return jsonify({"status": "ok"})

@questions.route('/random', methods=['GET'])
def random():
    return jsonify({"id": 123, "question": "do it ride good?"})
