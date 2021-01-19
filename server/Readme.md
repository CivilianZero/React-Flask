# PostgreSQL Database Setup
### Mac
Since the downloadable installer doesn't work in MacOS anymore, use homebrew:
1. Install: `brew install postgres`
2. Run servers; `brew services start postgres`
   - Stop servers: `brew services stop postgres`
    - Restart servers: `brew services restart postgres`
3. Launch CLI: `psql postgres`
4. Create message_app db: `CREATE DATABASE message_app;`
5. Set `SQLALCHEMY_DATABASE_URI` to `"sqlite:///data.db"` in `config.py`
6. `config.py` will also need a `SECRET_KEY` attr for auth to work
### Windows
https://www.postgresql.org/download/windows/
### Linux
https://www.postgresql.org/download/linux/

After installing project dependencies, open a terminal in the server folder and run the following commands in order:  
1. `python manage.py db init`
2. `python manage.py db migrate`
3. `pipenv run flask run`