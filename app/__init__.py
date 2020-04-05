from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from .views import index, account
    app.register_blueprint(index.bp, url_prefix='/')
    app.register_blueprint(account.bp, url_prefix='/account')

    @app.errorhandler(404)
    def page_not_found(error):
        return error

    return app
