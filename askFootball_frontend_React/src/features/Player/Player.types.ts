export type ATTACK_POS = "ls" | "st" | "rs" | "lw" | "lf" | "cf" | "rf" | "rw"
export type MIDFIELD_POS = "lam" | "cam" | "ram" | "lm" | "lcm" | "cm" | "rcm" | "rm" | "ldm" | "cdm" | "rdm" | "lam" | "cam" |"ram"
export type DEFENSE_POS = "lwb" | "lb" | "lcb" | "cb" | "rcb" | "rb" | "rwb"
export type GK_POS = "gk"
export type SUB = "SUB"
export type RES = "RES"

export type PreferredFoot = "Left" | "Right"

export interface Player {
    player_id: number
    display_name: string
    age: number
    overall: number
    potential: number
    positions: ATTACK_POS | MIDFIELD_POS | DEFENSE_POS | GK_POS | SUB | RES
    club_position: ATTACK_POS | MIDFIELD_POS | DEFENSE_POS | GK_POS | SUB | RES
    preferred_foot: PreferredFoot
    value_eur: number
    wage_eur: number
    club_name: string
    league_name: string
}