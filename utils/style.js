/**
 * ═══════════════════════════════════════════
 *  NEON/CYBER STYLE — Irfan Bot V4
 *  ╔═══╗  ║ ║  ╚═══╝  ╠═══╣
 * ═══════════════════════════════════════════
 */

const BOX = {
  // Top border with title
  top(title, width = 24) {
    const pad = Math.max(0, width - title.length - 2);
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return `╔${'═'.repeat(left + 1)} ${title} ${'═'.repeat(right + 1)}╗`;
  },

  // Divider line
  divider(width = 28) {
    return `╠${'═'.repeat(width)}╣`;
  },

  // Content line
  line(text, width = 28) {
    return `║ ${text}`;
  },

  // Bottom border
  bottom(width = 28) {
    return `╚${'═'.repeat(width)}╝`;
  },

  // Empty line
  empty() {
    return '║';
  }
};

/**
 * Build a full Neon/Cyber box
 * @param {string} title - Header title (e.g., "BOT INFO")
 * @param {string[]} lines - Content lines
 * @param {object} opts - { divider: bool, footer: string }
 * @returns {string} Formatted box string
 */
function cyberBox(title, lines = [], opts = {}) {
  const parts = [];
  parts.push(BOX.top(title));

  if (opts.header) {
    parts.push(BOX.line(opts.header));
    parts.push(BOX.divider());
  }

  for (const line of lines) {
    if (line === '---') {
      parts.push(BOX.divider());
    } else {
      parts.push(BOX.line(line));
    }
  }

  if (opts.footer) {
    parts.push(BOX.divider());
    parts.push(BOX.line(opts.footer));
  }

  parts.push(BOX.bottom());
  return parts.join('\n');
}

/**
 * Quick header — just top + bottom with title
 */
function cyberHeader(title) {
  return `${BOX.top(title)}\n${BOX.bottom()}`;
}

/**
 * Error box
 */
function cyberError(text) {
  return cyberBox('ERROR', [text]);
}

/**
 * Success box
 */
function cyberSuccess(text) {
  return cyberBox('SUCCESS', [text]);
}

/**
 * Info box
 */
function cyberInfo(text) {
  return cyberBox('INFO', [text]);
}

module.exports = {
  BOX,
  cyberBox,
  cyberHeader,
  cyberError,
  cyberSuccess,
  cyberInfo
};
