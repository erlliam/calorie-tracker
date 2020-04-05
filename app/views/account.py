from flask import Blueprint
from flask import request
from flask import redirect

bp = Blueprint('acccount', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    return redirect(request.referrer)


@bp.route('/login', methods=['POST'])
def login():
    return redirect(request.referrer)
