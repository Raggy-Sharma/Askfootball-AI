import type { Player } from '@/features/Player/Player.types'

export const convertToCamelCase = (str: string) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const convertToTitleCase = (str: string) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const ATTACK_POS = ["ls","st","rs","lf","cf","rf"]

export const WING_POS = ["lw","rw"]

export const WIDE_MID_POS = ["lm", "rm"]

export const ATTACKING_MIDFIELD_POS = ["lam","cam","ram"]

export const MIDFIELD_POS = ["lcm","cm","rcm"]

export const DEFENSIVE_MIDFIELD_POS = ["ldm","cdm","rdm"]

export const WINGBACK_POS = ["lwb","rwb","lb","rb"]

export const DEFENSE_POS = ["lcb","cb","rcb"]

export const GK_POS = ["gk"]

export type GridSlot = {
    row: number
    col: number
}

export type PitchSlot = {
    col: number
    positions: string[]
}

export type PitchRow = {
    row: number
    slots: PitchSlot[]
}

/** 5 cols × 8 rows — attack (row 1) → GK (row 8) */
export const PITCH_ROWS: PitchRow[] = [
    {
        row: 1,
        slots: [
            { col: 2, positions: ['ls', 'lf'] },
            { col: 3, positions: ['st', 'cf'] },
            { col: 4, positions: ['rs', 'rf'] },
        ],
    },
    {
        row: 2,
        slots: [
            { col: 1, positions: ['lw'] },
            { col: 5, positions: ['rw'] },
        ],
    },
    {
        row: 3,
        slots: [
            { col: 1, positions: ['lm'] },
            { col: 2, positions: ['lam'] },
            { col: 3, positions: ['cam'] },
            { col: 4, positions: ['ram'] },
            { col: 5, positions: ['rm'] },
        ],
    },
    {
        row: 4,
        slots: [
            { col: 2, positions: ['lcm'] },
            { col: 3, positions: ['cm'] },
            { col: 4, positions: ['rcm'] },
        ],
    },
    {
        row: 5,
        slots: [
            { col: 2, positions: ['ldm'] },
            { col: 3, positions: ['cdm'] },
            { col: 4, positions: ['rdm'] },
        ],
    },
    {
        row: 6,
        slots: [
            { col: 1, positions: ['lwb', 'lb'] },
            { col: 5, positions: ['rwb', 'rb'] },
        ],
    },
    {
        row: 7,
        slots: [
            { col: 2, positions: ['lcb'] },
            { col: 3, positions: ['cb'] },
            { col: 4, positions: ['rcb'] },
        ],
    },
    {
        row: 8,
        slots: [{ col: 3, positions: ['gk'] }],
    },
]

export const POSITION_TO_SLOT: Record<string, GridSlot> = Object.fromEntries(
    PITCH_ROWS.flatMap(({ row, slots }) =>
        slots.flatMap(({ col, positions }) =>
            positions.map((pos) => [pos, { row, col }])
        )
    )
)

export const getGridSlot = (position: string): GridSlot | undefined =>
    POSITION_TO_SLOT[position.toLowerCase().trim()]

export type PlacedPlayer = {
    player: Player
    slot: GridSlot
}

export const compareGridSlots = (a: GridSlot, b: GridSlot): number =>
    a.row - b.row || a.col - b.col

export const placePlayersOnPitch = (players: Player[]): PlacedPlayer[] =>
    players
        .map((player) => {
            const slot = getGridSlot(player.club_position)
            if (!slot) return null
            return { player, slot }
        })
        .filter((entry): entry is PlacedPlayer => entry !== null)
        .sort((a, b) => compareGridSlots(a.slot, b.slot))


export const getCoreAttributes = (coreAttributes: any): Record<string, number> => {
    const attributes = Object.keys(coreAttributes)
    const normalizedAttributes: Record<string, number> = {}
    for (const attribute of attributes) {
        normalizedAttributes[convertToTitleCase(attribute)] = coreAttributes[attribute]
    }
    return normalizedAttributes
}