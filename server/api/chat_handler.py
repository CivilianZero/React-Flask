import datetime

from flask_restful import Resource, reqparse
from sqlalchemy.exc import DatabaseError

from models.MessageModel import MessageModel


class Chat(Resource):
    pass


class Message(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("text",
                        type=str,
                        required=True,
                        trim=True,
                        help="MessageModel is required")
    parser.add_argument("timestamp",
                        type=datetime,
                        required=True,
                        trim=True,
                        help="Timestamp is required")
    parser.add_argument("user_id",
                        type=int,
                        trim=True,
                        required=True,
                        help="User_id is required")

    @classmethod
    def post(cls):
        data = cls.parser.parse_args()
        message = MessageModel(**data)

        try:
            message.upsert()
        except DatabaseError as error:
            return {"message": "An error occurred while saving message to database. Error: {}".format(error)}

        return message.to_json(), 201
