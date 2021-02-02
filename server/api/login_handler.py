from flask import jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_refresh_token_required, get_jwt_identity, \
    set_access_cookies, set_refresh_cookies, jwt_required
from flask_restful import Resource, reqparse
from flask_socketio import emit

from models.UserModel import UserModel


class Login(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username",
                        type=str,
                        required=True,
                        trim=True,
                        help="Username is required")
    parser.add_argument("password",
                        type=str,
                        required=True,
                        trim=True,
                        help="Password is required")

    @classmethod
    def post(cls):
        data = cls.parser.parse_args()
        user = UserModel.find_by_username(data["username"])

        if user and user.check_password(data["password"]):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            response = jsonify({"username": user.username, "email": user.email, "user_id": user.id})
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        return {"msg": "Invalid credentials"}, 401


class Auth(Resource):
    @staticmethod
    @jwt_required
    def get():
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)
        online_users = UserModel.get_current_users()
        if user.username not in online_users:
            UserModel.add_current_user(user.username)
        emit('get_users', online_users, broadcast=True, namespace="user")
        return 200

    @staticmethod
    @jwt_refresh_token_required
    def post():
        user_id = get_jwt_identity()
        try:
            new_token = create_access_token(identity=user_id, fresh=False)
        except Exception as error:
            return {"msg": "Error: {}".format(error)}
        else:
            response = jsonify({"refresh": True})
            set_access_cookies(response, new_token)

            return response
