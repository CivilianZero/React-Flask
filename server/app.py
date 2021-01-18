from flask import Flask
from flask_restful import Api

from api.login_handler import Login
from api.register_handler import Register

app = Flask(__name__)
api = Api(app)

api.add_resource(Login, "/login")
api.add_resource(Register, "/register")