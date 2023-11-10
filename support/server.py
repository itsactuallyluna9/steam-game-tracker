from flask import Flask
import sqlite3
import requests
import textdistance
from functools import cache
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

@cache
def get_details_for_game(game_id):
    r = requests.get(f'https://store.steampowered.com/api/appdetails?appids={game_id}')
    return r.json()

@app.route('/games/<game_id>')
def game(game_id):
    return get_details_for_game(game_id)

@app.route('/lookup/name/<game_name>')
def lookup_name(game_name):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT appid, name FROM games WHERE name LIKE ? LIMIT 100', (f'%{game_name}%',))
    res = []
    for row in c.fetchall():
        res.append({'appid': row[0], 'name': row[1], 'similarity': textdistance.levenshtein.normalized_similarity(row[1], game_name)})
    # textdistance.levenshtein
    res.sort(key=lambda x: x['similarity'], reverse=True)
    # filter out with the same appid
    filtered_res = []
    for i in range(len(res)):
        if i == 0 or res[i]['appid'] != res[i - 1]['appid']:
            filtered_res.append(res[i])
    return filtered_res

@app.route('/lookup/id/<game_id>')
def lookup_id(game_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT appid, name FROM games WHERE appid = ?', (game_id,))
    res = []
    for row in c.fetchall():
        res.append({'appid': row[0], 'name': row[1]})
    # filter out with the same appid
    filtered_res = []
    for i in range(len(res)):
        if i == 0 or res[i]['appid'] != res[i - 1]['appid']:
            filtered_res.append(res[i])
    return filtered_res

@app.route('/ping')
def ping():
    return 'Pong!'

app.run()