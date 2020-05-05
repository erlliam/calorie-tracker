from flask import Blueprint, render_template, request, session
from flask import jsonify, Response
from app.database import db

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return render_template('user/diary/index.html')

@bp.route('/add', methods=['POST'])
def add():
    
    try:
        food_id = request.json.get('foodId')
        grams = request.json.get('grams')

        if value_positive_digit(food_id) and value_positive_digit(grams):
            entry = {
                'user_id': session['user']['user_id'],
                'food_id': request.json.get('foodId'),
                'grams': request.json.get('grams')
            }
            db.create_entry(**entry)

            return Response('Entry created', status=201)
    except Exception as e:
        print(e)
        return Response('Error', status=400)

def value_positive_digit(value):
    if isinstance(value, str):
        if value.isdigit():
            return int(value) > 0
    elif isinstance(value, int):
        return value > 0
    else:
        return False

@bp.route('/get', methods=['GET'])
def get():
    user_id = session['user']['user_id']
    # implement getting entries by date
    date = request.args.get('date')
    entries = db.get_entries(user_id, date)
    json_entries = []

    for entry in entries:
        grams = entry['grams']
        serving_size = entry['serving_size']
        if value_positive_digit(grams) and value_positive_digit(serving_size):
            serving_size_consumed = grams / serving_size
            json_entries.append({
                'name': entry['name'],
                'calories': entry['calories'] * serving_size_consumed,
                'fats': 1,
                'carbs': 1,
                'proteins': 1,
            })
    return jsonify(json_entries)
#['grams', 'name', 'serving_size', 'calories', 'fats', 'carbs', 'proteins']

@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
