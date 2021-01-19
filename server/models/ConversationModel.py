from sqlalchemy.orm import backref

from db import db

user_conversations = db.Table("conversations",
                         db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
                         db.Column("conversation_id", db.Integer, db.ForeignKey("conversation.id"), primary_key=True))


class ConversationModel(db.Model):
    __tablename__ = "conversation"

    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("MessageModel", backref("conversation", lazy='subquery'), lazy=False)

    def __init__(self):
        pass

    def upsert(self):
        pass

    def to_json(self):
        pass
