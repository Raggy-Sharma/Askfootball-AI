from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base


class SquadSummary(Base):
    __tablename__ = "squad_summary"

    club_id = Column(Integer, ForeignKey("clubs.club_id"), primary_key=True)
    role_name = Column(String, primary_key=True)
    player_count = Column(Integer)
    avg_score = Column(Float)
    elite_count = Column(Integer)
    best_player_id = Column(Integer)
    role_status = Column(String)

    club = relationship("Club", back_populates="squad_summaries")

