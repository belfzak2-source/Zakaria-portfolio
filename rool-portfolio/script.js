// 1. PASTE YOUR RENDER URL HERE (Replace the URL inside the quotes)
const API_URL = "https://rool-api.onrender.com"; 

// Audio tracks setup
const audioTracks = [
    "https://curli-loxxbrilliant-salmon-vjxpiszd.edgeone.dev",
    "https://ugly-gray-isfeqawv.edgeone.dev", // Dusty Decks
    "https://big-orange-dkydoond.edgeone.dev" // Timothy Infinite
];

// Pick a random track
const randomTrack = audioTracks[Math.floor(Math.random() * audioTracks.length)];
const bgMusic = new Audio(randomTrack);
bgMusic.loop = true;
bgMusic.volume = 0.2; // Keep it low

// Play on first interaction
document.body.addEventListener('click', () => {
    if (bgMusic.paused) bgMusic.play();
}, { once: true });

// Volume Slider Logic
const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });
}

// Smooth Scroll Function
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Initial Entry Animation using GSAP
gsap.from(".title", { duration: 1.5, y: -50, opacity: 0, ease: "bounce" });
gsap.from(".subtitle", { duration: 1.5, opacity: 0, delay: 0.5 });
gsap.from(".hero-buttons", { duration: 1, opacity: 0, delay: 1 });

// Fetch portfolio items from your Render backend
async function fetchPortfolioWork() {
    try {
        const response = await fetch(`${API_URL}/api/work`);
        const data = await response.json();
        console.log("Loaded portfolio items from backend:", data);
    } catch (err) {
        console.error("Failed to load portfolio items:", err);
    }
}

fetchPortfolioWork();