from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class PlayerAttribute(Base):
    __tablename__ = "player_attributes"
    player_id = Column(Integer, ForeignKey("players.player_id"), primary_key=True)

    # Core Attribute Aggregates
    pace = Column(Integer)
    shooting = Column(Integer)
    passing = Column(Integer)
    dribbling = Column(Integer)
    defending = Column(Integer)
    physic = Column(Integer)

    # Attacking Skills
    attacking_crossing = Column(Integer)
    attacking_finishing = Column(Integer)
    attacking_heading_accuracy = Column(Integer)
    attacking_short_passing = Column(Integer)
    attacking_volleys = Column(Integer)

    # Skill & Ball Control
    # Note: 'dribbling' aggregate above, this is the detailed skill
    skill_curve = Column(Integer)
    skill_fk_accuracy = Column(Integer)
    skill_long_passing = Column(Integer)
    skill_ball_control = Column(Integer)

    # Movement & Physicality
    movement_acceleration = Column(Integer)
    movement_sprint_speed = Column(Integer)
    movement_agility = Column(Integer)
    movement_reactions = Column(Integer)
    movement_balance = Column(Integer)

    # Power Attributes
    power_shot_power = Column(Integer)
    power_jumping = Column(Integer)
    power_stamina = Column(Integer)
    power_strength = Column(Integer)
    power_long_shots = Column(Integer)

    # Mentality Attributes
    mentality_aggression = Column(Integer)
    mentality_interceptions = Column(Integer)
    mentality_positioning = Column(Integer)
    mentality_vision = Column(Integer)
    mentality_penalties = Column(Integer)
    mentality_composure = Column(Integer)

    # Defensive Technical Skills
    defending_marking_awareness = Column(Integer)
    defending_standing_tackle = Column(Integer)
    defending_sliding_tackle = Column(Integer)

    # Goalkeeping
    goalkeeping_diving = Column(Integer)
    goalkeeping_handling = Column(Integer)
    goalkeeping_kicking = Column(Integer)
    goalkeeping_positioning = Column(Integer)
    goalkeeping_reflexes = Column(Integer)

    # 27-Position Rating Grid (Attack)
    ls = Column(Integer)
    st = Column(Integer)
    rs = Column(Integer)
    lw = Column(Integer)
    lf = Column(Integer)
    cf = Column(Integer)
    rf = Column(Integer)
    rw = Column(Integer)

    # 27-Position Rating Grid (Midfield)
    lam = Column(Integer)
    cam = Column(Integer)
    ram = Column(Integer)
    lm = Column(Integer)
    lcm = Column(Integer)
    cm = Column(Integer)
    rcm = Column(Integer)
    rm = Column(Integer)
    ldm = Column(Integer)
    cdm = Column(Integer)
    rdm = Column(Integer)

    # 27-Position Rating Grid (Defense)
    lwb = Column(Integer)
    rwb = Column(Integer)
    lb = Column(Integer)
    lcb = Column(Integer)
    cb = Column(Integer)
    rcb = Column(Integer)
    rb = Column(Integer)

    # Goalkeeper
    gk = Column(Integer)

    player = relationship("Player", back_populates="attributes")







