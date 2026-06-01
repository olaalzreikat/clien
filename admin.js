// ===== GITHUB API HELPERS =====
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_FILE}`;

function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

async function getFileData(token) {
    const res = await fetch(`${API_BASE}?ref=${GITHUB_BRANCH}&t=${Date.now()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
        }
    });
    if (!res.ok) throw new Error('Could not read data. Check your token and repo settings.');
    const file = await res.json();
    const content = JSON.parse(decodeURIComponent(escape(atob(file.content.replace(/\n/g, '')))));
    return { sha: file.sha, data: content };
}

async function saveData(newData, token, sha) {
    const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update portfolio data via admin',
            content: toBase64(JSON.stringify(newData, null, 2)),
            sha,
            branch: GITHUB_BRANCH,
        })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Save failed');
    }
}

// ===== AUTH =====
let portfolioData = { illustrations: [], animations: [], films: [] };
let githubToken   = localStorage.getItem('gh_token') || '';

window.addEventListener('DOMContentLoaded', () => {
    if (githubToken) attemptAutoLogin();
});

async function attemptAutoLogin() {
    try {
        const { data } = await getFileData(githubToken);
        portfolioData = data;
        showDashboard();
    } catch (_) {
        localStorage.removeItem('gh_token');
        githubToken = '';
    }
}

async function login() {
    const token = document.getElementById('gh-token').value.trim();
    const errEl  = document.getElementById('loginError');
    if (!token) return;
    errEl.textContent = 'Checking token...';
    try {
        const { data } = await getFileData(token);
        portfolioData = data;
        localStorage.setItem('gh_token', token);
        githubToken = token;
        errEl.textContent = '';
        showDashboard();
    } catch (err) {
        errEl.textContent = err.message;
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') login();
});

function logout() {
    localStorage.removeItem('gh_token');
    githubToken = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display   = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display   = 'block';
    renderAllLists();
}

// ===== TABS =====
function showTab(name, btn) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    if (btn) btn.classList.add('active');
}

// ===== URL PREVIEW =====
function previewUrl(inputId, previewId) {
    const url     = document.getElementById(inputId).value.trim();
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    if (!url) return;
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4','webm','mov'].includes(ext)) {
        const vid = document.createElement('video');
        vid.src = url; vid.muted = true; vid.controls = true;
        preview.appendChild(vid);
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.onerror = () => { preview.innerHTML = '<span class="preview-error">Could not load - check URL</span>'; };
        preview.appendChild(img);
    }
}

// ===== STATUS =====
function setStatus(elId, msg, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.className = 'status-msg ' + (type === 'success' ? 'success' : type === 'error' ? 'error-text' : '');
}

// ===== ADD ILLUSTRATION =====
async function addIllustration(e) {
    e.preventDefault();
    const title    = document.getElementById('illus-title').value.trim();
    const category = document.getElementById('illus-category').value;
    const src      = document.getElementById('illus-src').value.trim();
    const wip      = document.getElementById('illus-wip').value.trim();
    const mp4      = document.getElementById('illus-mp4').value.trim();
    if (!title || !src) return;

    const btn = document.getElementById('illus-submit');
    btn.disabled = true;
    setStatus('illus-status', 'Saving...', '');

    const entry = { title, category, src };
    if (wip) entry.wip = wip;
    if (mp4) entry.mp4 = mp4;

    try {
        const { data, sha } = await getFileData(githubToken);
        data.illustrations = data.illustrations || [];
        data.illustrations.push(entry);
        await saveData(data, githubToken, sha);
        portfolioData = data;
        setStatus('illus-status', '✓ Illustration added! Changes live in ~1 min.', 'success');
        document.getElementById('illusForm').reset();
        ['illus-src-preview','illus-wip-preview'].forEach(id => document.getElementById(id).innerHTML = '');
        renderIllustrations();
    } catch (err) {
        setStatus('illus-status', 'Error: ' + err.message, 'error');
    } finally { btn.disabled = false; }
}

