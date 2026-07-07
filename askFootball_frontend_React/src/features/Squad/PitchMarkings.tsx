const PitchMarkings = () => (
    <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
    >
        {/* stroke uses currentColor so it adapts to theme; low opacity to blend */}
        <g fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.25">
            {/* outer boundary */}
            <rect x="2" y="2" width="96" height="146" />
            {/* halfway line */}
            <line x1="2" y1="75" x2="98" y2="75" />
            {/* center circle */}
            <circle cx="50" cy="75" r="12" />
            <circle cx="50" cy="75" r="0.6" fill="currentColor" />
            {/* top penalty box */}
            <rect x="25" y="2" width="50" height="20" />
            <rect x="38" y="2" width="24" height="8" />
            {/* bottom penalty box */}
            <rect x="25" y="128" width="50" height="20" />
            <rect x="38" y="140" width="24" height="8" />
        </g>
    </svg>
);

export default PitchMarkings;