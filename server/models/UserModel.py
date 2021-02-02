import re

from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

from db import db

EMAIL_PATTERN = re.compile(r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)", re.IGNORECASE)
user_conversations = db.Table("user_conversations",
                              db.Column("conversation_id", db.Integer, db.ForeignKey("conversation.id"),
                                        primary_key=True),
                              db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True))

current_users = {}


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    conversations = db.relationship("ConversationModel", secondary=user_conversations, backref="user",
                                    lazy=True)
    messages = db.relationship("MessageModel", backref="user", lazy=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = UserModel.set_password(password)

    @staticmethod
    def set_password(password):
        if not password:
            raise AssertionError("No password provided")
        if len(password) < 7:
            raise AssertionError("Password must be longer than 6 characters")
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @validates("username")
    def validate_username(self, _key, username):
        if not username:
            raise AssertionError("No username provided")
        if self.find_by_username(username):
            raise AssertionError("Username already in use")
        return username

    @validates("email")
    def validate_email(self, _key, email):
        if not email:
            raise AssertionError("No email provided")
        if not EMAIL_PATTERN.match(email):
            raise AssertionError("Invalid email format provided")
        if UserModel.query.filter_by(email=email).first():
            raise AssertionError("Email already in use")
        return email

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def upsert(self):
        db.session.add(self)
        db.session.commit()

    def to_json(self):
        return {"username": self.username, "email": self.email}

    @staticmethod
    def add_current_user(username, sid):
        current_users[username] = sid
