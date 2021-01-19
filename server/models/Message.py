from sqlalchemy import ForeignKey

from db import db
from models import Chat


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    chat = db.Column(db.Integer, ForeignKey(Chat), nullable=False)
    message = db.Column(db.String(360))
    timestamp = db.Column(db.DateTime, timezone=True, nullable=False)
    user = db.Column(db.Integer, ForeignKey("User.id"), nullable=False)
