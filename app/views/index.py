from flask import Blueprint, render_template, request, session

bp = Blueprint('index', __name__)

@bp.route('/')
def index():
    if session.get('user'):
        return render_template('user/index.html')
    return render_template('visitor/index.html')
