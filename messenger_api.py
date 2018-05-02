from flask import request
from flask_api import FlaskAPI, status
import json
import redis

app = FlaskAPI(__name__)
redis = redis.Redis(host='localhost', port='6379', db=0)

HEADER = {'Access-Control-Allow-Origin': '*'}


@app.route("/addUser/", methods=['GET', 'POST'])
def add_user():
    print('hi!')
    req = request.get_json(force=True)
    print(req)
    nickname = req['name']
    print(nickname)
    if nickname.encode() in redis.smembers('users'):
        return {'text': 'User existe'}, status.HTTP_200_OK, HEADER
    else:
        redis.sadd('users', nickname)
        return {'text': 'User was created'}, status.HTTP_200_OK, HEADER

@app.route("/sendMessage/", methods=['GET', 'POST'])
def send_message():
    req = request.get_json(force=True)
    sender_nickname = req['sender_nickname']
    getter_nickname = req['getter_nickname']
    return {'not implemented': True}

@app.route("/getHistory/", methods=['GET', 'POST'])
def get_history():
    req = request.get_json(force=True)
    nickname = req['nickname']
    dialog = req['dialog']
    return {'not implemented': True}


@app.route("/getDialogs/", methods=['GET', 'POST'])
def get_dialogs():
    req = request.get_json(force=True)
    nickname = req['nickname']
    return {'not implemented': True}

@app.route("/getUserCount/", methods=['GET'])
def get_users_count():
    return {'users_count': redis.scard('users')}

if __name__ == '__main__':
    app.run(debug=False)
