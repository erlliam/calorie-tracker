DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS food;
DROP TABLE IF EXISTS food_entry;

CREATE TABLE user (
    user_id    INTEGER PRIMARY KEY,
    name       TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL
);

CREATE TABLE food (
    food_id         INTEGER PRIMARY KEY,
    creator_id      INTEGER DEFAULT 0,
    name            TEXT    NOT NULL,
    serving_size    INTEGER NOT NULL,
    calories        INTEGER NOT NULL,
    fats            INTEGER,
    carbs           INTEGER,
    proteins        INTEGER,

    FOREIGN KEY (creator_id) 
        REFERENCES user(user_id)
            ON DELETE SET DEFAULT
);


CREATE TABLE food_entry (
    entry_id        INTEGER PRIMARY KEY,
    date            TEXT    NOT NULL,
    user_id         INTEGER NOT NULL,
    food_id         INTEGER NOT NULL,
    grams           INTEGER NOT NULL,

    FOREIGN KEY (user_id) 
        REFERENCES user(user_id)
            ON DELETE SET DEFAULT

    FOREIGN KEY (food_id) 
        REFERENCES food(food_id)
            ON DELETE SET DEFAULT
);

INSERT INTO user
    (user_id, name, password)
VALUES
    (0, 'admin', 'password');
