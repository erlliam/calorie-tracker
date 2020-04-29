from flask import Blueprint, render_template, request, session
from flask import jsonify
from app.database import db

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return 'Diary home'

@bp.route('/add', methods=['POST'])
def add():
    food_id = request.json.get('food_id')
    serving_size = request.json.get('serving_size')

    print(food_id, serving_size)

    return 'not implemented'
    
@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
