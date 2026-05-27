// ===== EXIT MODAL =====
let _exitUrl = '#';

function openExitModal(url) {
    _exitUrl = url;
    const modal = document.getElementById('exitModal');
    if (modal) modal.classList.add('active');
}

function closeExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) modal.classList.remove('active');
}

function confirmExit() {
    closeExitModal();
    window.open(_exitUrl, '_blank');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExitModal();
});

// ===== FILM ARTWORK LIGHTBOX =====
let lightboxImages = [];
let lightboxIndex  = 0;

function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex  = index;
    updateLightboxImage();
    document.getElementById('filmLightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('filmLightbox').classList.remove('active');
    document.body.style.overflow = '';
    lightboxImages = [];
}

function lightboxNext() {
    if (!lightboxImages.length) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
}

function lightboxPrev() {
    if (!lightboxImages.length) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img     = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    if (img)     img.src = lightboxImages[lightboxIndex];
    if (counter) counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxImages.length;
}

document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('filmLightbox');
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft')  lightboxPrev();
});

// ===== UTILITY: Debounce =====
function debounce(fn, ms = 100) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ===== BACK TO TOP =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }

    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const r = Math.round(124 + (233 - 124) * scrollProgress);
    const g = Math.round(58  + (129 - 58)  * scrollProgress);
    const b = Math.round(237 + (17  - 237) * scrollProgress);
    backToTopBtn.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';

    const navBottom = mainNav.offsetTop + mainNav.offsetHeight;
    if (window.scrollY > navBottom) {
        stickyNav.classList.add('visible');
    } else {
        stickyNav.classList.remove('visible');
    }
}, 16));

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== UTILITY: YouTube ID extractor =====
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ===== UTILITY: Create watermark wrapper =====
function createWatermarkWrapper(el) {
    const wrapper = document.createElement('div');
    wrapper.className = 'artwork-img-wrapper';
    wrapper.appendChild(el);
    return wrapper;
}

// ===== INTERSECTION OBSERVER for lazy video play =====
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
            vid.play().catch(() => {});
        } else {
            vid.pause();
            vid.currentTime = 0;
        }
    });
}, { threshold: 0.1 });

// ===== TAB SWITCHING =====
function showIllusTab(tabName) {
    const section = document.querySelector('.work-section');
    section.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    section.querySelectorAll('.illus-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    section.querySelectorAll('.illus-tab').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
    setTimeout(positionMoonAndSides, 60);
}


function showCommTab(tabName) {
    document.querySelectorAll('.comm-panel').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.comm-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.comm-tab').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
}

function showAboutTab(tabName) {
    const section = document.querySelector('.about-section');
    section.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    section.querySelectorAll('.about-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    section.querySelectorAll('.about-tab').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
    setTimeout(positionMoonAndSides, 60);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== ILLUSTRATIONS =====
const images = [
    { src: 'imgs/illustration1.png', title: 'Enchanted Forest', category: 'digital', wip: 'imgs/LEAFDRAGONS_AP2025_wip.png',              mp4: 'imgs/LEAFDRAGONS_AP2025.mp4' },
    { src: 'imgs/illustration2.png', title: 'Dragon Frog',      category: 'digital', wip: 'imgs/FROG_AP_2025_wip.png',                   mp4: 'imgs/FROG_AP_2025.mp4' },
    { src: 'imgs/illustration3.png', title: 'Sky Islands',      category: 'digital', wip: 'imgs/GRYFFIN CITY_AP 2025_wip.png',           mp4: 'imgs/GRYFFIN CITY_AP 2025.mp4' },
    { src: 'imgs/illustration4.png', title: 'Starfield',        category: 'digital', wip: 'imgs/AP_2026_SNOWWOLF_wip1.png',              mp4: 'imgs/AP_2026_SNOWWOLF_wip2.mp4' },
    { src: 'imgs/illustration5.png', title: 'Deep Sea',         category: 'digital', wip: 'imgs/AQUARIUM_AP_2026_wip.png',               mp4: 'imgs/AQUARIUM_AP_2026.mp4' },
    { src: 'imgs/illustration6.png', title: 'Dragon Night',     category: 'digital', wip: 'imgs/BOOK OF ADVENTURE_2025_APwip.png',       mp4: 'imgs/BOOK OF ADVENTURE_2025_AP_0.mp4' },
    { src: 'imgs/illustration7.png', title: 'Forest Scare',     category: 'digital', wip: 'imgs/LIBRARYBOX_AP_2025_wip.png',             mp4: 'imgs/LIBRARYBOX_AP_2025_Wip1.mp4' },
    { src: 'imgs/illustration8.png', title: 'Roller Dog',       category: 'digital', wip: 'imgs/AP_2025_ROLLERDOG_wip.png',              mp4: 'imgs/AP_2025_ROLLERDOG.mp4' },
    { src: 'imgs/illustration9.png', title: 'Unicorn Dream',    category: 'digital', wip: 'imgs/UNICORN_AP_2025_wip.png',                mp4: 'imgs/UNICORN_AP_2025_0.mp4' },
    { src: 'imgs/trad1.jpg', title: 'Traditional 1', category: 'traditional' },
    { src: 'imgs/trad2.jpg', title: 'Traditional 2', category: 'traditional' },
    { src: 'imgs/trad3.jpg', title: 'Traditional 3', category: 'traditional' },
    { src: 'imgs/trad4.jpg', title: 'Traditional 4', category: 'traditional' },
    { src: 'imgs/trad5.jpg', title: 'Traditional 5', category: 'traditional' },
    { src: 'imgs/trad6.jpg', title: 'Traditional 6', category: 'traditional' },
    { src: 'imgs/trad7.jpg', title: 'Traditional 7', category: 'traditional' },
    { src: 'imgs/trad8.jpg', title: 'Traditional 8', category: 'traditional' },
];
let currentImageIndex = 0;
let currentCategory = 'digital';

function getFilteredImages() {
    return images.filter(img => img.category === currentCategory);
}

function showIllusCategory(category) {
    currentCategory = category;
    currentImageIndex = 0;
    document.querySelectorAll('.illus-cat').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.illus-cat').forEach(btn => {
        if (btn.getAttribute('onclick').includes(category)) btn.classList.add('active');
    });
    updateShowcase();
    populateGallery();
}

function preloadAdjacentImages() {
    const nextIdx = (currentImageIndex + 1) % images.length;
    const prevIdx = (currentImageIndex - 1 + images.length) % images.length;
    [nextIdx, prevIdx].forEach(idx => {
        const preload = new Image();
        preload.src = images[idx].src;
    });
}

function updateShowcase() {
    const filtered = getFilteredImages();
    const display = document.querySelector('.illustration-display');
    let inner = display.querySelector('.illus-inner');
    if (!inner) {
        inner = document.createElement('div');
        inner.className = 'illus-inner';
        display.appendChild(inner);
    }
    if (!filtered.length) { inner.innerHTML = '<p style="color:#fff;text-align:center">No images yet</p>'; return; }
    const imageSrc = filtered[currentImageIndex].src;
    const img = new Image();
    img.onload = function() {
        inner.innerHTML = '';
        const imgEl = document.createElement('img');
        imgEl.src = imageSrc;
        imgEl.alt = filtered[currentImageIndex].title;
        imgEl.style.cssText = 'display:block;max-width:100%;max-height:100%;';
        inner.appendChild(imgEl);
        preloadAdjacentImages();
    };
    img.src = imageSrc;
    populateIllusProcess();
}

function nextImage() { const f = getFilteredImages(); currentImageIndex = (currentImageIndex + 1) % f.length; updateShowcase(); }
function previousImage() { const f = getFilteredImages(); currentImageIndex = (currentImageIndex - 1 + f.length) % f.length; updateShowcase(); }

function populateGallery() {
    const filtered = getFilteredImages();
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    filtered.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.title;
        imgEl.loading = 'lazy';
        imgEl.decoding = 'async';
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const titleSpan = document.createElement('span');
        titleSpan.textContent = img.title;
        overlay.appendChild(titleSpan);
        item.appendChild(imgEl);
        item.appendChild(overlay);
        item.addEventListener('click', () => { currentImageIndex = index; updateShowcase(); showIllusTab('closeup'); });
        fragment.appendChild(item);
    });
    galleryGrid.appendChild(fragment);
}

