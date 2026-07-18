// ── TIME-OF-DAY THEME ──
const TimeTheme = (function() {
  function getPhase() {
    const h = new Date().getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 12) return 'morning';
    if (h >= 12 && h < 16) return 'afternoon';
    if (h >= 16 && h < 19) return 'sunset';
    if (h >= 19 && h < 22) return 'evening';
    return 'night';
  }

  const themes = {
    dawn:      { bg: ['#1a1a3e', '#4a2c5e', '#f4845f'], label: '\ud83c\udf05 Dawn Departure',   stars: true,  starOpacity: 0.3 },
    morning:   { bg: ['#87CEEB', '#b5d6e8', '#f0f0f0'], label: '\u2600\ufe0f Morning Flight',   stars: false, starOpacity: 0 },
    afternoon: { bg: ['#4a90d9', '#6bb3e0', '#f5f5dc'], label: '\ud83c\udf24\ufe0f Afternoon Cruise', stars: false, starOpacity: 0 },
    sunset:    { bg: ['#2c1654', '#c84b31', '#f4a460'], label: '\ud83c\udf05 Sunset Approach',  stars: true,  starOpacity: 0.2 },
    evening:   { bg: ['#0d1b2a', '#1b2838', '#2d4a7a'], label: '\ud83c\udf06 Evening Arrival',  stars: true,  starOpacity: 0.6 },
    night:     { bg: ['#0a0e1a', '#0f1629', '#1a2240'], label: '\ud83c\udf19 Night Flight',     stars: true,  starOpacity: 0.9 }
  };

  function apply() {
    const phase = getPhase();
    const t = themes[phase];
    const root = document.documentElement;
    root.style.setProperty('--theme-bg1', t.bg[0]);
    root.style.setProperty('--theme-bg2', t.bg[1]);
    root.style.setProperty('--theme-bg3', t.bg[2]);
    root.style.setProperty('--star-opacity', t.starOpacity);
    return { phase, label: t.label, stars: t.stars, starOpacity: t.starOpacity };
  }

  return { apply, getPhase, themes };
})();
