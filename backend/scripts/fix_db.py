from sqlalchemy import create_engine, text
from app.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        print("Checking users table...")
        try:
            result = connection.execute(text("SHOW COLUMNS FROM users"))
            columns = [row[0] for row in result]
            print(f"Current columns: {columns}")
            
            if 'username' not in columns:
                print("Adding 'username' column...")
                connection.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE NOT NULL AFTER full_name"))
                try:
                    connection.commit()
                except AttributeError:
                    pass 
                print("Column added.")
            else:
                print("'username' column exists.")
                
            if 'last_login_at' not in columns and 'last_login' in columns:
                 print("Renaming last_login to last_login_at...")
                 connection.execute(text("ALTER TABLE users CHANGE COLUMN last_login last_login_at TIMESTAMP NULL"))
                 try: connection.commit() 
                 except: pass
                 print("Renamed.")
            elif 'last_login_at' not in columns:
                 print("Adding last_login_at column...")
                 connection.execute(text("ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL"))
                 try: connection.commit() 
                 except: pass
                 print("Added.")

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    migrate()
