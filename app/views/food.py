from flask import Blueprint, render_template, request, session
from flask import jsonify
from app.database import db

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return 'Food home'

@bp.route('/add', methods=['POST'])
def add():
    user_id = session['user'][0]
    request_json = request.json

    food_name = request_json['foodName']
    food_serving_size = request_json['foodServingSize']
    food_calories = request_json['foodCalories']
    food_name_valid = len(food_name) > 0
    food_serving_size_valid = food_serving_size.isdigit()
    food_calories_valid = food_calories.isdigit()

    ok = food_serving_size_valid and food_calories_valid

    if ok:
        db.create_food(food_name, food_serving_size, food_calories)
        return jsonify(
            result='success',
            reason='added a database entry for food'
        )
    else:
        return jsonify(
            result='fail',
            reason='food_name invalid or digit check fail'
        )

@bp.route('/add/image')
def add_image():
    return 'Add to food using OCR'

@bp.route('/update')
def update():
    return 'Update food'

@bp.route('/remove')
def remove():
    return 'Remove from food database'
