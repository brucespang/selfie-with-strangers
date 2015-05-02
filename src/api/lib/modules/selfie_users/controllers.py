from flask import Blueprint, request, jsonify, redirect
from models import Selfie_Users
from app import db
from  sqlalchemy.sql.expression import func

selfie_users = Blueprint('selfie_users', __name__, url_prefix='/selfie_users')

# @selfies.route('/', methods=['GET'])
# def list():
#     selfie_users = Selfie.query.all()
#     return jsonify({"data": [q.as_json() for q in selfies]})

@selfie_users.route('/', methods=['POST'])
def create():
    data = request.get_json(force=True)
    selfie_users = Selfie_Users(selfie_id =data['selfie_id'])
    selfie_users = Selfie_Users(user_id=data['user_id'])
    selfie_users = Selfie_Users(answer=data['answer'])
    db.session.add(selfie_users)
    db.session.commit()
    #return redirect("/questions/%s"%question.id)

@selfie_users.route('/<id>', methods=['GET'])
def get(id):
    selfie_users = Selfie_Users.query.filter(Selfie_Users.selfie_id == id)
    if not selfie_users:
        abort(404)
    else:
        return jsonify([s_user.as_json() for s_user in selfie_users])


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


@selfie_users.route('/<id>', methods=['DELETE'])
def delete(selfie_id, user_id):
    selfie = Selfie_Users.query.filter(Selfie_Users.selfie_id == selfie_id && Selfie_Users.user_id == user_id).first()
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
