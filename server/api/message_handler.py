from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_socketio import Namespace, emit, join_room
from sqlalchemy.exc import DatabaseError

from models.ConversationModel import ConversationModel
from models.MessageModel import MessageModel
from models.UserModel import UserModel


class MessageList(Resource):
    @staticmethod
    @jwt_required
    def get(conversation_id):
        messages = MessageModel.find_all_in_conversation(conversation_id)
        message_json_list = []
        for message in messages:
            message_json = MessageModel.to_json(message)
            message_json_list.append(message_json)
        message_json_list.sort(key=lambda x: x["timestamp"])
        return message_json_list, 200


class MessageSocket(Namespace):
    @staticmethod
    @jwt_required
    def on_connect():
        user_id = get_jwt_identity()
        conversation_list = ConversationModel.get_conversation_ids_for_user(user_id)
        [join_room(conversation_id) for conversation_id in conversation_list]

    @staticmethod
    @jwt_required
    def on_send_chat(chat):
        message = MessageModel(**chat)

        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        conversation_list = ConversationModel.find_all_by_id(message.conversation_id)
        conversation_result = next(filter(lambda conv: conv.user_id == user_id, conversation_list), None)
        conversation = ConversationModel.get_conversation(conversation_result.conversation_id)

        try:
            message.upsert(user, conversation)
        except DatabaseError as error:
            return {"msg": "An error occurred while saving message to database. Error: {}".format(error)}, 500
        message_list = MessageModel.find_all_in_conversation(message.conversation_id)
        message = message_list[-1]
        emit('receive_message', message.to_json(), room=message.conversation_id)

    @staticmethod
    @jwt_required
    def on_join_chat(chat):
        join_room(chat['conversation_id'])
