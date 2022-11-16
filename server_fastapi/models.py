from sqlalchemy import Column, Integer, String

from database import Base

class Playlist(Base):
    
    __tablename__="playlist"

    index = Column(Integer, primary_key=True)
    artist = Column(String)
    music = Column(String)