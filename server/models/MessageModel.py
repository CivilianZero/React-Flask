from sqlalchemy import ForeignKey

from db import db


class MessageModel(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(360))
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False)
    conversation_id = db.Column(db.Integer, ForeignKey("conversation.id"), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey("user.id"), nullable=False)

    def __init__(self, text, timestamp, user_id):
        self.text = text
        self.timestamp = timestamp
        self.user_id = user_id

    def upsert(self):
        pass

    def to_json(self):
        pass
