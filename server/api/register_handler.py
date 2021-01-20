from flask_restful import reqparse, Resource
from sqlalchemy.exc import DatabaseError

from models.user import UserModel


class Register(Resource):
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
    parser.add_argument("email",
                        type=str,
                        trim=True,
                        required=True,
                        help="Email is required")

    @classmethod
    def post(cls):
        data = cls.parser.parse_args()
        user = UserModel(**data)

        try:
            user.upsert()
        except DatabaseError as error:
            return {"message": "An error occurred while saving to database. Error: {}".format(error)}, 500

        return user.json(), 201
