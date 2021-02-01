from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from sqlalchemy.exc import DatabaseError

from models.ConversationModel import ConversationModel, ConversationExists
from models.UserModel import UserModel


class Conversation(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("target_username",
                        type=str,
                        required=True,
                        trim=True,
                        help="Username of target is required")

    @classmethod
    @jwt_required
    def get(cls, username):
        user_id = get_jwt_identity()

        try:
            return ConversationModel.find_by_target_user(user_id, username), 200
        except AttributeError as error:
            return {"msg": "Target user does not exist in the database. Error: {}".format(error)}, 404
        except DatabaseError as error:
            return {"msg": "An error occurred while retrieving conversation from the database. Error: {}".format(
                error)}, 500

    @classmethod
    @jwt_required
    def post(cls):
        data = cls.parser.parse_args()
        target_user = UserModel.find_by_username(data["target_username"])

        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        try:
            if ConversationModel.find_by_target_user(user_id, target_user.id):
                raise ConversationExists(user_id, target_user.id)
            conversation = ConversationModel()
        except ConversationExists as error:
            return {"msg": "Duplicate entry. Error: {}".format(error)}, 409

        try:
            conversation.upsert(user, target_user)
        except AttributeError as error:
            return {"msg": "Target user does not exist in the database. Error: {}".format(error)}, 404
        except DatabaseError as error:
            return {"msg": "An error occurred while creating a new chat in the database. Error: {}".format(
                error)}, 500
        conversation_id = ConversationModel.find_by_target_user(user_id, target_user.id)
        return {"username": target_user.username, "conversation_id": conversation_id}, 201


class ConversationList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        user_id = get_jwt_identity()

        try:
            return ConversationModel.get_all_for_current_user(user_id), 200
        except DatabaseError as error:
            return {"msg": "An error occurred while retrieving all conversations in the database. Error: {}".format(
                error)}, 500
