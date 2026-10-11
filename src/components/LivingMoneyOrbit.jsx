import React from 'react';

/**
 * LivingMoneyOrbit
 * 
 * Signature Visual for Ledgerly:
 * A dimensional stack of translucent, illuminated financial tokens
 * surrounded by delicate orbiting rings and small moving particles.
 * 
 * Supports:
 * - 'full' mode: Dedicated atmospheric decorative panel on Overview
 * - 'compact' mode: Subtly anchored in shell / header for persistent identity
 * - 'mini' mode: Minimalist badge for mobile navigation
 */
export default function LivingMoneyOrbit({ size = 'full', className = '' }) {
  const isCompact = size === 'compact';
  const isMini = size === 'mini';

  // Dimension scaling
  const dimensions = isMini
    ? { width: 44, height: 44, scale: 0.3 }
    : isCompact
    ? { width: 100, height: 100, scale: 0.55 }
    : { width: 280, height: 280, scale: 1.0 };

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      aria-hidden="true"
    >
      {/* Ambient Radial Mint Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-mint-500/10 via-mint-300/15 to-amberGold-400/10 blur-2xl mint-glow"
        style={{ transform: `scale(${dimensions.scale * 1.3})` }}
      />

      {/* Outer Floating Container (Gentle vertical oscillation) */}
      <div
        className="relative flex items-center justify-center animate-float-slow"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* SVG Orbital Rings & Travelling Particles */}
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="tokenGradTop" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#0F766E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#134E4A" stopOpacity="0.98" />
            </radialGradient>
            <radialGradient id="tokenGradMid" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#115E59" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="tokenGradBase" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#134E4A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#042F2E" stopOpacity="0.95" />
            </radialGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Charcoal Cast Shadow */}
          <ellipse
            cx="150"
            cy="245"
            rx="75"
            ry="18"
            fill="#0F1714"
            opacity="0.22"
            filter="url(#softGlow)"
          />

          {/* Orbit Ring 1 (Tilted 30deg, Slow Clockwise) */}
          <g className="animate-orbit-clockwise" style={{ transformOrigin: '150px 150px' }}>
            <ellipse
              cx="150"
              cy="150"
              rx="125"
              ry="52"
              fill="none"
              stroke="url(#orbitGrad1)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              transform="rotate(-25 150 150)"
              opacity="0.85"
            />
            {/* Particle 1 on Ring */}
            <circle
              cx="260"
              cy="100"
              r={isMini ? 2 : 4}
              fill="#FBBF24"
              filter="url(#softGlow)"
            />
            {/* Particle 1 Trail Node */}
            <circle
              cx="40"
              cy="200"
              r={isMini ? 1.5 : 3}
              fill="#34D399"
              opacity="0.75"
            />
          </g>

          {/* Orbit Ring 2 (Tilted -40deg, Slow Counter-Clockwise) */}
          <g className="animate-orbit-counter" style={{ transformOrigin: '150px 150px' }}>
            <ellipse
              cx="150"
              cy="150"
              rx="110"
              ry="45"
              fill="none"
              stroke="url(#orbitGrad2)"
              strokeWidth="1.2"
              transform="rotate(35 150 150)"
              opacity="0.75"
            />
            {/* Particle 2 on Ring */}
            <circle
              cx="230"
              cy="205"
              r={isMini ? 2 : 3.5}
              fill="#10B981"
              filter="url(#softGlow)"
            />
            {/* Warm metallic accent particle */}
            <circle
              cx="70"
              cy="95"
              r={isMini ? 1.5 : 2.8}
              fill="#F59E0B"
            />
          </g>

          {/* Orbit Ring 3: Subtle inner equator */}
          {!isMini && (
            <ellipse
              cx="150"
              cy="150"
              rx="88"
              ry="26"
              fill="none"
              stroke="#D1FAE5"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          )}

          {/* 3D TOKEN STACK (Tiered translucent illuminated financial discs) */}
          <g transform="translate(0, -6)">
            {/* BASE TOKEN */}
            {/* Rim edge */}
            <path
              d="M 95 180 A 55 22 0 0 0 205 180 L 205 192 A 55 22 0 0 1 95 192 Z"
              fill="#064E3B"
              opacity="0.9"
            />
            {/* Face */}
            <ellipse
              cx="150"
              cy="180"
              rx="55"
              ry="22"
              fill="url(#tokenGradBase)"
              stroke="#047857"
              strokeWidth="1"
            />

            {/* MIDDLE TOKEN */}
            {/* Rim edge */}
            <path
              d="M 95 152 A 55 22 0 0 0 205 152 L 205 164 A 55 22 0 0 1 95 164 Z"
              fill="#065F46"
              opacity="0.95"
            />
            {/* Face */}
            <ellipse
              cx="150"
              cy="152"
              rx="55"
              ry="22"
              fill="url(#tokenGradMid)"
              stroke="#059669"
              strokeWidth="1.2"
            />

            {/* TOP TOKEN (Brightest, Translucent, Embossed ₹) */}
            {/* Metallic rim edge */}
            <path
              d="M 95 124 A 55 22 0 0 0 205 124 L 205 137 A 55 22 0 0 1 95 137 Z"
              fill="#0F766E"
              stroke="#D97706"
              strokeWidth="0.8"
              opacity="0.98"
            />
            {/* Face */}
            <ellipse
              cx="150"
              cy="124"
              rx="55"
              ry="22"
              fill="url(#tokenGradTop)"
              stroke="#F59E0B"
              strokeWidth="1.8"
            />

            {/* Concentric inner etched ring on top coin */}
            <ellipse
              cx="150"
              cy="124"
              rx="42"
              ry="16.5"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="0.8"
              strokeDasharray="4 2"
              opacity="0.75"
            />

            {/* Engraved Rupee Sign (₹) */}
            <text
              x="150"
              y="131"
              fontSize="24"
              fontFamily="'JetBrains Mono', Georgia, serif"
              fontWeight="bold"
              fill="#FAF8F5"
              textAnchor="middle"
              filter="url(#softGlow)"
              style={{ letterSpacing: '-1px' }}
            >
              ₹
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
