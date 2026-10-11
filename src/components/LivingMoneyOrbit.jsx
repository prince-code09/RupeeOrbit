import React from 'react';

/**
 * LivingMoneyOrbit
 * 
 * Signature Visual for RupeeOrbit based on the design mockup:
 * Dimensional stack of glowing golden/emerald Rupee tokens,
 * surrounded by concentric ribbon orbit rings with floating miniature category charms:
 * - 🏠 House (Rent)
 * - 🛒 Cart (Shopping/Food)
 * - ☕ Cup (Living)
 * - 📖 Book (Education)
 * - 💚 Heart (Health/Savings)
 * Plus handwritten script: "Live Track Plan Survive"
 */
export default function LivingMoneyOrbit({ size = 'full', className = '' }) {
  const isCompact = size === 'compact';
  const isMini = size === 'mini';

  if (isMini) {
    return (
      <div className={`relative w-8 h-8 flex items-center justify-center ${className}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#111D17" stroke="#EAB308" strokeWidth="3" />
          <circle cx="50" cy="50" r="32" fill="#0F6E54" stroke="#26A680" strokeWidth="2" />
          <text x="50" y="58" fontSize="30" fontFamily="Playfair Display, serif" fontWeight="bold" fill="#FDE047" textAnchor="middle">₹</text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}
      style={{
        width: isCompact ? 180 : 340,
        height: isCompact ? 160 : 300,
      }}
      aria-hidden="true"
    >
      {/* Ambient Radial Soft Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-mint-500/20 via-gold-400/15 to-mint-400/20 blur-3xl animate-pulse-subtle"
        style={{ transform: 'scale(1.2)' }}
      />

      {/* Main Floating Container */}
      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
        <svg
          viewBox="0 0 400 360"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gold Gradients */}
            <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>

            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EAB308" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#FACC15" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.85" />
            </linearGradient>

            {/* Emerald Core Gradients */}
            <radialGradient id="emeraldCoreGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="40%" stopColor="#059669" />
              <stop offset="80%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#022C22" />
            </radialGradient>

            <radialGradient id="tokenBaseGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="60%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#022C22" />
            </radialGradient>

            {/* Charm Disc Gradient */}
            <linearGradient id="charmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A2F" />
              <stop offset="100%" stopColor="#0D1A15" />
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="softOrbitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="deepShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#06120E" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Deep Ambient Floor Shadow */}
          <ellipse cx="200" cy="305" rx="110" ry="24" fill="#0B1410" opacity="0.35" filter="url(#softOrbitGlow)" />

          {/* BACK ORBITAL RIBBON 1 (Clockwise) */}
          <g className="animate-orbit-clockwise" style={{ transformOrigin: '200px 180px' }}>
            <ellipse
              cx="200"
              cy="180"
              rx="155"
              ry="65"
              fill="none"
              stroke="url(#goldRibbonGrad)"
              strokeWidth="3.5"
              transform="rotate(-28 200 180)"
              opacity="0.9"
            />
            {/* Fine dashed secondary trajectory */}
            <ellipse
              cx="200"
              cy="180"
              rx="168"
              ry="72"
              fill="none"
              stroke="#FACC15"
              strokeWidth="1"
              strokeDasharray="6 6"
              transform="rotate(-28 200 180)"
              opacity="0.4"
            />

            {/* Floating Category Charm 1: 🏠 House (Rent) */}
            <g transform="translate(70, 115)">
              <circle cx="16" cy="16" r="16" fill="url(#charmGrad)" stroke="#EAB308" strokeWidth="2" filter="url(#deepShadow)" />
              {/* House icon SVG path */}
              <path d="M16 9 L9 15 L11 15 L11 23 L21 23 L21 15 L23 15 Z" fill="#FDE047" />
            </g>

            {/* Floating Category Charm 2: 🛒 Cart (Shopping/Food) */}
            <g transform="translate(140, 245)">
              <circle cx="15" cy="15" r="15" fill="url(#charmGrad)" stroke="#10B981" strokeWidth="2" filter="url(#deepShadow)" />
              {/* Shopping cart icon path */}
              <path d="M9 10 L12 10 L14 19 L21 19 L22 13 L13 13 M14 21 A1.5 1.5 0 1 1 14 21.01 M20 21 A1.5 1.5 0 1 1 20 21.01" stroke="#FDE047" strokeWidth="1.6" fill="none" />
            </g>
          </g>

          {/* BACK ORBITAL RIBBON 2 (Counter-Clockwise) */}
          <g className="animate-orbit-counter" style={{ transformOrigin: '200px 180px' }}>
            <ellipse
              cx="200"
              cy="180"
              rx="145"
              ry="60"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.8"
              strokeDasharray="8 4"
              transform="rotate(38 200 180)"
              opacity="0.85"
            />

            {/* Floating Category Charm 3: 📖 Book (Education) */}
            <g transform="translate(300, 190)">
              <circle cx="15" cy="15" r="15" fill="url(#charmGrad)" stroke="#EAB308" strokeWidth="2" filter="url(#deepShadow)" />
              {/* Book icon */}
              <path d="M10 11 C13 10 15 11 16 13 C17 11 19 10 22 11 L22 21 C19 20 17 21 16 23 C15 21 13 20 10 21 Z" fill="none" stroke="#FDE047" strokeWidth="1.6" />
            </g>

            {/* Floating Category Charm 4: 💚 Heart / Shield (Health & Savings) */}
            <g transform="translate(255, 95)">
              <circle cx="15" cy="15" r="15" fill="url(#goldRimGrad)" stroke="#065F46" strokeWidth="1.5" filter="url(#deepShadow)" />
              {/* Heart icon */}
              <path d="M15 13 C13 11 10 12 10 15 C10 18 15 21 15 21 C15 21 20 18 20 15 C20 12 17 11 15 13 Z" fill="#065F46" />
            </g>
          </g>

          {/* CENTRAL 3D LAYERED FINANCIAL TOKEN STACK */}
          <g transform="translate(0, 0)">
            {/* BASE TOKEN DISC */}
            <g transform="translate(0, 16)">
              {/* Gold edge */}
              <path
                d="M 125 180 A 75 32 0 0 0 275 180 L 275 194 A 75 32 0 0 1 125 194 Z"
                fill="#854D0E"
                stroke="#CA8A04"
                strokeWidth="1"
              />
              {/* Face */}
              <ellipse cx="200" cy="180" rx="75" ry="32" fill="url(#tokenBaseGrad)" stroke="#EAB308" strokeWidth="2" />
            </g>

            {/* MAIN GLOWING GOLD & EMERALD TOKEN */}
            <g filter="url(#deepShadow)">
              {/* Heavy Beveled Gold Rim Edge */}
              <path
                d="M 120 162 A 80 34 0 0 0 280 162 L 280 178 A 80 34 0 0 1 120 178 Z"
                fill="url(#goldRimGrad)"
                stroke="#713F12"
                strokeWidth="1.5"
              />

              {/* Main Face Outer Gold Rim */}
              <ellipse
                cx="200"
                cy="162"
                rx="80"
                ry="34"
                fill="url(#goldRimGrad)"
                stroke="#FEF08A"
                strokeWidth="2.5"
              />

              {/* Concentric Beaded / Serrated Gold Inset Ring */}
              <ellipse
                cx="200"
                cy="162"
                rx="70"
                ry="29"
                fill="none"
                stroke="#854D0E"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />

              {/* Radiant Emerald Core Disc */}
              <ellipse
                cx="200"
                cy="162"
                rx="63"
                ry="25"
                fill="url(#emeraldCoreGrad)"
                stroke="#10B981"
                strokeWidth="1.5"
              />

              {/* Glowing Inner Concentric Golden Thread */}
              <ellipse
                cx="200"
                cy="162"
                rx="52"
                ry="20"
                fill="none"
                stroke="#FDE047"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.75"
              />

              {/* Engraved Indian Rupee Symbol (₹) */}
              <text
                x="200"
                y="173"
                fontSize="38"
                fontFamily="'Playfair Display', Georgia, serif"
                fontWeight="bold"
                fill="#FEF08A"
                textAnchor="middle"
                filter="url(#softOrbitGlow)"
                style={{ letterSpacing: '-1px' }}
              >
                ₹
              </text>
            </g>
          </g>

          {/* SCRIPT ANNOTATION: "Live Track Plan Survive" with arrows */}
          <g transform="translate(295, 120)">
            <text
              x="0"
              y="0"
              fontFamily="'Caveat', cursive"
              fontSize="20"
              fontWeight="bold"
              fill="#52796F"
              opacity="0.9"
            >
              Live
            </text>
            <path d="M26 -6 C32 -2 34 6 30 12" fill="none" stroke="#52796F" strokeWidth="1.2" strokeDasharray="2 2" />

            <text
              x="12"
              y="22"
              fontFamily="'Caveat', cursive"
              fontSize="20"
              fontWeight="bold"
              fill="#52796F"
              opacity="0.9"
            >
              Track
            </text>
            <path d="M48 20 C54 26 50 34 42 38" fill="none" stroke="#52796F" strokeWidth="1.2" strokeDasharray="2 2" />

            <text
              x="20"
              y="44"
              fontFamily="'Caveat', cursive"
              fontSize="20"
              fontWeight="bold"
              fill="#52796F"
              opacity="0.9"
            >
              Plan
            </text>
            <path d="M52 44 C56 50 50 58 42 60" fill="none" stroke="#52796F" strokeWidth="1.2" strokeDasharray="2 2" />

            <text
              x="18"
              y="66"
              fontFamily="'Caveat', cursive"
              fontSize="21"
              fontWeight="bold"
              fill="#2D5A4C"
            >
              Survive
            </text>
            <path d="M12 72 Q 40 76 60 70" fill="none" stroke="#EAB308" strokeWidth="1.8" />
          </g>
        </svg>
      </div>
    </div>
  );
}
