import sqlite3
from flask import g, current_app

DATABASE = 'database/app.db'

def get_db():
    db = getattr(g, 'database', None)
    if db is None:
        db = g.database = sqlite3.connect(DATABASE)
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    print('wtf')
    if one:
        return rv[0]
    else:
        return rv

    # I really didn't like this, but I understand it now
    # return (rv[0] if rv else None) if one else rv

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
        COLLATE NOCASE''', (username,), one=True)

def create_user(username, password):
    insert_db('''
        INSERT INTO user
            (user_name, user_password)
        VALUES
            (?, ?)''', (username, password))

def create_food(creator_id, food_name, food_serving_size, food_calories, food_fats,
    food_carbs, food_proteins):

    insert_db('''
        INSERT INTO food
            (creator_id, food_name, serving_size, calories, fats, carbs, proteins)
        VALUES
            (?, ?, ?, ?, ?, ?, ?)
        ''', 
        (creator_id, food_name, food_serving_size, food_calories, food_fats,
            food_carbs, food_proteins)
    )

def create_entry(user_id, date, food_id, grams):
    insert_db('''
        INSERT INTO food_entry
            (user_id, date, food_id, grams)
        VALUES
            (?, ?, ?, ?)
        ''', (user_id, date, food_id, grams))
