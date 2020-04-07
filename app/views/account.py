import re
from flask import Blueprint, request, redirect, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from .. import database

username_constraints = re.compile('[A-Za-z0-9]*')

bp = Blueprint('acccount', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    username_valid = username_constraints.fullmatch(username)

    if username_valid:
        if database.username_found(username):
            flash('Username taken')
        else:
            database.create_user(
                username, 
                generate_password_hash(request.form.get('password'))
            )
            session['user'] = username
            flash('Successfully signed up')
    else:
        flash('Illegal username format')

    return redirect(request.referrer)


@bp.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')

    user_row = database.username_found(username)
    db_username = user_row[0][1]
    db_password = user_row[0][2]

    if user_row:
        password = request.form.get('password')
        if check_password_hash(db_password, password):
            session['user'] = db_username
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
