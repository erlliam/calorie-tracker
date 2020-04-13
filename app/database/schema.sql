DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS food;
DROP TABLE IF EXISTS food_entry;

CREATE TABLE user (
    user_id         INTEGER PRIMARY KEY,
    user_name       TEXT    NOT NULL UNIQUE,
    user_password   TEXT    NOT NULL
);


CREATE TABLE food (
    food_id         INTEGER PRIMARY KEY,
    creator_id      INTEGER DEFAULT 0,
    food_name       TEXT    NOT NULL,
    serving_size    INTEGER NOT NULL,
    calories        INTEGER NOT NULL,
    fats            INTEGER DEFAULT 0,
    carbs           INTEGER DEFAULT 0,
    proteins        INTEGER DEFAULT 0,

    FOREIGN KEY (creator_id) 
        REFERENCES user(user_id)
            ON DELETE SET DEFAULT
);


CREATE TABLE food_entry (
    entry_id        INTEGER PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    date            TEXT    NOT NULL,
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
    (user_id, user_name, user_password)
VALUES
    (0, 'admin', 'password');
