/**
 * Neutral theme-consistent SVG placeholders matching the CIPHER dark green aesthetic.
 * These are used as graceful fallbacks when uploaded images fail to load or are missing.
 * NOTE: Per strict requirements, the CIPHER logo is NEVER used as an automatic fallback
 * for a person's photo, event poster, or media asset.
 */

// Sleek cyber silhouette for team members & leadership roster
export const NEUTRAL_MEMBER_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="#030905"/>
  <rect x="2" y="2" width="196" height="196" rx="12" fill="none" stroke="#00ff66" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="6,4"/>
  <circle cx="100" cy="72" r="34" fill="#061a0c" stroke="#00ff66" stroke-width="2" stroke-opacity="0.5"/>
  <path d="M40,175 C40,132 66,118 100,118 C134,118 160,132 160,175" fill="#061a0c" stroke="#00ff66" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="100" cy="72" r="16" fill="#00ff66" fill-opacity="0.15"/>
</svg>
`)}`;

// Sleek cyber event cover for events, workshops & activities
export const NEUTRAL_EVENT_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
  <rect width="400" height="225" fill="#030905"/>
  <rect x="4" y="4" width="392" height="217" rx="8" fill="none" stroke="#00ff66" stroke-width="1.5" stroke-opacity="0.25"/>
  <path d="M0,45 L400,45 M0,180 L400,180 M100,0 L100,225 M300,0 L300,225" stroke="#00ff66" stroke-width="0.75" stroke-opacity="0.1"/>
  <circle cx="200" cy="112" r="32" fill="#061a0c" stroke="#00ff66" stroke-width="1.5" stroke-opacity="0.4"/>
  <rect x="188" y="104" width="24" height="16" rx="2" fill="none" stroke="#00ff66" stroke-width="1.5" stroke-opacity="0.6"/>
  <circle cx="200" cy="112" r="4" fill="#00ff66" fill-opacity="0.5"/>
</svg>
`)}`;

// Sleek cyber media library asset placeholder
export const NEUTRAL_MEDIA_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="#030905"/>
  <rect x="3" y="3" width="194" height="194" rx="8" fill="none" stroke="#00ff66" stroke-width="1" stroke-opacity="0.2"/>
  <path d="M40,140 L75,95 L110,130 L140,105 L160,140 Z" fill="#061a0c" stroke="#00ff66" stroke-width="1.5" stroke-opacity="0.4"/>
  <circle cx="65" cy="70" r="12" fill="#00ff66" fill-opacity="0.2"/>
</svg>
`)}`;

// Sleek cyber contributor silhouette
export const NEUTRAL_CONTRIBUTOR_AVATAR = NEUTRAL_MEMBER_AVATAR;
