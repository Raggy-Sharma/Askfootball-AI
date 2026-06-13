from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base


class TeamProfile(Base):
    __tablename__ = "team_profiles"

    club_id = Column(Integer, ForeignKey("clubs.club_id"),
                     primary_key=True)
    club_name = Column(String)
    club_tier = Column(String)

    # Tactical Identity
    build_up_style = Column(String)
    defensive_style = Column(String)
    tempo = Column(Integer)
    width = Column(Integer)
    pressing_intensity = Column(Integer)
    defensive_line = Column(Integer)
    preferred_formation = Column(String)

    # Personnel
    coach_name = Column(String)
    rivals = Column(String)

    # Data Sources
    formation_source = Column(String)
    coach_source = Column(String)
    rivals_source = Column(String)

    # Confidence Scores
    formation_confidence = Column(Integer)
    coach_confidence = Column(Integer)
    rivals_confidence = Column(Integer)

    # Override Flags
    formation_overridden = Column(Integer)  # 0 or 1
    coach_overridden = Column(Integer)
    rivals_overridden = Column(Integer)

    # Timestamps
    last_grounded_update = Column(String)
    last_user_update = Column(String)
    created_at = Column(String)

    club = relationship("Club", back_populates="team_profile")
