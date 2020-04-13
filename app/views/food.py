from flask import Blueprint, render_template, request, session
from flask import jsonify
from app.database import db

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return 'Food home'

@bp.route('/add', methods=['POST'])
def add():
    request_json = request.json

    food = (
        session['user'][0],
        request_json['foodName'],
        request_json['foodServingSize'],
        request_json['foodCalories'],
        request_json['foodFats'],
        request_json['foodCarbs'],
        request_json['foodProteins']
    )

    return add_food(food)

# I am going to punch a wall, is it add or create food? I can't handle this anymore

def add_food(food):
    for value in food[2:]:
        if not value.isdigit() and value != '':
            return jsonify(
                result='fail',
                reason='unacceptable data'
            )

    db.create_food(*food)

    return jsonify(
        result='success',
        reason='added a database entry for food'
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
