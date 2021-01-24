from flask import jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_refresh_token_required, get_jwt_identity, \
    set_access_cookies, set_refresh_cookies
from flask_restful import Resource, reqparse

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
            response = jsonify({"login": True})
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        return {"message": "Invalid credentials"}, 401


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        try:
            new_token = create_access_token(identity=current_user, fresh=False)
        except Exception as error:
            return {"message": "Error: {}".format(error)}
        else:
            response = jsonify({"refresh": True})
            set_access_cookies(response, new_token)
            return response
