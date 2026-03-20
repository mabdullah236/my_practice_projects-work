import os

# Get URL from env, or fallback to localhost for local testing without Docker
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://user:password@localhost/translingo_db"
)

engine = create_async_engine(DATABASE_URL, echo=True)