function populateIllusProcess() {
    const grid = document.getElementById('illusProcessGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = getFilteredImages();
    const current = filtered[currentImageIndex];
    if (!current || (!current.wip && !current.mp4)) return;
    if (current.wip) {
        const item = document.createElement('div');
        item.className = 'wip-process-item';
        const el = document.createElement('img');
        el.src = current.wip;
        el.alt = current.title + ' sketch';
        el.loading = 'lazy';
        const lbl = document.createElement('div');
        lbl.className = 'wip-item-label';
        lbl.textContent = current.title + ' · Sketch';
        item.append(el, lbl);
        grid.appendChild(item);
    }
    if (current.mp4) {
        const item = document.createElement('div');
        item.className = 'wip-process-item';
        const vid = document.createElement('video');
        vid.src = current.mp4;
        vid.controls = true;
        vid.muted = true;
        vid.setAttribute('playsinline', '');
        vid.preload = 'none';
        const lbl = document.createElement('div');
        lbl.className = 'wip-item-label';
        lbl.textContent = current.title + ' · Timelapse';
        item.append(vid, lbl);
        grid.appendChild(item);
    }
}

// ===== SWIPE SUPPORT =====
function addSwipeSupport(container, onSwipeLeft, onSwipeRight) {
    let startX = 0, startY = 0;
    container.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - startX;
        const dy = e.changedTouches[0].screenY - startY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx < 0) onSwipeLeft(); else onSwipeRight();
        }
    }, { passive: true });
}

// ===== ANIMATIONS =====
const animationCategories = [
    { section: 'Locomotion', videos: [
        { src: 'vids/GirlWalkCycle.gif', title: 'Ballerina Walk Cycle' },
        { src: 'vids/StoneLionRunCycle.gif', title: 'Lion Run Cycle' },
        { src: 'vids/SneakyWalkCycle.mp4', title: 'Child Sneak Walk Cycle' },
        { src: 'vids/walk4leggedfoxfixed (1).gif', title: 'Fox Walk Cycle' },
    ]},
    { section: 'Motion Graphics', videos: [
        { src: 'vids/icebreaker.mp4', title: 'Introduce Yourself Motion Animation' },
        { src: 'vids/rig.mp4', title: 'Monkey! Motion Animation' },
        { src: 'vids/lyrics.mp4', title: 'Roller Skating Dog Lyric Video' },
        { src: 'vids/Tiger-final.mp4', title: 'Tiger Walk Cycle' },
        { src: 'vids/MotionGraphicsFinal_Render1.mp4', title: 'Dog and Elephant' },
    ]},
    { section: 'Character Acting', videos: [
        { src: 'vids/hair.mp4', title: 'Cape' },
        { src: 'vids/wave.mp4', title: 'Wave' },
        { src: 'vids/props.mp4', title: 'Acting with a Prop' },
        { src: 'vids/ScaryEncounter.mp4', title: 'Character Acting' },
        { src: 'vids/dance.mp4', title: 'Dance!' },
    ]},
    { section: 'Stop Motion', videos: [
        { src: 'vids/stopmotion-cat.mp4', title: 'Big Cat Paper' },
        { src: 'vids/stopmotion-intro1.mp4', title: 'Sleepy Creature Clay' },
        { src: 'vids/charcoal.mp4', title: 'Big Dog Charcoal' },
    ]},
];

let currentAnimCategory = 0;
let currentVideoIndex = 0;

function showAnimCategory(index) {
    currentAnimCategory = index;
    currentVideoIndex = 0;
    const label = document.querySelector('.anim-cat-label');
    if (label) label.textContent = animationCategories[index].section.toUpperCase();
    updateVideoDisplay();
    const galleryTab = document.getElementById('anim-gallery');
    if (galleryTab && galleryTab.classList.contains('active')) populateAnimGallery();
    setTimeout(positionMoonAndSides, 60);
}

