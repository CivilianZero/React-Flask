from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource

from models.UserModel import UserModel


class User(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)
        return {"username": user.username, "id": user_id, "email": user.email}, 200


class UserList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        user_list = []
        for user in UserModel.get_all():
            user_list.append(user.to_json())
        return user_list, 200
