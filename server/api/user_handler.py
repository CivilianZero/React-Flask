from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_socketio import Namespace

from models.UserModel import UserModel


class User(Resource):
    @staticmethod
    @jwt_required
    def get():
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)
        return {"username": user.username, "id": user_id, "email": user.email}, 200


class UserList(Resource):
    @staticmethod
    @jwt_required
    def get():
        user_list = []
        for user in UserModel.get_all():
            user_list.append(user.to_json())
        return user_list, 200


class UserSocket(Namespace):
    @staticmethod
    def on_login(username):
        UserModel.add_current_user(username, request.sid)
