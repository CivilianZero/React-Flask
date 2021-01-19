import datetime

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from sqlalchemy.exc import DatabaseError

from models.ConversationModel import ConversationModel
from models.MessageModel import MessageModel
from models.UserModel import UserModel


class Chat(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("target_user",
                        type=int,
                        required=True,
                        trim=True,
                        help="Username of target is required")

    @classmethod
    @jwt_required
    def post(cls):
        conversation = ConversationModel()
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        try:
            conversation.upsert(user)
        except DatabaseError as error:
            return {"message": "An error occurred while creating a new chat in the database. Error: {}".format(error)}

        return 201


class Message(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("text",
                        type=str,
                        required=True,
                        trim=True,
                        help="Message text is required")
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
    @jwt_required
    def post(cls, user):
        data = cls.parser.parse_args()
        message = MessageModel(**data)

        try:
            message.upsert()
        except DatabaseError as error:
            return {"message": "An error occurred while saving message to database. Error: {}".format(error)}

        return message.to_json(), 201
