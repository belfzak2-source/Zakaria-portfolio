const API_URL = ""; // Automatically targets Vercel /api routes

// Looped Music Pool
const audioTracks = [
    "https://curli-loxxbrilliant-salmon-vjxpiszd.edgeone.dev",
    "https://ugly-gray-isfeqawv.edgeone.dev",
    "https://big-orange-dkydoond.edgeone.dev"
];

const randomTrack = audioTracks[Math.floor(Math.random() * audioTracks.length)];
const bgMusic = new Audio(randomTrack);
bgMusic.loop = true;
bgMusic.volume = 0.2;

document.body.addEventListener('click', () => {
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}, { once: true });

const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Global data store
let allWorkItems = [];

async function loadData() {
    try {
        // Increment and get views
        const viewsRes = await fetch(`${API_URL}/api/views`, { method: 'POST' });
        const viewsData = await viewsRes.json();
        document.getElementById('views-count').innerText = viewsData.views || 0;

        // Fetch stats
        const statsRes = await fetch(`${API_URL}/api/stats`);
        const statsData = await statsRes.json();
        if (statsData) {
            document.getElementById('stat-games').innerText = statsData.gamesMade || 0;
            document.getElementById('stat-visits').innerText = statsData.visitCount || 0;
            document.getElementById('stat-experience').innerText = statsData.experienceYears || 0;
        }

        // Fetch portfolio items
        const workRes = await fetch(`${API_URL}/api/work`);
        allWorkItems = await workRes.json();
        renderWorkItems(allWorkItems);

        // Fetch payment details
        const payRes = await fetch(`${API_URL}/api/payment`);
        const payData = await payRes.json();
        if (payData) {
            if (payData.paypal) document.getElementById('pay-paypal').innerText = payData.paypal;
            if (payData.robux) document.getElementById('pay-robux').innerText = payData.robux;
            if (payData.bank) document.getElementById('pay-bank').innerText = payData.bank;
        }
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function renderWorkItems(items) {
    const commGrid = document.getElementById('commissions-grid');
    const gamesGrid = document.getElementById('games-grid');
    commGrid.innerHTML = '';
    gamesGrid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.onclick = () => openModal(item);

        card.innerHTML = `
            <img src="${item.thumbnailUrl || 'https://via.placeholder.com/300x180'}" class="card-thumb" alt="${item.title}">
            <div class="card-body">
                <div class="card-title">${item.title}</div>
                <span class="card-role">${item.role || item.category}</span>
            </div>
        `;

        if (item.category === 'game') {
            gamesGrid.appendChild(card);
        } else {
            commGrid.appendChild(card);
        }
    });
}

function filterCategory(category) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('back-btn').classList.remove('hidden');

    if (category === 'all') {
        renderWorkItems(allWorkItems);
    } else {
        const filtered = allWorkItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
        renderWorkItems(filtered);
    }
}

function resetWorkView() {
    document.getElementById('back-btn').classList.add('hidden');
    filterCategory('all');
}

function openModal(item) {
    const modal = document.getElementById('item-modal');
    const video = document.getElementById('modal-video');
    const img = document.getElementById('modal-image');
    const gameLink = document.getElementById('modal-game-link');

    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-description').innerText = item.description || '';
    document.getElementById('modal-role').innerText = item.role || item.category;

    if (item.videoUrl) {
        video.src = item.videoUrl;
        video.classList.remove('hidden');
        img.classList.add('hidden');
    } else {
        img.src = item.thumbnailUrl;
        img.classList.remove('hidden');
        video.classList.add('hidden');
    }

    if (item.gameLink) {
        gameLink.href = item.gameLink;
        gameLink.classList.remove('hidden');
    } else {
        gameLink.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('item-modal').classList.add('hidden');
    document.getElementById('modal-video').pause();
}

// GSAP Animations
gsap.from(".title", { duration: 1.2, y: -40, opacity: 0, ease: "power3.out" });
gsap.from(".subtitle", { duration: 1.2, opacity: 0, delay: 0.3 });
gsap.from(".hero-buttons", { duration: 1, opacity: 0, delay: 0.6 });

loadData();
