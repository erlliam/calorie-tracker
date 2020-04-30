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

@bp.route('/get', methods=['GET'])
def get():
    user_id = session['user']['user_id']
    entries = db.get_entries(user_id, '')
    json_entries = []

    for entry in entries:
        grams = entry['grams']
        serving_size = entry['serving_size']
        serving_size_consumed = grams / serving_size

        json_entries.append({
            'name': entry['name'],
            'calories_consumed': entry['calories'] * serving_size_consumed,
            'fats_consumed': 1,
            'carbs_consumed': 1,
            'proteins_consumed': 1,
        })
    return jsonify(json_entries)
#['grams', 'name', 'serving_size', 'calories', 'fats', 'carbs', 'proteins']

@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
