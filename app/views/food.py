from flask import Blueprint, render_template, request, session

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
    # we don't check for decimals, kinda bad...
    food_serving_size_valid = food_serving_size.isdigit()
    food_calories_valid = food_calories.isdigit()
    # name is a string
    # serving size and calories is a number
    ok = food_serving_size_valid and food_calories_valid
    if ok:
        return 'success'
    else:
        return 'failed'

@bp.route('/add/image')
def add_image():
    return 'Add to food using OCR'

@bp.route('/update')
def update():
    return 'Update food'

@bp.route('/remove')
def remove():
    return 'Remove from food database'
