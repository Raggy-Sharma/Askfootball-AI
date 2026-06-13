from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Player(Base):
    __tablename__ = "players"
    player_id = Column(Integer, primary_key=True)
    display_name = Column(String)
    full_name = Column(String)
    positions = Column(String)
    age = Column(Integer)
    height_cm = Column(Integer)
    weight_kg = Column(Integer)
    preferred_foot = Column(String)
    weak_foot = Column(Integer)
    skill_moves = Column(Integer)
    overall = Column(Integer)
    potential = Column(Integer)
    value_eur = Column(Integer)
    wage_eur = Column(Integer)
    club_id = Column(Integer, ForeignKey("clubs.club_id"))
    nationality_id = Column(Integer, ForeignKey("nations.nation_id"))
    club_position = Column(String)
    jersey_number = Column(Integer)
    contract_valid_until_year = Column(Integer)
    primary_phase = Column(String)

    # Relationships
    club = relationship("Club", back_populates="players")
    nation = relationship("Nation", back_populates="players")
    attributes = relationship("PlayerAttribute", uselist=False,
                              back_populates="player")
    playstyles = relationship("PlayerPlaystyle", back_populates="player")
    roles = relationship("PlayerRole", back_populates="player")