function prevAnimCategory() { showAnimCategory((currentAnimCategory - 1 + animationCategories.length) % animationCategories.length); }
function nextAnimCategory() { showAnimCategory((currentAnimCategory + 1) % animationCategories.length); }

function showAnimViewTab(tabName) {
    const section = document.querySelector('.animations-section');
    section.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    section.querySelectorAll('.anim-view-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    section.querySelectorAll('.anim-view-tab').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
    if (tabName === 'anim-gallery') {
        populateAnimGallery();
        setTimeout(() => {
            document.querySelectorAll('#animGalleryGrid video').forEach(v => videoObserver.observe(v));
        }, 100);
    }
    setTimeout(positionMoonAndSides, 60);
}

function populateAnimGallery() {
    const container = document.getElementById('animGalleryGrid');
    if (!container) return;
    container.innerHTML = '';
    const catVideos = animationCategories[currentAnimCategory].videos;
    const fragment = document.createDocumentFragment();
    catVideos.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'anim-gallery-item';
        let mediaEl;
        const ext = video.src.split('.').pop().toLowerCase();
        if (ext === 'gif') {
            mediaEl = document.createElement('img');
            mediaEl.src = video.src;
            mediaEl.alt = video.title;
            mediaEl.loading = 'lazy';
            mediaEl.decoding = 'async';
            mediaEl.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        } else {
            mediaEl = document.createElement('video');
            mediaEl.muted = true;
            mediaEl.playsInline = true;
            mediaEl.loop = true;
            mediaEl.preload = 'none';
            mediaEl.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            const source = document.createElement('source');
            source.src = video.src;
            source.type = 'video/mp4';
            mediaEl.appendChild(source);
        }
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = '<div class="play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div><span>' + video.title + '</span>';
        item.appendChild(mediaEl);
        item.appendChild(overlay);
        item.addEventListener('click', () => {
            currentVideoIndex = index;
            updateVideoDisplay();
            showAnimViewTab('anim-closeup');
        });
        fragment.appendChild(item);
        if (mediaEl.tagName === 'VIDEO') videoObserver.observe(mediaEl);
    });
    container.appendChild(fragment);
}

function updateVideoDisplay() {
    const vp = document.querySelector('.animations-section .video-placeholder');
    if (!vp) return;
    const catVideos = animationCategories[currentAnimCategory].videos;
    const cur = catVideos[currentVideoIndex];
    const ext = cur.src.split('.').pop().toLowerCase();
    if (ext === 'gif') {
        vp.innerHTML = '<div class="anim-inner-wrap"><img src="' + cur.src + '" alt="' + cur.title + '"></div>';
    } else {
        vp.innerHTML = '<div class="anim-inner-wrap"><video autoplay loop muted playsinline><source src="' + cur.src + '" type="video/mp4"></video></div>';
    }
}

function nextVideo() {
    const catVideos = animationCategories[currentAnimCategory].videos;
    currentVideoIndex = (currentVideoIndex + 1) % catVideos.length;
    updateVideoDisplay();
}
function previousVideo() {
    const catVideos = animationCategories[currentAnimCategory].videos;
    currentVideoIndex = (currentVideoIndex - 1 + catVideos.length) % catVideos.length;
    updateVideoDisplay();
}


// ===== FILMS =====
const films = [
    {
        url: 'https://www.youtube.com/watch?v=xO5sDt7_qN4', title: 'FISHBOWL',
        description: "A young painter searches for a reference for her aquatic painting, but doesn't know the fish she bought is actually magical. This imaginative animated short explores themes of curiosity, adventure, and finding your place in the world.",
        year: '2025', genre: 'Animation', duration: '7 min', roles: 'Director, Editor, Animator, Colorist',
        imdb: 'https://m.imdb.com/title/tt36786195/?ref_=ext_shr_lnk',
        awards: [
            { event: '2025 PUSD Film Festival', detail: '"Alice in Wonderland Animation" category', wins: ['Best Overall'] },
            { event: '2024–2025 Rocky Mountain Southwest Chapter Student Production Awards', detail: '"Highschool Animation/Graphics/Special Effects"', wins: ['Best Overall'], link: 'https://www.youtube.com/watch?v=09NP_b_IOHA&feature=youtu.be', linkLabel: '▶ Watch Ceremony' },
            { event: '2025 National Academy of Television Arts & Sciences\' National Student Production Awards', detail: '"Highschool Animation/Graphics/Special Effects"', wins: ['Best Overall'], link: 'https://theemmys.tv/wp-content/uploads/2025/11/2025-NSPA-WINNERS-.pdf', linkLabel: 'View Winners PDF' },
            { event: '2026 Arizona Student Film Festival', wins: ['2nd Place'] },
            { event: '2026 69th San Francisco International Film Festival, YouthWorks section', wins: ['Nominee'] },
        ],
        behindScenesLabel: 'Behind the Scenes',
        artworkCategories: [
            { label: 'Concept Art', images: ['imgs/fishconcept1.png','imgs/fishconcept2.png','imgs/fishconcept3.png','imgs/fishconcept4.png','imgs/fishconcept5.png','imgs/fishconcept6.gif','imgs/fishconcept7.gif','imgs/fishconcept8.png'] },
            { label: 'Reference Sheets', images: ['imgs/fishref.png','imgs/fishref1.png'] },
            { label: 'Backgrounds', images: ['imgs/fishback1.png','imgs/fishback2.png','imgs/fishback3.png','imgs/fishback4.png','imgs/fishback5.png','imgs/fishback6.png','imgs/fishback7.png','imgs/fishback8.png','imgs/fishback9.png','imgs/fishback10.png'] },
        ]
    },
    {
        url: 'https://www.youtube.com/watch?v=fXAdtJOotVQ', title: 'PIZZA DOG',
        description: 'Dog learns to let go. This heartfelt animated short explores themes of love and loss between two best friends.',
        year: '2024', genre: 'Animation', duration: '2 min', roles: 'Director, Editor, Animator, Colorist',
        imdb: 'https://m.imdb.com/title/tt36587391/?ref_=ext_shr_lnk',
        awards: [
            { event: '2024 PUSD Film Festival', detail: '"Coming of Age" category', wins: ['Best Sound Design', 'Best Overall'] },
            { event: '2023–2024 Rocky Mountain Southwest Chapter Student Production Awards', detail: '"Highschool Animation/Graphics/Special Effects"', wins: ['Best Overall'] },
            { event: '2024 National Academy of Arts and Sciences\' National Student Production Awards', wins: ['Nominee'] },
            { event: '2026 69th San Francisco International Film Festival, YouthWorks section', wins: ['Nominee'] },
        ],
        behindScenesLabel: 'Behind the Scenes',
        artworkCategories: [
            { label: 'Concept Art', images: ['imgs/pizzaconcept.png','imgs/pizzaconcept2.png','imgs/pizzaconcept3.png','imgs/pizzaconcept4.png'] },
            { label: 'Reference Sheets', images: ['imgs/pizzaref.png'] },
            { label: 'Backgrounds', images: ['imgs/pizzaback1.png','imgs/pizzaback2.png','imgs/pizzaback3.png','imgs/pizzaback4.png','imgs/pizzaback5.png','imgs/pizzaback6.png'] },
        ]
    },
    {
        url: 'https://www.youtube.com/watch?v=NrgbSkulAZk', title: 'BODY',
        director: 'Directed by Lavender Birch',
        description: 'Body follows a young woman and her internal struggle as she juggles the complex challenge of chasing her dreams and the changing demands of her physical body.',
        year: '2025', genre: 'Animation', duration: '', roles: 'Guest Colorist',
        imdb: '', youtubeLink: 'https://www.youtube.com/watch?v=NrgbSkulAZk',
        behindScenesLabel: 'Work', artworkType: 'videos', noWatermark: true,
        artwork: ['vids/BODY_CUT1.mp4','vids/BODY_CUT2.mp4','vids/BODY_CUT3.mp4']
    }
];

