from flask import Blueprint
from flask import render_template
from flask import request


bp = Blueprint('index', __name__)

@bp.route('/')
def index():
    print(request)
    print(request.method)
    print(request.path)
    return render_template('index.html')
