from sqlalchemy.orm import backref

from db import db

chats = db.Table("chat",
                 db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
                 db.Column("chat_id", db.Integer, db.ForeignKey("chat.id"), primary_key=True))


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("Message", backref("chat", lazy='subquery'), lazy=False)

    def __init__(self):
        pass

    def upsert(self):
        pass

    def to_json(self):
        pass