let currentFilmIndex = 0;

function updateFilmDisplay() {
    const vp = document.querySelector('.video-placeholder-film');
    const filmTag = document.querySelector('.film-tag');
    const filmText = document.querySelector('.film-text');
    const filmMeta = document.querySelector('.film-meta');
    const filmRoles = document.querySelector('.film-roles');
    const filmLinks = document.querySelector('.film-links');
    const filmAwards = document.querySelector('.film-awards');
    const processTitle = document.querySelector('.process-title');
    const processContent = document.querySelector('.process-content');
    if (!vp) return;

    const f = films[currentFilmIndex];
    const vid = getYouTubeID(f.url);
    vp.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + vid + '" title="' + f.title + '" frameborder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius: 20px;"></iframe>';

    if (filmTag) filmTag.textContent = f.title;

    // Director credit
    let directorEl = document.querySelector('.film-director');
    if (!directorEl) {
        directorEl = document.createElement('p');
        directorEl.className = 'film-director';
        filmTag.parentNode.insertBefore(directorEl, filmTag.nextSibling);
    }
    directorEl.textContent = f.director || '';
    directorEl.style.display = f.director ? 'block' : 'none';
    if (filmText) filmText.textContent = f.description;
    if (filmMeta) {
        const parts = [f.year, f.genre, f.duration].filter(Boolean);
        filmMeta.innerHTML = parts.map((p, i) => i < parts.length - 1 ? '<span>' + p + '</span><span class="meta-dot">&bull;</span>' : '<span>' + p + '</span>').join('');
    }
    if (filmRoles) filmRoles.textContent = f.roles || '';
    if (filmLinks) {
        filmLinks.innerHTML = '';
        if (f.imdb) filmLinks.innerHTML += '<a href="' + f.imdb + '" target="_blank" class="film-link">IMDB page</a>';
        if (f.youtubeLink && !f.awards) filmLinks.innerHTML += '<a href="' + f.youtubeLink + '" target="_blank" class="film-link">YouTube Link</a>';
    }

    if (filmAwards) {
        filmAwards.innerHTML = '';
        if (f.awards && f.awards.length) {
            const title = document.createElement('h5');
            title.className = 'film-awards-title';
            title.textContent = 'Awards';
            filmAwards.appendChild(title);
            f.awards.forEach(award => {
                const item = document.createElement('div');
                item.className = 'film-award-item';
                const eventEl = document.createElement('span');
                eventEl.className = 'award-event';
                eventEl.textContent = award.event;
                item.appendChild(eventEl);
                if (award.detail) {
                    const detail = document.createElement('span');
                    detail.className = 'award-detail';
                    detail.textContent = award.detail;
                    item.appendChild(detail);
                }
                const winsEl = document.createElement('span');
                winsEl.className = 'award-wins';
                award.wins.forEach(win => {
                    const badge = document.createElement('span');
                    badge.className = 'award-badge' + (win === 'Nominee' ? ' nominee' : '');
                    badge.textContent = win;
                    winsEl.appendChild(badge);
                });
                if (award.link) {
                    const link = document.createElement('a');
                    link.href = award.link;
                    link.target = '_blank';
                    link.className = 'award-link';
                    link.textContent = award.linkLabel || 'View Link';
                    winsEl.appendChild(link);
                }
                item.appendChild(winsEl);
                filmAwards.appendChild(item);
            });
        }
    }

    if (processTitle) processTitle.textContent = f.behindScenesLabel || 'Behind the Scenes';
    if (processContent) {
        processContent.innerHTML = '';
        if (f.artworkCategories) {
            f.artworkCategories.forEach(cat => {
                const heading = document.createElement('h5');
                heading.className = 'artwork-heading';
                heading.textContent = cat.label + ':';
                processContent.appendChild(heading);
                const grid = document.createElement('div');
                grid.className = 'artwork-grid';
                if (cat.images && cat.images.length) {
                    const fragment = document.createDocumentFragment();
                    cat.images.forEach((src, imgIdx) => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = cat.label;
                        img.className = 'artwork-img artwork-img-zoomable';
                        img.loading = 'lazy';
                        img.decoding = 'async';
                        img.addEventListener('click', () => openLightbox(cat.images, imgIdx));
                        fragment.appendChild(createWatermarkWrapper(img));
                    });
                    grid.appendChild(fragment);
                } else {
                    grid.innerHTML = '<p class="no-artwork">Images coming soon.</p>';
                }
                processContent.appendChild(grid);
            });
        } else {
            const heading = document.createElement('h5');
            heading.className = 'artwork-heading';
            heading.textContent = f.artworkType === 'videos' ? 'Work:' : 'Artwork:';
            processContent.appendChild(heading);
            const grid = document.createElement('div');
            grid.className = 'artwork-grid';
            if (f.artwork && f.artwork.length > 0) {
                const fragment = document.createDocumentFragment();
                if (f.artworkType === 'videos') {
                    f.artwork.forEach(src => {
                        const v = document.createElement('video');
                        v.src = src; v.className = 'artwork-img';
                        v.loop = true; v.muted = true; v.playsInline = true; v.preload = 'none';
                        v.style.objectFit = 'cover';
                        videoObserver.observe(v);
                        if (f.noWatermark) {
                            const wrapper = document.createElement('div');
                            wrapper.style.cssText = 'width:95%;position:relative;overflow:hidden;border-radius:12px;';
                            wrapper.appendChild(v);
                            fragment.appendChild(wrapper);
                        } else {
                            fragment.appendChild(createWatermarkWrapper(v));
                        }
                    });
                } else {
                    f.artwork.forEach((src, imgIdx) => {
                        const img = document.createElement('img');
                        img.src = src; img.alt = f.title + ' artwork';
                        img.className = 'artwork-img artwork-img-zoomable'; img.loading = 'lazy'; img.decoding = 'async';
                        img.addEventListener('click', () => openLightbox(f.artwork, imgIdx));
                        fragment.appendChild(createWatermarkWrapper(img));
                    });
                }
                grid.appendChild(fragment);
            } else {
                grid.innerHTML = '<p class="no-artwork">No artwork added yet.</p>';
            }
            processContent.appendChild(grid);
        }
    }
    setTimeout(positionMoonAndSides, 60);
}

