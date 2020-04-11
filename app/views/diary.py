from flask import Blueprint, render_template, request, session

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return 'Diary home'

@bp.route('/add')
def add():
    return 'Add to diary database'

@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
