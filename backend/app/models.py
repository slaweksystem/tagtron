from database import Base
from sqlalchemy import Column, Integer, String

class Project(Base):
    __tablename__ = 'Project'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)