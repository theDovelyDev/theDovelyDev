//Hamburger Menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

//Visitor Counter
const functionUrl = "https://ligzkttonselfrpj5d3266qb7a0imnhp.lambda-url.us-east-1.on.aws/";

// Log helper
const logError = (msg, err) => {
    console.error(msg, err);
    document.getElementById("visitor_counter").innerText = "Unavailable";
};

// 1. Increment visitor count (POST)
fetch(functionUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    mode: "cors"
}).catch(err => logError("POST failed", err));

// 2. Fetch current visitor count (GET)
fetch(functionUrl, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    },
    mode: "cors"
})
    .then(response => {
        if (!response.ok) throw new Error("Response not OK");
        return response.json();
    })
    .then(data => {
        if (data.visitorCount !== undefined) {
            document.getElementById("visitor_counter").innerText = data.visitorCount;
        } else {
            throw new Error("Missing visitorCount in response");
        }
    })
    .catch(err => logError("GET failed", err));

//Project Slider Dots
const sliderTrack = document.querySelector('.slider-track');
const tiles = document.querySelectorAll('.project-tile');
const dotsContainer = document.querySelector('.dots');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

// Create dots
tiles.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => moveToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('span');
dots[0].classList.add('active');

function moveToSlide(index) {
    currentIndex = index;
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Arrow navigation
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % tiles.length;
    moveToSlide(currentIndex);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + tiles.length) % tiles.length;
    moveToSlide(currentIndex);
});

// Optional: Auto-slide
setInterval(() => {
    currentIndex = (currentIndex + 1) % tiles.length;
    moveToSlide(currentIndex);
}, 8000);