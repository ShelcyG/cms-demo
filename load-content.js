// ─────────────────────────────────────────────
//  CHANGE THESE TWO LINES TO YOUR REPO DETAILS
// ─────────────────────────────────────────────
const REPO   = 'ShelcyG/cms-demo'; 
const BRANCH = 'main';
// ─────────────────────────────────────────────

const API = `https://api.github.com/repos/${REPO}/contents`;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fields = {};
  if (match) {
    match[1].split('\n').forEach(line => {
      const colon = line.indexOf(':');
      if (colon === -1) return;
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
      if (key) fields[key] = val;
    });
  }
  fields.body = text.replace(/^---[\s\S]*?---\r?\n?/, '').trim();
  return fields;
}

function mdToHtml(md) {
  if (!md) return '';
  return md
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^- (.+)$/gm,    '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .split(/\n{2,}/)
    .map(block => {
      if (/^<[hul]/.test(block.trim())) return block;
      return `<p>${block.trim()}</p>`;
    })
    .join('\n')
    .replace(/<p><\/p>/g, '');
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getInitials(str) {
  if (!str) return '?';
  return str.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Show single post ──────────────────────────
function showPost(post) {
  document.getElementById('listing-view').style.display = 'none';
  const view = document.getElementById('post-view');
  view.style.display = 'block';

  const initials = getInitials(post.author_initials || post.author);
  const coverHtml = post.cover_image
    ? `<div class="post-cover"><img src="${post.cover_image}" alt="${post.title || ''}"></div>`
    : '';

  document.getElementById('single-post-content').innerHTML = `
    <div class="single-post" style="display:block">
      ${coverHtml}
      <h1 class="post-title">${post.title || 'Untitled'}</h1>
      <div class="post-meta">
        <div class="avatar">${initials}</div>
        <div class="meta-text">
          <span class="author-name">${post.author || ''}</span>
          <span class="post-date">${formatDate(post.date)}</span>
        </div>
      </div>
      <div class="post-body">${mdToHtml(post.body)}</div>
    </div>`;

  window.scrollTo(0, 0);
}

// ── Go back to listing ────────────────────────
function showListing() {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('listing-view').style.display = 'block';
  window.scrollTo(0, 0);
}

// ── Load and render blog posts ────────────────
async function loadBlogs() {
  const el = document.getElementById('blogs');

  const files = await fetchJSON(`${API}/content/blogs?ref=${BRANCH}`);
  if (!files || !Array.isArray(files)) {
    el.innerHTML = '<p class="empty-msg">No posts yet. Add one in Pages CMS!</p>';
    return;
  }

  const mdFiles = files.filter(f => f.name.endsWith('.md'));
  if (mdFiles.length === 0) {
    el.innerHTML = '<p class="empty-msg">No posts yet. Add one in Pages CMS!</p>';
    return;
  }

  const posts = await Promise.all(mdFiles.map(async f => {
    const file = await fetchJSON(f.url);
    if (!file || !file.content) return null;
    const text = atob(file.content.replace(/\n/g, ''));
    return parseFrontMatter(text);
  }));

  const sorted = posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  el.innerHTML = sorted.map((p, i) => {
    const initials = getInitials(p.author_initials || p.author);
    const cover = p.cover_image
      ? `<div class="card-cover"><img src="${p.cover_image}" alt="${p.title || ''}"></div>`
      : '';
    const excerpt = p.excerpt || p.body.replace(/<[^>]+>/g, '').slice(0, 160) + '…';

    return `
      <article class="blog-card" onclick='showPost(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        ${cover}
        <div class="card-body">
          <h2 class="card-title">${p.title || 'Untitled'}</h2>
          <div class="card-meta">
            <div class="avatar">${initials}</div>
            <span class="author-name">${p.author || ''}</span>
            <span class="dot">·</span>
            <span class="post-date">${formatDate(p.date)}</span>
          </div>
          <p class="card-excerpt">${excerpt}</p>
        </div>
      </article>`;
  }).join('');
}

// ── Load and render photos ────────────────────
async function loadPhotos() {
  const el = document.getElementById('photos');
  if (!el) return;

  const files = await fetchJSON(`${API}/content/photos?ref=${BRANCH}`);
  if (!files || !Array.isArray(files)) {
    el.innerHTML = '<p class="empty-msg">No photos yet.</p>';
    return;
  }

  const mdFiles = files.filter(f => f.name.endsWith('.md'));
  if (mdFiles.length === 0) {
    el.innerHTML = '<p class="empty-msg">No photos yet.</p>';
    return;
  }

  const items = await Promise.all(mdFiles.map(async f => {
    const file = await fetchJSON(f.url);
    if (!file || !file.content) return null;
    const text = atob(file.content.replace(/\n/g, ''));
    return parseFrontMatter(text);
  }));

  el.innerHTML = items.filter(Boolean).map(p => `
    <div class="photo-card">
      <img src="${p.image || ''}" alt="${p.caption || p.title || ''}">
      <p class="photo-caption">${p.caption || p.title || ''}</p>
    </div>`).join('');
}

loadBlogs();
loadPhotos();
