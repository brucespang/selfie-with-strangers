from flask import Blueprint, request, jsonify, redirect
from models import Selfie
from app import db
from  sqlalchemy.sql.expression import func

selfies = Blueprint('selfies', __name__, url_prefix='/selfies')

@selfies.route('/', methods=['GET'])
def list():
    selfies = Selfie.query.all()
    return jsonify({"data": [q.as_json() for q in selfies]})

@questions.route('/', methods=['POST'])
def create():
    data = request.get_json(force=True)
    selfie = Selfie(picture=data['picture'])
    selfie = Selfie(picture=data['qid'])
    db.session.add(selfie)
    db.session.commit()
    #return redirect("/questions/%s"%question.id)

# @questions.route('/<id>', methods=['GET'])
# def get(id):
#     question = Question.query.filter(Question.id == id).first()
#     if not question:
#         abort(404)
#     else:
#         return jsonify(question.as_json())

# @questions.route('/<id>', methods=['POST'])
# def update(id):
#     data = request.get_json(force=True)
#     question = Question.query.filter(Question.id == id).first()
#     if not question:
#         abort(404)
#     else:
#         question.question = data['question']
#         db.session.commit()
#         return jsonify({"status": "ok"})


@questions.route('/<id>', methods=['DELETE'])
def delete(id):
    selfie = Selfie.query.filter(Selfie.id == id).first()
    if not selfie:
        abort(404)
    else:
        db.session.delete(selfie)
        db.session.commit()
        return jsonify({"status": "ok"})

# @questions.route('/random', methods=['GET'])
# def random():
#     question = Question.query.order_by(func.random()).first()
#     return jsonify(question.as_json())
