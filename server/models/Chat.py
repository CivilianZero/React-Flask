from sqlalchemy.orm import backref

from db import db

chats = db.Table("chats",
                 db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
                 db.Column("chat_id", db.Integer, db.ForeignKey("chat.id"), primary_key=True))


class Chat(db.Model):
    __tablename__ = "chats"

    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship("Message", backref("chat", lazy=True), lazy=False)
