from flask import Blueprint, render_template, request, session
from flask import jsonify
from app.database import db

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return 'Diary home'

@bp.route('/add', methods=['POST'])
def add():
    user_input = request.json
    date = '70'
    user_id = user['user_id']

    try:
        entry = {
            'food_id': get_int_value(user_input, 'id'),
            'serving_size': get_float_value(user_input, 'servingSize')
        }

        #db.create_entry(date, user_id, food_id, grams)
    return 'not implemented'
    
@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
