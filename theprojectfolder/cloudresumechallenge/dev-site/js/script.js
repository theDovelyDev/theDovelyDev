//Hamburger Menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

//Slider
const grid = document.querySelector('.projects-grid');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

let scrollAmount = 0;
const cardWidth = grid.querySelector('.project-card').offsetWidth + 16;

// Scroll right
nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
});

// Scroll left
prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
});

// Enable dragging on mobile
let isDown = false;
let startX;
let scrollLeft;

grid.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
});

grid.addEventListener('mouseleave', () => (isDown = false));
grid.addEventListener('mouseup', () => (isDown = false));

grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 2;
    grid.scrollLeft = scrollLeft - walk;
});


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

document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target

                    document.addEventListener("DOMContentLoaded", function () {
                        const observerOptions = { threshold: 0.1 };

                        const observer = new IntersectionObserver((entries, observer) => {
                            entries.forEach((entry, index) => {
                                if (entry.isIntersecting) {
                                    // Add visible class to icon immediately
                                    entry.target.classList.add('visible');

                                    // If the target is a cert-wrapper, fade in the name slightly after
                                    const certName = entry.target.querySelector('.cert-name');
                                    if (certName) {
                                        setTimeout(() => {
                                            certName.classList.add('visible');
                                        }, 150); // delay in ms for name
                                    }

                                    observer.unobserve(entry.target);
                                }
                            });
                        }, observerOptions);

                        // About Me section cards, icons, and cert wrappers
                        const aboutElements = document.querySelectorAll(
                            '.about-details-container, .icon-circle, .cert-wrapper'
                        );
                        aboutElements.forEach(el => observer.observe(el));

                        // Experience section cards and icons
                        const experienceElements = document.querySelectorAll(
                            '.details-container, .details-container .icon-circle'
                        );
                        experienceElements.forEach(el => observer.observe(el));
                    });
