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

export function getContextualQuestions(clubPosition: string) {
    const base = [
        { key: "q_importance", displayValue: "How important is this player?", value: "How important is this player in this team?" },
        { key: "q_fit", displayValue: "How well does this player fit?", value: "How well does this player fit in this team?" },
    ];

    const GK = ['GK'];
    const DEF = ['LB', 'LCB', 'CB', 'RCB', 'RB', 'LWB', 'RWB'];
    const MID = ['LDM', 'CDM', 'RDM', 'LM', 'LCM', 'CM', 'RCM', 'RM', 'CAM', 'LAM', 'RAM'];
    const FWD = ['LW', 'RW', 'LF', 'CF', 'RF', 'LS', 'ST', 'RS'];

    if (GK.includes(clubPosition)) {
        base.push({ key: "q_gk", displayValue: "Find a backup goalkeeper", value: "Suggest a backup goalkeeper for this team within a reasonable budget" });
    } else if (DEF.includes(clubPosition)) {
        base.push({ key: "q_def", displayValue: "Who can cover this defensive role?", value: "Which players in this squad can cover this player's defensive role if injured?" });
        base.push({ key: "q_def2", displayValue: "Find a defensive signing", value: "Suggest a young defender who could strengthen this position" });
    } else if (MID.includes(clubPosition)) {
        base.push({ key: "q_mid", displayValue: "Find a midfield replacement", value: "Suggest a young central midfielder who could replace this player" });
        base.push({ key: "q_mid2", displayValue: "Who partners well here?", value: "Which midfielders in this squad partner well with this player?" });
    } else if (FWD.includes(clubPosition)) {
        base.push({ key: "q_fwd", displayValue: "Find a backup striker/winger", value: "Suggest a young attacker who could back up this player" });
        base.push({ key: "q_fwd2", displayValue: "Who supplies this player?", value: "Which players in this squad create the most chances for this player?" });
    }

    return base;
}

export function linkifyPlayers(markdown: string, players: Player[]): string {
    if (!players?.length) return markdown;
    // Longest names first, so "Joan García" matches before "García"
    const sorted = [...players].sort(
        (a, b) => b.display_name.length - a.display_name.length
    );
    let result = markdown;
    for (const player of sorted) {
        const escaped = player.display_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // \b word boundary; avoid double-wrapping already-linked text
        const regex = new RegExp(`(?<!\\]\\()\\b(${escaped})\\b`, 'g');
        result = result?.replace(regex, `[$1](afplayer:${player.player_id})`);
    }
    return result;
}

export function getConversationId (conversationType: "question" | "response") {
    return `${conversationType}-${crypto.randomUUID()}`
}

export function getImageSizeAndStyleClass(variant: "details" | "pitch" | "compare" | "default") {
    switch (variant) {
        case "details":
            return "h-34 w-20 rounded-full "
        case "pitch": 
            return "h-12 w-12 rounded-full"
        case "compare": 
            return "h-auto w-auto"
        default:
            return "h-12 w-12 rounded-full";
    }
}

export function toTitleCase(str: string) {
    if (!str) return '';
  
    return str
      // 1. Insert a space before any uppercase letter (handles camelCase)
      .replace(/([A-Z])/g, ' $1')
      // 2. Replace underscores with spaces (handles snake_case)
      .replace(/_/g, ' ')
      // 3. Trim extra spaces
      .trim()
      // 4. Capitalize the first letter of each word and lowercase the rest
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  export function formatCurrency(value?: number): string {
    if (value == null) return "—";
    if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
    return `€${value}`;
  }
  
  export function formatWage(value?: number): string {
    if (value == null) return "—";
    return `${formatCurrency(value)}/wk`;
  }
  
  // Initials for playstyle badges, e.g. "Quick Step+" -> "QS+"
  export function playstyleInitials(name: string): string {
    const hasPlus = name.trim().endsWith("+");
    const base = name.replace(/\+$/, "").trim();
    const initials = base
      .split(/\s+/)
      .map(w => w[0]?.toUpperCase())
      .join("")
      .slice(0, 3);
    return hasPlus ? `${initials}+` : initials;
  }