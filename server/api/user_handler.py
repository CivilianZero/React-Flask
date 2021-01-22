from flask_jwt_extended import jwt_required
from flask_restful import Resource

from models.UserModel import UserModel


class UserList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        user_list = []
        for user in UserModel.get_all():
            user_list.append(user.to_json())
        return user_list, 201
