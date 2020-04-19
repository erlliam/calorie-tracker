from flask import Blueprint, render_template, request, session
from flask import jsonify, Response
from app.database import db
import sys

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return 'Food home'

@bp.route('/add', methods=['POST'])
def add():
    user_input = request.json

    try:
        user_food = {
            'food_name': get_string_value(user_input, 'foodName'),
            'food_serving_size': get_float_value(user_input, 'foodServingSize'),
            'food_calories': get_float_value(user_input, 'foodCalories'),
            'food_fats': get_float_value(user_input, 'foodFats', optional=True),
            'food_carbs': get_float_value(user_input, 'foodCarbs', optional=True),
            'food_proteins': get_float_value(user_input, 'foodProteins', optional=True),
        }
        print(user_food)

        db.create_food(creator_id=0, **user_food)

        return Response(status=201)
    except ValueNotFound:
        print('Missing key, or data is not string, big error here')
        return Response(status=400)
    except ValueNotOptional:
        print('Value is not optional, give value besides empty str')
        return Response(status=400)
    except ValueError:
        print('Incorrect format given for data')
        return Response(status=400)
    except:
        raise

def get_string_value(dictionary, key, optional=False):
    value = dictionary.get(key)
    if value is None or not isinstance(value, str):
        raise ValueNotFound()
    elif value.strip() == '':
        if optional:
            return None
        else:
            raise ValueNotOptional()

    return value

def get_float_value(dictionary, key, optional=False):
    value = dictionary.get(key)
    if value is None or not isinstance(value, str):
        raise ValueNotFound()
    elif value.strip() == '':
        if optional:
            return None
        else:
            raise ValueNotOptional()

    if isinstance(value, str):
        try:
            value = float(value)
        except:
            raise

    return value

class ValueNotFound(Exception):
    pass

class ValueNotOptional(Exception):
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