// ===== ADD ANIMATION =====
async function addAnimation(e) {
    e.preventDefault();
    const title   = document.getElementById('anim-title').value.trim();
    const section = document.getElementById('anim-section').value;
    const src     = document.getElementById('anim-src').value.trim();
    if (!title || !src) return;

    const btn = document.getElementById('anim-submit');
    btn.disabled = true;
    setStatus('anim-status', 'Saving...', '');

    try {
        const { data, sha } = await getFileData(githubToken);
        data.animations = data.animations || [];
        data.animations.push({ title, section, src });
        await saveData(data, githubToken, sha);
        portfolioData = data;
        setStatus('anim-status', '✓ Animation added! Changes live in ~1 min.', 'success');
        document.getElementById('animForm').reset();
        document.getElementById('anim-src-preview').innerHTML = '';
        renderAnimations();
    } catch (err) {
        setStatus('anim-status', 'Error: ' + err.message, 'error');
    } finally { btn.disabled = false; }
}

// ===== AWARDS =====
function addAwardField() {
    const container = document.getElementById('awards-container');
    const entry = document.createElement('div');
    entry.className = 'dynamic-entry';
    entry.innerHTML = `
        <div class="entry-header">
            <span class="entry-label">Award</span>
            <button type="button" class="btn-remove" onclick="this.closest('.dynamic-entry').remove()">✕</button>
        </div>
        <div class="form-group">
            <label>Festival / Event Name</label>
            <input type="text" class="award-event" placeholder="e.g. 2025 PUSD Film Festival">
        </div>
        <div class="form-group">
            <label>Category Detail <span class="optional">(optional)</span></label>
            <input type="text" class="award-detail" placeholder='e.g. "Animation" category'>
        </div>
        <div class="form-group">
            <label>Win(s) <span class="optional">(comma separated)</span></label>
            <input type="text" class="award-wins" placeholder="e.g. Best Overall, Best Sound Design">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Link URL <span class="optional">(optional)</span></label>
                <input type="url" class="award-link" placeholder="https://...">
            </div>
            <div class="form-group">
                <label>Link Label <span class="optional">(optional)</span></label>
                <input type="text" class="award-link-label" placeholder="e.g. ▶ Watch Ceremony">
            </div>
        </div>`;
    container.appendChild(entry);
}

function collectAwards() {
    return Array.from(document.querySelectorAll('#awards-container .dynamic-entry')).map(entry => ({
        event:     entry.querySelector('.award-event').value.trim(),
        detail:    entry.querySelector('.award-detail').value.trim(),
        wins:      entry.querySelector('.award-wins').value.split(',').map(s => s.trim()).filter(Boolean),
        link:      entry.querySelector('.award-link').value.trim(),
        linkLabel: entry.querySelector('.award-link-label').value.trim(),
    })).filter(a => a.event && a.wins.length);
}

// ===== BEHIND THE SCENES =====
function addBtsCategory() {
    const container = document.getElementById('bts-container');
    const entry = document.createElement('div');
    entry.className = 'dynamic-entry';
    entry.innerHTML = `
        <div class="entry-header">
            <input type="text" class="bts-label" placeholder='Category label e.g. "Concept Art"' style="flex:1;margin-right:8px">
            <button type="button" class="btn-remove" onclick="this.closest('.dynamic-entry').remove()">✕</button>
        </div>
        <div class="form-group" style="margin-top:10px">
            <label>Image URLs <span class="optional">(one per line)</span></label>
            <textarea class="bts-images" rows="4" placeholder="https://i.imgur.com/abc.png&#10;https://i.imgur.com/def.png"></textarea>
        </div>`;
    container.appendChild(entry);
}

function collectBtsCategories() {
    return Array.from(document.querySelectorAll('#bts-container .dynamic-entry')).map(entry => ({
        label:  entry.querySelector('.bts-label').value.trim(),
        images: entry.querySelector('.bts-images').value.split('\n').map(s => s.trim()).filter(Boolean),
    })).filter(c => c.label && c.images.length);
}

