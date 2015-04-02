# Import flask dependencies
from flask import Blueprint, request, render_template, \
    flash, g, session, redirect, url_for

from app import db
from moduels.auth.models import User

mod_auth = Blueprint('sessions', __name__, url_prefix='/sessions')

# Set the route and accepted methods
@mod_auth.route('/', methods=['GET', 'POST'])
def signin():

    # If sign in form is submitted
    form = LoginForm(request.form)

    # Verify the sign in form
    if form.validate_on_submit():

        user = User.query.filter_by(email=form.email.data).first()

        if user and check_password_hash(user.password, form.password.data):

            session['user_id'] = user.id

            flash('Welcome %s' % user.name)

            return redirect(url_for('auth.home'))

        flash('Wrong email or password', 'error-message')

    return render_template("auth/signin.html", form=form)
