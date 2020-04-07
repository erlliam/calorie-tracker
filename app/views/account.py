from flask import Blueprint
from flask import request
from flask import redirect
from .. import database
import re

username_constraints = re.compile('[A-Za-z0-9]*')

bp = Blueprint('acccount', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    password = request.form.get('password')
    username_valid = username_constraints.fullmatch(username)

    if username_valid:
        if database.username_found(username):
            return 'Name taken'
        else:
            database.create_user(username, password)

    return redirect(request.referrer)


@bp.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    user_row = database.username_found(username)
    if user_row:
        if password == user_row[0][2]:
            return 'I have to log you in'
    # handle username not found

    return redirect(request.referrer)