// ===== ADD FILM =====
async function addFilm(e) {
    e.preventDefault();
    const filmEntry = {
        title:             document.getElementById('film-title').value.trim(),
        url:               document.getElementById('film-url').value.trim(),
        description:       document.getElementById('film-description').value.trim(),
        year:              document.getElementById('film-year').value.trim(),
        genre:             document.getElementById('film-genre').value.trim(),
        duration:          document.getElementById('film-duration').value.trim(),
        roles:             document.getElementById('film-roles').value.trim(),
        imdb:              document.getElementById('film-imdb').value.trim(),
        awards:            collectAwards(),
        artworkCategories: collectBtsCategories(),
    };
    if (!filmEntry.title || !filmEntry.url || !filmEntry.description) return;

    const btn = document.getElementById('film-submit');
    btn.disabled = true;
    setStatus('film-status', 'Saving...', '');

    try {
        const { data, sha } = await getFileData(githubToken);
        data.films = data.films || [];
        data.films.push(filmEntry);
        await saveData(data, githubToken, sha);
        portfolioData = data;
        setStatus('film-status', '✓ Film added! Changes live in ~1 min.', 'success');
        document.getElementById('filmForm').reset();
        document.getElementById('awards-container').innerHTML = '';
        document.getElementById('bts-container').innerHTML = '';
        renderFilms();
    } catch (err) {
        setStatus('film-status', 'Error: ' + err.message, 'error');
    } finally { btn.disabled = false; }
}

// ===== DELETE =====
async function deleteItem(type, index) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const { data, sha } = await getFileData(githubToken);
            if (!data[type] || index >= data[type].length) break;
            data[type].splice(index, 1);
            await saveData(data, githubToken, sha);
            portfolioData = data;
            if (type === 'illustrations') renderIllustrations();
            else if (type === 'animations') renderAnimations();
            else renderFilms();
            return;
        } catch (err) {
            if (attempt === 2) alert('Delete failed: ' + err.message);
        }
    }
}

// ===== RENDER LISTS =====
function renderIllustrations() {
    const container = document.getElementById('illus-list');
    const items = portfolioData.illustrations || [];
    if (!items.length) { container.innerHTML = '<p class="empty-state">No illustrations added yet.</p>'; return; }
    container.innerHTML = '';
    items.forEach((d, i) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${d.src}" alt="${d.title}" loading="lazy">
            <div class="item-card-info">
                <div class="item-card-title">${d.title}</div>
                <div class="item-card-meta">${d.category}${d.wip ? ' · WIP' : ''}${d.mp4 ? ' · timelapse' : ''}</div>
            </div>
            <div class="item-card-footer">
                <button class="btn-delete" onclick="deleteItem('illustrations',${i})">Delete</button>
            </div>`;
        container.appendChild(card);
    });
}

function renderAnimations() {
    const container = document.getElementById('anim-list');
    const items = portfolioData.animations || [];
    if (!items.length) { container.innerHTML = '<p class="empty-state">No animations added yet.</p>'; return; }
    container.innerHTML = '';
    items.forEach((d, i) => {
        const ext = d.src.split('?')[0].split('.').pop().toLowerCase();
        const card = document.createElement('div');
        card.className = 'item-card';
        const mediaTag = ext === 'gif'
            ? `<img src="${d.src}" alt="${d.title}" loading="lazy">`
            : `<video src="${d.src}" muted autoplay loop playsinline></video>`;
        card.innerHTML = `
            ${mediaTag}
            <div class="item-card-info">
                <div class="item-card-title">${d.title}</div>
                <div class="item-card-meta">${d.section}</div>
            </div>
            <div class="item-card-footer">
                <button class="btn-delete" onclick="deleteItem('animations',${i})">Delete</button>
            </div>`;
        container.appendChild(card);
    });
}

function renderFilms() {
    const container = document.getElementById('film-list');
    const items = portfolioData.films || [];
    if (!items.length) { container.innerHTML = '<p class="empty-state">No films added yet.</p>'; return; }
    container.innerHTML = '';
    items.forEach((d, i) => {
        const awards = d.awards ? d.awards.length + ' award(s)' : '';
        const bts    = d.artworkCategories ? d.artworkCategories.length + ' BTS category(s)' : '';
        const meta   = [awards, bts].filter(Boolean).join(' · ');
        const item = document.createElement('div');
        item.className = 'film-item';
        item.innerHTML = `
            <div class="film-item-info">
                <div class="film-item-title">${d.title} ${d.year ? '(' + d.year + ')' : ''}</div>
                <div class="film-item-meta">${meta || d.url}</div>
            </div>
            <button class="btn-delete" onclick="deleteItem('films',${i})">Delete</button>`;
        container.appendChild(item);
    });
}

function renderAllLists() {
    renderIllustrations();
    renderAnimations();
    renderFilms();
}
