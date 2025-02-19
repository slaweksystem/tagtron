import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# PostgreSQL env
PG_USERNAME = os.getenv('POSTGRES_USER')
PG_PASSWORD = os.getenv('POSTGRES_PASSWORD')
PG_DATABASE = os.getenv('POSTGRES_DB' )
PG_HOST = os.getenv('POSTGRES_HOST', 'localhost')  # Default host is 'localhost'
PG_PORT = os.getenv('POSTGRES_PORT', '5432')       # Default port is '5432'

# PostgreSQL
#SQLALCHEMY_DATABASE_URL = f'postgresql://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}'
#engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SQLite
SQLALCHEMY_DATABASE_URL = 'sqlite:///./tagtron.db'
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()