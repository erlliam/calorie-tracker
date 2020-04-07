import sqlite3
from flask import Flask
from flask import g


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from .views import index, account
    app.register_blueprint(index.bp, url_prefix='/')
    app.register_blueprint(account.bp, url_prefix='/account')

    @app.errorhandler(404)
    def page_not_found(error):
        return error

    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, 'database', None)
        if db is not None:
            db.close

    return app
