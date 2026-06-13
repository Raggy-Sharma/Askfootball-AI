from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base


class PlayerPlaystyle(Base):
    __tablename__ = "player_playstyles"

    player_id = Column(Integer, ForeignKey("players.player_id"),
                       primary_key=True)
    playstyle = Column(String, primary_key=True)
    is_plus = Column(Integer)  # BIGINT in SQLite, 0 or 1

    player = relationship("Player", back_populates="playstyles")