function nextFilm() { currentFilmIndex = (currentFilmIndex + 1) % films.length; updateFilmDisplay(); }
function previousFilm() { currentFilmIndex = (currentFilmIndex - 1 + films.length) % films.length; updateFilmDisplay(); }

// ===== STAMP HIGHLIGHT =====
function addStampHighlight() {
    const stamps = document.querySelectorAll('.stamp');
    const stampBg = document.querySelector('.contact-stamp');
    const pcStampStatic = document.querySelector('.pc-stamp-static');

    function startHeartbeat() {
        if (pcStampStatic) pcStampStatic.classList.add('heartbeat');
        if (stampBg) stampBg.classList.add('highlight');
    }
    function stopHeartbeat() {
        if (pcStampStatic) pcStampStatic.classList.remove('heartbeat');
        if (stampBg) stampBg.classList.remove('highlight');
    }

    stamps.forEach(stamp => {
        stamp.addEventListener('mouseenter', startHeartbeat);
        stamp.addEventListener('mouseleave', () => {
            if (!stamp.classList.contains('dragging')) stopHeartbeat();
        });
        stamp.addEventListener('mousedown', startHeartbeat);
        stamp.addEventListener('touchstart', startHeartbeat, { passive: true });
    });
    document.addEventListener('mouseup', () => setTimeout(stopHeartbeat, 300));
    document.addEventListener('touchend', () => setTimeout(stopHeartbeat, 300));
}

// ===== DRAGGABLE STAMPS =====
function makeDraggable() {
    const stamps = document.querySelectorAll('.stamp');
    const contactContainer = document.querySelector('.contact-container');
    if (!contactContainer) return;

    contactContainer.style.minHeight = contactContainer.offsetHeight + 'px';

    stamps.forEach(stamp => {
        stamp._originalParent = stamp.parentElement;
        stamp._originalIndex = Array.from(stamp.parentElement.children).indexOf(stamp);
    });

    stamps.forEach(stamp => {
        let isDragging = false;
        let mouseOffsetX, mouseOffsetY;

        function dragStart(e) {
            if (e.cancelable) e.preventDefault();
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            const stampRect = stamp.getBoundingClientRect();
            mouseOffsetX = clientX - stampRect.left;
            mouseOffsetY = clientY - stampRect.top;

            if (stamp.parentElement !== contactContainer) {
                const containerRect = contactContainer.getBoundingClientRect();
                const newLeft = stampRect.left - containerRect.left + contactContainer.scrollLeft;
                const newTop = stampRect.top - containerRect.top + contactContainer.scrollTop;
                const placeholder = document.createElement('div');
                placeholder.className = 'stamp-placeholder';
                placeholder.style.cssText = 'width:' + stamp.offsetWidth + 'px;height:' + stamp.offsetHeight + 'px;visibility:hidden;pointer-events:none;flex-shrink:0;';
                stamp.parentElement.insertBefore(placeholder, stamp);
                stamp._placeholder = placeholder;
                stamp.style.position = 'absolute';
                stamp.style.left = newLeft + 'px';
                stamp.style.top = newTop + 'px';
                contactContainer.appendChild(stamp);
            }

            isDragging = true;
            stamp.style.zIndex = '1000';
            stamp.classList.add('dragging');
            document.addEventListener('mousemove', drag, { passive: false });
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
        }

        function drag(e) {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const containerRect = contactContainer.getBoundingClientRect();
            stamp.style.left = (clientX - containerRect.left - mouseOffsetX + contactContainer.scrollLeft) + 'px';
            stamp.style.top = (clientY - containerRect.top - mouseOffsetY + contactContainer.scrollTop) + 'px';
        }

        function dragEnd() {
            isDragging = false;
            stamp.style.zIndex = '10';
            stamp.classList.remove('dragging');
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
        }

        stamp.addEventListener('mousedown', dragStart);
        stamp.addEventListener('touchstart', dragStart, { passive: false });
    });
}

