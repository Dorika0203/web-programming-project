from sqlalchemy.orm import Session
from models import Playlist
from schemas import MusicRequest

def get_playlist(db: Session):
    return db.query(Playlist).all()

def add_playlist(db: Session, item:MusicRequest):
    db_item = Playlist(artist=item.artist, music=item.music)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db.query(Playlist).all()