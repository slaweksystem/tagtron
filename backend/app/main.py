from contextlib import asynccontextmanager
from fastapi import FastAPI
from .models import Base

from .database import engine
from .database_init import init_db
from .routers import  auth, projects, users

@asynccontextmanager
async def lifespan(application: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)