from flask import Blueprint, request, jsonify

questions = Blueprint('questions', __name__, url_prefix='/questions')

@questions.route('/', methods=['GET'])
def list():
    return jsonify({"questions": []})

@questions.route('/random', methods=['GET'])
def random():
    return jsonify({"id": 123, "question": "do it ride good?"})
