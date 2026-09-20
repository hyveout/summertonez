// DROP TIMING — shared by the shop grid and the product page.
//
// `dropsAt` on a product is an absolute instant (ISO 8601, UTC). The label
// is always rendered in the studio's own timezone, so every visitor reads
// the same "6:00 PM PDT" no matter where they are, while the countdown
// itself runs against their local clock.
//
// This is presentation only. The real lock is Shopify — a product that
// isn't sellable there can't be bought by anyone who skips the UI.

const DROP_TZ = 'America/Los_Angeles';

function dropDate(p) {
  return p && p.dropsAt ? new Date(p.dropsAt) : null;
}

function isUpcoming(p) {
  const d = dropDate(p);
  return !!d && d.getTime() > Date.now();
}

// "Sep 27, 6:00 PM PDT"
function dropLabel(p) {
  const d = dropDate(p);
  if (!d) return '';
  return d.toLocaleString('en-US', {
    timeZone: DROP_TZ,
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZoneName: 'short',
  }).replace(',', '');
}

// "Sep 27" — the short form for the grid badge.
function dropLabelShort(p) {
  const d = dropDate(p);
  if (!d) return '';
  return d.toLocaleString('en-US', { timeZone: DROP_TZ, month: 'short', day: 'numeric' });
}

// Whole units remaining until the drop, or null once it has passed.
function dropRemaining(p) {
  const d = dropDate(p);
  if (!d) return null;
  let ms = d.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}
