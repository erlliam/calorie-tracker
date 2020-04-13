from flask import Blueprint, render_template, request, session
from flask import jsonify
from app.database import db

bp = Blueprint('diary', __name__)

@bp.route('/')
def home():
    return 'Diary home'

@bp.route('/add', methods=['POST'])
def add():
    request_json = request.json

    # perhaps I can use kwargs here? Makes it more clear which arg is what
    food = (
        session['user'][0],
        # Either add date using sqlite3's date thing or write it here..
        '100',
        # Use foreign key support to let sqltie handle invalid food ids
        request_json['foodId'],
        request_json['foodServingSize']
    )

    return add_diary(food)
    
def add_diary(food):
    for value in food[2:]:
        if not value.isdigit():
            return jsonify(
                result='fail',
                reason='unacceptable data'
            )

    db.create_entry(*food)

    return jsonify(
        result='success',
        reason='added a database entry for entry'
    )

@bp.route('/update')
def update():
    return 'Update diary'

@bp.route('/remove')
def remove():
    return 'Remove from diary database'
