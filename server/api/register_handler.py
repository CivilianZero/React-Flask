from flask import request
from flask_restful import Resource

# placeholder till database implemented
from api.dummy_users import users


class Register(Resource):
    @staticmethod
    def post():
        # TODO: replace dummy_users code with sqlalchemy
        data = request.get_json()
        # check if email already in use
        if next(filter(lambda email: data["email"] == email, users), None):
            return {"message": "User with email '{}' already exists"}.format(
                data["email"]
            ), 400
        # check if username already in use
        if next(filter(lambda username: data["username"] == username, users), None):
            return {"message": "User with username '{}' already exists"}.format(
                data["username"]
            ), 400
        user = {
            "username": data["username"],
            "email": data["email"],
            # TODO: hash this
            "password": data["password"],
        }
        users.append(user)
        return user, 200
