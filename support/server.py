from flask import Flask
import sqlite3
import requests
import json
from flask_cors import CORS

def get_connection():
    return sqlite3.connect('db.sqlite')

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hi! This is a simple server, used to fetch info about the games. I blame Everett.'

@app.route('/games')
def games():
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT appid, name FROM games')
    # return json
    res = []
    for row in c.fetchall():
        res.append({'appid': row[0], 'name': row[1]})
    return res

@app.route('/games/<game_id>')
def game(game_id):
    r = requests.get(f'https://store.steampowered.com/api/appdetails?appids={game_id}')
    return r.json()

@app.route('/ping')
def ping():
    return 'Pong!'

app.run()