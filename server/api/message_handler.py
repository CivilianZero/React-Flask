from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from sqlalchemy.exc import DatabaseError

from models.ConversationModel import ConversationModel
from models.MessageModel import MessageModel
from models.UserModel import UserModel


class Message(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("text",
                        type=str,
                        required=True,
                        trim=True,
                        help="Message text is required.")
    parser.add_argument("timestamp",
                        type=str,
                        required=True,
                        trim=True,
                        help="Timestamp is required.")
    parser.add_argument("conversation_id",
                        type=int,
                        trim=True,
                        required=True,
                        help="Conversation id is required.")

    @classmethod
    @jwt_required
    def post(cls):
        data = cls.parser.parse_args()
        message = MessageModel(**data)

        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        conversation_list = ConversationModel.find_all_by_id(data["conversation_id"])
        conversation_result = next(filter(lambda conv: conv.user_id == user_id, conversation_list), None)
        conversation = ConversationModel.get_conversation(conversation_result.conversation_id)

        try:
            message.upsert(user, conversation)
        except DatabaseError as error:
            return {"msg": "An error occurred while saving message to database. Error: {}".format(error)}, 500
        message_list = MessageModel.find_all_in_conversation(data["conversation_id"])
        message = message_list[-1]
        return message.to_json(), 201


class MessageList(Resource):
    @classmethod
    @jwt_required
    def get(cls, conversation_id):
        messages = MessageModel.find_all_in_conversation(conversation_id)
        message_json_list = []
        for message in messages:
            message_json = MessageModel.to_json(message)
            message_json_list.append(message_json)
        message_json_list.sort(key=lambda x: x["timestamp"])
        return message_json_list, 200
