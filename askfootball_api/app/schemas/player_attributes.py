from pydantic import BaseModel
from app.schemas.player import CoreAttributesSchema

class AttackingAttributesSchema(BaseModel):
    attacking_crossing: int
    attacking_finishing: int
    attacking_heading_accuracy: int
    attacking_short_passing: int
    attacking_volleys: int

class SkillAttributesSchema(BaseModel):
    skill_curve: int
    skill_fk_accuracy: int
    skill_long_passing: int
    skill_ball_control: int

class MovementAttributesSchema(BaseModel):
    movement_acceleration: int
    movement_sprint_speed: int
    movement_agility: int
    movement_reactions: int
    movement_balance: int

class PowerAttributesSchema(BaseModel):
    power_shot_power: int
    power_jumping: int
    power_stamina: int
    power_strength: int
    power_long_shots: int

class MentalityAttributesSchema(BaseModel):
    mentality_aggression: int
    mentality_interceptions: int
    mentality_positioning: int
    mentality_vision: int
    mentality_penalties: int
    mentality_composure: int

class DefensiveAttributesSchema(BaseModel):
    defending_marking_awareness: int
    defending_standing_tackle: int
    defending_sliding_tackle: int

class GoalkeepingAttributesSchema(BaseModel):
    goalkeeping_diving: int
    goalkeeping_handling: int
    goalkeeping_kicking: int
    goalkeeping_positioning: int
    goalkeeping_reflexes: int
    
class PlayerAttributes(BaseModel):
    player_id: int
    core_attributes: CoreAttributesSchema
    attacking_attributes: AttackingAttributesSchema
    skill_attributes: SkillAttributesSchema
    movement_attributes: MovementAttributesSchema
    power_attributes: PowerAttributesSchema
    mentality_attributes: MentalityAttributesSchema
    defensive_attributes: DefensiveAttributesSchema
    goalkeeping_attributes: GoalkeepingAttributesSchema