from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/powergrid_inventory"

engine = create_engine(
    DATABASE_URL,
    echo=True,          # shows SQL queries in terminal (optional)
    pool_pre_ping=True  # checks stale connections
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
