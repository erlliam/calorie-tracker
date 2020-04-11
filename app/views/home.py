from flask import Blueprint, render_template, request, session

bp = Blueprint('home', __name__)

@bp.route('/')
def home():
    if session.get('user'):
        return render_template('user/home/index.html')
    return render_template('visitor/home/index.html')

@bp.route('/overview')
def overview():
    return render_template('user/home/overview.html')
