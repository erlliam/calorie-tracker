from flask import Blueprint
from flask import request
from flask import redirect
from . import database
import re

username_constraints = re.compile('[A-Za-z0-9]*')

bp = Blueprint('acccount', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    password = request.form.get('password')

    username_valid = username_constraints.fullmatch(username)

    if database.username_found(username):
        # check if the username exists in teh database
    return redirect(request.referrer)


@bp.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # check if username exists in the databse
    return redirect(request.referrer)
