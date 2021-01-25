from sqlalchemy import ForeignKey

from db import db
from models.UserModel import UserModel


class MessageModel(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(360))
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False)
    conversation_id = db.Column(db.Integer, ForeignKey("conversation.id"), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey("user.id"), nullable=False)

    def __init__(self, text, timestamp, conversation_id):
        self.text = text
        self.timestamp = timestamp
        self.conversation_id = conversation_id

    @classmethod
    def find_all_by_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def find_all_in_conversation(cls, conversation_id):
        return cls.query.filter_by(conversation_id=conversation_id).all()

    def upsert(self, user, conversation):
        conversation.messages.append(self)
        user.messages.append(self)
        db.session.add(conversation)
        db.session.add(user)
        db.session.commit()

    def to_json(self):
        user = UserModel.find_by_id(self.user_id)
        return {"text": self.text, "timestamp": self.timestamp.__str__(), "sender": user.username,
                "conversation_id": self.conversation_id, "id": self.id, "sender_id": user.id}
