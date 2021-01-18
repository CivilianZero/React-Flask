from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api

import config
from api.login_handler import Login, TokenRefresh
from api.register_handler import Register
from db import db

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config.from_object(config)
db.init_app(app)
api = Api(app)


@app.before_first_request
def create_tables():
    db.create_all()


jwt = JWTManager(app)

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(TokenRefresh, "/refresh")
