from pydantic import BaseModel
from typing import Optional


class MusicRequest(BaseModel):
    index: Optional[int]
    artist: str
    music: str

    class Config:
        orm_mode = True