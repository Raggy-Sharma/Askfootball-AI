from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base


class PlayerRole(Base):
    __tablename__ = "player_roles"

    player_id = Column(Integer, ForeignKey("players.player_id"),
                       primary_key=True)
    role_name = Column(String, primary_key=True)
    score = Column(Float)
    confidence = Column(String)  # TEXT in your DB, not numeric
    explanation = Column(String)

    player = relationship("Player", back_populates="roles")
