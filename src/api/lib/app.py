from flask import Flask
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

from modules.users.controllers import users as users_module
app.register_blueprint(users_module)
