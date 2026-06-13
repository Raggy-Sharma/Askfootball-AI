from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.schemas.player_attributes import (
    PlayerAttributes, 
    CoreAttributesSchema,
    AttackingAttributesSchema, 
    SkillAttributesSchema, 
    MovementAttributesSchema, 
    PowerAttributesSchema, 
    MentalityAttributesSchema, 
    DefensiveAttributesSchema, 
    GoalkeepingAttributesSchema
)

from app.database.session import get_db
from app.auth.api_key import verify_api_key
from app.models.attributes import PlayerAttribute
from app.schemas.common import APIResponse

router = APIRouter(
    prefix="/players/{player_id}/attributes",
    tags=["Attributes"],
    dependencies=[Depends(verify_api_key)]
)

@router.get("", response_model=APIResponse[PlayerAttributes])
def get_attributes(
    player_id: int,
    db: Session = Depends(get_db),
):
    """Get player attributes."""
    attributes = db.query(PlayerAttribute).filter(PlayerAttribute.player_id == player_id).first()
    return APIResponse[PlayerAttributes](
        data=PlayerAttributes(
            player_id=attributes.player_id,
            core_attributes=CoreAttributesSchema(
                pace=attributes.pace,
                shooting=attributes.shooting,
                passing=attributes.passing,
                dribbling=attributes.dribbling,
                defending=attributes.defending,
                physic=attributes.physic,
            ),
            attacking_attributes=AttackingAttributesSchema(
                attacking_crossing=attributes.attacking_crossing,
                attacking_finishing=attributes.attacking_finishing,
                attacking_heading_accuracy=attributes.attacking_heading_accuracy,
                attacking_short_passing=attributes.attacking_short_passing,
                attacking_volleys=attributes.attacking_volleys,
            ),
            skill_attributes=SkillAttributesSchema(
                skill_curve=attributes.skill_curve,
                skill_fk_accuracy=attributes.skill_fk_accuracy,
                skill_long_passing=attributes.skill_long_passing,
                skill_ball_control=attributes.skill_ball_control,
            ),
            movement_attributes=MovementAttributesSchema(
                movement_acceleration=attributes.movement_acceleration,
                movement_sprint_speed=attributes.movement_sprint_speed,
                movement_agility=attributes.movement_agility,
                movement_reactions=attributes.movement_reactions,
                movement_balance=attributes.movement_balance,
            ),
            power_attributes=PowerAttributesSchema(
                power_shot_power=attributes.power_shot_power,
                power_jumping=attributes.power_jumping,
                power_stamina=attributes.power_stamina,
                power_strength=attributes.power_strength,
                power_long_shots=attributes.power_long_shots,
            ),
            mentality_attributes=MentalityAttributesSchema(
                mentality_aggression=attributes.mentality_aggression,
                mentality_interceptions=attributes.mentality_interceptions,
                mentality_positioning=attributes.mentality_positioning,
                mentality_vision=attributes.mentality_vision,
                mentality_penalties=attributes.mentality_penalties,
                mentality_composure=attributes.mentality_composure,
            ),
            defensive_attributes=DefensiveAttributesSchema(
                defending_marking_awareness=attributes.defending_marking_awareness,
                defending_standing_tackle=attributes.defending_standing_tackle,
                defending_sliding_tackle=attributes.defending_sliding_tackle,
            ),
            goalkeeping_attributes=GoalkeepingAttributesSchema(
                goalkeeping_diving=attributes.goalkeeping_diving,
                goalkeeping_handling=attributes.goalkeeping_handling,
                goalkeeping_kicking=attributes.goalkeeping_kicking,
                goalkeeping_positioning=attributes.goalkeeping_positioning,
                goalkeeping_reflexes=attributes.goalkeeping_reflexes,
            ),
        ),
    )