// ===== STAMP CAROUSEL (visible only at ≤1200px, old one kept for fallback) =====
function initStampCarousel() {
    const stampImages = [
        'imgs/stamp1.png',
        'imgs/stamp2.png',
        'imgs/stamp3.png',
    ];

    const img    = document.getElementById('stampCarouselImg');
    const prev   = document.getElementById('stampPrev');
    const next   = document.getElementById('stampNext');
    const dotsEl = document.getElementById('stampDots');

    if (!img || !prev || !next || !dotsEl) return;

    let current = 0;

    stampImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'stamp-carousel__dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
    });

    function goTo(index) {
        current = (index + stampImages.length) % stampImages.length;
        img.style.opacity = '0';
        img.style.transform = 'scale(0.82) rotate(5deg)';
        img.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
        setTimeout(() => {
            img.src = stampImages[current];
            img.style.transition = 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)';
            img.style.opacity = '1';
            img.style.transform = 'scale(1) rotate(0deg)';
        }, 190);
        dotsEl.querySelectorAll('.stamp-carousel__dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    addSwipeSupport(img.parentElement, () => goTo(current + 1), () => goTo(current - 1));
}

// ===== PC STAMP CAROUSEL (inside postcard, for tablets 769–1200px) =====
function initPcStampCarousel() {
    const stampImages = [
        'imgs/stamp1.png',
        'imgs/stamp2.png',
        'imgs/stamp3.png',
    ];

    const img    = document.getElementById('pcStampImg');
    const prev   = document.getElementById('pcStampPrev');
    const next   = document.getElementById('pcStampNext');
    const dotsEl = document.getElementById('pcStampDots');

    if (!img || !prev || !next || !dotsEl) return;

    let current = 0;

    // Build dots
    stampImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'pc-stamp-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
    });

    function goTo(index) {
        current = (index + stampImages.length) % stampImages.length;

        // Animate out
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8) rotate(6deg)';
        img.style.transition = 'opacity 0.16s ease, transform 0.16s ease';

        setTimeout(() => {
            img.src = stampImages[current];
            // Animate in with a springy bounce
            img.style.transition = 'opacity 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)';
            img.style.opacity = '1';
            img.style.transform = 'scale(1) rotate(0deg)';
        }, 180);

        // Update dots
        dotsEl.querySelectorAll('.pc-stamp-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    // Swipe on the stamp track
    const track = img.parentElement;
    if (track) addSwipeSupport(track, () => goTo(current + 1), () => goTo(current - 1));
}

// ===== POSITION MOON AND SIDE DECORATIONS =====
function positionMoonAndSides() {
    const contact = document.querySelector('.contact-section');
    const moon = document.querySelector('.right-moon');
    const sides = document.querySelectorAll('.side-decoration-container');

    const contactTop = contact
        ? contact.offsetTop
        : document.documentElement.scrollHeight - 200;
    let moonTop = contactTop;

    if (moon) {
        const moonH = moon.offsetHeight || 300;
        moonTop = contactTop - moonH + 90;
        moon.style.top = (moonTop - 100) + 'px';
    }

    sides.forEach(s => {
        if (s.classList.contains('left')) {
            const sunImg = document.querySelector('.left-sun');
            const sunHeight = sunImg ? (sunImg.offsetHeight || 300) : 300;
            const topOffset = sunHeight + 20;
            s.style.top = topOffset + 'px';
            s.style.left = 10 + 'px';
            s.style.height = (contactTop - topOffset - 80) + 'px';
        } else if (s.classList.contains('right')) {
            const topOffset = 10;
            s.style.top = topOffset + 'px';
            const moonImg = document.querySelector('.right-moon');
            if (moonImg) {
                const moonTopPos = parseInt(moonImg.style.top) || moonTop;
                s.style.height = (moonTopPos - topOffset - 50) + 'px';
            } else {
                s.style.height = (contactTop - topOffset - 80) + 'px';
            }
        }
    });
}

function positionMargins() {
    const contact = document.querySelector('.contact-section');
    const footer = document.querySelector('.footer');

    const bodyStyle = window.getComputedStyle(document.body);
    const paddingLeft = parseInt(bodyStyle.paddingLeft) || 0;
    const paddingRight = parseInt(bodyStyle.paddingRight) || 0;

    if (contact) {
        contact.style.marginLeft = '';
        contact.style.marginRight = '';
        contact.style.paddingLeft = '';
        contact.style.paddingRight = '';
        contact.style.marginLeft = '-' + paddingLeft + 'px';
        contact.style.marginRight = '-' + paddingRight + 'px';
        contact.style.paddingLeft = (paddingLeft + 30) + 'px';
        contact.style.paddingRight = (paddingRight + 30) + 'px';
    }

    if (footer) {
        footer.style.marginLeft = '-' + paddingLeft + 'px';
        footer.style.marginRight = '-' + paddingRight + 'px';
        footer.style.paddingLeft = (paddingLeft + 30) + 'px';
        footer.style.paddingRight = (paddingRight + 30) + 'px';
    }
}

function positionElements() {
    positionMoonAndSides();
    positionMargins();
}

// ================================================================
//  NAVBAR INTERACTIVE ANIMATIONS
// ================================================================

function initNavParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const nav = document.getElementById('mainNav');

    function resize() {
        canvas.width  = nav.offsetWidth;
        canvas.height = nav.offsetHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    function drawStar(ctx, x, y, r, alpha, color) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = color;
        ctx.shadowColor = color;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle  = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? r : r * 0.38;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    const COLORS = ['#ffe566', '#fff5c0', '#ffb347', '#ff9fe0', '#ffffff', '#ffd0a0'];

    class Star {
        constructor(initial) { this.reset(!!initial); }
        reset(initial) {
            this.x       = Math.random() * canvas.width;
            this.y       = initial ? Math.random() * canvas.height : -14;
            this.r       = Math.random() * 10 + 5;
            this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.vx      = (Math.random() - 0.5) * 0.4;
            this.vy      = (Math.random() * 0.3 + 0.1);
            this.spin    = (Math.random() - 0.5) * 0.02;
            this.angle   = Math.random() * Math.PI * 2;
            this.life    = 0;
            this.maxLife = Math.random() * 320 + 200;
            this.twinkle = Math.random() * Math.PI * 2;
        }
        update() {
            this.x     += this.vx;
            this.y     += this.vy;
            this.angle += this.spin;
            this.life++;
            this.twinkle += 0.055;
            const lr    = this.life / this.maxLife;
            this.alpha  = (1 - lr) * (0.45 + 0.3 * Math.sin(this.twinkle));
            if (this.life >= this.maxLife || this.y > canvas.height + 14) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            drawStar(ctx, 0, 0, this.r, this.alpha, this.color);
            ctx.restore();
        }
    }

    const stars = [];
    for (let i = 0; i < 25; i++) stars.push(new Star(true));

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(loop);
    })();
}

function splitNavTitle() {
    const title = document.getElementById('navTitle');
    if (!title) return;
    const text = title.textContent.trim();
    title.textContent = '';
    [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className  = 'nav-letter';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        title.appendChild(span);
    });
}

function initLetterHover() {
    function attachHover() {
        const letters = Array.from(document.querySelectorAll('#navTitle .nav-letter'));
        if (!letters.length) return;
        letters.forEach((letter, i) => {
            letter.addEventListener('mouseenter', () => {
                document.getElementById('navTitle').classList.remove('idle-wave');
                letters.forEach(l => {
                    l.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), text-shadow 0.2s ease';
                    l.style.transform  = '';
                    l.style.animation  = 'none';
                });
                letters[i].style.transform = 'translateY(-14px) scale(1.22) rotate(-4deg)';
                if (letters[i - 1]) letters[i - 1].style.transform = 'translateY(-6px) scale(1.06) rotate(-1.5deg)';
                if (letters[i + 1]) letters[i + 1].style.transform = 'translateY(-6px) scale(1.06) rotate(1.5deg)';
                if (letters[i - 2]) letters[i - 2].style.transform = 'translateY(-2px) scale(1.02)';
                if (letters[i + 2]) letters[i + 2].style.transform = 'translateY(-2px) scale(1.02)';
            });
            letter.addEventListener('mouseleave', () => {
                letters.forEach(l => {
                    l.style.transform = '';
                    l.style.animation = '';
                });
                setTimeout(() => {
                    document.getElementById('navTitle').classList.add('idle-wave');
                }, 400);
            });
        });
    }
    setTimeout(attachHover, 50);
}

function initBtnSparkles() {
    document.querySelectorAll('.nav-links .nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const rect   = btn.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const colors = ['#ffe566','#ff9520','#ff3cbe','#ffb347','#fff5c0','#ffdd00','#ff8800'];
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 18; i++) {
                const s     = document.createElement('div');
                s.className = 'nav-sparkle';
                const angle = (i / 18) * Math.PI * 2;
                const dist  = 60 + Math.random() * 100;
                const size  = 4 + Math.random() * 8;
                s.style.cssText = [
                    'position:fixed',
                    'pointer-events:none',
                    'z-index:9999',
                    'left:' + cx + 'px',
                    'top:'  + cy + 'px',
                    'width:'  + size + 'px',
                    'height:' + size + 'px',
                    'border-radius:50%',
                    'background:' + colors[Math.floor(Math.random() * colors.length)],
                    'box-shadow: 0 0 6px ' + colors[Math.floor(Math.random() * colors.length)],
                    '--tx:' + (Math.cos(angle) * dist) + 'px',
                    '--ty:' + (Math.sin(angle) * dist) + 'px',
                    'animation:sparkleBurst 0.85s ease-out ' + (Math.random() * 0.1) + 's both'
                ].join(';');
                fragment.appendChild(s);
                s.addEventListener('animationend', () => s.remove());
            }
            document.body.appendChild(fragment);
        });
    });
}

function initNavOrbs() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const orbColors = [
        'rgba(255,180,50,0.35)',
        'rgba(255,100,200,0.3)',
        'rgba(120,50,255,0.25)',
        'rgba(255,220,80,0.4)',
        'rgba(255,60,120,0.25)',
    ];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'navbar-orb';
        const size = 80 + Math.random() * 180;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 600;
        const dy = (Math.random() - 0.5) * 400;
        const dur = 8 + Math.random() * 10;
        const delay = Math.random() * -dur;
        orb.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'background:' + orbColors[i % orbColors.length],
            'left:' + startX + '%',
            'top:' + startY + '%',
            '--dx:' + dx + 'px',
            '--dy:' + dy + 'px',
            'animation-duration:' + dur + 's',
            'animation-delay:' + delay + 's',
        ].join(';');
        fragment.appendChild(orb);
    }
    nav.appendChild(fragment);
}

function startIdleWave() {
    const title = document.getElementById('navTitle');
    if (!title) return;
    setTimeout(() => {
        title.classList.add('idle-wave');
    }, 1500);
}

function initIntroStars() {
    const container = document.getElementById('introStars');
    if (!container) return;
    const colors = ['#ffe566', '#ffb347', '#fff5c0', '#ff9fe0', '#ffffff', '#ffcc80'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
        const s = document.createElement('div');
        s.className = 'intro-star-particle';
        const size = 4 + Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 500;
        const cx = 50 + (Math.random() - 0.5) * 40;
        const cy = 45 + (Math.random() - 0.5) * 20;
        const fx = Math.cos(angle) * dist + 'px';
        const fy = Math.sin(angle) * dist + 'px';
        const dur = 1.5 + Math.random() * 1.2;
        const delay = 0.3 + Math.random() * 1.2;
        s.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'background:' + colors[Math.floor(Math.random() * colors.length)],
            'left:calc(' + cx + '% - ' + (size/2) + 'px)',
            'top:calc(' + cy + '% - ' + (size/2) + 'px)',
            '--fx:' + fx,
            '--fy:' + fy,
            'box-shadow: 0 0 8px ' + colors[Math.floor(Math.random() * colors.length)],
            'animation: introStarFly ' + dur + 's ease-out ' + delay + 's both',
        ].join(';');
        fragment.appendChild(s);
    }
    container.appendChild(fragment);
}

