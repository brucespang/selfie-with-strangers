from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import helpers
import yaml
import os
from werkzeug.exceptions import default_exceptions

app = Flask(__name__)

config_path = os.environ.get('CONFIG', "config.yaml")
app.config.from_object(yaml.safe_load(open(config_path)))

db = SQLAlchemy(app)

for code in default_exceptions.iterkeys():
    app.error_handler_spec[None][code] = helpers.make_json_error

from modules.users.controllers import users as users_module
app.register_blueprint(users_module)
