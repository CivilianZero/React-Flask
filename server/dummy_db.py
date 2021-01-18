import sqlite3

# create temporary dummy db before implementing postgres
connection = sqlite3.connect("data.db")

cursor = connection.cursor()

create_table = "CREATE TABLE users (id int, username text, email text, password text)"
cursor.execute(create_table)

insert_query = "INSERT INTO users VALUES (?, ?, ?, ?)"

users = [(1, "lord nikon", "jeff@jeff.com", "secret"),
         (2, "acid burn", "jeffty@jeff.com", "love"),
         (3, "crash override", "geof@jeff.com", "god")]
cursor.executemany(insert_query, users)

connection.commit()

connection.close()
