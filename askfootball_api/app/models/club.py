from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Club(Base):
    __tablename__ = "clubs"
    club_id = Column(Integer, primary_key=True)
    club_name = Column(String)
    league_id = Column(Integer, ForeignKey("leagues.league_id"))
    rival_team = Column(Integer)
    home_stadium = Column(String)

    league = relationship("League", back_populates="clubs")
    players = relationship("Player", back_populates="club")
    team_profile = relationship("TeamProfile", uselist=False,
                                back_populates="club")
    squad_summaries = relationship("SquadSummary", back_populates="club")


class League(Base):
    __tablename__ = "leagues"
    league_id = Column(Integer, primary_key=True)
    league_name = Column(String)
    league_level = Column(Integer)

    clubs = relationship("Club", back_populates="league")


class Nation(Base):
    __tablename__ = "nations"
    nation_id = Column(Integer, primary_key=True)
    nation_name = Column(String)

    players = relationship("Player", back_populates="nation")


