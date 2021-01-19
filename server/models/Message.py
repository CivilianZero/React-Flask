from sqlalchemy import ForeignKey

from db import db
from models import Chat


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(360))
    timestamp = db.Column(db.DateTime, timezone=True, nullable=False)
    user = db.Column(db.Integer, ForeignKey("User.id"), nullable=False)

    def __init__(self):
        pass

    def upsert(self):
        pass

    def to_json(self):
        pass
