from flask import session
from modules.users.models import User

def current_user():
    user_id = session.get('user_id')
    return User.query.filter_by(id=user_id).first()
