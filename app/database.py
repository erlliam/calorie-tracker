import sqlite3
from flask import g

DATABASE='./sqlite3/database.db'

def get_db():
    db = getattr(g, 'database', None)
    if db is None:
        db = g.database = sqlite3.connect(DATABASE)
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def insert_db(query, args=()):
    conn = get_db()
    cur = conn.execute(query, args)
    cur.close()
    conn.commit()

def username_found(username):
    return query_db('''
        SELECT *
        FROM user
        WHERE user_name = ?
        COLLATE NOCASE''', (username,))

def create_user(username, password):
    insert_db('''
        INSERT INTO user
            (user_name, user_password)
        VALUES
            (?, ?)''', (username, password))

def create_food(food_name, food_serving_size, food_calories):
    insert_db('''
        INSERT INTO food
            (food_name, serving_size, calories)
        VALUES
            (?, ?, ?)
        ''', (food_name, food_serving_size, food_calories))
