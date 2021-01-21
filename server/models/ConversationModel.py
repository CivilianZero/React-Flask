from sqlalchemy.orm import backref

from db import db
from models.UserModel import UserModel, user_conversations


class ConversationModel(db.Model):
    __tablename__ = "conversation"

    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("MessageModel", backref=backref("conversation", lazy='subquery'), lazy=False)

    @classmethod
    def find_all_by_id(cls, conversation_id):
        return db.session.query(user_conversations).filter_by(conversation_id=conversation_id).all()

    @classmethod
    def find_all_by_user(cls, user_id):
        return db.session.query(user_conversations).filter_by(user_id=user_id).all()

    @classmethod
    def find_by_target_user(cls, user_id, target_username):
        target_user = UserModel.find_by_username(target_username)
        conversation_set_user = cls.get_conversation_ids_from_list(cls.find_all_by_user(user_id))
        conversation_set_target_user = cls.get_conversation_ids_from_list(cls.find_all_by_user(target_user.id))
        return list(conversation_set_user & conversation_set_target_user)[0]

    @classmethod
    def get_conversation(cls, conversation_id):
        return cls.query.filter_by(id=conversation_id).first()

    @classmethod
    def get_all_for_current_user(cls, user_id):
        conversation_json = {}
        list_of_conversations = cls.find_all_by_user(user_id)
        for i, conv in enumerate(list_of_conversations, start=1):
            for _, user_id in cls.find_all_by_id(conv.conversation_id):
                user = UserModel.find_by_id(user_id)
                if user_id != conv.user_id:
                    conversation_json["Conversation {}".format(i)] = {"user": user.username,
                                                                      "chat_id": conv.conversation_id}
        return conversation_json

    def upsert(self, user, target_user):
        user.conversations.append(self)
        target_user.conversations.append(self)
        db.session.add(user)
        db.session.add(target_user)
        db.session.commit()

    @staticmethod
    def get_conversation_ids_from_list(conversation_list):
        id_set = set(conversation_id for conversation_id, user_id in conversation_list)
        return id_set


class ConversationExists(Exception):
    def __init__(self, user_id, target_user_id, ):
        self.user_id = user_id
        self.target_user_id = target_user_id
        self.message = "Conversation between users with IDs {} and {} already exists in database".format(user_id,
                                                                                                         target_user_id)
        Exception.__init__(self, self.message)
