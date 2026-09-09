const API_URL = ""; 

// Tracks specified in the document
const audioTracks = [
    "https://videotourl.com/audio/1788966590049-a2ac9e4d-1a4d-469f-b9a0-c6a873dfa743.mp3",
    "https://videotourl.com/audio/1788977518911-95c68b5c-35e2-4c8a-8390-d965ea3083fa.mp3",
    "https://videotourl.com/audio/1788977556485-4320f3b0-f87c-4791-8510-ab78e8fc22e9.mp3"
];

// Pick a random starting index
let currentTrackIndex = Math.floor(Math.random() * audioTracks.length);

const bgMusic = new Audio(audioTracks[currentTrackIndex]);
bgMusic.loop = false; // Disable single track loop to allow playlist progression
bgMusic.volume = 0.15; // Lower initial volume

// Function to advance and play the next track in sequence
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    bgMusic.src = audioTracks[currentTrackIndex];
    bgMusic.play().catch(() => {});
}

// Play next track automatically when current track ends
bgMusic.addEventListener('ended', playNextTrack);

let audioStarted = false;
function startAudio() {
    if (!audioStarted) {
        bgMusic.play().then(() => {
            audioStarted = true;
        }).catch(() => {});
    }
}
document.addEventListener('click', startAudio, { once: true });
document.addEventListener('keydown', startAudio, { once: true });

// Volume slider handler
const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });
}

// Secret Admin Access via Shift + A
let adminAuthToken = "";

document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toUpperCase() === 'A') {
        const pass = prompt("Enter Admin Password:"); // Password: zak56belf
        if (pass === "zak56belf") {
            adminAuthToken = pass;
            alert("Admin Access Granted.");
            openAdminModal();
        } else if (pass !== null) {
            alert("Incorrect Admin Password.");
        }
    }
});

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`admin-tab-${tab}`).classList.remove('hidden');
}

// Smooth scroll helper
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

let allWorkItems = [];

// Load data & increment view count atomically
async function loadData() {
    try {
        const viewsRes = await fetch(`${API_URL}/api/views`, { method: 'POST' });
        const viewsData = await viewsRes.json();
        document.getElementById('views-count').innerText = viewsData.views || 1;

        const statsRes = await fetch(`${API_URL}/api/stats`);
        const statsData = await statsRes.json();
        if (statsData) {
            document.getElementById('stat-games').innerText = statsData.gamesMade || '0';
            document.getElementById('stat-visits').innerText = statsData.visitCount || '0';
            document.getElementById('stat-experience').innerText = statsData.experienceYears || '0';
        }

        const workRes = await fetch(`${API_URL}/api/work`);
        allWorkItems = await workRes.json();
        if (Array.isArray(allWorkItems)) {
            renderWorkItems(allWorkItems);
        }

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

// Category Filtering
function filterCategory(category, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

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
    filterCategory('all', document.querySelector('.tab-btn'));
}

// Roblox style game modal popup
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

// Admin Submissions
async function submitAdminStats() {
    const res = await fetch(`${API_URL}/api/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: adminAuthToken,
            gamesMade: document.getElementById('adm-gamesMade').value,
            visitCount: document.getElementById('adm-visitCount').value,
            experienceYears: document.getElementById('adm-experienceYears').value
        })
    });
    if (res.ok) alert("Stats Updated!");
}

async function submitAdminWork() {
    const res = await fetch(`${API_URL}/api/work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: adminAuthToken,
            title: document.getElementById('adm-title').value,
            category: document.getElementById('adm-category').value,
            role: document.getElementById('adm-role').value,
            thumbnailUrl: document.getElementById('adm-thumbnailUrl').value,
            videoUrl: document.getElementById('adm-videoUrl').value,
            gameLink: document.getElementById('adm-gameLink').value,
            description: document.getElementById('adm-description').value
        })
    });
    if (res.ok) {
        alert("Published Successfully!");
        loadData();
    }
}

async function submitAdminPayment() {
    const res = await fetch(`${API_URL}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: adminAuthToken,
            paypal: document.getElementById('adm-paypal').value,
            robux: document.getElementById('adm-robux').value,
            bank: document.getElementById('adm-bank').value
        })
    });
    if (res.ok) alert("Payment Details Updated!");
}

// GSAP Entrance Animations
gsap.from(".title", { duration: 1.2, y: -40, opacity: 0, ease: "power3.out" });
gsap.from(".subtitle", { duration: 1.2, opacity: 0, delay: 0.3 });
gsap.from(".hero-buttons", { duration: 1, opacity: 0, delay: 0.6 });

loadData();
