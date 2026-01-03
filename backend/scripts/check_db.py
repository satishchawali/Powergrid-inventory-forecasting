from sqlalchemy import create_engine, text
from app.config import settings

def check_db():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        print("Columns in 'users' table:")
        try:
            result = connection.execute(text("SHOW COLUMNS FROM users"))
            for row in result:
                print(row)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
