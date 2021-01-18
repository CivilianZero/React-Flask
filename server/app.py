from flask import Flask
from flask_restful import Api

from api.login_handler import Login
from api.register_handler import Register
from db import db

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db.init_app(app)
api = Api(app)


@app.before_first_request
def create_tables():
    db.create_all()


api.add_resource(Login, "/login")
api.add_resource(Register, "/register")
