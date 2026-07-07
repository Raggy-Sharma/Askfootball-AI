import React, { createContext, useContext } from "react";
import PlayerFace from './PlayerFace'
import { formatCurrency, formatWage, playstyleInitials, cmToFeetInches } from '@/Utils/CommonUtils'
import { getCountryCode } from '@/Utils/CountryCOdes'
import * as Flags from 'country-flag-icons/react/3x2';


type PlayerDetailsContext = {
    playerDetails: any;
}

const PlayerDetailsContext = createContext<PlayerDetailsContext>({ playerDetails: null });

function usePlayerDetailsContext() {
    return useContext(PlayerDetailsContext);
}

export default function PlayerDetails({ playerDetails, children }: any) {
    return (
        <PlayerDetailsContext.Provider value={{ playerDetails }}>
            <div className="relative flex flex-col min-h-0 w-full h-full border border-white/15 rounded-xl p-5 bg-[#141414] overflow-hidden">
                {children}
            </div>
        </PlayerDetailsContext.Provider>
    )
}

// ---- Overall + Position (top-left, big) ----
PlayerDetails.RatingPosition = function ({variant=""}) {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    const position = playerDetails.club_position !== 'SUB' && playerDetails.club_position !== 'RES' ? playerDetails.club_position : playerDetails.positions?.split(',')[0]?.trim();
    return (
        <div className="flex items-center gap-2">
            <span className={`${variant === 'details' ? 'text-md font-bold' : "text-4xl font-extrabold"}`}>{playerDetails.overall}</span>
            <span className={`${variant === "details" ? 'text-md font-bold' : "text-2xl font-extrabold opacity-90"}`}>| {position}</span>
        </div>
    )
}

// ---- Name + Country (styled like reference image) ----
PlayerDetails.Title = function ({titleString="", titleSize="", showFulName=false}) {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    return (
        <h2 className={`${titleSize} || 'text-lg font-bold'} leading-tight`}>{titleString ? titleString : showFulName ? playerDetails.full_name : playerDetails.display_name }</h2>
    )
}

PlayerDetails.Flag = function ({ size = 16 }: { size?: number }) {
    const { playerDetails } = usePlayerDetailsContext();
    const code = getCountryCode(playerDetails?.nationality);
    if (!code) return null;
    // country-flag-icons/react/3x2 exports components named by ISO code
    const FlagComponent = Flags[code];
    if (!FlagComponent) return null;
    return <FlagComponent style={{ width: size, height: size * 0.75 }} title={playerDetails.nationality} />;
}

PlayerDetails.NameAndCountry = function ({titleSize="", showFulName=false}) {
    const { playerDetails } = usePlayerDetailsContext();
    const nameSplit = playerDetails?.full_name?.split(' ') || [];
    const firstName = nameSplit.length > 0 && nameSplit[0];
    const displayName = nameSplit.slice(1, nameSplit.length).join(' ')
    if (!playerDetails) return null;
    return (
        <>
            {
                showFulName ?
                <div className="flex flex-col gap-2">
                    <PlayerDetails.Title titleSize="text-4xl font-bold" titleString={firstName}/>
                    <div className="flex gap-5 items-center">
                        <PlayerDetails.Flag size={24} />
                        <PlayerDetails.Title titleSize={"text-2xl font-semi-bold"} titleString={displayName}/>
                    </div>
                </div> : 

                <div className="flex flex-row items-center gap-4 text-xs">
                    <PlayerDetails.Flag size={24} />
                    <PlayerDetails.Title titleSize={titleSize} showFulName={showFulName}/>
                </div>
            }
        </>
    )
}

// ---- Positions row (top-right box: "Positions separated by |") ----
PlayerDetails.Positions = function () {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    const positions = (playerDetails.positions || playerDetails.club_position || "")
        .split(',')
        .map((p: string) => p.trim())
        .filter(Boolean);
    return (
        <div className="text-center text-sm font-medium text-cyan-200">
            {positions.join(' | ')}
        </div>
    )
}

