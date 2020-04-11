import re
from flask import Blueprint, request, session, redirect, flash
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import db

bp = Blueprint('account', __name__)

username_constraints = re.compile('[A-Za-z0-9]*')

@bp.route('/')
def home():
    return 'Account home'

@bp.route('/register', methods=['POST'])
def add():
    form_username = request.form.get('username')
    form_username_valid_format = username_constraints.fullmatch(form_username)
    form_password = request.form.get('password')
    form_password_valid_format = len(form_password) > 3

    if form_username_valid_format and form_password_valid_format:
        if db.username_found(form_username):
            flash('Username taken')
        else:
            db.create_user(
                form_username,
                generate_password_hash(form_password)
            )
            # TODO send request to /login with password/username
            flash('Successfully signed up')
    else:
        if form_username_valid_format:
            flash('Illegal password')
        else:
            flash('Illegal username')

    return redirect(request.referrer)

@bp.route('/login', methods=['POST'])
def login():
    form_username = request.form.get('username')
    user = db.username_found(form_username)
    # user = (user_id, username, user_password)
    if user:
        username = user[1]
        password = user[2]
        form_password = request.form.get('password')
        if check_password_hash(password, form_password):
            session['user'] = (user[0], user[1])
            flash('Successfully logged in')
        else:
            flash('Invalid password')
    else:
        flash('Username not found')

    return redirect(request.referrer)

@bp.route('/logout', methods=['POST'])
def logout():
    del session['user']
    flash('Successfully logged out')

    return redirect(request.referrer)

@bp.route('/update', methods=['POST'])
def update():
    return redirect(request.referrer)

@bp.route('/remove', methods=['POST'])
def remove():
    return redirect(request.referrer)
