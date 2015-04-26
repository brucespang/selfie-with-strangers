from flask import Flask, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
import helpers
import yaml
import os
from werkzeug.exceptions import default_exceptions

app = Flask(__name__)

config_path = os.environ.get('CONFIG', "config.yaml")
config_obj = yaml.safe_load(open(config_path))
app.config.from_object(helpers.Struct(**config_obj))

app.debug = app.config.get('DEBUG', False)

db = SQLAlchemy(app)

for code in default_exceptions.iterkeys():
    app.error_handler_spec[None][code] = helpers.make_json_error

class ApiError(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv

@app.errorhandler(ApiError)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

from modules.users.controllers import users
from modules.questions.controllers import questions
from modules.sessions.controllers import sessions

app.register_blueprint(users)
app.register_blueprint(questions)
app.register_blueprint(sessions)
app.register_blueprint(matching)
app.register_blueprint(locations)
