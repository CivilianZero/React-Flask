from flask import request
from flask_restful import Resource


class Register(Resource):
    @staticmethod
    def post():
        # TODO: replace dummy_users code with sqlalchemy
        data = request.get_json()
        # check if email already in use

        # check if username already in use

        user = {
            "username": data["username"],
            "email": data["email"],
            # TODO: hash this
            "password": data["password"],
        }

        return user, 200
