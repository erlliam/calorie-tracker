from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from app.views import home, account, food, diary
    app.register_blueprint(home.bp, url_prefix='/')
    app.register_blueprint(account.bp, url_prefix='/account')
    app.register_blueprint(food.bp, url_prefix='/food')
    app.register_blueprint(diary.bp, url_prefix='/diary')

    @app.errorhandler(404)
    def page_not_found(error):
        return error


    # import sqlite3
    # from flask import g
    # @app.teardown_appcontext
    # def close_connection(exception):
    #     db = getattr(g, 'database', None)
    #     if db is not None:
    #         db.close()

    return app