function setupIntroOverlay() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;
    initIntroStars();
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2900);
}

function initLogoSpin() {
    const logo = document.getElementById('logoImg');
    if (!logo) return;
    let spinning = false;
    logo.addEventListener('click', () => {
        if (spinning) return;
        spinning = true;
        logo.style.animation = 'logoSpin 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        setTimeout(() => {
            spinning = false;
            logo.style.animation = 'logoFloat 4.5s ease-in-out infinite';
        }, 750);
    });
}

// ===== PROFILE PIC CAROUSEL =====
// First image matches the src in HTML (hana1.png) so it shows immediately on load
const profilePics = [
    'imgs/profile-pic.jpg',
    'imgs/hana2.JPG',
    'imgs/hana3.JPG',
    'imgs/hana4.JPG',
    'imgs/hana5.JPG',
];
let currentProfilePic = 0;

function buildProfileDots() {
    const wrapper = document.querySelector('.profile-pic-wrapper');
    if (!wrapper) return;
    // Remove any existing dots first to avoid duplicates
    const existing = wrapper.querySelector('.profile-pic-dots');
    if (existing) existing.remove();

    const dotsEl = document.createElement('div');
    dotsEl.className = 'profile-pic-dots';
    profilePics.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'profile-pic-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToProfilePic(i));
        dotsEl.appendChild(dot);
    });
    wrapper.appendChild(dotsEl);
}

function goToProfilePic(index) {
    const img = document.getElementById('profilePic');
    if (!img) return;
    currentProfilePic = (index + profilePics.length) % profilePics.length;

    img.style.transition = 'opacity 0.22s ease';
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = profilePics[currentProfilePic];
        img.style.opacity = '1';
    }, 220);

    document.querySelectorAll('.profile-pic-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentProfilePic);
    });
}

function changeProfilePic(dir) {
    goToProfilePic(currentProfilePic + dir);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function () {

    setupIntroOverlay();

    splitNavTitle();
    initLetterHover();
    initNavParticles();
    initBtnSparkles();
    initNavOrbs();
    startIdleWave();
    initLogoSpin();

    updateShowcase();
    populateGallery();
    populateIllusProcess();

    const imgArrows = document.querySelectorAll('.illustration-showcase .nav-arrow');
    if (imgArrows.length >= 2) {
        imgArrows[0].addEventListener('click', previousImage);
        imgArrows[1].addEventListener('click', nextImage);
    }

    const illusShowcase = document.querySelector('.illustration-showcase');
    if (illusShowcase) addSwipeSupport(illusShowcase, nextImage, previousImage);

    updateVideoDisplay();

    const animPrev = document.querySelector('.anim-arrow-prev');
    const animNext = document.querySelector('.anim-arrow-next');
    if (animPrev) animPrev.addEventListener('click', previousVideo);
    if (animNext) animNext.addEventListener('click', nextVideo);

    const animShowcase = document.querySelector('.animation-showcase');
    if (animShowcase) addSwipeSupport(animShowcase, nextVideo, previousVideo);

    const animCatPrev = document.querySelector('.anim-cat-prev-btn');
    const animCatNext = document.querySelector('.anim-cat-next-btn');
    if (animCatPrev) animCatPrev.addEventListener('click', prevAnimCategory);
    if (animCatNext) animCatNext.addEventListener('click', nextAnimCategory);

    const animCatNav = document.querySelector('.anim-cat-nav');
    if (animCatNav) addSwipeSupport(animCatNav, nextAnimCategory, prevAnimCategory);

    updateFilmDisplay();
    const filmPrev = document.querySelector('.film-arrow-prev');
    const filmNext = document.querySelector('.film-arrow-next');
    if (filmPrev) filmPrev.addEventListener('click', previousFilm);
    if (filmNext) filmNext.addEventListener('click', nextFilm);

    const filmWrapper = document.querySelector('.film-video-wrapper');
    if (filmWrapper) addSwipeSupport(filmWrapper, nextFilm, previousFilm);

    makeDraggable();
    addStampHighlight();

    // ── Old stamp carousel (for any legacy elements) ──
    initStampCarousel();

    // ── Postcard stamp carousel (tablet 769–1200px) ──
    initPcStampCarousel();

    // ── Lightbox swipe on mobile ──
    const lbImgWrap = document.querySelector('.lightbox-img-wrap');
    if (lbImgWrap) addSwipeSupport(lbImgWrap, lightboxNext, lightboxPrev);

    // ── Profile pic carousel: build dots and set first image immediately ──
    buildProfileDots();
    const profileImg = document.getElementById('profilePic');
    if (profileImg) {
        profileImg.style.transition = 'none';
        profileImg.style.opacity = '1';
        profileImg.style.visibility = 'visible';
        profileImg.style.display = 'block';
        profileImg.src = profilePics[0];
        // Re-enable transition after paint so only arrow clicks animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                profileImg.style.transition = 'opacity 0.22s ease';
            });
        });
    }

    const moonImg = document.querySelector('.right-moon');
    if (moonImg) {
        if (moonImg.complete) positionElements();
        else moonImg.addEventListener('load', positionElements);
    }
    positionElements();
});

window.addEventListener('load', positionElements);
window.addEventListener('resize', debounce(positionElements, 150));

// ===== STICKY NAV ON SCROLL =====
const stickyNav = document.getElementById('stickyNav');
const mainNav = document.querySelector('.navbar');