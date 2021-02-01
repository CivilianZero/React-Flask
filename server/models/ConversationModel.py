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
    def find_by_target_user(cls, user_id, target_user_id):
        conversation_set_user = cls.get_conversation_ids_for_user(user_id)
        conversation_set_target_user = cls.get_conversation_ids_for_user(target_user_id)
        shared_chat = list(conversation_set_user & conversation_set_target_user)
        if len(shared_chat) > 0:
            return shared_chat[0]
        else:
            return None

    @classmethod
    def get_conversation(cls, conversation_id):
        return cls.query.filter_by(id=conversation_id).first()

    @classmethod
    def get_all_for_current_user(cls, user_id):
        conversation_id_list = cls.get_conversation_ids_for_user(user_id)
        uc_columns = user_conversations.columns
        conversation_list = db.session.query(user_conversations).filter(
            uc_columns["conversation_id"].in_(conversation_id_list)).filter(uc_columns["user_id"] != user_id).all()

        conversation_list_json = []
        for conv in conversation_list:
            user = UserModel.find_by_id(conv.user_id)
            conversation_list_json.append({"username": user.username, "conversation_id": conv.conversation_id})
        return conversation_list_json

    def upsert(self, user, target_user):
        user.conversations.append(self)
        target_user.conversations.append(self)
        db.session.add(user)
        db.session.add(target_user)
        db.session.commit()

    @classmethod
    def get_conversation_ids_for_user(cls, user_id):
        conversation_list = cls.find_all_by_user(user_id)
        id_set = set(conversation_id for conversation_id, user_id in conversation_list)
        if len(id_set) > 0:
            return id_set
        else:
            return None


class ConversationExists(Exception):
    def __init__(self, user_id, target_user_id, ):
        self.user_id = user_id
        self.target_user_id = target_user_id
        self.msg = "Conversation between users with IDs {} and {} already exists in database".format(user_id,
                                                                                                     target_user_id)
        Exception.__init__(self, self.msg)