// ---- Bio row: Age | Height | Preferred Foot ----
PlayerDetails.Bio = function ({textSize="", variant="details"}) {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    const heightCm = playerDetails.height_cm;
    if (variant === "details") return (
        <div className={`text-center ${textSize || 'text-xs'} font-medium text-blue-200`}>
            Age: {playerDetails.age ?? "—"} &nbsp;|&nbsp; Overall: {playerDetails.overall} &nbsp;|&nbsp; Potential: {playerDetails.potential}
        </div>
    )
     if (variant === "compare") return (
        <div className={`text-center ${textSize || 'text-xs'} font-medium text-blue-200`}>
            Age: {playerDetails.age ?? "—"} &nbsp;|&nbsp; Height: {cmToFeetInches(Number(heightCm))} &nbsp;|&nbsp; Pref. Foot: {playerDetails.preferred_foot?.[0] ?? "—"}
        </div>
     )
}

// ---- Summary: core attributes or GK attributes ----
PlayerDetails.Summary = function () {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    const isGK = playerDetails.club_position === 'GK';
    const attrs = isGK ? playerDetails.gk_attributes : playerDetails.core_attributes;
    if (!attrs) return null;
    const entries = Object.entries(attrs);
    return (
        <div className="rounded-md border border-orange-400/40 bg-orange-400/5 p-3 w-1/2">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-200">Summary</p>
            <div className="felx flex-col text-sm">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                        <span className="capitalize opacity-70">{key}</span>
                        <span className="font-semibold">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ---- Skill moves / weak foot stars ----
function Stars({ count }: { count: number }) {
    return (
        <span className="text-yellow-400 tracking-tighter">
            {"★".repeat(count)}
            <span className="text-white/20">{"★".repeat(5 - count)}</span>
        </span>
    )
}

PlayerDetails.SkillMoves = function () {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails?.skill_moves) return null;
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="opacity-70">Skill Moves</span>
            <Stars count={playerDetails.skill_moves} />
        </div>
    )
}

PlayerDetails.WeakFoot = function () {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails?.weak_foot) return null;
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="opacity-70">Weak Foot</span>
            <Stars count={playerDetails.weak_foot} />
        </div>
    )
}

// ---- Playstyles: styled initials badges ----
PlayerDetails.Playstyles = function () {
    const { playerDetails } = usePlayerDetailsContext();
    const playstyles = playerDetails?.playstyles;
    if (!playstyles?.length) return null;
    return (
        <div>
            <p className="mb-1.5 text-xs opacity-70">Playstyles</p>
            <div className="flex flex-wrap gap-1.5">
                {playstyles.map((ps: any, i: number) => {
                    const label = typeof ps === 'string' ? ps : ps.playstyle;
                    const isPlus = typeof ps === 'object' && ps.is_plus;
                    const display = playstyleInitials(isPlus ? `${label}+` : label);
                    return (
                        <span
                            key={`${label}-${i}`}
                            title={label}
                            className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-1.5 text-[10px] font-bold ${
                                isPlus
                                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                                    : 'border-white/25 bg-white/5 text-white/80'
                            }`}
                        >
                            {display}
                        </span>
                    );
                })}
            </div>
        </div>
    )
}

// ---- Market value + wage ----
PlayerDetails.MarketInfo = function () {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails) return null;
    return (
        <div className="flex flex-col w-full justify-between text-sm gap-4">
            <div>
                <span className="opacity-70">Value: </span>
                <span className="font-semibold">{formatCurrency(playerDetails.value_eur)}</span>
            </div>
            <div>
                <span className="opacity-70">Wage: </span>
                <span className="font-semibold">{formatWage(playerDetails.wage_eur)}</span>
            </div>
            <div>
                <span className="opacity-70">Remaining contract (in years): </span>
                <span className="font-semibold">{playerDetails.contract_valid_until_year - 2026}</span>
            </div>
        </div>
    )
}

// ---- Face (unchanged signature, kept for compatibility) ----
PlayerDetails.PlayerFace = function ({ variant, imageDimension, isLoading = false }: any) {
    const { playerDetails } = usePlayerDetailsContext();
    if (!playerDetails && !isLoading) return null;
    return <PlayerFace playerId={playerDetails?.player_id} variant={variant} imageDimension={imageDimension} isLoading={isLoading} />
}

// ---- Legacy single-attribute helper (kept for compatibility) ----
PlayerDetails.PlayerAttribute = function ({ attribute }: any) {
    return (
        <p className="text-sm font-bold">{attribute.attributeName}: {attribute.value}</p>
    )
}