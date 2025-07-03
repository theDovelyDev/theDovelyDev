function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}


// Visitor Counter
const counterElement = document.getElementById("visitor_counter");

function updateCounter() {
    fetch("https://ligzkttonselfrpj5d3266qb7a0imnhp.lambda-url.us-east-1.on.aws/", { method: "POST" })
        .then(() => fetch("https://ligzkttonselfrpj5d3266qb7a0imnhp.lambda-url.us-east-1.on.aws/", { method: "GET" }))
        .then(response => response.json())
        .then(data => {
            counterElement.innerText = data.visitCount;
        })
        .catch(() => {
            counterElement.innerText = "Unavailable";
        });
}

updateCounter();
