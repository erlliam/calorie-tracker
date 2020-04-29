import sqlite3
from flask import g, current_app

DATABASE = 'app/database/app.db'

def get_db():
    db = getattr(g, 'database', None)
    if db is None:
        db = g.database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    results = cur.fetchall()
    cur.close()

    if results:
        if one:
            return results[0]
        else:
            return results

def insert_db(query, args=()):
    conn = get_db()
    cur = conn.execute(query, args)
    cur.close()
    conn.commit()

def create_user(username, password):
    insert_db(
        '''
        INSERT INTO user
            (name, password)
        VALUES
            (?, ?)
        ''',
        (username, password)
    )

def get_user(username):
    return query_db(
        '''
        SELECT *
        FROM user
        WHERE name = ?
        COLLATE NOCASE
        ''',
        (username, ),
        one=True
    )


def create_food(creator_id, name, serving_size, calories, fats, carbs, proteins):
    insert_db(
        '''
        INSERT INTO food
            (creator_id, name, serving_size, calories, fats, carbs, proteins)
        VALUES
            (?, ?, ?, ?, ?, ?, ?)
        ''', 
        (creator_id, name, serving_size, calories, fats, carbs, proteins)
    )

def get_food(search_term):
    return query_db(
        '''
        SELECT * FROM food
        WHERE name LIKE ?
        ''',
        (f'%{search_term}%', )
    )


def create_entry(user_id, food_id, grams):
    insert_db(
        '''
        INSERT INTO food_entry
            (user_id, date, food_id, grams)
        VALUES
            (?, ?, ?, ?)
        ''',
        (user_id, 'Add date', food_id, grams)
    )

def get_entries(user_id, date):
    '''
    SELECT * FROM food_entry
    WHERE user_id = ? and date = ?
    '''
