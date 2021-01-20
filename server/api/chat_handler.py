from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from sqlalchemy.exc import DatabaseError

from models.ConversationModel import ConversationModel
from models.MessageModel import MessageModel
from models.UserModel import UserModel


class Chat(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("target_username",
                        type=str,
                        required=True,
                        trim=True,
                        help="Username of target is required")

    @classmethod
    @jwt_required
    def get(cls, name):
        user_id = get_jwt_identity()
        return ConversationModel.find_by_target_user(user_id, name)

    @classmethod
    @jwt_required
    def post(cls):
        data = cls.parser.parse_args()
        target_user = UserModel.find_by_username(data["target_username"])

        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        conversation = ConversationModel()

        try:
            conversation.upsert(user, target_user)
        except AttributeError as error:
            return {"message": "Target user does not exist in the database. Error: {}".format(error)}, 404
        except DatabaseError as error:
            return {"message": "An error occurred while creating a new chat in the database. Error: {}".format(
                error)}, 500

        return 201


class ChatList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        user_id = get_jwt_identity()
        return ConversationModel.get_all_for_current_user(user_id), 201


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
            return {"message": "An error occurred while saving message to database. Error: {}".format(error)}

        return 201


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
        return message_json_list, 201
