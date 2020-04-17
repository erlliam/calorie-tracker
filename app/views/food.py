from flask import Blueprint, render_template, request, session
from flask import jsonify, Response
from app.database import db
import sys

bp = Blueprint('food', __name__)

@bp.route('/')
def home():
    return 'Food home'

json_criteria = {
    'foodName': 'Potatoe',
    'foodServingSize': 200,
    'foodCalories': 200,
    'foodFats': 200,
    'foodCarbs': 200,
    'foodProteins': 200
}

@bp.route('/add', methods=['POST'])
def add():
    response = respond_to_data(json_criteria, request.json)
    if response.status == 201:
        # make database stuff happen
        print('food added')
    elif response.status == 400:
        # keys don't match
        # or value types failed to convert
        print('food not added')
    return response

def respond_to_data(json_criteria, json):
    if keys_match(json_criteria, json):
        try:
            convert_value_types(json_criteria, json)
        except ValueError:
            return Response(status=400)
        else:
            return Response(status=201)
    else:
        return Response(status=400)

def keys_match(criteria, check):
    return criteria.keys() == check.keys()

def convert_value_types(criteria, check):
    for key in criteria.keys():
        criteria_type = type(criteria[key])
        check_type = type(check[key])

        if criteria_type != check_type:
            if criteria_type == int and check_type == str:
                try:
                    check[key] = int(check[key])
                except ValueError:
                    raise

@bp.route('/add/image')
def add_image():
    return 'Add to food using OCR'

@bp.route('/update')
def update():
    return 'Update food'

@bp.route('/remove')
def remove():
    return 'Remove from food database'
