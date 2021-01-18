from flask import Flask
from flask_jwt import JWT
from flask_restful import Api

import config
from api.register_handler import Register
from api.security import authenticate, identity
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


# /auth route for login/getting auth token
# @jwt_required() decorator for protected routes
jwt = JWT(app, authenticate, identity)

api.add_resource(Register, "/register")
