import { renderBody, youtubeId, safeImage, readingTime } from './core.js';
export function element(tag, text, className) {
  const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el;
}
export function dateText(p) { return p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'}) : 'Just saved'; }
export function articleView(root, p) {
  root.replaceChildren(element('p',p.category,'blog-eyebrow'),element('h1',p.title),element('p',`${dateText(p)} · ${readingTime(p.body)} min read · Hammad Shahzad`,'meta'));
  const cover = safeImage(p.coverUrl);
  if (cover) { const img=element('img'); img.src=cover; img.alt=p.title; img.className='article-cover'; root.append(img); }
  root.append(element('p',p.excerpt,'muted'));
  const body=element('div', '', 'article-body'); renderBody(body,p.body); root.append(body);
  const id=youtubeId(p.youtubeUrl);
  if (id) { const frame=element('iframe'); frame.src=`https://www.youtube-nocookie.com/embed/${id}`; frame.title='YouTube video'; frame.className='video'; frame.loading='lazy'; frame.allow='fullscreen; picture-in-picture'; frame.referrerPolicy='strict-origin-when-cross-origin'; root.append(frame); }
}
