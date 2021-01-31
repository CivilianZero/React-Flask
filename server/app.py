from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api

import config
from api.conversation_handler import Conversation, ConversationList
from api.login_handler import Login, Auth
from api.message_handler import Message, MessageList
from api.register_handler import Register
from api.user_handler import UserList, User
from db import db

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_ACCESS_CSRF_HEADER_NAME'] = "X-CSRF-TOKEN-ACCESS"
app.config['JWT_REFRESH_CSRF_HEADER_NAME'] = "X-CSRF-TOKEN-REFRESH"

app.config.from_object(config)
db.init_app(app)
api = Api(app)

jwt = JWTManager(app)

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(Auth, "/auth")
api.add_resource(Conversation, "/chat", "/chat/<string:username>")
api.add_resource(ConversationList, "/chats")
api.add_resource(Message, "/message")
api.add_resource(MessageList, "/messages/<int:conversation_id>")
api.add_resource(User, "/user")
api.add_resource(UserList, "/users")
