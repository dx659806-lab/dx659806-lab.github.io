```javascript
/**
 * Codex Bestiarum — Full JavaScript Engine
 * Complete standalone runtime: Procedural Audio, CSS-in-JS, State Engine, and Battle Loop.
 */
(function () {
  'use strict';

  // ==========================================
  // 1. DYNAMIC STYLESHEET INJECTION (CSS-in-JS)
  // ==========================================
  const CSS_STYLES = `
    :root {
      --bg-midnight: #0e0c0a;
      --bg-tome: #181410;
      --bg-surface: #221c17;
      --bg-surface-elevated: #2e261f;
      --parchment: #f0e6cf;
      --parchment-muted: #c8b99d;
      --ink: #f5eedb;
      --ink-soft: #b8a990;
      --gilt: #d4a34b;
      --gilt-bright: #fbbf24;
      --gilt-glow: rgba(251, 191, 36, 0.25);
      --wax-red: #991b1b;
      --wax-red-bright: #ef4444;
      --gem-cyan: #22d3ee;
      --gem-blue: #0284c7;
      --xp-purple: #9333ea;
      --xp-purple-bright: #c084fc;
      --fire: #e11d48;
      --water: #0284c7;
      --grass: #16a34a;
      --storm: #9333ea;
      --earth: #ca8a04;
      --font-display: 'Cinzel', Georgia, serif;
      --font-body: 'Crimson Text', Georgia, serif;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 100%; }

    body {
      background-color: var(--bg-midnight);
      background-image:
        radial-gradient(ellipse 900px 600px at 50% 0%, rgba(212, 163, 75, 0.12), transparent 70%),
        radial-gradient(circle at 15% 20%, rgba(147, 51, 234, 0.08), transparent 45%),
        radial-gradient(circle at 85% 30%, rgba(2, 132, 199, 0.08), transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(225, 29, 72, 0.06), transparent 50%),
        radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.85) 100%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 12px);
      background-attachment: fixed;
      font-family: var(--font-body);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
    }

    #app { min-height: 100vh; display: flex; flex-direction: column; }
    .screen {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      padding: 2rem 1.25rem 3rem; animation: fadeIn 0.4s ease; margin: 0 auto; width: 100%;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #vfx-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden; }
    .floating-combat-text {
      position: absolute; font-family: var(--font-display); font-weight: 900;
      text-shadow: 0 2px 6px #000, 0 0 12px currentColor; pointer-events: none;
      transform: translate(-50%, -50%); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .type-seal {
      --seal-size: 40px; width: var(--seal-size); height: var(--seal-size);
      border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
      border: 2px solid var(--gilt); box-shadow: 0 0 10px rgba(0,0,0,0.8), inset 0 0 6px rgba(255,255,255,0.25);
      flex-shrink: 0; color: #fff;
    }
    .type-seal svg { width: 58%; height: 58%; fill: #fff; stroke: none; }
    .type-seal--grass svg { fill: none; stroke: #fff !important; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .type-seal--fire { background: linear-gradient(135deg, #e11d48, #881337); border-color: #fda4af; box-shadow: 0 0 12px rgba(225,29,72,0.45); }
    .type-seal--water { background: linear-gradient(135deg, #0284c7, #0c4a6e); border-color: #7dd3fc; box-shadow: 0 0 12px rgba(2,132,199,0.45); }
    .type-seal--grass { background: linear-gradient(135deg, #16a34a, #14532d); border-color: #86efac; box-shadow: 0 0 12px rgba(22,163,74,0.45); }
    .type-seal--storm { background: linear-gradient(135deg, #9333ea, #581c87); border-color: #d8b4fe; box-shadow: 0 0 12px rgba(147,51,234,0.45); }
    .type-seal--earth { background: linear-gradient(135deg, #ca8a04, #713f12); border-color: #fde047; box-shadow: 0 0 12px rgba(202,138,4,0.45); }

    .creature-model { width: 100%; height: 84px; display: flex; align-items: center; justify-content: center; margin: 0.1rem 0 0.3rem; }
    .creature-model svg { width: 78px; height: 78px; overflow: visible; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.7)); }
    .creature-model svg polygon, .creature-model svg ellipse, .creature-model svg rect, .creature-model svg circle, .creature-model svg path {
      stroke: #120e0b; stroke-width: 1.5; stroke-linejoin: round; fill: var(--ink-soft);
    }
    .type-fire .creature-model svg > * { fill: #f43f5e; }
    .type-water .creature-model svg > * { fill: #38bdf8; }
    .type-grass .creature-model svg > * { fill: #4ade80; }
    .type-storm .creature-model svg > * { fill: #c084fc; }
    .type-earth .creature-model svg > * { fill: #eab308; }
    .creature-model svg .model-accent { fill: #fff !important; }
    .creature-model svg .model-dark { fill: #0e0c0a !important; stroke: none; }
    .mon-panel .creature-model { height: 100px; }
    .mon-panel .creature-model svg { width: 92px; height: 92px; }

    .title-screen, .difficulty-screen { justify-content: center; text-align: center; width: 100%; min-height: 100vh; padding: 1.5rem; }
    .title-frame {
      width: 100%; max-width: 100%; min-height: calc(100vh - 3rem);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      background: radial-gradient(circle at 50% 25%, #241e17 0%, #17130e 75%, #0f0c09 100%);
      border: 2px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.35);
      outline-offset: -6px; border-radius: 12px 32px 12px 32px; padding: 2.5rem 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6);
    }
    .eyebrow { font-family: var(--font-display); letter-spacing: 0.25em; text-transform: uppercase; font-size: 0.75rem; color: var(--gilt-bright); margin: 0 0 0.75rem; text-shadow: 0 0 10px rgba(251,191,36,0.4); }
    .game-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(2.4rem, 6vw, 3.8rem); letter-spacing: 0.04em; margin: 0 0 1rem; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(212,163,75,0.35); }
    .game-title::first-letter { color: var(--gilt-bright); font-size: 1.15em; text-shadow: 0 0 20px rgba(251,191,36,0.6); }
    .title-blurb { font-family: var(--font-display); font-size: 1.2rem; line-height: 1.6; color: var(--parchment-muted); margin: 0 0 1.5rem; max-width: 700px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
    .guide-heading { font-family: var(--font-display); font-size: 1.2rem; text-align: center; margin: 0 0 0.8rem; color: var(--gilt-bright); }
    .title-buttons { display: flex; flex-direction: column; gap: 0.7rem; align-items: center; justify-content: center; margin-top: 1rem; width: 100%; }
    .title-buttons-row { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }
    .reset-btn-title { background: linear-gradient(180deg, #3f3f46, #18181b) !important; color: #d4d4d8 !important; border-color: #52525b !important; }

    .player-identity-bar {
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.45);
      border: 1px solid var(--gilt); border-radius: 16px; padding: 0.6rem 1.2rem; margin-bottom: 0.8rem;
      font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: var(--ink); max-width: 480px; width: 100%;
      box-shadow: inset 0 0 12px rgba(0,0,0,0.6);
    }
    .player-identity-top { display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap; }
    .player-name-highlight { color: var(--gilt-bright); font-weight: 900; }

    .level-badge {
      padding: 0.2rem 0.7rem; border-radius: 12px; font-size: 0.82rem; letter-spacing: 0.05em; text-transform: uppercase;
      font-weight: 800; display: inline-flex; align-items: center; justify-content: center; text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    }
    .level-badge.level-tier-1 { background: linear-gradient(180deg, #0284c7, #0369a1); color: #f0f9ff; border: 1px solid #38bdf8; }
    .level-badge.level-tier-2 { background: linear-gradient(180deg, #7e22ce, #581c87); color: #faf5ff; border: 1px solid #c084fc; }
    .level-badge.level-tier-3 { background: linear-gradient(180deg, #b91c1c, #7f1d1d); color: #fef2f2; border: 1px solid #f87171; }
    .level-badge.level-tier-4 { background: linear-gradient(180deg, #15803d, #14532d); color: #f0fdf4; border: 1px solid #4ade80; }
    .level-badge.level-tier-5 { background: linear-gradient(180deg, #ca8a04, #854d0e); color: #fefce8; border: 1px solid #fde047; }

    .player-xp-container { width: 100%; display: flex; flex-direction: column; gap: 0.2rem; align-items: center; }
    .player-xp-track { width: 100%; max-width: 320px; height: 9px; background: #181410; border-radius: 5px; overflow: hidden; border: 1px solid rgba(212,163,75,0.4); }
    .player-xp-fill { height: 100%; background: linear-gradient(90deg, #9333ea, #6366f1); transition: width 0.3s ease; box-shadow: 0 0 8px rgba(147,51,234,0.6); }
    .player-xp-label { font-size: 0.75rem; color: var(--parchment-muted); font-family: var(--font-display); }

    .edit-name-btn {
      background: rgba(255,255,255,0.06); border: 1px solid var(--gilt); border-radius: 12px; padding: 0.15rem 0.55rem;
      font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; color: var(--parchment-muted);
      cursor: pointer; transition: all 0.15s ease;
    }
    .edit-name-btn:hover { background: var(--gilt); color: #000; }

    .currency-bar { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .gold-badge, .gem-badge {
      font-family: var(--font-display); font-size: 1.15rem; font-weight: bold; padding: 0.45em 1.2em;
      border-radius: 8px; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .gold-badge { color: var(--gilt-bright); text-shadow: 0 1px 2px #000; background: linear-gradient(180deg, #241a0d, #140d05); border: 2px solid var(--gilt); }
    .gem-badge { color: #a5f3fc; text-shadow: 0 1px 2px #000; background: linear-gradient(180deg, #0e7490, #083344); border: 2px solid #38bdf8; }

    .primary-btn, .move-btn {
      font-family: var(--font-display); font-weight: 700; letter-spacing: 0.03em;
      background: linear-gradient(180deg, #eab308, #ca8a04); border: 2px solid #fef08a;
      color: #1c150c; padding: 0.75em 1.6em; border-radius: 8px 14px 8px 14px; cursor: pointer;
      box-shadow: 0 3px 0 #713f12, 0 6px 12px rgba(0,0,0,0.6); transition: all 0.12s ease;
    }
    .primary-btn:hover:not(:disabled), .move-btn:hover:not(:disabled) { filter: brightness(1.15); box-shadow: 0 3px 0 #713f12, 0 0 15px rgba(251,191,36,0.6); }
    .primary-btn:active:not(:disabled), .move-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 0 0 #713f12, 0 2px 4px rgba(0,0,0,0.4); }
    .primary-btn:disabled, .move-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    .move-btn { padding-right: 3.5rem; }

    .section-title { font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 2.2rem); margin: 0 0 0.4rem; text-align: center; color: #fff; }
    .section-sub { text-align: center; color: var(--parchment-muted); margin: 0 0 1.5rem; }
    .count-badge { font-family: var(--font-display); font-weight: 700; color: var(--gilt-bright); }
    .creature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1rem; width: 100%; margin-bottom: 2rem; }

    .creature-card {
      position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; text-align: left;
      background: var(--bg-surface); border: 2px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.25);
      outline-offset: -5px; border-radius: 8px 5px 9px 4px; padding: 0.9rem; font-family: var(--font-body); color: var(--ink);
      cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: all 0.12s ease; width: 100%;
    }
    .creature-card.type-fire { border-top: 6px solid var(--fire); }
    .creature-card.type-water { border-top: 6px solid var(--water); }
    .creature-card.type-grass { border-top: 6px solid var(--grass); }
    .creature-card.type-storm { border-top: 6px solid var(--storm); }
    .creature-card.type-earth { border-top: 6px solid var(--earth); }
    .creature-card:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(0,0,0,0.7), 0 0 12px rgba(212,163,75,0.3); }
    .creature-card.selected { border-color: var(--gilt-bright); box-shadow: 0 0 0 3px rgba(251,191,36,0.5), 0 8px 18px rgba(0,0,0,0.7); }
    .creature-card:disabled { opacity: 0.4; cursor: not-allowed; }
    .creature-card .type-seal { position: absolute; top: 0.7rem; right: 0.7rem; }
    .selected-badge {
      position: absolute; top: 0.6rem; left: 0.7rem; width: 22px; height: 22px; background: var(--gilt-bright);
      color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border: 1px solid #000;
    }
    .creature-name { font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; display: block; margin-top: 0.1rem; color: #fff; }
    .creature-name::first-letter { color: var(--gilt-bright); font-size: 1.2em; }
    .creature-type-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--parchment-muted); display: block; }
    .creature-hp { font-family: var(--font-display); font-size: 0.85rem; display: block; margin-top: 0.15rem; color: #86efac; }
    .creature-moves { display: block; width: 100%; margin-top: 0.4rem; border-top: 1px dashed rgba(212,163,75,0.3); padding-top: 0.4rem; }
    .move-row { display: flex; justify-content: space-between; gap: 0.5rem; font-size: 0.85rem; padding: 0.1rem 0; }
    .move-name { font-style: italic; color: #fff; }
    .move-dmg { font-family: var(--font-display); color: #fca5a5; white-space: nowrap; }
    .move-cost { font-size: 0.72rem; color: var(--gilt-bright); margin-left: 0.3rem; }
    .creature-passive { display: block; font-size: 0.8rem; font-style: italic; color: var(--parchment-muted); margin-top: 0.4rem; line-height: 1.35; }

    .battle-screen { max-width: 900px; gap: 1rem; }
    .battle-top-nav { display: flex; gap: 1rem; justify-content: center; align-items: center; margin-bottom: 1rem; width: 100%; flex-wrap: wrap; }
    .battle-nav-btn {
      font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; padding: 0.6em 1.5em; border-radius: 8px 14px 8px 14px;
      cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: all 0.12s ease; display: inline-flex; align-items: center; justify-content: center;
    }
    .battle-nav-btn:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0,0,0,0.7); }
    .battle-nav-btn.guide-btn { background: linear-gradient(180deg, var(--bg-surface-elevated), var(--bg-surface)); border: 2px solid var(--gilt); color: var(--ink); }
    .battle-nav-btn.forfeit-btn { background: linear-gradient(180deg, #7f1d1d, #450a0a); border: 2px solid var(--wax-red-bright); color: #fecaca; }
    .battle-nav-btn.forfeit-btn:hover { background: var(--wax-red); color: #fff; }

    .party-rosters-container { width: 100%; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .party-roster-group {
      display: flex; flex-direction: column; align-items: center; gap: 0.45rem; background: rgba(24,20,16,0.85);
      border: 1px solid var(--gilt); border-radius: 8px 14px 8px 14px; padding: 0.55rem 0.9rem 0.65rem; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .roster-badge { font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.18rem 0.75rem; border-radius: 12px; }
    .player-badge { background: linear-gradient(180deg, #1c150c, #0d0a06); color: var(--gilt-bright); border: 1px solid var(--gilt); }
    .enemy-badge { background: linear-gradient(180deg, #7f1d1d, #450a0a); color: #fee2e2; border: 1px solid #ef4444; }
    .difficulty-indicator-badge { background: linear-gradient(180deg, #7f1d1d, #991b1b); color: #fee2e2; border: 1px solid #ef4444; }
    .party-row { display: flex; gap: 0.45rem; justify-content: center; align-items: center; }
    .party-token { position: relative; transition: all 0.15s ease; cursor: default; }
    .party-token.active { box-shadow: 0 0 0 3px var(--gilt-bright), 0 0 15px rgba(251,191,36,0.8) !important; transform: scale(1.12); z-index: 2; }
    .party-token.fainted { filter: grayscale(85%) brightness(0.4); opacity: 0.4; }
    .fainted-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 900; color: #ef4444; text-shadow: 0 0 4px #000; z-index: 3; }

    .versus-area { width: 100%; display: flex; align-items: stretch; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .mon-panel {
      flex: 1 1 260px; max-width: 320px; position: relative; background-color: var(--bg-surface); border: 2px solid var(--gilt);
      outline: 1px solid rgba(212,163,75,0.25); outline-offset: -5px; border-radius: 10px 6px 10px 6px; padding: 1rem; text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.6); transition: transform 0.08s ease;
    }
    .mon-panel.type-fire { border-top: 6px solid var(--fire); }
    .mon-panel.type-water { border-top: 6px solid var(--water); }
    .mon-panel.type-grass { border-top: 6px solid var(--grass); }
    .mon-panel.type-storm { border-top: 6px solid var(--storm); }
    .mon-panel.type-earth { border-top: 6px solid var(--earth); }
    .mon-panel.empty { display: flex; align-items: center; justify-content: center; opacity: 0.7; font-style: italic; min-height: 160px; font-family: var(--font-display); font-size: 1.1rem; color: var(--parchment-muted); }
    .mon-panel .type-seal { margin-bottom: 0.4rem; }
    .mon-name { font-family: var(--font-display); font-size: 1.3rem; margin: 0.2rem 0 0.6rem; color: #fff; }
    .mon-name::first-letter { color: var(--gilt-bright); font-size: 1.15em; }
    .hp-row { display: flex; align-items: center; gap: 0.5rem; }
    .hp-bar-track { flex: 1; height: 14px; background: #120e0b; border: 1px solid rgba(212,163,75,0.4); border-radius: 7px; overflow: hidden; }
    .hp-bar-fill { height: 100%; background: linear-gradient(180deg, #ef4444, #991b1b); transition: width 0.4s ease; box-shadow: 0 0 6px rgba(239,68,68,0.5); }
    .hp-text { font-family: var(--font-display); font-size: 0.8rem; white-space: nowrap; color: #fff; }
    .energy-pips { display: flex; gap: 0.3rem; justify-content: center; margin-top: 0.6rem; }
    .pip { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--gilt); background: transparent; }
    .pip.filled { background: var(--gilt-bright); box-shadow: 0 0 8px rgba(251,191,36,0.8); }
    .vs-divider { font-family: var(--font-display); font-weight: 900; font-size: 1.4rem; color: var(--gilt-bright); align-self: center; text-shadow: 0 0 10px rgba(251,191,36,0.5); }

    .inline-pick-container {
      width: 100%; background: var(--bg-surface); border: 2px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.25);
      outline-offset: -5px; border-radius: 10px; padding: 1rem 1.2rem; margin: 0.4rem 0 1rem; box-shadow: 0 8px 20px rgba(0,0,0,0.6);
      text-align: center;
    }
    .inline-pick-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.8rem; color: var(--gilt-bright); }
    .inline-pick-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.8rem; width: 100%; }

    .battle-lower { width: 100%; display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
    .action-bar { flex: 1 1 260px; display: flex; flex-direction: column; gap: 0.6rem; }
    .move-btn { display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem; text-align: left; width: 100%; }
    .move-btn-name { font-size: 1rem; }
    .move-btn-dmg { font-size: 0.78rem; font-family: var(--font-body); font-style: italic; }
    .move-btn-cost { font-size: 0.72rem; font-family: var(--font-body); font-style: italic; }

    .action-bar[class*="type-"] .move-btn.open-items-btn {
      background: linear-gradient(180deg, #0e7490, #083344);
      border-color: #38bdf8; color: #fff; box-shadow: 0 3px 0 #083344, 0 5px 8px rgba(0,0,0,0.5);
    }
    .action-bar[class*="type-"] .move-btn.open-items-btn .move-btn-dmg { color: #a5f3fc; }

    .action-bar[class*="type-"] .move-btn { position: relative; color: #fff; overflow: hidden; z-index: 1; }
    .action-bar[class*="type-"] .move-btn span { position: relative; z-index: 2; }
    .action-bar[class*="type-"] .move-btn .move-btn-dmg { color: rgba(255, 255, 255, 0.85); }
    .action-bar[class*="type-"] .move-btn .move-btn-cost { color: rgba(255, 255, 255, 0.95); }
    .action-bar[class*="type-"] .move-btn.special .move-btn-cost { color: #ffe699; font-weight: bold; }
    .action-bar.type-fire .move-btn { background: linear-gradient(180deg, #e11d48, #881337); border-color: #fda4af; box-shadow: 0 3px 0 #4c0519, 0 5px 8px rgba(0,0,0,0.5); }
    .action-bar.type-water .move-btn { background: linear-gradient(180deg, #0284c7, #0369a1); border-color: #7dd3fc; box-shadow: 0 3px 0 #0c4a6e, 0 5px 8px rgba(0,0,0,0.5); }
    .action-bar.type-grass .move-btn { background: linear-gradient(180deg, #16a34a, #15803d); border-color: #86efac; box-shadow: 0 3px 0 #14532d, 0 5px 8px rgba(0,0,0,0.5); }
    .action-bar.type-storm .move-btn { background: linear-gradient(180deg, #9333ea, #7e22ce); border-color: #d8b4fe; box-shadow: 0 3px 0 #581c87, 0 5px 8px rgba(0,0,0,0.5); }
    .action-bar.type-earth .move-btn { background: linear-gradient(180deg, #ca8a04, #a16207); border-color: #fde047; box-shadow: 0 3px 0 #713f12, 0 5px 8px rgba(0,0,0,0.5); }

    .eff-arrow { position: absolute; right: 1.25rem; top: 0; bottom: 0; display: flex; align-items: center; font-size: 1.8rem; z-index: 5; }
    .eff-up { color: #4ade80; text-shadow: 0 0 8px rgba(74,222,128,0.8); }
    .eff-up::before { content: '▲'; animation: floatUp 0.8s ease-in-out infinite alternate; display: block; }
    .eff-down { color: #f87171; text-shadow: 0 0 8px rgba(248,113,113,0.8); }
    .eff-down::before { content: '▼'; animation: floatDown 0.8s ease-in-out infinite alternate; display: block; }
    @keyframes floatUp { from { transform: translateY(4px); } to { transform: translateY(-4px); } }
    @keyframes floatDown { from { transform: translateY(-4px); } to { transform: translateY(4px); } }

    .battle-log-panel {
      flex: 1 1 300px; max-height: 230px; overflow-y: auto;
      background: linear-gradient(135deg, rgba(28,22,17,0.95) 0%, rgba(18,14,11,0.98) 100%);
      border: 2px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.25); outline-offset: -4px;
      border-radius: 8px 14px 8px 14px; padding: 0.85rem 1.1rem; box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 6px 14px rgba(0,0,0,0.6);
      font-family: var(--font-body); font-size: 1.05rem; line-height: 1.55; color: var(--ink);
    }
    .battle-log-panel::-webkit-scrollbar { width: 6px; }
    .battle-log-panel::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); border-radius: 3px; }
    .battle-log-panel::-webkit-scrollbar-thumb { background: var(--gilt); border-radius: 3px; }
    .log-entry { margin: 0 0 0.42rem; animation: fadeIn 0.3s ease; font-weight: 600; }
    .log-entry::before { content: '❧ '; color: var(--gilt-bright); font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; margin-right: 0.35em; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; padding: 1.5rem; z-index: 200; backdrop-filter: blur(3px); }
    .modal-box { background: var(--bg-surface); border: 3px solid var(--gilt); border-radius: 10px; padding: 1.5rem; max-width: 800px; width: 100%; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.9); }
    .modal-box h2 { font-family: var(--font-display); text-align: center; margin-top: 0; color: var(--gilt-bright); }
    .forfeit-modal-box, .reset-modal-box, .name-modal-box, .levelup-modal-box, .items-modal-box { max-width: 520px; text-align: center; padding: 2rem 1.5rem; }
    .forfeit-msg, .reset-msg, .name-modal-msg { font-size: 1.15rem; color: var(--parchment-muted); margin: 1rem 0 1.5rem; line-height: 1.5; }
    .name-input-field {
      width: 100%; max-width: 320px; padding: 0.65rem 0.9rem; font-family: var(--font-display); font-size: 1.1rem;
      background: #140f0c; border: 2px solid var(--gilt); border-radius: 8px; color: #fff;
      text-align: center; margin-bottom: 1.5rem; outline: none; box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);
    }
    .name-input-field:focus { border-color: var(--gilt-bright); box-shadow: 0 0 12px rgba(251,191,36,0.5); }
    .modal-buttons { display: flex; gap: 1.2rem; justify-content: center; flex-wrap: wrap; }
    .forfeit-confirm-btn, .reset-confirm-btn { background: linear-gradient(180deg, #ef4444, #991b1b); color: #fff; border-color: #fca5a5; box-shadow: 0 3px 0 #7f1d1d, 0 5px 8px rgba(0,0,0,0.5); }

    .items-list-grid { display: flex; flex-direction: column; gap: 0.75rem; margin: 1.2rem 0 1.5rem; text-align: left; }
    .item-modal-row {
      background: var(--bg-surface-elevated); border: 1.5px solid var(--gilt); border-radius: 8px; padding: 0.8rem 1rem;
      display: flex; justify-content: space-between; align-items: center; gap: 1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    }
    .item-modal-info { flex: 1; }
    .item-modal-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.4rem; }
    .item-modal-desc { font-size: 0.88rem; color: var(--parchment-muted); line-height: 1.35; }
    .item-modal-owned { font-size: 0.82rem; font-family: var(--font-display); font-weight: 700; color: var(--gilt-bright); margin-top: 0.2rem; }
    .item-modal-use-btn {
      font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; padding: 0.5em 1.2em; border-radius: 6px;
      background: linear-gradient(180deg, #eab308, #ca8a04); border: 1.5px solid #fef08a; color: #1c150c;
      cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: transform 0.1s ease; white-space: nowrap;
    }
    .item-modal-use-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
    .item-modal-use-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    .levelup-modal-box {
      background: radial-gradient(circle at 50% 30%, #2e1065 0%, var(--bg-surface) 100%);
      border: 3px solid #c084fc; box-shadow: 0 0 35px rgba(168,85,247,0.6);
    }
    .levelup-badge-big {
      font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: #d8b4fe;
      text-shadow: 0 0 15px rgba(192,132,252,0.8); margin: 0.5rem 0;
    }
    .levelup-unlock-note {
      background: rgba(147,51,234,0.2); border: 2px dashed #c084fc; border-radius: 8px;
      padding: 0.8rem 1rem; margin: 0.6rem 0; font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #f3e8ff; text-align: left;
    }

    .summon-reveal-box {
      max-width: 520px; text-align: center; padding: 2rem 1.5rem;
      background: radial-gradient(circle at 50% 30%, #352614 0%, var(--bg-surface) 100%);
      border: 3px solid var(--gilt-bright); box-shadow: 0 0 35px rgba(251,191,36,0.6);
    }
    .summon-reveal-box.is-pity { border-color: #38bdf8; box-shadow: 0 0 35px rgba(56,189,248,0.6); background: radial-gradient(circle at 50% 30%, #0c2d48 0%, var(--bg-surface) 100%); }
    .summon-reveal-box.is-duplicate { border-color: #52525b; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    .summon-title { color: var(--gilt-bright); font-family: var(--font-display); font-size: 1.8rem; margin: 0 0 0.5rem; }
    .summon-title.is-pity { color: #38bdf8; }
    .summon-title.is-duplicate { color: #a1a1aa; }
    .summon-card-preview { background: var(--bg-surface-elevated); border: 2px solid var(--gilt-bright); box-shadow: 0 0 16px rgba(251,191,36,0.4); border-radius: 10px; padding: 1.2rem; margin: 1.2rem auto; max-width: 320px; }
    .summon-card-preview.is-duplicate { border-color: #52525b; box-shadow: none; opacity: 0.85; }
    .summon-effect-desc { font-style: italic; color: var(--parchment-muted); margin: 0.6rem 0 0; font-size: 0.95rem; }
    .dupe-status-banner { background: rgba(0,0,0,0.5); border: 1px solid #52525b; border-radius: 6px; padding: 0.4rem 0.8rem; font-family: var(--font-display); font-size: 0.82rem; font-weight: 700; color: #a1a1aa; margin: 0.8rem 0 0.2rem; }

    .end-screen { justify-content: center; align-items: center; text-align: center; position: relative; z-index: 10; }
    .end-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(2.4rem, 8vw, 4rem); margin: 0 0 0.5rem; }
    .end-screen.victory .end-title { color: var(--gilt-bright); text-shadow: 0 0 20px rgba(251,191,36,0.6), 0 2px 0 #000; }
    .end-screen.defeat .end-title { color: #f87171; text-shadow: 0 0 20px rgba(239,68,68,0.6); }
    .end-sub { color: var(--parchment-muted); font-size: 1.2rem; margin: 0 0 1.5rem; max-width: 600px; font-weight: 600; line-height: 1.45; }
    .rewards-wrapper { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
    .gold-reward { font-family: var(--font-display); font-size: 1.3rem; color: var(--gilt-bright); text-shadow: 0 0 8px rgba(251,191,36,0.6); font-weight: bold; }
    .gem-reward { font-family: var(--font-display); font-size: 1.3rem; color: #38bdf8; text-shadow: 0 0 8px rgba(56,189,248,0.6); font-weight: bold; }
    .xp-reward { font-family: var(--font-display); font-size: 1.3rem; color: #c084fc; text-shadow: 0 0 8px rgba(192,132,252,0.6); font-weight: bold; }

    .difficulty-options { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; width: 100%; max-width: 820px; margin: 1.5rem 0 2rem; }
    .difficulty-card {
      flex: 1 1 320px; max-width: 380px; background: rgba(30, 24, 18, 0.9); border: 2px solid var(--gilt);
      border-radius: 12px; padding: 1.8rem 1.4rem; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: flex; flex-direction: column;
      justify-content: space-between; text-align: left; position: relative; transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .difficulty-card:hover:not(.locked-card) { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.8), 0 0 15px rgba(212,163,75,0.3); }
    .difficulty-card.hard { border-color: var(--wax-red-bright); background: linear-gradient(180deg, rgba(45, 15, 15, 0.9), rgba(24, 15, 15, 0.9)); }
    .difficulty-card.locked-card { opacity: 0.7; filter: grayscale(40%); }
    .difficulty-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
    .diff-badge { font-family: var(--font-display); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 4px; }
    .diff-badge.normal { background: #064e3b; color: #6ee7b7; border: 1px solid #10b981; }
    .diff-badge.hard { background: #7f1d1d; color: #fca5a5; border: 1px solid #ef4444; }
    .diff-badge.locked { background: #27272a; color: #a1a1aa; border: 1px solid #52525b; }
    .diff-title { font-family: var(--font-display); font-size: 1.5rem; margin: 0 0 0.5rem; color: #fff; }
    .diff-desc { font-size: 0.95rem; color: var(--parchment-muted); line-height: 1.45; margin: 0 0 1rem; }
    .diff-perks { list-style: none; padding: 0; margin: 0 0 1.5rem; font-size: 0.9rem; line-height: 1.5; color: var(--ink); }
    .diff-perks li { margin-bottom: 0.4rem; display: flex; align-items: flex-start; gap: 0.4rem; }
    .diff-perks li::before { content: '❖'; color: var(--gilt-bright); }
    .diff-rewards-box { background: rgba(0,0,0,0.4); border: 1px dashed var(--gilt); border-radius: 6px; padding: 0.6rem 0.8rem; font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; margin-bottom: 1.2rem; }
    .locked-reason-banner {
      background: rgba(153,27,27,0.25); border: 1px solid var(--wax-red-bright); border-radius: 6px;
      padding: 0.5rem 0.8rem; color: #fca5a5; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700;
      text-align: center; margin-bottom: 0.8rem;
    }

    .shop-screen { max-width: 820px; text-align: center; }
    .shop-items-container { display: flex; gap: 1.2rem; justify-content: center; flex-wrap: wrap; width: 100%; margin: 1rem 0; }
    .shop-item {
      background: var(--bg-surface); border: 2px solid var(--gilt); border-radius: 8px; padding: 1.5rem;
      width: 100%; max-width: 250px; box-shadow: 0 6px 14px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between;
    }
    .shop-item h3 { font-family: var(--font-display); margin: 0 0 0.5rem; font-size: 1.25rem; color: #fff; }
    .shop-item p { margin: 0 0 1.2rem; color: var(--parchment-muted); font-size: 0.92rem; line-height: 1.45; }

    .quests-container, .achievements-container {
      width: 100%; max-width: 960px; background: var(--bg-surface); border: 2px solid var(--gilt);
      outline: 1px solid rgba(212,163,75,0.25); outline-offset: -5px; border-radius: 10px; padding: 1.2rem 1.4rem;
      margin: 0 auto 1.5rem; box-shadow: 0 8px 20px rgba(0,0,0,0.5);
    }
    .quests-header, .achievements-header {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;
      margin-bottom: 1rem; border-bottom: 1px dashed rgba(212,163,75,0.4); padding-bottom: 0.6rem;
    }
    .quests-title, .achievements-title {
      font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; color: var(--gilt-bright);
      display: flex; align-items: center; gap: 0.4rem;
    }
    .quests-date-badge, .achieve-stats-badge {
      font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: var(--parchment-muted); letter-spacing: 0.05em;
    }
    .quests-grid, .achievements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .quest-card, .achieve-card {
      background: var(--bg-surface-elevated); border: 1px solid rgba(212,163,75,0.4); border-radius: 8px; padding: 0.9rem;
      display: flex; flex-direction: column; justify-content: space-between; gap: 0.6rem; position: relative; text-align: left;
    }
    .quest-card.locked-quest-card { opacity: 0.5; filter: grayscale(50%); border-style: dashed; }
    .quest-card.hard-quest-card { border-color: rgba(225,29,72,0.5); background: rgba(45,15,15,0.85); }
    .quest-card.completed, .achieve-card.unlocked-ready { border-color: var(--gilt-bright); background: rgba(50,40,20,0.9); box-shadow: 0 0 10px rgba(251,191,36,0.3); }
    .quest-card.hard-quest-card.completed { border-color: var(--wax-red-bright); background: rgba(60,20,25,0.9); box-shadow: 0 0 10px rgba(239,68,68,0.3); }
    .achieve-card.claimed, .quest-card.claimed { opacity: 0.6; background: rgba(20,20,20,0.6); border-color: #52525b; }
    .achieve-card.locked { opacity: 0.85; border-color: rgba(212,163,75,0.25); }
    .quest-card-top, .achieve-card-top { display: flex; justify-content: space-between; align-items: center; }
    .quest-tier-badge, .achieve-cat-badge {
      font-family: var(--font-display); font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.05em; padding: 0.18rem 0.5rem; border-radius: 4px;
    }
    .quest-tier--easy, .achieve-cat--battles { background: #064e3b; color: #6ee7b7; border: 1px solid #10b981; }
    .quest-tier--medium, .achieve-cat--attacks { background: #713f12; color: #fde047; border: 1px solid #ca8a04; }
    .quest-tier--hard, .achieve-cat--abilities { background: #3730a3; color: #c7d2fe; border: 1px solid #6366f1; }
    .achieve-cat--quests { background: #581c87; color: #f3e8ff; border: 1px solid #a855f7; }
    .achieve-cat--hardMode { background: #7f1d1d; color: #fecaca; border: 1px solid #ef4444; }

    .quest-desc, .achieve-desc { font-size: 0.95rem; font-weight: 600; color: #fff; margin: 0; line-height: 1.35; }
    .quest-rewards, .achieve-rewards { display: flex; gap: 0.5rem; font-family: var(--font-display); font-size: 0.82rem; font-weight: 700; }
    .quest-reward-gold, .achieve-reward-gold { color: var(--gilt-bright); }
    .quest-reward-gems, .achieve-reward-gems { color: #38bdf8; }
    .quest-progress-track, .achieve-progress-track {
      width: 100%; height: 8px; background: #120e0b; border-radius: 4px; overflow: hidden; margin: 0.2rem 0; border: 1px solid rgba(255,255,255,0.1);
    }
    .quest-progress-fill, .achieve-progress-fill {
      height: 100%; background: linear-gradient(90deg, var(--gilt-bright), #22c55e); transition: width 0.3s ease; box-shadow: 0 0 6px rgba(34,197,94,0.5);
    }
    .quest-progress-label, .achieve-progress-label {
      display: flex; justify-content: space-between; font-size: 0.75rem; font-family: var(--font-display); color: var(--parchment-muted);
    }
    .quest-claim-btn, .achieve-claim-btn {
      font-family: var(--font-display); font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.85rem;
      border-radius: 6px; background: linear-gradient(180deg, #22c55e, #15803d); color: #fff; border: 1px solid #4ade80;
      cursor: pointer; box-shadow: 0 0 10px rgba(34,197,94,0.4); transition: transform 0.1s ease;
    }
    .quest-claim-btn:hover, .achieve-claim-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .quest-claimed-label, .achieve-claimed-label { font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: #4ade80; }

    .altar-screen { max-width: 800px; text-align: center; }
    .altar-banner-tabs, .achieve-filter-bar, .index-filter-bar {
      display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin: 1rem 0;
    }
    .banner-tab-btn, .filter-btn {
      font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; padding: 0.45em 1.1em;
      border-radius: 20px; background: var(--bg-surface); border: 2px solid var(--gilt); color: var(--parchment-muted);
      cursor: pointer; transition: all 0.15s ease;
    }
    .banner-tab-btn.active, .filter-btn.active {
      background: var(--gilt); color: #000; border-color: var(--gilt-bright); box-shadow: 0 0 12px var(--gilt-glow);
    }
    .altar-pedestal {
      background: linear-gradient(135deg, #241c14, #18120c);
      border: 3px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.35); outline-offset: -5px;
      border-radius: 14px; padding: 1.8rem 1.2rem; margin: 1rem auto 1.5rem; width: 100%; max-width: 650px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.6);
    }
    .rotation-track { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin: 1.2rem 0 1.5rem; }
    .step-node {
      background: #15110d; border: 2px solid rgba(212,163,75,0.4); border-radius: 8px; padding: 0.6rem 0.4rem;
      display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    }
    .step-node.active { border-color: var(--gilt-bright); background: #352614; box-shadow: 0 0 15px rgba(251,191,36,0.5); transform: translateY(-3px); }
    .step-node.free-step { border-color: #38bdf8; }
    .step-node.free-step.active { border-color: #38bdf8; background: #0c2d48; box-shadow: 0 0 18px rgba(56,189,248,0.6); }
    .step-title { font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--gilt-bright); }
    .step-cost { font-size: 0.95rem; font-weight: bold; }
    .step-cost.free { color: #4ade80; text-transform: uppercase; letter-spacing: 0.05em; }
    .pity-streak-bar {
      background: rgba(0,0,0,0.5); border: 1px dashed var(--gilt); border-radius: 20px; padding: 0.4rem 1rem;
      display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--font-display); font-size: 0.85rem;
      font-weight: 700; color: var(--parchment-muted); margin-bottom: 1.2rem;
    }
    .pity-highlight { color: var(--gilt-bright); font-weight: 900; }
    .summon-btn-large { font-size: 1.2rem; padding: 0.8em 2.2em; }
    .altar-completed-banner {
      background: #064e3b; border: 2px solid #22c55e; border-radius: 8px; padding: 0.8rem 1rem;
      font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #86efac; margin-bottom: 1rem;
    }

    .move-row.enhanced { background: rgba(251,191,36,0.15); border: 1px solid var(--gilt-bright); border-radius: 4px; padding: 0.15rem 0.35rem; margin: 0.15rem 0; }
    .move-row.enhanced .move-dmg { color: var(--gilt-bright); font-weight: bold; }
    .enhanced-badge-tag { font-family: var(--font-display); font-size: 0.65rem; font-weight: 800; color: var(--gilt-bright); text-transform: uppercase; letter-spacing: 0.05em; margin-left: 0.3rem; }
    .aoe-badge-tag { font-family: var(--font-display); font-size: 0.65rem; font-weight: 800; color: #fdba74; background: rgba(194,65,12,0.5); border: 1px solid #f97316; border-radius: 4px; padding: 0.1rem 0.35rem; margin-left: 0.3rem; text-transform: uppercase; }
    .action-bar .move-btn.enhanced-move { border: 2px solid var(--gilt-bright) !important; box-shadow: 0 0 16px rgba(251,191,36,0.5) !important; }
    .action-bar .move-btn.enhanced-move::before { content: '★ ENHANCED'; position: absolute; top: 4px; right: 8px; font-family: var(--font-display); font-size: 0.62rem; font-weight: 800; color: #fef08a; text-shadow: 0 1px 2px #000; z-index: 4; }

    .index-screen, .achieve-screen, .quests-screen { max-width: 1200px; }
    .index-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.4rem; width: 100%; margin-bottom: 2.5rem; }
    .index-card {
      background: var(--bg-surface); border: 2px solid var(--gilt); outline: 1px solid rgba(212,163,75,0.25);
      outline-offset: -5px; border-radius: 10px; padding: 1.2rem; box-shadow: 0 6px 14px rgba(0,0,0,0.6);
      display: flex; flex-direction: column; gap: 0.8rem; text-align: left;
    }
    .index-card.type-fire { border-top: 6px solid var(--fire); }
    .index-card.type-water { border-top: 6px solid var(--water); }
    .index-card.type-grass { border-top: 6px solid var(--grass); }
    .index-card.type-storm { border-top: 6px solid var(--storm); }
    .index-card.type-earth { border-top: 6px solid var(--earth); }
    .index-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .index-move-section {
      display: flex; flex-direction: column; gap: 0.5rem; background: rgba(0,0,0,0.3);
      border: 1px solid rgba(212,163,75,0.35); border-radius: 6px; padding: 0.6rem 0.8rem;
    }
    .index-move-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--gilt-bright); display: flex; justify-content: space-between; }
    .index-enh-preview { margin-top: 0.35rem; padding: 0.45rem 0.6rem; border-radius: 6px; font-size: 0.85rem; line-height: 1.35; }
    .index-enh-preview.unlocked { background: rgba(202,138,4,0.2); border: 1px solid var(--gilt-bright); color: #fef08a; }
    .index-enh-preview.locked { background: rgba(0, 0, 0, 0.25); border: 1px dashed #52525b; color: #a1a1aa; }
    .status-pill { font-family: var(--font-display); font-size: 0.65rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.15rem 0.45rem; border-radius: 4px; }
    .status-pill.unlocked { background: #ca8a04; color: #000; }
    .status-pill.locked { background: #3f3f46; color: #d4d4d8; }

    .type-guide { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 760px; text-align: left; }
    .type-guide-row {
      display: flex; align-items: center; gap: 0.7rem; background: var(--bg-surface); border: 1px solid rgba(212,163,75,0.4);
      border-left: 5px solid var(--gilt); border-radius: 4px 8px 8px 4px; padding: 0.5rem 0.8rem; flex-wrap: wrap;
    }
    .type-guide-row.type-fire { border-left-color: var(--fire); }
    .type-guide-row.type-water { border-left-color: var(--water); }
    .type-guide-row.type-grass { border-left-color: var(--grass); }
    .type-guide-row.type-storm { border-left-color: var(--storm); }
    .type-guide-row.type-earth { border-left-color: var(--earth); }
    .type-guide-name { font-family: var(--font-display); font-weight: 700; min-width: 68px; color: #fff; }
    .type-guide-rel { font-size: 0.85rem; color: var(--parchment-muted); }
    .type-guide-rel strong { color: var(--gilt-bright); font-family: var(--font-display); font-size: 0.72rem; text-transform: uppercase; margin-right: 0.3rem; }
    .type-guide-rel.weak strong { color: var(--wax-red-bright); }
    .guide-btn {
      font-family: var(--font-display); font-size: 0.78rem; background: rgba(0,0,0,0.4); border: 1px solid var(--gilt);
      color: var(--parchment-muted); padding: 0.4em 1em; border-radius: 20px; cursor: pointer; transition: all 0.12s ease;
    }
    .guide-btn:hover { background: var(--gilt); color: #000; }

    @media (max-width: 640px) {
      .versus-area { flex-direction: column; align-items: center; }
      .vs-divider { transform: rotate(90deg); margin: -0.3rem 0; }
      .mon-panel { max-width: 100%; width: 100%; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS_STYLES;
  document.head.appendChild(styleEl);

  // Overlay for visual numbers
  const overlay = document.createElement('div');
  overlay.id = 'vfx-overlay';
  document.body.appendChild(overlay);

  // ==========================================
  // 2. WEB AUDIO SYNTHESIZER
  // ==========================================
  class SoundEngine {
    constructor() { this.ctx = null; }
    ensure() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) this.ctx = new Ctx();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    tone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
      this.ensure();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }
    noise(duration = 0.2, gainVal = 0.25) {
      this.ensure();
      if (!this.ctx) return;
      const bSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + duration);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start();
    }
    click() { this.tone(780, 'triangle', 0.04, 0.06); }
    potion() { [320, 480, 640].forEach((f, i) => setTimeout(() => this.tone(f, 'sine', 0.18, 0.12), i * 70)); }
    attackHit(isSpecial) {
      this.noise(isSpecial ? 0.3 : 0.16, isSpecial ? 0.35 : 0.18);
      this.tone(isSpecial ? 90 : 160, 'sawtooth', isSpecial ? 0.25 : 0.12, 0.15);
    }
    superEffective() { [440, 660, 880].forEach((f, i) => setTimeout(() => this.tone(f, 'sine', 0.15, 0.16), i * 60)); }
    faint() { [240, 180, 120, 60].forEach((f, i) => setTimeout(() => this.tone(f, 'sawtooth', 0.2, 0.12), i * 80)); }
    levelUp() { [392, 523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => this.tone(f, 'sine', 0.3, 0.18), i * 90)); }
    victory() { [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => this.tone(f, 'triangle', 0.3, 0.22), i * 110)); }
    defeat() { [293.66, 277.18, 261.63, 246.94].forEach((f, i) => setTimeout(() => this.tone(f, 'sawtooth', 0.35, 0.18), i * 150)); }
  }
  const sound = new SoundEngine();

  // ==========================================
  // 3. VISUAL EFFECTS ENGINE
  // ==========================================
  const fx = {
    shake(el) {
      if (!el) return;
      el.style.transform = 'translateX(-8px)';
      setTimeout(() => el.style.transform = 'translateX(8px)', 40);
      setTimeout(() => el.style.transform = 'translateX(-5px)', 80);
      setTimeout(() => el.style.transform = 'translateX(5px)', 120);
      setTimeout(() => el.style.transform = 'none', 160);
    },
    spawnDmg(targetEl, text, isSuper, isHeal) {
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const overlayEl = document.getElementById('vfx-overlay');
      if (!overlayEl) return;
      const num = document.createElement('div');
      num.className = 'floating-combat-text';
      num.textContent = text;
      num.style.left = `${rect.left + rect.width / 2 + (Math.random() * 30 - 15)}px`;
      num.style.top = `${rect.top + rect.height / 3}px`;
      num.style.fontSize = isSuper ? '2.3rem' : (isHeal ? '1.8rem' : '1.9rem');
      num.style.color = isHeal ? '#4ade80' : (isSuper ? '#fbbf24' : '#ef4444');
      overlayEl.appendChild(num);
      requestAnimationFrame(() => {
        num.style.opacity = '0';
        num.style.transform = 'translate(-50%, -70px)';
      });
      setTimeout(() => num.remove(), 850);
    },
    confettiVictory() {
      if (typeof window.confetti === 'function') {
        window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  // ==========================================
  // 4. BESTIARY & GAME DATA
  // ==========================================
  const TYPE_META = {
    fire:  { label: 'Fire' },
    water: { label: 'Water' },
    grass: { label: 'Nature' },
    storm: { label: 'Storm' },
    earth: { label: 'Earth' }
  };

  const TYPE_ICONS = {
    fire: '<path d="M12,2 C10.5,5.5 14,8.5 12.5,12 C11.5,10.5 11,9.5 9,8.5 C7,11.5 6,13.5 6,16 C6,19.3 8.7,22 12,22 C15.3,22 18,19.3 18,16 C18,12 15.5,7 12,2 Z"/>',
    water: '<path d="M12,2 C12,2 5,11.5 5,16 C5,19.866 8.134,23 12,23 C15.866,23 19,19.866 19,16 C19,11.5 12,2 12,2 Z"/>',
    grass: '<path d="M4.8,19.5 C4.2,14.5 5.8,7.8 11.8,4.5 C15.5,4.3 18.5,5.2 20.2,6.2 C17.5,11.5 15,15.2 10.5,17.2 C8.2,17.5 6.5,17.5 6.5,17.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8,13.8 C8.5,12 10.8,10.8 12.5,10.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
    storm: '<polygon points="13,2 6,14 11,14 9,22 18,10 13,10"/>',
    earth: '<polygon points="9,6 13,12 17,4 22,20 2,20"/>'
  };

  const EFFECTIVENESS = {
    fire:  { fire: 1, water: 0.67, grass: 1.5, storm: 1, earth: 1.0 },
    water: { fire: 1.5, water: 1, grass: 0.67, storm: 0.67, earth: 1 },
    grass: { fire: 0.67, water: 1.5, grass: 1, storm: 1, earth: 1.5 },
    storm: { fire: 1, water: 1.5, grass: 1, storm: 1, earth: 0.67 },
    earth: { fire: 1.5, water: 1, grass: 0.67, storm: 1.5, earth: 1 }
  };

  const VICTORY_MSGS = [
    "Congrats you beat a bot, how skilled of you",
    "Wow, how impressive now try and beat a real player. Oh wait, the developer hasn't developed that option yet",
    "That was a close one eh?",
    "Nah that was a fluke, you're not gonna win next time"
  ];

  const DEFEAT_MSGS = [
    "Bro really lost to a bot lmao",
    "How trash can one be?",
    "Better luck next time buddy",
    "You might have a skill issue ngl",
    "Womp Womp"
  ];

  const CREATURES = [
    { id: 'phoenix', name: 'Phoenix', type: 'fire', maxHp: 60,
      basic: { name: 'Ember Peck', dmg: 12 }, special: { name: 'Solar Flare', dmg: 26, cost: 2 },
      passive: 'rebirth', passiveDesc: 'Once per battle, rises from defeat with 20 HP instead of fainting.',
      model: '<path d="M45,75 L30,95 L50,85 L70,95 L55,75 Z" /><path d="M50,30 C30,30 10,20 10,20 C15,35 25,50 40,55 L35,85 L50,75 L65,85 L60,55 C75,50 85,35 90,20 C90,20 70,30 50,30 Z" /><path d="M50,15 C55,15 60,20 60,25 C60,35 40,35 40,25 C40,20 45,15 50,15 Z" /><path d="M45,15 L40,5 L50,10 L60,5 L55,15 Z" class="model-accent"/><circle cx="48" cy="22" r="2" class="model-dark"/>' },
    { id: 'ifrit', name: 'Ifrit', type: 'fire', maxHp: 65,
      basic: { name: 'Cinder Claw', dmg: 13 }, special: { name: 'Infernal Burst', dmg: 24, cost: 2, aoe: true },
      passive: 'scorch', passiveDesc: 'Infernal Burst may scorch the foe, searing them at the start of their next turn.',
      model: '<path d="M40,30 C30,40 30,60 40,70 C50,80 30,90 20,95 C40,95 70,80 60,65 C55,55 70,40 60,30 Z" /><path d="M40,15 C40,5 60,5 60,15 C60,25 55,30 50,30 C45,30 40,25 40,15 Z" /><path d="M35,35 C20,35 15,50 25,55 C35,60 45,50 50,45 C55,50 65,60 75,55 C85,50 80,35 65,35 Z" /><path d="M42,16 C34,14 26,8 22,2 C28,6 39,8 46,11 Z" class="model-accent"/><path d="M58,16 C66,14 74,8 78,2 C72,6 61,8 54,11 Z" class="model-accent"/>' },
    { id: 'salamander', name: 'Salamander', type: 'fire', maxHp: 55,
      basic: { name: 'Tail Whip', dmg: 14 }, special: { name: 'Molten Bite', dmg: 22, cost: 2 },
      passive: 'dyingEmber', passiveDesc: 'When it falls, its dying ember burns the foe for 14.',
      model: '<path d="M20,80 C10,80 5,60 20,55 C40,50 60,60 75,50 C85,45 90,30 80,25 C70,20 60,30 65,40 C70,50 50,40 30,45 C15,50 15,70 25,75 Z" /><path d="M25,55 L15,45 L20,40 L30,52 Z" /><path d="M40,50 L35,35 L42,33 L45,47 Z" /><path d="M55,45 L50,35 L57,33 L60,45 Z" /><path d="M70,50 L80,65 L87,60 L75,48 Z" /><path d="M30,45 L35,30 L40,43 L48,25 L53,40 L62,28 L65,40 Z" class="model-accent"/><circle cx="78" cy="30" r="2" class="model-dark"/>' },
    { id: 'kraken', name: 'Kraken', type: 'water', maxHp: 80,
      basic: { name: 'Tentacle Lash', dmg: 12 }, special: { name: 'Crushing Grip', dmg: 22, cost: 2 },
      passive: 'crushingGrip', passiveDesc: 'Crushing Grip deals 12 bonus damage to a foe below 30% HP.',
      model: '<path d="M35,50 C20,60 10,80 15,95 C20,85 30,70 40,55 Z" /><path d="M45,50 C40,70 35,90 45,95 C50,85 50,70 50,55 Z" /><path d="M55,50 C60,70 65,90 55,95 C50,85 50,70 50,55 Z" /><path d="M65,50 C80,60 90,80 85,95 C80,85 70,70 60,55 Z" /><path d="M30,40 C30,10 70,10 70,40 C70,55 30,55 30,40 Z" /><circle cx="40" cy="35" r="4" class="model-accent"/><circle cx="60" cy="35" r="4" class="model-accent"/><circle cx="40" cy="35" r="1.5" class="model-dark"/><circle cx="60" cy="35" r="1.5" class="model-dark"/>' },
    { id: 'nixie', name: 'Nixie', type: 'water', maxHp: 58,
      basic: { name: 'Siren Song', dmg: 12 }, special: { name: 'Tidal Wave', dmg: 24, cost: 2, aoe: true },
      passive: 'lure', passiveDesc: 'Siren Song may lure the foe, halving the damage of their next attack.',
      model: '<path d="M45,50 C30,60 20,80 40,95 C60,80 70,60 55,50 Z" /><path d="M40,95 C30,90 20,95 20,95 C30,105 40,100 40,95 Z" class="model-accent"/><path d="M60,95 C50,90 40,95 40,95 C50,105 60,100 60,95 Z" class="model-accent"/><path d="M42,25 C42,40 40,55 45,55 C50,55 58,40 58,25 Z" /><path d="M42,20 C42,10 58,10 58,20 C58,30 42,30 42,20 Z" /><path d="M45,10 C20,10 10,30 25,45 C20,30 30,20 42,15 Z" class="model-accent"/><path d="M55,10 C80,10 90,30 75,45 C80,30 70,20 58,15 Z" class="model-accent"/>' },
    { id: 'leviathan', name: 'Leviathan', type: 'water', maxHp: 85,
      basic: { name: 'Deep Current', dmg: 13 }, special: { name: 'Abyssal Roar', dmg: 24, cost: 2 },
      passive: 'thickHide', passiveDesc: 'Thick hide reduces all incoming damage by 4.',
      model: '<path d="M15,86 C15,74 35,70 58,72 C80,74 88,82 85,90 C80,97 50,98 28,95 C16,93 15,86 15,86 Z"/><path d="M60,78 C70,55 64,30 48,16 C36,6 20,12 14,24 C10,32 12,42 22,46 C16,49 10,44 8,36 C6,24 16,10 32,5 C52,-2 76,14 78,42 C80,62 70,78 60,78 Z"/><polygon points="48,15 54,6 58,16" class="model-accent"/><polygon points="62,24 72,18 68,30" class="model-accent"/><polygon points="73,38 84,36 76,46" class="model-accent"/><polygon points="76,54 86,55 74,62" class="model-accent"/><path d="M25,28 C20,20 12,22 8,28 C5,32 8,36 15,35 C20,34 26,35 25,28 Z"/><path d="M18,39 C14,42 9,41 7,37 C10,36 14,35 18,39 Z"/><polygon points="12,32 10,38 14,35" class="model-accent"/><circle cx="16" cy="28" r="2.5" class="model-accent"/><circle cx="16" cy="28" r="1.2" class="model-dark"/>' },
    { id: 'dryad', name: 'Dryad', type: 'grass', maxHp: 62,
      basic: { name: 'Vine Whip', dmg: 12 }, special: { name: "Nature's Wrath", dmg: 23, cost: 2 },
      passive: 'regrowth', passiveDesc: 'Regrows 6 HP at the start of each of her turns.',
      model: '<path d="M46,25 C41,32 42,38 44,44 C38,58 32,75 26,95 L74,95 C68,75 62,58 56,44 C58,38 59,32 54,25 Z" /><path d="M22,95 C30,82 34,70 36,58 L40,68 C36,78 30,95 22,95 Z" /><path d="M78,95 C70,82 66,70 64,58 L60,68 C64,78 70,95 78,95 Z" /><path d="M43,32 C33,30 20,20 12,8 C18,17 28,26 43,36 Z" /><path d="M57,32 C67,30 80,20 88,8 C82,17 72,26 57,36 Z" /><path d="M50,46 C48,62 46,78 43,95 L57,95 C54,78 52,62 50,46 Z" class="model-accent"/><ellipse cx="50" cy="18.5" rx="7.5" ry="9.5" /><path d="M49,9 C41,9 35,15 33,23 C31,33 33,45 37,54 C34,45 37,30 43,20 C45,16 47,11 49,9 Z" class="model-accent"/><path d="M51,9 C59,9 65,15 67,23 C69,33 67,45 63,54 C66,45 63,30 57,20 C55,16 53,11 51,9 Z" class="model-accent"/><path d="M44,14 C48,11 52,11 56,14 C53,13 47,13 44,14 Z" class="model-accent"/>' },
    { id: 'satyr', name: 'Satyr', type: 'grass', maxHp: 54,
      basic: { name: 'Reed Pipe', dmg: 11 }, special: { name: 'Wild Charge', dmg: 24, cost: 2 },
      passive: 'trickster', passiveDesc: 'Reed Pipe may befuddle the foe, halving their next attack.',
      model: '<path d="M45,55 C35,70 45,85 40,95 L48,95 L50,85 C52,90 55,95 55,95 L63,95 C58,85 65,70 55,55 Z" /><path d="M42,55 L42,30 C42,20 58,20 58,30 L58,55 Z" /><path d="M45,20 C45,10 55,10 55,20 C55,30 45,30 45,20 Z" /><path d="M45,15 C35,10 35,5 40,5 C42,10 48,12 45,15 Z" class="model-accent"/><path d="M55,15 C65,10 65,5 60,5 C58,10 52,12 55,15 Z" class="model-accent"/><path d="M42,35 C35,40 35,45 42,45 L48,42 Z" /><path d="M58,35 C65,40 65,45 58,45 L52,42 Z" /><path d="M40,43 L60,38 L62,41 L42,46 Z" class="model-accent"/>' },
    { id: 'ent', name: 'Ent', type: 'grass', maxHp: 90,
      basic: { name: 'Root Grasp', dmg: 12 }, special: { name: 'Timberfall', dmg: 22, cost: 2 },
      passive: 'ironbark', passiveDesc: 'Ironbark reduces all incoming damage by 5.',
      model: '<path d="M30,95 C35,70 30,40 50,30 C70,40 65,70 70,95 C65,85 60,80 55,95 C50,85 45,85 45,95 C40,80 35,85 30,95 Z" /><path d="M20,45 C10,20 30,10 50,5 C70,10 90,20 80,45 C75,55 65,55 60,45 C55,50 45,50 40,45 C35,55 25,55 20,45 Z" /><path d="M30,55 C20,70 10,75 15,90 C20,80 30,75 35,65 Z" /><path d="M70,55 C80,70 90,75 85,90 C80,80 70,75 65,65 Z" /><path d="M42,35 L47,38 L42,40 Z" class="model-accent"/><path d="M58,35 L53,38 L58,40 Z" class="model-accent"/>' },
    { id: 'thunderbird', name: 'Thunderbird', type: 'storm', maxHp: 64,
      basic: { name: 'Static Peck', dmg: 14 }, special: { name: 'Storm Call', dmg: 27, cost: 2 },
      passive: 'windRider', passiveDesc: 'Rides the wind with a chance to dodge any attack entirely.',
      model: '<path d="M50,85 L35,95 L45,80 Z" /><path d="M50,85 L65,95 L55,80 Z" /><path d="M45,45 L15,20 L25,35 L5,40 L30,50 L10,60 L40,60 Z" /><path d="M55,45 L85,20 L75,35 L95,40 L70,50 L90,60 L60,60 Z" /><path d="M45,40 C40,60 45,80 50,90 C55,80 60,60 55,40 Z" /><path d="M45,30 C45,20 55,20 55,30 C55,40 45,40 45,30 Z" /><path d="M55,25 L65,28 L55,31 Z" class="model-accent"/><path d="M52,26 L54,26 L54,28 L52,28 Z" class="model-accent"/>' },
    { id: 'raiju', name: 'Raiju', type: 'storm', maxHp: 65,
      basic: { name: 'Spark Bite', dmg: 13 }, special: { name: 'Thunder Fang', dmg: 23, cost: 2 },
      passive: 'charged', passiveDesc: 'Grows charged with each attack, gaining +3 damage per turn (up to +9).',
      model: '<path d="M25,35 L20,25 L32,35 Z" /><path d="M30,35 L35,25 L38,38 Z" /><path d="M30,35 C40,40 50,40 60,45 C70,50 80,50 80,60 C80,75 70,80 65,70 C60,60 50,55 40,60 C30,65 25,60 30,50 Z" /><path d="M35,60 L30,85 L40,80 L45,65 Z" /><path d="M65,65 L60,90 L70,85 L75,70 Z" /><path d="M75,55 L85,75 L95,70 L80,55 Z" /><path d="M45,45 L55,65 L65,60 L50,40 Z" /><path d="M20,40 L30,35 L35,45 L25,50 Z" /><path d="M20,40 L10,45 L25,50 Z" /><path d="M40,30 L50,15 L45,35 L55,25 L45,40 Z" class="model-accent"/>' },
    { id: 'valkyrie', name: 'Valkyrie', type: 'storm', maxHp: 68,
      basic: { name: 'Spear Thrust', dmg: 13 }, special: { name: 'Judgment', dmg: 22, cost: 2 },
      passive: 'judgment', passiveDesc: 'Judgment deals 14 bonus damage to a foe below half HP.',
      model: '<path d="M42,20 C30,10 15,15 25,25 C30,22 35,25 42,25 Z" class="model-accent"/><path d="M58,20 C70,10 85,15 75,25 C70,22 65,25 58,25 Z" class="model-accent"/><path d="M40,40 C35,60 30,85 30,90 L70,90 C70,85 65,60 60,40 Z" /><path d="M38,60 L62,60 L62,65 L38,65 Z" class="model-accent"/><path d="M46,32 L54,32 L54,40 L46,40 Z" /><path d="M42,25 C42,15 58,15 58,25 C58,35 42,35 42,25 Z" /><path d="M40,45 L25,55 L25,60 L40,50 Z" /><path d="M60,45 L75,55 L75,60 L60,50 Z" /><path d="M20,10 L28,10 L26,95 L22,95 Z" class="model-dark"/><path d="M20,10 L24,0 L28,10 Z" class="model-accent"/><path d="M75,55 C65,45 85,45 90,55 C95,65 75,75 75,55 Z" class="model-accent"/>' },
    { id: 'golem', name: 'Golem', type: 'earth', maxHp: 88,
      basic: { name: 'Boulder Toss', dmg: 13 }, special: { name: 'Seismic Slam', dmg: 24, cost: 2, aoe: true },
      passive: 'stoneSkin', passiveDesc: 'Stone skin reduces all incoming damage by 4.',
      model: '<path d="M28,30 L15,40 L20,70 L35,60 Z" /><path d="M72,30 L85,40 L80,70 L65,60 Z" /><path d="M40,62 L35,90 L45,90 L48,62 Z" /><path d="M60,62 L65,90 L55,90 L52,62 Z" /><path d="M30,30 L70,30 L60,60 L40,60 Z" /><path d="M40,15 L60,15 L55,28 L45,28 Z" /><path d="M45,20 L48,25 L42,25 Z" class="model-accent"/><path d="M55,20 L58,25 L52,25 Z" class="model-accent"/><path d="M45,40 L55,40 L50,50 Z" class="model-accent"/>' },
    { id: 'minotaur', name: 'Minotaur', type: 'earth', maxHp: 78,
      basic: { name: 'Horn Gore', dmg: 15 }, special: { name: 'Labyrinth Rage', dmg: 22, cost: 2 },
      passive: 'rage', passiveDesc: 'Enraged below 40% HP, dealing 30% more damage.',
      model: '<path d="M35,35 C20,35 25,60 40,65 C40,80 35,95 35,95 L45,95 C45,80 50,70 50,70 C50,70 55,80 55,95 L65,95 C65,95 60,80 60,65 C75,60 80,35 65,35 Z" /><path d="M42,20 C42,10 58,10 58,20 C58,35 42,35 42,20 Z" /><path d="M45,28 L55,28 L55,35 L45,35 Z" class="model-accent"/><path d="M42,15 C30,15 20,5 25,5 C30,5 35,10 45,18 Z" class="model-accent"/><path d="M58,15 C70,15 80,5 75,5 C70,5 65,10 55,18 Z" class="model-accent"/>' },
    { id: 'basilisk', name: 'Basilisk', type: 'earth', maxHp: 60,
      basic: { name: 'Venom Bite', dmg: 13 }, special: { name: 'Petrifying Gaze', dmg: 22, cost: 2 },
      passive: 'petrify', passiveDesc: 'Petrifying Gaze may turn the foe to stone, causing it to miss its next turn.',
      model: '<path d="M20,80 C10,70 30,60 50,60 C70,60 90,70 80,85 C70,100 30,100 20,80 Z" /><path d="M30,70 C20,50 40,40 60,40 C80,40 90,60 70,75 C50,90 40,90 30,70 Z" /><path d="M50,55 C40,40 35,30 40,25 C45,20 55,20 60,35 C65,50 60,65 50,55 Z" /><path d="M35,25 C30,15 45,5 55,15 C60,20 50,30 40,25 Z" /><path d="M36,25 C30,23 24,20 18,19 L10,14 L16,21 L11,26 L19,22 C24,23 30,25 36,26 Z" class="model-accent"/><circle cx="42" cy="15" r="2" class="model-accent"/>' }
  ];

  const ENHANCED_MOVES = {
    'phoenix_basic':   { charId: 'phoenix', moveKey: 'basic', dmg: 16, effect: 'phoenix_burn_4', effectDesc: 'Ignites the foe for 4 lingering burn damage for 2 turns.' },
    'phoenix_special': { charId: 'phoenix', moveKey: 'special', dmg: 32, cost: 2, effect: 'phoenix_heal_10', effectDesc: 'Heals Phoenix for 10 HP upon detonation.' },
    'ifrit_basic':     { charId: 'ifrit', moveKey: 'basic', dmg: 17, effect: 'ifrit_cinder_bonus', effectDesc: 'Deals +5 bonus damage if target is smoldering.' },
    'ifrit_special':   { charId: 'ifrit', moveKey: 'special', dmg: 30, cost: 2, aoe: true, effect: 'ifrit_guaranteed_burn', effectDesc: 'Guarantees 10 severe burn for 2 turns (splashes 25% damage to foe\'s bench).' },
    'salamander_basic':{ charId: 'salamander', moveKey: 'basic', dmg: 18, effect: 'salamander_weaken', effectDesc: 'Weakens the target, halving their next attack.' },
    'salamander_special':{ charId: 'salamander', moveKey: 'special', dmg: 28, cost: 2, effect: 'salamander_energy_refund', effectDesc: 'Refreshes 1 Energy upon hit.' },
    'kraken_basic':    { charId: 'kraken', moveKey: 'basic', dmg: 16, effect: 'kraken_leech_6', effectDesc: 'Leeches 6 HP from the target.' },
    'kraken_special':  { charId: 'kraken', moveKey: 'special', dmg: 28, cost: 2, effect: 'kraken_deep_crush', effectDesc: 'Deals +18 bonus damage if foe is below 40% HP.' },
    'nixie_basic':     { charId: 'nixie', moveKey: 'basic', dmg: 14, effect: 'nixie_hyper_lure', effectDesc: 'Guarantees the foe is lured, halving their next attack.' },
    'nixie_special':   { charId: 'nixie', moveKey: 'special', dmg: 30, cost: 2, aoe: true, effect: 'nixie_cleanse_wave', effectDesc: 'Cleanses all debuffs from your active champion (splashes 25% damage to foe\'s bench).' },
    'leviathan_basic': { charId: 'leviathan', moveKey: 'basic', dmg: 17, effect: 'leviathan_barrier', effectDesc: 'Surges Leviathan with tidal barrier (+4 temp guard armor).' },
    'leviathan_special':{ charId: 'leviathan', moveKey: 'special', dmg: 30, cost: 2, effect: 'leviathan_abyssal_stun', effectDesc: 'Terrorizes the foe, stunning them for their next turn.' },
    'dryad_basic':     { charId: 'dryad', moveKey: 'basic', dmg: 16, effect: 'dryad_siphon_6', effectDesc: 'Entangles target, siphoning 6 HP to Dryad.' },
    'dryad_special':   { charId: 'dryad', moveKey: 'special', dmg: 29, cost: 2, effect: 'dryad_pollen_heal', effectDesc: 'Spreads pollen that heals all active and benched allies for 8 HP.' },
    'satyr_basic':     { charId: 'satyr', moveKey: 'basic', dmg: 15, effect: 'satyr_melody_energy', effectDesc: 'Plays a resonant tune, granting Satyr +1 Energy.' },
    'satyr_special':   { charId: 'satyr', moveKey: 'special', dmg: 30, cost: 2, effect: 'satyr_critical_charge', effectDesc: 'Critical impact dealing +35% damage against fortified foes or full HP targets.' },
    'ent_basic':       { charId: 'ent', moveKey: 'basic', dmg: 16, effect: 'ent_sap_8', effectDesc: 'Saps life from the soil, restoring 8 HP to Ent.' },
    'ent_special':     { charId: 'ent', moveKey: 'special', dmg: 28, cost: 2, effect: 'ent_heavy_dampen', effectDesc: 'Crushing timber dampens foe’s outgoing damage by 5 for 2 turns.' },
    'thunderbird_basic':{ charId: 'thunderbird', moveKey: 'basic', dmg: 18, effect: 'tbird_quick_charge', effectDesc: 'Shocks target, gaining +1 charge stack (+3 bonus damage per stack, max +9).' },
    'thunderbird_special':{ charId: 'thunderbird', moveKey: 'special', dmg: 30, cost: 2, effect: 'tbird_tempest_dodge', effectDesc: 'Summons a gale granting Thunderbird 50% dodge on the next incoming attack.' },
    'raiju_basic':     { charId: 'raiju', moveKey: 'basic', dmg: 17, effect: 'raiju_double_charge', effectDesc: 'Generates 2 charge stacks simultaneously.' },
    'raiju_special':   { charId: 'raiju', moveKey: 'special', dmg: 29, cost: 2, effect: 'raiju_energy_drain', effectDesc: 'Paralyzes target, draining 1 Energy from them.' },
    'valkyrie_basic':  { charId: 'valkyrie', moveKey: 'basic', dmg: 17, effect: 'valk_true_pierce', effectDesc: 'True spear strike that completely ignores armor and defensive passives.' },
    'valkyrie_special':{ charId: 'valkyrie', moveKey: 'special', dmg: 28, cost: 2, effect: 'valk_divine_judgment', effectDesc: 'Deals +20 bonus damage if foe is below 50% HP.' },
    'golem_basic':     { charId: 'golem', moveKey: 'basic', dmg: 17, effect: 'golem_rock_fortify', effectDesc: 'Fortifies Golem, granting +5 temp guard armor.' },
    'golem_special':   { charId: 'golem', moveKey: 'special', dmg: 30, cost: 2, aoe: true, effect: 'golem_ground_shatter', effectDesc: 'Shatters the ground, stunning the foe for 1 turn (splashes 25% damage to foe\'s bench).' },
    'minotaur_basic':  { charId: 'minotaur', moveKey: 'basic', dmg: 18, effect: 'mino_frenzy_energy', effectDesc: 'Frenzied attack generating +1 Energy.' },
    'minotaur_special':{ charId: 'minotaur', moveKey: 'special', dmg: 28, cost: 2, effect: 'mino_early_rage', effectDesc: 'Triggers rage damage bonus below 60% HP instead of 40%.' },
    'basilisk_basic':  { charId: 'basilisk', moveKey: 'basic', dmg: 17, effect: 'basilisk_toxin_6', effectDesc: 'Injects virulent toxin dealing 6 damage per turn for 2 turns.' },
    'basilisk_special':{ charId: 'basilisk', moveKey: 'special', dmg: 26, cost: 2, effect: 'basilisk_deep_petrify', effectDesc: 'High chance (60%) to turn the foe to solid stone for 1 turn.' }
  };

  const ABILITY_ENHANCEMENTS = {
    'phoenix_passive': { charId: 'phoenix', passiveKey: 'rebirth', name: 'Immortal Ashes', desc: 'Once per battle, rises from defeat with 35 HP (up from 20 HP).' },
    'ifrit_passive': { charId: 'ifrit', passiveKey: 'scorch', name: 'Blazing Combustion', desc: 'Infernal Burst has a 60% chance to scorch the foe for 8 burn damage for 2 turns.' },
    'salamander_passive': { charId: 'salamander', passiveKey: 'dyingEmber', name: 'Infernal Pyre', desc: 'When it falls, its dying ember scorches the foe for 22 damage (up from 14).' },
    'kraken_passive': { charId: 'kraken', passiveKey: 'crushingGrip', name: 'Abyssal Constriction', desc: 'Crushing Grip deals +20 bonus damage when targeting a foe below 50% HP.' },
    'nixie_passive': { charId: 'nixie', passiveKey: 'lure', name: 'Enchanting Melody', desc: 'Siren Song has a 75% chance to lure the foe (halving next attack) and drains 1 Energy.' },
    'leviathan_passive': { charId: 'leviathan', passiveKey: 'thickHide', name: 'Armored Carapace', desc: 'Reinforced scales reduce all incoming damage by 7 (up from 4).' },
    'dryad_passive': { charId: 'dryad', passiveKey: 'regrowth', name: 'Verdant Flourish', desc: 'Flourishes with vital sap, regrowing 11 HP at the start of each turn (up from 6).' },
    'satyr_passive': { charId: 'satyr', passiveKey: 'trickster', name: 'Mischief Master', desc: 'Reed Pipe has a 60% chance to befuddle the foe (halving attack) and grants Satyr +1 Energy.' },
    'ent_passive': { charId: 'ent', passiveKey: 'ironbark', name: 'Ancient Timber', desc: 'Ancient petrified bark reduces all incoming damage by 8 (up from 5).' },
    'thunderbird_passive': { charId: 'thunderbird', passiveKey: 'windRider', name: 'Cyclone Wings', desc: 'Soars on cyclone winds with a 35% chance to dodge any incoming attack (up from 20%).' },
    'raiju_passive': { charId: 'raiju', passiveKey: 'charged', name: 'Overcharged Current', desc: 'Overcharges with electricity, gaining +5 damage per attack (up to +15 total).' },
    'valkyrie_passive': { charId: 'valkyrie', passiveKey: 'judgment', name: 'Divine Retribution', desc: 'Judgment deals +22 bonus damage when striking a foe below 60% HP.' },
    'golem_passive': { charId: 'golem', passiveKey: 'stoneSkin', name: 'Granite Aegis', desc: 'Dense granite aegis reduces all incoming damage by 7 (up from 4).' },
    'minotaur_passive': { charId: 'minotaur', passiveKey: 'rage', name: 'Berserker Bloodlust', desc: 'Enters bloodlust below 50% HP, dealing 50% more damage (up from 30% below 40%).' },
    'basilisk_passive': { charId: 'basilisk', passiveKey: 'petrify', name: 'Medusa Gaze', desc: 'Petrifying Gaze has a 55% chance to stun and afflicts 4 toxin damage for 2 turns.' }
  };

  const ACHIEVEMENTS = [
    { id: 'ach_win_1', category: 'battles', tier: 'Novice', name: 'Novice Duelist', desc: 'Win 5 battles against the realm guardian', target: 5, goldReward: 150, gemReward: 5 },
    { id: 'ach_win_2', category: 'battles', tier: 'Amateur', name: 'Proven Champion', desc: 'Win 10 battles against the realm guardian', target: 10, goldReward: 300, gemReward: 10 },
    { id: 'ach_win_3', category: 'battles', tier: 'Veteran', name: 'Veteran Tactician', desc: 'Win 25 battles against the realm guardian', target: 25, goldReward: 600, gemReward: 20 },
    { id: 'ach_win_4', category: 'battles', tier: 'Master', name: 'Grand Battler', desc: 'Win 50 battles against the realm guardian', target: 50, goldReward: 1200, gemReward: 40 },
    { id: 'ach_win_5', category: 'battles', tier: 'Legend', name: 'Mythic Sovereign', desc: 'Win 100 battles against the realm guardian', target: 100, goldReward: 2500, gemReward: 80 },

    { id: 'ach_hard_1', category: 'hardMode', tier: 'Novice', name: 'Trial Initiate', desc: 'Conquer 1 Hard Mode battle trial', target: 1, goldReward: 200, gemReward: 8 },
    { id: 'ach_hard_2', category: 'hardMode', tier: 'Veteran', name: 'Veteran Vanquisher', desc: 'Conquer 3 Hard Mode battle trials', target: 3, goldReward: 400, gemReward: 15 },
    { id: 'ach_hard_3', category: 'hardMode', tier: 'Champion', name: 'Mythic Conqueror', desc: 'Conquer 5 Hard Mode battle trials', target: 5, goldReward: 800, gemReward: 30 },
    { id: 'ach_hard_4', category: 'hardMode', tier: 'Master', name: 'Dread Sovereign', desc: 'Conquer 10 Hard Mode battle trials', target: 10, goldReward: 1500, gemReward: 50 },
    { id: 'ach_hard_5', category: 'hardMode', tier: 'Legend', name: 'Immortal Conqueror', desc: 'Conquer 25 Hard Mode battle trials', target: 25, goldReward: 3000, gemReward: 100 },

    { id: 'ach_atk_1', category: 'attacks', tier: 'Initiate', name: 'Technique Initiate', desc: 'Awaken 5 enhanced attack techniques', target: 5, goldReward: 150, gemReward: 5 },
    { id: 'ach_atk_2', category: 'attacks', tier: 'Adept', name: 'Technique Adept', desc: 'Awaken 10 enhanced attack techniques', target: 10, goldReward: 300, gemReward: 10 },
    { id: 'ach_atk_3', category: 'attacks', tier: 'Expert', name: 'Technique Expert', desc: 'Awaken 20 enhanced attack techniques', target: 20, goldReward: 600, gemReward: 20 },
    { id: 'ach_atk_4', category: 'attacks', tier: 'Archmage', name: 'Grand Technologist', desc: 'Awaken all 30 enhanced attack techniques', target: 30, goldReward: 1500, gemReward: 50 },

    { id: 'ach_abi_1', category: 'abilities', tier: 'Awakening', name: 'Dormant Spark', desc: 'Awaken 3 passive ability enhancements', target: 3, goldReward: 150, gemReward: 5 },
    { id: 'ach_abi_2', category: 'abilities', tier: 'Ascended', name: 'Ascended Might', desc: 'Awaken 7 passive ability enhancements', target: 7, goldReward: 350, gemReward: 12 },
    { id: 'ach_abi_3', category: 'abilities', tier: 'Mythic', name: 'Ancient Lineage', desc: 'Awaken 12 passive ability enhancements', target: 12, goldReward: 700, gemReward: 25 },
    { id: 'ach_abi_4', category: 'abilities', tier: 'Transcendent', name: 'Transcendent Essence', desc: 'Awaken all 15 passive ability enhancements', target: 15, goldReward: 1500, gemReward: 50 },

    { id: 'ach_qst_1', category: 'quests', tier: 'Errand Runner', name: 'Errand Runner', desc: 'Fulfill 5 daily quest decrees', target: 5, goldReward: 150, gemReward: 5 },
    { id: 'ach_qst_2', category: 'quests', tier: 'Town Courier', name: 'Town Courier', desc: 'Fulfill 15 daily quest decrees', target: 15, goldReward: 350, gemReward: 12 },
    { id: 'ach_qst_3', category: 'quests', tier: 'Guild Envoy', name: 'Guild Envoy', desc: 'Fulfill 30 daily quest decrees', target: 30, goldReward: 700, gemReward: 25 },
    { id: 'ach_qst_4', category: 'quests', tier: 'Grand Inquisitor', name: 'Realm Inquisitor', desc: 'Fulfill 60 daily quest decrees', target: 60, goldReward: 1500, gemReward: 50 }
  ];

  // ==========================================
  // 5. CORE STATE & PROGRESSION
  // ==========================================
  function getLevelTierClass(level) {
    const lvl = level || 1;
    if (lvl <= 4) return 'level-tier-1';
    if (lvl <= 9) return 'level-tier-2';
    if (lvl <= 14) return 'level-tier-3';
    if (lvl <= 19) return 'level-tier-4';
    return 'level-tier-5';
  }

  function getXpRequiredForLevel(level) { return 100 + (level - 1) * 20; }
  function getTodayDateStr() {
    const now = new Date();
    return now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generateDailyQuests(dateStr) {
    const d = dateStr || getTodayDateStr();
    const sC = shuffle(CREATURES), sT = shuffle(Object.keys(TYPE_META));
    return [
      { id: 'q_' + d + '_1', tier: 'Easy', type: 'use_char', targetKey: sC[0].id, targetName: sC[0].name, desc: 'Attack 3 times with ' + sC[0].name, target: 3, progress: 0, goldReward: 100, gemReward: 3, completed: false, claimed: false, isHard: false },
      { id: 'q_' + d + '_2', tier: 'Medium', type: 'defeat_type', targetKey: sT[0], targetName: TYPE_META[sT[0]].label, desc: 'Defeat 4 ' + TYPE_META[sT[0]].label + '-element enemies', target: 4, progress: 0, goldReward: 200, gemReward: 6, completed: false, claimed: false, isHard: false },
      { id: 'q_' + d + '_3', tier: 'Hard', type: 'win_battle', targetKey: null, targetName: null, desc: 'Achieve victory in 2 battles', target: 2, progress: 0, goldReward: 300, gemReward: 10, completed: false, claimed: false, isHard: false }
    ];
  }

  function generateHardModeQuests(dateStr) {
    const d = dateStr || getTodayDateStr();
    const sC = shuffle(CREATURES), sT = shuffle(Object.keys(TYPE_META));
    return [
      { id: 'hq_' + d + '_1', tier: 'Easy', type: 'use_char', targetKey: sC[0].id, targetName: sC[0].name, desc: 'Attack 3 times with ' + sC[0].name + ' in Hard Mode', target: 3, progress: 0, goldReward: 150, gemReward: 5, completed: false, claimed: false, isHard: true },
      { id: 'hq_' + d + '_2', tier: 'Medium', type: 'defeat_type', targetKey: sT[0], targetName: TYPE_META[sT[0]].label, desc: 'Defeat 4 ' + TYPE_META[sT[0]].label + '-element enemies in Hard Mode', target: 4, progress: 0, goldReward: 300, gemReward: 9, completed: false, claimed: false, isHard: true },
      { id: 'hq_' + d + '_3', tier: 'Hard', type: 'win_battle', targetKey: null, targetName: null, desc: 'Achieve victory in 2 Hard Mode battles', target: 2, progress: 0, goldReward: 450, gemReward: 15, completed: false, claimed: false, isHard: true }
    ];
  }

  let state = null;

  function loadSaveData() {
    const data = { 
      playerName: 'Champion',
      playerLevel: 1,
      playerXp: 0,
      gold: 0, potions: 0, atkPotions: 0, shieldPotions: 0, energyPotions: 0, gems: 0, 
      summonStep: 1, unlockedEnhanced: {}, dupeStreak: 0,
      abilitySummonStep: 1, unlockedAbilities: {}, abilityDupeStreak: 0,
      lastQuestDate: '', quests: [], hardModeQuests: [],
      totalBattlesWon: 0, totalHardModeWins: 0, totalQuestsCompleted: 0, claimedAchievements: {}
    };
    try {
      const stored = localStorage.getItem('codex_save');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(data, parsed);
        data.claimedAchievements = data.claimedAchievements || {};
        if (!data.playerName || typeof data.playerName !== 'string') data.playerName = 'Champion';
        data.playerLevel = Math.max(1, parseInt(data.playerLevel, 10) || 1);
        data.playerXp = Math.max(0, parseInt(data.playerXp, 10) || 0);
      }
    } catch (e) {
      if (state) state.storageError = true;
    }
    return data;
  }

  function saveGameData() {
    try {
      localStorage.setItem('codex_save', JSON.stringify({ 
        playerName: state.playerName,
        playerLevel: state.playerLevel,
        playerXp: state.playerXp,
        gold: state.gold, potions: state.potions, atkPotions: state.atkPotions, shieldPotions: state.shieldPotions, energyPotions: state.energyPotions,
        gems: state.gems, summonStep: state.summonStep, unlockedEnhanced: state.unlockedEnhanced, dupeStreak: state.dupeStreak,
        abilitySummonStep: state.abilitySummonStep, unlockedAbilities: state.unlockedAbilities, abilityDupeStreak: state.abilityDupeStreak,
        lastQuestDate: state.lastQuestDate, quests: state.quests, hardModeQuests: state.hardModeQuests,
        totalBattlesWon: state.totalBattlesWon, totalHardModeWins: state.totalHardModeWins, totalQuestsCompleted: state.totalQuestsCompleted, claimedAchievements: state.claimedAchievements
      }));
    } catch (e) {
      state.storageError = true;
    }
  }

  function freshState() {
    const saved = loadSaveData();
    const todayStr = getTodayDateStr();
    let quests = saved.quests;
    let hardQuests = saved.hardModeQuests;
    let lastDate = saved.lastQuestDate;

    if (!quests || !quests.length || !hardQuests || !hardQuests.length || lastDate !== todayStr) {
      quests = generateDailyQuests(todayStr);
      hardQuests = generateHardModeQuests(todayStr);
      lastDate = todayStr;
    }

    return Object.assign({
      playerName: saved.playerName || 'Champion',
      playerLevel: saved.playerLevel || 1,
      playerXp: saved.playerXp || 0,
      screen: 'title',
      difficulty: 'normal',
      selectedIds: [],
      player: { roster: [], active: null },
      ai: { roster: [], active: null },
      turn: 'player',
      busy: false,
      log: [],
      winner: null,
      endMessage: null,
      pendingChoice: null,
      pendingEndTurnSide: null,
      showGuide: false,
      showForfeit: false,
      showResetModal: false,
      showNameModal: false,
      showItemsModal: false,
      levelUpModalData: null,
      storageError: false,
      indexFilter: 'all',
      achieveFilter: 'all',
      altarTab: 'attacks',
      recentSummon: null,
      atkBuffTurns: 0,
      shieldBuffTurns: 0,
      earnedGold: 0,
      earnedGems: 0,
      earnedXp: 0
    }, saved, { lastQuestDate: lastDate, quests, hardModeQuests: hardQuests });
  }

  // ==========================================
  // 6. BATTLE LOGIC & SYSTEM HOOKS
  // ==========================================
  function logMsg(text) { state.log.push(text); }
  function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function makeInstance(template) { return { template, curHp: template.maxHp, energy: 0, flags: {}, aiEnhancedMoves: null, aiEnhancedAbility: false }; }

  function trackQuestProgress(type, key, amount = 1) {
    const isHard = (state.difficulty === 'hard');
    if (!isHard && state.playerLevel < 5) return;
    if (isHard && state.playerLevel < 10) return;

    const activeQuests = isHard ? state.hardModeQuests : state.quests;
    if (!activeQuests || !activeQuests.length) return;
    let changed = false;
    activeQuests.forEach(q => {
      if (q.completed) return;
      const match = (q.type === type) && ((q.type === 'use_char' && q.targetKey === key) || (q.type === 'defeat_type' && q.targetKey === key) || (q.type === 'win_battle'));
      if (match) {
        q.progress = Math.min(q.target, q.progress + amount);
        if (q.progress >= q.target) {
          q.completed = true;
          state.totalQuestsCompleted = (state.totalQuestsCompleted || 0) + 1;
        }
        changed = true;
      }
    });
    if (changed) saveGameData();
  }

  function applyBurn(target, amount, turns) {
    if (!target || target.curHp <= 0) return;
    target.flags.burnDmg = Math.max(target.flags.burnDmg || 0, amount);
    target.flags.burnTurns = Math.max(target.flags.burnTurns || 0, turns || 1);
  }

  function isPassiveEnhanced(inst, side) {
    if (!inst || !inst.template) return false;
    if (side === 'player') {
      return !!(state && state.unlockedAbilities && state.unlockedAbilities[inst.template.id + '_passive']);
    } else {
      return !!inst.aiEnhancedAbility;
    }
  }

  function getInstMove(inst, moveKey, isPlayer) {
    if (!inst || !inst.template) return { name: '', dmg: 0, cost: 0, effectDesc: null, isEnhanced: false, aoe: false };
    const t = inst.template;
    const key = t.id + '_' + moveKey;
    const baseMove = t[moveKey];
    const isEnhanced = isPlayer ? !!(state && state.unlockedEnhanced && state.unlockedEnhanced[key]) : !!(inst.aiEnhancedMoves && inst.aiEnhancedMoves[moveKey]);

    if (isEnhanced && ENHANCED_MOVES[key]) {
      const enh = ENHANCED_MOVES[key];
      return {
        name: baseMove.name,
        dmg: enh.dmg,
        cost: enh.cost !== undefined ? enh.cost : baseMove.cost,
        effect: enh.effect,
        effectDesc: enh.effectDesc,
        aoe: enh.aoe !== undefined ? enh.aoe : !!baseMove.aoe,
        isEnhanced: true
      };
    }
    return {
      name: baseMove.name,
      dmg: baseMove.dmg,
      cost: baseMove.cost,
      effectDesc: null,
      aoe: !!baseMove.aoe,
      isEnhanced: false
    };
  }

  function tryReviveOrFall(inst, side) {
    const isRebirthEnhanced = isPassiveEnhanced(inst, side);
    if (inst.template.passive === 'rebirth' && !inst.flags.revived) {
      inst.flags.revived = true;
      const reviveHp = isRebirthEnhanced ? 35 : 20;
      inst.curHp = reviveHp;
      logMsg(inst.template.name + ' rises from the ashes, reborn with ' + reviveHp + ' HP!' + (isRebirthEnhanced ? ' (★ Awakened Ashes)' : ''));
      sound.potion();
      return true;
    }
    inst.curHp = 0;
    logMsg(inst.template.name + ' has fallen!');
    sound.faint();
    
    if (side === 'ai') trackQuestProgress('defeat_type', inst.template.type, 1);

    if (inst.template.passive === 'dyingEmber') {
      const foe = state[side === 'player' ? 'ai' : 'player'].active;
      if (foe && foe.curHp > 0) {
        const isEmberEnhanced = isPassiveEnhanced(inst, side);
        const dmg = isEmberEnhanced ? 22 : 14;
        foe.curHp = Math.max(1, foe.curHp - dmg);
        logMsg(inst.template.name + "'s dying ember scorches " + foe.template.name + ' for ' + dmg + '!' + (isEmberEnhanced ? ' (★ Infernal Pyre)' : ''));
      }
    }
    return false;
  }

  function checkAndHandleFaint(inst, side) {
    if (!inst || inst.curHp > 0) return;
    if (!tryReviveOrFall(inst, side)) {
      if (state[side].active === inst) state[side].active = null;
    }
  }

  function aiPickBest(bench, defenderActive) {
    if (!bench.length) return null;
    if (!defenderActive) return bench[Math.floor(Math.random() * bench.length)];
    let best = [], bestScore = -Infinity;
    bench.forEach(c => {
      const score = EFFECTIVENESS[c.template.type][defenderActive.template.type];
      if (score > bestScore) { bestScore = score; best = [c]; }
      else if (score === bestScore) { best.push(c); }
    });
    return best[Math.floor(Math.random() * best.length)];
  }

  function fillEmptyActives() {
    if (state.player.active === null) {
      const pBench = state.player.roster.filter(c => c.curHp > 0);
      if (pBench.length === 0) {
        state.winner = 'ai';
        state.screen = 'end';
        state.showItemsModal = false;
        state.earnedGold = 0;
        state.earnedGems = 0;
        state.earnedXp = 0;
        state.endMessage = getRandomItem(DEFEAT_MSGS);
        sound.defeat();
      } else {
        state.pendingChoice = 'replace-player';
      }
    }
    if (state.screen === 'end') return true;
    
    if (state.ai.active === null) {
      const aBench = state.ai.roster.filter(c => c.curHp > 0);
      if (aBench.length === 0) {
        state.winner = 'player';
        state.screen = 'end';
        state.showItemsModal = false;
        state.endMessage = getRandomItem(VICTORY_MSGS);

        if (state.difficulty === 'hard') {
          state.earnedGold = Math.floor(Math.random() * 151) + 100;
          state.earnedGems = Math.floor(Math.random() * 6) + 5;
          state.earnedXp = Math.floor(Math.random() * 61) + 260;
          state.totalHardModeWins = (state.totalHardModeWins || 0) + 1;
        } else {
          state.earnedGold = Math.floor(Math.random() * 26) + 25; 
          state.earnedGems = Math.floor(Math.random() * 3) + 1;
          state.earnedXp = Math.floor(Math.random() * 26) + 105;
        }

        state.gold += state.earnedGold;
        state.gems += state.earnedGems;
        state.playerXp = (state.playerXp || 0) + state.earnedXp;

        const startLevel = state.playerLevel || 1;
        while (state.playerXp >= getXpRequiredForLevel(state.playerLevel)) {
          state.playerXp -= getXpRequiredForLevel(state.playerLevel);
          state.playerLevel++;
        }

        if (state.playerLevel > startLevel) {
          state.levelUpModalData = {
            oldLevel: startLevel,
            newLevel: state.playerLevel,
            unlockedLvl5Features: (startLevel < 5 && state.playerLevel >= 5),
            unlockedHard: (startLevel < 10 && state.playerLevel >= 10)
          };
          sound.levelUp();
        }

        state.totalBattlesWon = (state.totalBattlesWon || 0) + 1;
        trackQuestProgress('win_battle', null, 1);
        saveGameData();
        sound.victory();
        fx.confettiVictory();
      } else {
        const pick = aiPickBest(aBench, state.player.active);
        state.ai.active = pick;
        logMsg('The Mysterious Being sends out ' + pick.template.name + '!');
      }
    }
    return state.screen === 'end';
  }

  function resolveAttack(side, moveKey) {
    const otherSide = side === 'player' ? 'ai' : 'player';
    const attacker = state[side].active;
    const defender = state[otherSide].active;
    if (!attacker || !defender) return;
    
    const isPlayerAttacker = (side === 'player');
    if (side === 'player') trackQuestProgress('use_char', attacker.template.id, 1);

    const move = getInstMove(attacker, moveKey, isPlayerAttacker);
    const isSpecial = moveKey === 'special';
    if (isSpecial) {
      if (attacker.energy < move.cost) return;
      attacker.energy -= move.cost;
    }

    let dmg = move.dmg;
    const eff = EFFECTIVENESS[attacker.template.type][defender.template.type];
    dmg = Math.round(dmg * eff);

    if (side === 'player' && state.atkBuffTurns > 0) dmg = Math.round(dmg * 1.20);
    if (attacker.flags.dampenTurns > 0) dmg = Math.max(1, dmg - (attacker.flags.dampenAmount || 5));

    if (otherSide === 'player' && state.shieldBuffTurns > 0) {
      dmg = Math.round(dmg * 0.65);
      logMsg('🛡️ Shield Potion wards ' + defender.template.name + ' (incoming damage reduced by 35%)!');
    }

    if (attacker.template.passive === 'crushingGrip' && isSpecial) {
      const isKrakenEnh = isPassiveEnhanced(attacker, side);
      const thresh = isKrakenEnh ? 0.5 : (move.isEnhanced ? 0.4 : 0.3);
      const bonus = isKrakenEnh ? 20 : (move.isEnhanced ? 18 : 12);
      if (defender.curHp / defender.template.maxHp < thresh) dmg += bonus;
    }
    if (attacker.template.passive === 'judgment' && isSpecial) {
      const isValkEnh = isPassiveEnhanced(attacker, side);
      const valkThresh = isValkEnh ? 0.6 : 0.5;
      const valkBonus = isValkEnh ? 22 : (move.isEnhanced ? 20 : 14);
      if (defender.curHp / defender.template.maxHp < valkThresh) dmg += valkBonus;
    }
    
    if (attacker.template.passive === 'charged' || attacker.flags.chargeStacks) {
      const isRaijuEnh = isPassiveEnhanced(attacker, side);
      const perStack = (attacker.template.passive === 'charged' && isRaijuEnh) ? 5 : 3;
      const stacks = Math.min(attacker.flags.chargeStacks || 0, 3);
      if (stacks > 0) {
        dmg += stacks * perStack;
        logMsg(attacker.template.name + ' unleashes electrical charge (+' + (stacks * perStack) + ' bonus dmg)!');
      }
    }

    if (attacker.template.passive === 'rage') {
      const isMinoEnh = isPassiveEnhanced(attacker, side);
      if (attacker.curHp / attacker.template.maxHp < (isMinoEnh ? 0.5 : (move.isEnhanced ? 0.6 : 0.4))) dmg = Math.round(dmg * (isMinoEnh ? 1.5 : 1.3));
    }
    if (attacker.flags.weakenNext) {
      dmg = Math.round(dmg / 2);
      attacker.flags.weakenNext = false;
      logMsg(attacker.template.name + "'s attack is weakened by a lingering hex!");
    }

    const isTbirdEnh = isPassiveEnhanced(defender, otherSide);
    let dodgeChance = 0;
    if (defender.flags.tempestDodge) {
      dodgeChance = 0.5;
      defender.flags.tempestDodge = false;
    } else if (defender.template.passive === 'windRider') {
      dodgeChance = isTbirdEnh ? 0.35 : 0.2;
    }

    sound.attackHit(isSpecial);

    if (Math.random() < dodgeChance) {
      logMsg(attacker.template.name + ' uses ' + move.name + ', but ' + defender.template.name + ' gracefully dodges on the wind!' + (isTbirdEnh ? ' (★ Cyclone Wings)' : ''));
    } else {
      if (move.effect !== 'valk_true_pierce') {
        if (defender.template.passive === 'thickHide') dmg = Math.max(1, dmg - (isPassiveEnhanced(defender, otherSide) ? 7 : 4));
        if (defender.template.passive === 'ironbark') dmg = Math.max(1, dmg - (isPassiveEnhanced(defender, otherSide) ? 8 : 5));
        if (defender.template.passive === 'stoneSkin') dmg = Math.max(1, dmg - (isPassiveEnhanced(defender, otherSide) ? 7 : 4));
        if (defender.flags.tempArmor) {
          dmg = Math.max(1, dmg - defender.flags.tempArmor);
          defender.flags.tempArmor = 0;
        }
      }

      defender.curHp = Math.max(0, defender.curHp - dmg);

      const targetPanel = document.querySelectorAll('.mon-panel')[otherSide === 'ai' ? 1 : 0];
      if (targetPanel) {
        fx.shake(targetPanel);
        fx.spawnDmg(targetPanel, `-${dmg}`, eff > 1, false);
      }
      if (eff > 1) sound.superEffective();

      const tag = (eff > 1) ? ' — super effective!' : (eff < 1 ? ' — not very effective...' : '');
      logMsg(attacker.template.name + ' uses ' + (move.isEnhanced ? '★ ' : '') + move.name + ' for ' + dmg + ' damage' + tag);

      if (move.aoe && dmg > 0) {
        const aoeDmg = Math.round(dmg * 0.25);
        if (aoeDmg > 0) {
          state[otherSide].roster.filter(c => c !== defender && c.curHp > 0).forEach(bMon => {
            bMon.curHp = Math.max(1, bMon.curHp - aoeDmg);
            logMsg(attacker.template.name + "'s " + move.name + ' shockwave splashes ' + bMon.template.name + ' on the bench for ' + aoeDmg + ' damage!');
            checkAndHandleFaint(bMon, otherSide);
          });
        }
      }

      if (attacker.template.passive === 'scorch' && isSpecial && defender.curHp > 0 && !move.effect) {
        const isIfritEnh = isPassiveEnhanced(attacker, side);
        if (Math.random() < (isIfritEnh ? 0.6 : 0.3)) {
          applyBurn(defender, isIfritEnh ? 8 : 6, isIfritEnh ? 2 : 1);
          logMsg(defender.template.name + ' is engulfed in ' + (isIfritEnh ? '★ Blazing Combustion!' : 'smoldering flames!'));
        }
      }
      if (attacker.template.passive === 'lure' && !isSpecial && defender.curHp > 0 && !move.effect) {
        const isNixieEnh = isPassiveEnhanced(attacker, side);
        if (Math.random() < (isNixieEnh ? 0.75 : 0.5)) {
          defender.flags.weakenNext = true;
          if (isNixieEnh && defender.energy > 0) {
            defender.energy = Math.max(0, defender.energy - 1);
            logMsg(defender.template.name + ' is mesmerized by ★ Enchanting Melody (attack halved & -1 Energy)!');
          } else {
            logMsg(defender.template.name + ' is lured into a stupor!');
          }
        }
      }
      if (attacker.template.passive === 'trickster' && !isSpecial && defender.curHp > 0) {
        const isSatyrEnh = isPassiveEnhanced(attacker, side);
        if (Math.random() < (isSatyrEnh ? 0.60 : 0.35)) {
          defender.flags.weakenNext = true;
          if (isSatyrEnh) {
            attacker.energy = Math.min(3, attacker.energy + 1);
            logMsg(defender.template.name + ' is befuddled by ★ Mischief Master (+1 Energy to ' + attacker.template.name + ')!');
          } else {
            logMsg(defender.template.name + ' is befuddled!');
          }
        }
      }
      if (attacker.template.passive === 'petrify' && isSpecial && defender.curHp > 0 && !move.effect) {
        const isBasiliskEnh = isPassiveEnhanced(attacker, side);
        if (Math.random() < (isBasiliskEnh ? 0.55 : 0.35)) {
          defender.flags.stunned = true;
          if (isBasiliskEnh) {
            applyBurn(defender, 4, 2);
            logMsg(defender.template.name + ' is turned to stone by ★ Medusa Gaze and poisoned for 2 turns!');
          } else {
            logMsg(defender.template.name + ' begins to turn to stone!');
          }
        }
      }
    }

    if (attacker.template.passive === 'charged') attacker.flags.chargeStacks = Math.min(3, (attacker.flags.chargeStacks || 0) + 1);
    afterAction(side);
  }

  function afterAction(actingSide) {
    const attacker = state[actingSide].active;
    if (attacker && attacker.flags.dampenTurns > 0) {
      attacker.flags.dampenTurns--;
      if (attacker.flags.dampenTurns === 0) logMsg(attacker.template.name + ' is no longer dampened.');
    }
    if (actingSide === 'player' && state.atkBuffTurns > 0) {
      state.atkBuffTurns--;
      if (state.atkBuffTurns === 0) logMsg("Your party's Attack Boost has worn off.");
    }
    if (actingSide === 'ai' && state.shieldBuffTurns > 0) {
      state.shieldBuffTurns--;
      if (state.shieldBuffTurns === 0) logMsg("Your party's Shield Boost has worn off.");
    }

    checkAndHandleFaint(state.player.active, 'player');
    checkAndHandleFaint(state.ai.active, 'ai');
    if (fillEmptyActives()) { render(); return; }
    if (state.pendingChoice) {
      state.pendingEndTurnSide = actingSide;
      render();
      return;
    }
    render();
    endTurn(actingSide);
  }

  function endTurn(justActedSide) {
    state.busy = true;
    const next = justActedSide === 'player' ? 'ai' : 'player';
    setTimeout(() => beginTurn(next), justActedSide === 'player' ? 650 : 1100);
  }

  function beginTurn(side) {
    state.turn = side;
    const inst = state[side].active;
    if (!inst) { state.busy = true; render(); return; }

    inst.energy = Math.min(3, inst.energy + 1);

    if (inst.template.passive === 'regrowth') {
      const isDryadEnh = isPassiveEnhanced(inst, side);
      const heal = Math.min(isDryadEnh ? 11 : 6, inst.template.maxHp - inst.curHp);
      if (heal > 0) {
        inst.curHp += heal;
        logMsg(inst.template.name + ' regrows ' + heal + ' HP.' + (isDryadEnh ? ' (★ Verdant Flourish)' : ''));
      }
    }

    if (inst.flags.burnTurns > 0 && inst.flags.burnDmg > 0) {
      const bdmg = inst.flags.burnDmg;
      inst.flags.burnTurns--;
      if (inst.flags.burnTurns <= 0) inst.flags.burnDmg = 0;
      inst.curHp = Math.max(1, inst.curHp - bdmg);
      logMsg(inst.template.name + ' suffers ' + bdmg + ' lingering burn/poison damage! (' + (inst.flags.burnTurns === 1 ? '1 turn remaining' : inst.flags.burnTurns + ' turns remaining') + ')');
    }

    checkAndHandleFaint(state.player.active, 'player');
    checkAndHandleFaint(state.ai.active, 'ai');
    if (fillEmptyActives()) { state.busy = true; render(); return; }
    if (state.pendingChoice) {
      state.pendingEndTurnSide = side;
      state.busy = true;
      render();
      return;
    }

    if (state[side].active !== inst) {
      state.busy = true;
      render();
      endTurn(side);
      return;
    }

    if (inst.flags.stunned) {
      inst.flags.stunned = false;
      logMsg(inst.template.name + ' is incapacitated and cannot act!');
      state.busy = true;
      render();
      endTurn(side);
      return;
    }

    if (side === 'ai') {
      state.busy = true;
      render();
      setTimeout(() => {
        const attacker = state.ai.active;
        if (!attacker || !state.player.active) return;
        resolveAttack('ai', attacker.energy >= attacker.template.special.cost ? 'special' : 'basic');
      }, 750);
    } else {
      state.busy = false;
      render();
    }
  }

  function startBattle() {
    if (state.selectedIds.length !== 5) return;
    const chosen = CREATURES.filter(c => state.selectedIds.indexOf(c.id) >= 0);
    const remaining = shuffle(CREATURES.filter(c => state.selectedIds.indexOf(c.id) === -1));
    
    state.player.roster = chosen.map(makeInstance);
    state.ai.roster = remaining.slice(0, 5).map(t => {
      const inst = makeInstance(t);
      if (state.difficulty === 'hard') {
        inst.aiEnhancedMoves = { basic: Math.random() < 0.5, special: Math.random() < 0.5 };
        inst.aiEnhancedAbility = Math.random() < 0.5;
      }
      return inst;
    });

    state.player.active = null;
    state.ai.active = aiPickBest(state.ai.roster, null);
    state.log = []; state.winner = null; state.endMessage = null; state.earnedGold = 0; state.earnedGems = 0; state.earnedXp = 0;
    state.atkBuffTurns = 0; state.shieldBuffTurns = 0; state.showForfeit = false; state.showItemsModal = false; state.busy = false; state.turn = 'player';
    state.pendingChoice = 'initial-player'; state.screen = 'battle';
    
    logMsg('The Mysterious Being takes the field with ' + state.ai.active.template.name + (state.difficulty === 'hard' ? ' [HARD MODE]' : '') + '!');
    render();
  }

  function performSummon() {
    if (state.playerLevel < 5) return;
    const isAbilities = (state.altarTab === 'abilities');
    const maxCount = isAbilities ? Object.keys(ABILITY_ENHANCEMENTS).length : Object.keys(ENHANCED_MOVES).length;
    const currentCount = isAbilities ? Object.keys(state.unlockedAbilities || {}).length : Object.keys(state.unlockedEnhanced || {}).length;

    if (currentCount >= maxCount) return;

    const step = isAbilities ? (state.abilitySummonStep || 1) : (state.summonStep || 1);
    const cost = (step === 4) ? 0 : 5;
    if (state.gems < cost && step !== 4) return;

    state.gems -= cost;

    if (isAbilities) {
      state.abilitySummonStep = (step % 4) + 1;
      const allKeys = Object.keys(ABILITY_ENHANCEMENTS);
      const unowned = allKeys.filter(k => !state.unlockedAbilities[k]);
      const drawnKey = allKeys[Math.floor(Math.random() * allKeys.length)];
      let isDuplicate = !!state.unlockedAbilities[drawnKey], pityTriggered = false, finalKey = drawnKey;

      if (isDuplicate) {
        state.abilityDupeStreak = (state.abilityDupeStreak || 0) + 1;
        if (state.abilityDupeStreak >= 3 && unowned.length > 0) {
          finalKey = unowned[Math.floor(Math.random() * unowned.length)];
          state.unlockedAbilities[finalKey] = true;
          pityTriggered = true;
          isDuplicate = false;
          state.abilityDupeStreak = 0;
        }
      } else {
        state.unlockedAbilities[finalKey] = true;
      }

      saveGameData();
      const enhData = ABILITY_ENHANCEMENTS[finalKey];
      const beast = CREATURES.find(c => c.id === enhData.charId);

      state.recentSummon = {
        isAbility: true, isDuplicate, pityTriggered,
        dupeStreak: state.abilityDupeStreak, key: finalKey, beast, name: enhData.name, effectDesc: enhData.desc
      };
    } else {
      state.summonStep = (step % 4) + 1;
      const allKeys = Object.keys(ENHANCED_MOVES);
      const unowned = allKeys.filter(k => !state.unlockedEnhanced[k]);
      const drawnKey = allKeys[Math.floor(Math.random() * allKeys.length)];
      let isDuplicate = !!state.unlockedEnhanced[drawnKey], pityTriggered = false, finalKey = drawnKey;

      if (isDuplicate) {
        state.dupeStreak = (state.dupeStreak || 0) + 1;
        if (state.dupeStreak >= 3 && unowned.length > 0) {
          finalKey = unowned[Math.floor(Math.random() * unowned.length)];
          state.unlockedEnhanced[finalKey] = true;
          pityTriggered = true;
          isDuplicate = false;
          state.dupeStreak = 0;
        }
      } else {
        state.unlockedEnhanced[finalKey] = true;
      }

      saveGameData();
      const enhData = ENHANCED_MOVES[finalKey];
      const beast = CREATURES.find(c => c.id === enhData.charId);

      state.recentSummon = {
        isAbility: false, isDuplicate, pityTriggered,
        dupeStreak: state.dupeStreak, key: finalKey, beast, moveKey: enhData.moveKey,
        name: beast[enhData.moveKey].name, dmg: enhData.dmg, cost: enhData.cost, effectDesc: enhData.effectDesc
      };
    }

    sound.potion();
    render();
  }

  // ==========================================
  // 7. UI RENDERER & DOM TEMPLATING
  // ==========================================
  function typeSeal(type, size = 40) {
    return `<span class="type-seal type-seal--${type}" style="--seal-size:${size}px" title="${TYPE_META[type].label}">` +
      `<svg viewBox="0 0 24 24" aria-hidden="true">${TYPE_ICONS[type]}</svg></span>`;
  }

  function creatureModelHTML(t) {
    return `<div class="creature-model"><svg viewBox="0 0 100 100" aria-hidden="true">${t.model}</svg></div>`;
  }

  function typeRelations(type) {
    const beats = [], weakTo = [];
    Object.keys(TYPE_META).forEach(other => {
      if (other === type) return;
      if (EFFECTIVENESS[type][other] > 1) beats.push(other);
      if (EFFECTIVENESS[other][type] > 1) weakTo.push(other);
    });
    return { beats, weakTo };
  }

  function typeGuideHTML() {
    return '<div class="type-guide">' + Object.keys(TYPE_META).map(type => {
      const rel = typeRelations(type);
      return `<div class="type-guide-row type-${type}">${typeSeal(type, 34)}<span class="type-guide-name">${TYPE_META[type].label}</span>` +
        `<span class="type-guide-rel"><strong>Strong vs</strong> ${(rel.beats.map(t => TYPE_META[t].label).join(' &amp; ') || '—')}</span>` +
        `<span class="type-guide-rel weak"><strong>Weak vs</strong> ${(rel.weakTo.map(t => TYPE_META[t].label).join(' &amp; ') || '—')}</span></div>`;
    }).join('') + '</div>';
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    let html = '';

    if (state.screen === 'title') {
      const curLvl = state.playerLevel || 1;
      const curXp = state.playerXp || 0;
      const reqXp = getXpRequiredForLevel(curLvl);
      const xpPct = Math.min(100, Math.round((curXp / reqXp) * 100));
      const isLvl5Locked = (curLvl < 5);
      const tierClass = getLevelTierClass(curLvl);

      html = `<div class="screen title-screen"><div class="title-frame">` +
        `<p class="eyebrow">A Codex of Battling Beasts</p><h1 class="game-title">Codex Bestiarum</h1>` +
        `<div class="player-identity-bar"><div class="player-identity-top">` +
          `<span>Bearer: <span class="player-name-highlight">${state.playerName || 'Champion'}</span></span>` +
          `<span class="level-badge ${tierClass}">Lvl ${curLvl}</span>` +
          `<button type="button" class="edit-name-btn" data-action="open-name-modal">✏️ Edit</button>` +
        `</div><div class="player-xp-container"><div class="player-xp-track"><div class="player-xp-fill" style="width:${xpPct}%;"></div></div>` +
        `<div class="player-xp-label">XP: ${curXp} / ${reqXp} (${xpPct}%)</div></div></div>` +
        `<div class="currency-bar"><div class="gold-badge">💰 Gold: ${state.gold}</div><div class="gem-badge">💎 Gems: ${state.gems}</div></div>` +
        `<p class="title-blurb">Assemble a party of five mythic creatures and lead them into tactical elemental combat against the mysterious guardian of the ancient realm.</p>` +
        `<div class="title-buttons">` +
          `<div class="title-buttons-row">` +
            `<button type="button" class="primary-btn" data-action="begin">Enter Battle</button>` +
            `<button type="button" class="primary-btn" data-action="go-index">Bestiary Index</button>` +
            `<button type="button" class="primary-btn" data-action="${isLvl5Locked ? 'locked-shop-info' : 'go-shop'}"${isLvl5Locked ? ' style="opacity:0.65; border-style:dashed;"' : ''}>${isLvl5Locked ? '🔒 Item Shop (Lvl 5)' : 'Item Shop'}</button>` +
          `</div><div class="title-buttons-row">` +
            `<button type="button" class="primary-btn" data-action="${isLvl5Locked ? 'locked-altar-info' : 'go-altar'}"${isLvl5Locked ? ' style="opacity:0.65; border-style:dashed;"' : ''}>${isLvl5Locked ? '🔒 Summon Altar (Lvl 5)' : 'Summon Altar'}</button>` +
            `<button type="button" class="primary-btn" data-action="${isLvl5Locked ? 'locked-quests-info' : 'go-quests'}"${isLvl5Locked ? ' style="opacity:0.65; border-style:dashed;"' : ''}>${isLvl5Locked ? '🔒 Daily Quests (Lvl 5)' : '📜 Daily Quests'}</button>` +
            `<button type="button" class="primary-btn" data-action="go-achievements">🏆 Achievements</button>` +
          `</div><div class="title-buttons-row" style="margin-top:0.3rem;">` +
            `<button type="button" class="primary-btn reset-btn-title" data-action="open-reset">Reset Data</button>` +
          `</div></div><h2 class="guide-heading" style="margin-top: 2rem;">Elemental Affinities</h2>${typeGuideHTML()}</div></div>`;
    } 
    else if (state.screen === 'difficulty') {
      const isHardLocked = (state.playerLevel < 10);
      html = `<div class="screen difficulty-screen"><div class="title-frame" style="max-width:900px; min-height:auto; padding:2.5rem 1.5rem;">` +
        `<p class="eyebrow">Choose Your Challenge</p><h1 class="game-title" style="margin-bottom:0.4rem;">Select Difficulty</h1>` +
        `<div class="currency-bar"><div class="gold-badge">💰 Gold: ${state.gold}</div><div class="gem-badge">💎 Gems: ${state.gems}</div></div>` +
        `<div class="difficulty-options">` +
          `<div class="difficulty-card"><div class="difficulty-card-header"><span class="diff-badge normal">Standard Trial</span><span>⚔️</span></div><h3 class="diff-title">Normal Mode</h3><p class="diff-desc">Face the realm guardian with standard creature techniques and innate abilities.</p><div class="diff-rewards-box">Victory Spoils:<br><span style="color:var(--gilt-bright);">25 – 50 Gold</span> &bull; <span style="color:#38bdf8;">1 – 3 Gems 💎</span> &bull; <span style="color:#c084fc;">105 – 130 XP</span></div><button type="button" class="primary-btn" data-action="set-difficulty" data-difficulty="normal">Select Normal</button></div>` +
          `<div class="difficulty-card hard${isHardLocked ? ' locked-card' : ''}"><div class="difficulty-card-header"><span class="diff-badge ${isHardLocked ? 'locked' : 'hard'}">${isHardLocked ? '🔒 Level 10 Required' : 'Deadly Trial'}</span><span>💀</span></div><h3 class="diff-title" style="color:#f87171;">Hard Mode</h3><p class="diff-desc">Empowered trial: enemy beasts possess awakened moves and passives.</p><div class="diff-rewards-box" style="border-color:var(--wax-red-bright); background:rgba(69,10,10,0.4);">Victory Spoils:<br><span style="color:var(--gilt-bright);">100 – 250 Gold</span> &bull; <span style="color:#38bdf8;">5 – 10 Gems 💎</span> &bull; <span style="color:#c084fc;">260 – 320 XP</span></div>` +
          (isHardLocked ? `<div class="locked-reason-banner">🔒 Locked: Reach Player Level 10</div><button type="button" class="primary-btn" disabled style="opacity:0.5;">Unlocks at Level 10</button>` : `<button type="button" class="primary-btn forfeit-confirm-btn" data-action="set-difficulty" data-difficulty="hard">Select Hard Mode</button>`) +
          `</div></div><button type="button" class="primary-btn" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'select') {
      const count = state.selectedIds.length;
      html = `<div class="screen select-screen"><h1 class="section-title">Assemble Your Party</h1>` +
        `<p class="section-sub">Select five mythic creatures to carry your banner. <span class="count-badge">${count} / 5</span></p>` +
        `<div class="creature-grid">${CREATURES.map(t => {
          const selected = state.selectedIds.indexOf(t.id) >= 0;
          return `<button type="button" class="creature-card type-${t.type}${selected ? ' selected' : ''}" data-action="toggle-select" data-id="${t.id}"${(count >= 5 && !selected) ? ' disabled' : ''}>` +
            typeSeal(t.type) + (selected ? '<span class="selected-badge">&#10003;</span>' : '') + creatureModelHTML(t) +
            `<span class="creature-name">${t.name}</span><span class="creature-hp">HP ${t.maxHp}</span></button>`;
        }).join('')}</div>` +
        `<div style="display:flex; justify-content:center; gap:1rem;"><button type="button" class="primary-btn" data-action="go-title">Back to Title</button><button type="button" class="primary-btn" data-action="start-battle"${count === 5 ? '' : ' disabled'}>Begin Battle</button></div></div>`;
    }
    else if (state.screen === 'battle') {
      const p = state.player, a = state.ai;
      const inst = p.active, aiInst = a.active;
      let actionButtonsHtml = '';

      if (inst) {
        const canAct = !state.busy && state.turn === 'player' && !state.pendingChoice && inst.curHp > 0;
        const basic = getInstMove(inst, 'basic', true);
        const special = getInstMove(inst, 'special', true);
        const specialReady = inst.energy >= special.cost;

        actionButtonsHtml = `<button type="button" class="move-btn${basic.isEnhanced ? ' enhanced-move' : ''}" data-action="attack" data-move="basic"${canAct ? '' : ' disabled'}>` +
          `<span><span class="move-btn-name">${basic.name}</span><br><span class="move-btn-dmg">${basic.dmg} dmg</span></span></button>` +
          `<button type="button" class="move-btn special${special.isEnhanced ? ' enhanced-move' : ''}" data-action="attack" data-move="special"${(canAct && specialReady) ? '' : ' disabled'}>` +
          `<span><span class="move-btn-name">${special.name}</span><br><span class="move-btn-dmg">${special.dmg} dmg (${special.cost}◆)</span></span></button>` +
          `<button type="button" class="move-btn open-items-btn" data-action="open-items"${canAct ? '' : ' disabled'}>` +
          `<span><span class="move-btn-name">🎒 Items</span><br><span class="move-btn-dmg">${(state.potions || 0) + (state.atkPotions || 0) + (state.shieldPotions || 0) + (state.energyPotions || 0)} Available</span></span></button>`;
      }

      let inlinePicker = '';
      if (state.pendingChoice) {
        const isOpening = (state.pendingChoice === 'initial-player');
        const options = isOpening ? p.roster : p.roster.filter(c => c.curHp > 0);
        inlinePicker = `<div class="inline-pick-container"><h2 class="inline-pick-title">Choose Your Champion</h2><div class="inline-pick-grid">` +
          options.map(c => `<button type="button" class="creature-card type-${c.template.type}" data-action="pick-creature" data-id="${c.template.id}">` +
            typeSeal(c.template.type) + creatureModelHTML(c.template) +
            `<span class="creature-name">${c.template.name}</span><span class="creature-hp">HP ${c.curHp}/${c.template.maxHp}</span></button>`).join('') +
          `</div></div>`;
      }

      const monPanel = (m) => {
        if (!m) return '<div class="mon-panel empty">Awaiting selection...</div>';
        const pct = Math.max(0, Math.round((m.curHp / m.template.maxHp) * 100));
        const pips = [0, 1, 2].map(i => `<span class="pip${i < m.energy ? ' filled' : ''}"></span>`).join('');
        return `<div class="mon-panel type-${m.template.type}">${typeSeal(m.template.type, 40)}${creatureModelHTML(m.template)}` +
          `<h2 class="mon-name">${m.template.name}</h2><div class="hp-row"><div class="hp-bar-track"><div class="hp-bar-fill" style="width:${pct}%"></div></div>` +
          `<span class="hp-text">${m.curHp}/${m.template.maxHp}</span></div><div class="energy-pips">${pips}</div></div>`;
      };

      html = `<div class="screen battle-screen"><div class="battle-top-nav">` +
        `<button type="button" class="battle-nav-btn guide-btn" data-action="toggle-guide">Elemental Guide</button>` +
        `<button type="button" class="battle-nav-btn forfeit-btn" data-action="open-forfeit">Surrender</button></div>` +
        `<div class="versus-area">${monPanel(p.active)}<div class="vs-divider">VS</div>${monPanel(a.active)}</div>` +
        inlinePicker +
        `<div class="battle-lower">${!state.pendingChoice ? `<div class="action-bar">${actionButtonsHtml}</div>` : ''}` +
        `<div class="battle-log-panel" id="battle-log">${state.log.slice(-40).map(m => `<div class="log-entry">${m}</div>`).join('')}</div></div></div>`;
    }
    else if (state.screen === 'end') {
      const won = state.winner === 'player';
      html = `<div class="screen end-screen ${won ? 'victory' : 'defeat'}">` +
        `<h1 class="end-title">${won ? 'Victory' : 'Defeat'}</h1><p class="end-sub">${state.endMessage || ''}</p>` +
        (won ? `<div class="rewards-wrapper"><div class="gold-reward">+${state.earnedGold} Gold</div><div class="gem-reward">+${state.earnedGems} Gems 💎</div><div class="xp-reward">+${state.earnedXp} XP ⚡</div></div>` : '') +
        `<div style="display:flex; justify-content:center; gap:1.2rem;"><button type="button" class="primary-btn" data-action="begin">Play Again</button><button type="button" class="primary-btn" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'altar') {
      const isAbilities = (state.altarTab === 'abilities');
      const step = isAbilities ? (state.abilitySummonStep || 1) : (state.summonStep || 1);
      const cost = (step === 4) ? 0 : 5;
      html = `<div class="screen altar-screen"><div class="title-frame"><h1 class="game-title">Summoning Altar</h1>` +
        `<div class="currency-bar"><div class="gem-badge">💎 Gems: ${state.gems}</div></div>` +
        `<div class="altar-pedestal">` +
          `<button class="primary-btn summon-btn-large" data-action="summon-technique">Awaken (${cost === 0 ? 'FREE' : cost + ' 💎'})</button>` +
        `</div><button class="primary-btn" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'shop') {
      html = `<div class="screen shop-screen"><div class="title-frame"><h1 class="game-title">Merchant</h1>` +
        `<div class="currency-bar"><div class="gold-badge">💰 Gold: ${state.gold}</div></div>` +
        `<div class="shop-items-container">` +
          `<div class="shop-item"><h3>❤️ Health Potion</h3><p>Restores to full HP.<br>Owned: ${state.potions}</p><button class="primary-btn" data-action="buy-potion" ${state.gold < 100 ? 'disabled' : ''}>Buy (100g)</button></div>` +
          `<div class="shop-item"><h3>⚔️ Atk Boost Potion</h3><p>+20% Attack for 3 turns.<br>Owned: ${state.atkPotions}</p><button class="primary-btn" data-action="buy-atk-potion" ${state.gold < 150 ? 'disabled' : ''}>Buy (150g)</button></div>` +
        `</div><button class="primary-btn" style="margin-top:2rem;" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'quests') {
      html = `<div class="screen quests-screen"><div class="title-frame"><h1 class="game-title">Daily Decrees</h1>` +
        `<div class="quests-container"><div class="quests-grid">${state.quests.map(q => `
          <div class="quest-card"><p class="quest-desc">${q.desc}</p><span>${q.progress} / ${q.target}</span>
          ${q.completed && !q.claimed ? `<button type="button" class="quest-claim-btn" data-action="claim-quest" data-id="${q.id}">Claim</button>` : ''}
          </div>`).join('')}</div></div>` +
        `<button type="button" class="primary-btn" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'achievements') {
      html = `<div class="screen achieve-screen"><div class="title-frame"><h1 class="game-title">Hall of Deeds</h1>` +
        `<div class="achievements-container"><div class="achievements-grid">${ACHIEVEMENTS.map(a => `
          <div class="achieve-card"><h3>${a.name}</h3><p class="achieve-desc">${a.desc}</p></div>`).join('')}</div></div>` +
        `<button type="button" class="primary-btn" data-action="go-title">Back to Title</button></div></div>`;
    }
    else if (state.screen === 'index') {
      html = `<div class="screen index-screen"><h1 class="section-title">The Mythic Bestiary</h1><div class="index-grid">${CREATURES.map(c => `
        <div class="index-card type-${c.type}">${typeSeal(c.type)}<h3>${c.name}</h3><p>HP: ${c.maxHp}</p><p>Basic: ${c.basic.name}</p><p>Special: ${c.special.name}</p></div>`).join('')}
        </div><button type="button" class="primary-btn" data-action="go-title">Back to Title</button></div>`;
    }

    app.innerHTML = html;
    const log = document.getElementById('battle-log');
    if (log) log.scrollTop = log.scrollHeight;
  }

  // ==========================================
  // 8. EVENT ROUTER & INITIALIZATION
  // ==========================================
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    sound.click();

    if (action === 'begin') { state.screen = 'difficulty'; render(); }
    else if (action === 'set-difficulty') { state.difficulty = el.dataset.difficulty; state.screen = 'select'; render(); }
    else if (action === 'toggle-select') {
      const id = el.dataset.id;
      const idx = state.selectedIds.indexOf(id);
      if (idx >= 0) state.selectedIds.splice(idx, 1);
      else if (state.selectedIds.length < 5) state.selectedIds.push(id);
      render();
    }
    else if (action === 'start-battle') { startBattle(); }
    else if (action === 'attack') { resolveAttack('player', el.dataset.move); }
    else if (action === 'pick-creature') {
      const inst = state.player.roster.find(c => c.template.id === el.dataset.id && c.curHp > 0);
      if (inst) {
        state.player.active = inst;
        const isInit = state.pendingChoice === 'initial-player';
        state.pendingChoice = null;
        render();
        if (isInit) setTimeout(() => beginTurn('player'), 400);
        else endTurn(state.pendingEndTurnSide || 'ai');
      }
    }
    else if (action === 'open-forfeit') {
      state.screen = 'end'; state.winner = 'ai'; state.endMessage = 'You surrendered the contest.';
      sound.defeat(); render();
    }
    else if (action === 'go-title') { state.screen = 'title'; render(); }
    else if (action === 'go-shop') { state.screen = 'shop'; render(); }
    else if (action === 'go-altar') { state.screen = 'altar'; render(); }
    else if (action === 'go-quests') { state.screen = 'quests'; render(); }
    else if (action === 'go-achievements') { state.screen = 'achievements'; render(); }
    else if (action === 'go-index') { state.screen = 'index'; render(); }
    else if (action === 'buy-potion') { if (state.gold >= 100) { state.gold -= 100; state.potions++; saveGameData(); sound.potion(); render(); } }
    else if (action === 'buy-atk-potion') { if (state.gold >= 150) { state.gold -= 150; state.atkPotions++; saveGameData(); sound.potion(); render(); } }
    else if (action === 'open-items') {
      if (state.potions > 0 && state.player.active && state.player.active.curHp < state.player.active.template.maxHp) {
        state.potions--;
        state.player.active.curHp = state.player.active.template.maxHp;
        sound.potion();
        logMsg("Used Health Potion! Champion fully healed.");
        saveGameData();
        render();
      } else {
        alert("No usable potions available right now!");
      }
    }
    else if (action === 'claim-quest') {
      const q = state.quests.find(item => item.id === el.dataset.id);
      if (q && q.completed && !q.claimed) {
        q.claimed = true; state.gold += q.goldReward; state.gems += q.gemReward;
        sound.potion(); saveGameData(); render();
      }
    }
    else if (action === 'summon-technique') { performSummon(); }
    else if (action === 'open-reset') {
      if (confirm("Reset all saved progress?")) {
        localStorage.removeItem('codex_save');
        state = freshState();
        render();
      }
    }
  });

  // Start engine
  state = freshState();
  render();
})();
```