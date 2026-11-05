export function youtubeId(value) {
  if (!value) return '';
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return '';
    const host = u.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be' ? u.pathname.slice(1) : ['youtube.com', 'm.youtube.com'].includes(host) ? (u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]) : '';
    return /^[\w-]{11}$/.test(id || '') ? id : '';
  } catch { return ''; }
}
export function safeImage(value) {
  if (!value) return '';
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
}
export function readingTime(body) { return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200)); }
export function validatePost(p) {
  if (!p.title.trim() || p.title.length > 160) throw Error('Title is required (maximum 160 characters).');
  if (!p.excerpt.trim() || p.excerpt.length > 400) throw Error('Summary is required (maximum 400 characters).');
  if (!p.body.trim() || p.body.length > 80000) throw Error('Article is required (maximum 80,000 characters).');
  if (!p.category.trim() || p.category.length > 60) throw Error('Category is required (maximum 60 characters).');
  if (p.coverUrl && !safeImage(p.coverUrl)) throw Error('Cover image must be an HTTPS URL.');
  if (p.youtubeUrl && !youtubeId(p.youtubeUrl)) throw Error('Enter a valid YouTube video URL.');
  if (!['draft','published'].includes(p.status)) throw Error('Invalid status.');
  return p;
}
// Render text with DOM APIs: stored HTML is never executed.
export function renderBody(root, body) {
  root.replaceChildren();
  for (const line of body.split('\n')) {
    const heading = line.match(/^(#{1,3})\s+(.+)/);
    const el = document.createElement(heading ? `h${heading[1].length + 1}` : line.startsWith('- ') ? 'p' : 'p');
    el.textContent = heading ? heading[2] : line.startsWith('- ') ? `• ${line.slice(2)}` : line;
    root.append(el);
  }
}
