from sqlalchemy.orm import backref

from db import db
from models.UserModel import UserModel


class ConversationModel(db.Model):
    __tablename__ = "conversation"

    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("MessageModel", backref=backref("conversation", lazy='subquery'), lazy=False)

    def __init__(self):
        pass

    @classmethod
    def find_by_id(cls, conversation_id):
        return cls.query.get(conversation_id)

    def upsert(self, user: UserModel, target_user: UserModel):
        user.conversations.append(self)
        target_user.conversations.append(self)
        db.session.add(user)
        db.session.add(target_user)
        db.session.commit()
