import sys, json

from flask import Blueprint, render_template, request, session
from flask import jsonify, Response

from sqlite3 import IntegrityError

from app.database import db

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return render_template('user/food/index.html')

@bp.route('/search_count')
def search_count():
    query = request.args.get('query')

    query_count = db.search_food_count(query)['COUNT(*)']
    
    return str(query_count)

@bp.route('/search/<string:query>/<int:last_value>')
def search(query, last_value):
    results = db.search_food(query, last_value)
    response = [r['name'] + str(r['food_id']) for r in results]
    lt = ' '.join(response)

    return lt

@bp.route('/add', methods=['POST'])
def add():
    user_id = session['user']['user_id']
    user_input = request.json

    try:
        # don't throw crap at sqlite3
        food = {
            'name': get_string_value(user_input, 'name'),
            'serving_size': get_float_value(user_input, 'servingSize'),
            'calories': get_float_value(user_input, 'calories'),
            'fats': get_float_value(user_input, 'fats'),
            'carbs': get_float_value(user_input, 'carbs'),
            'proteins': get_float_value(user_input, 'proteins')
        }

        db.create_food(creator_id=user_id, **food)

        return Response('Food created', status=201)
    except IntegrityError as e:
        return Response('Not null constraint failed', status=400)
    except ValueError:
        return Response('Letter in float value', status=400)
    except ValueNotFound:
        return Response('Dictionary missing key or data is not string', status=400)

def get_string_value(dictionary, key, optional=False):
    value = dictionary.get(key)
    if value_is_empty_string(value):
        return None

    return value

def get_float_value(dictionary, key, optional=False):
    value = dictionary.get(key)
    if value_is_empty_string(value):
        return None

    if isinstance(value, str):
        value = float(value)

    return value

def value_is_empty_string(value):
    if value is None or not isinstance(value, str):
        raise ValueNotFound()
    elif value.strip() == '':
        return True

class ValueNotFound(Exception):
    pass

@bp.route('/add/image')
def add_image():
    return 'Add to food using OCR'

@bp.route('/update')
def update():
    return 'Update food'

@bp.route('/remove')
def remove():
    return 'Remove from food database'
