import React from "react";
// Placeholder for animated roadmap graphic
export default function AnimatedRoadmap({ levels, onLevelClick, guardBlocked }) {
    // You can add SVG or Canvas animations here
    return (
        <svg width="480" height="220" style={{ display: "block", margin: "0 auto" }}>
            {/* Example: circles for levels, lines connecting them */}
            <line x1="86" y1="120" x2="230" y2="77" stroke="#22d3ee" strokeWidth="6" />
            <line x1="230" y1="77" x2="374" y2="120" stroke="#22d3ee" strokeWidth="6" />
            <circle cx="86" cy="120" r="28" fill="#22d3ee" onClick={() => onLevelClick(1)} style={{ cursor: "pointer" }} />
            <circle cx="230" cy="77" r="28" fill={guardBlocked ? "#aaa" : "#22d3ee"} onClick={() => !guardBlocked && onLevelClick(2)} style={{ cursor: guardBlocked ? "not-allowed" : "pointer" }} />
            <circle cx="374" cy="120" r="28" fill={guardBlocked ? "#aaa" : "#22d3ee"} onClick={() => !guardBlocked && onLevelClick(3)} style={{ cursor: guardBlocked ? "not-allowed" : "pointer" }} />
            {/* Guard Monster graphic if blocked */}
            {guardBlocked && (
                <text x="230" y="170" textAnchor="middle" fill="#f5576c" fontSize="18">Guard Monster</text>
            )}
        </svg>
    );
}
