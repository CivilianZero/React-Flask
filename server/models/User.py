import re

from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

from db import db
from models import Chat


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    chats = db.relationship("Chat", secondary=Chat.chats, backref="user", lazy=True)

    EMAIL_PATTERN = re.compile(r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)",
                               re.IGNORECASE)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = User.set_password(password)

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
        if not self.EMAIL_PATTERN.match(email):
            raise AssertionError("Invalid email format provided")
        if User.query.filter_by(email=email).first():
            raise AssertionError("Email already in use")
        return email

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first()

    def upsert(self):
        db.session.add(self)
        db.session.commit()

    def to_json(self):
        return {'username': self.username, 'email': self.email}
