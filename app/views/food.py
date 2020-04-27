import sys, json

from flask import Blueprint, render_template, request, session
from flask import jsonify, Response

from sqlite3 import IntegrityError

from app.database import db

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return 'Food home'

@bp.route('/search')
def search():
    query = request.args.get('name')

    query_results = db.get_food(query)
    json_results = []

    if query_results:
        for result in query_results:
            json_results.append({
                'food_id': result['food_id'],
                'name': result['name'],
                'serving_size': result['serving_size'],
                'calories': result['calories'],
                'fats': result['fats'],
                'carbs': result['carbs'],
                'proteins': result['proteins']
            })

    response = Response(
        response=json.dumps(json_results),
        mimetype='application/json',
        status=200,
    )

    return response

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
