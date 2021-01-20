from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api

import config
from api.chat_handler import Chat, Message, ChatList, MessageList
from api.login_handler import Login, TokenRefresh
from api.register_handler import Register
from db import db

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config.from_object(config)
db.init_app(app)
api = Api(app)

jwt = JWTManager(app)

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(TokenRefresh, "/refresh")
api.add_resource(Chat, "/chat", "/chat/<string:name>")
api.add_resource(ChatList, "/conversations")
api.add_resource(Message, "/send")
api.add_resource(MessageList, "/messages")
