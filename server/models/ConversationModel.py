from sqlalchemy.orm import backref

from db import db

user_conversations = db.Table("user_conversations",
                              db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
                              db.Column("conversation_id", db.Integer, db.ForeignKey("conversation.id"),
                                        primary_key=True))


class ConversationModel(db.Model):
    __tablename__ = "conversation"

    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("MessageModel", backref=backref("conversation", lazy='subquery'), lazy=False)

    def __init__(self):
        pass

    @classmethod
    def find_by_id(cls, conversation_id):
        return cls.query.get(conversation_id)

    def upsert(self, user):
        user.conversations.append(self)
        db.session.add(user)
        db.session.commit()
