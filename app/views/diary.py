from flask import Blueprint, render_template, request, session
from flask import jsonify, Response
from app.database import db

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return 'Diary home'

@bp.route('/add', methods=['POST'])
def add():
    try:
        entry = {
            'user_id': session['user']['user_id'],
            'food_id': request.json.get('food_id'),
            'grams': request.json.get('serving_size')
        }
        # Rename serving_size to grams in json

        print(entry)

        db.create_entry(**entry)

        return Response('Entry created', status=201)
    except Exception as e:
        print(e)
        return Response('Error', status=400)
    
@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
