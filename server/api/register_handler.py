from flask_restful import reqparse, Resource
from sqlalchemy.exc import DatabaseError

from models.user import UserModel


class Register(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username",
                        type=str,
                        trim=True,
                        required=True,
                        help="This field is required")
    parser.add_argument("email",
                        type=str,
                        trim=True,
                        required=True,
                        help="This field is required")
    parser.add_argument("password",
                        type=str,
                        trim=True,
                        required=True,
                        )

    def post(self):
        data = self.parser.parse_args()
        user = UserModel(**data)

        try:
            user.upsert()
        except DatabaseError as error:
            return {"message": "An error occurred while saving to database. Error: {}".format(error)}, 500

        return user.json(), 201
