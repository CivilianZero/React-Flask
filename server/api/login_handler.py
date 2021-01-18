from flask import request
from flask_restful import Resource


class Login(Resource):
    def post(self):
        data = request.get_json()
        pass
