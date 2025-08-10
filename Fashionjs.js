// ==== script.js ====

// ================== Image Slider Setup ==================
const images = [
  "images/FBG.jpg",
  "images/FBG 11.png",
  "images/FBG 2.png",
  "images/FBG 3.png"
];
let currentImage = 0;

function showImage(index) {
  const hero = document.getElementById("hero-section");
  const content = document.getElementById("hero-content");

  if (index >= images.length) index = 0;
  if (index < 0) index = images.length - 1;

  currentImage = index;
  hero.style.backgroundImage = `url('${images[currentImage]}')`;

  // Show content only on first image
  if (images[currentImage] === "images/FBG.jpg") {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showImage(0);
  setupAddToCart();
  updateUserNavbar();
});

function nextImage() {
  showImage(currentImage + 1);
}

function prevImage() {
  showImage(currentImage - 1);
}

// ================== Product Modal ==================
function openProductModal(name, price, description, imageSrc) {
  document.getElementById("modal-name").innerText = name;
  document.getElementById("modal-price").innerText = price;
  document.getElementById("modal-description").innerText = description;
  document.getElementById("modal-image").src = imageSrc;
  document.getElementById("product-modal").style.display = "flex";
}

function closeProductModal() {
  document.getElementById("product-modal").style.display = "none";
}

// ================== User Auth ==================
function updateUserNavbar() {
  const user = JSON.parse(localStorage.getItem("auraUser"));
  const userSection = document.getElementById("user-section");

  if (user && user.name) {
    userSection.innerHTML = `
      <span>Hi, ${user.name.split(" ")[0]}</span> |
      <a href="#" onclick="logoutUser()">Logout</a>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem("auraUser");
  location.reload();
}

function switchTab(type) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");

  if (type === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
  }
}

function openModal(type) {
  document.getElementById("auth-modal").style.display = "flex";
  switchTab(type);
}

function closeModal() {
  document.getElementById("auth-modal").style.display = "none";
}

// ================== Cart Logic ==================
function saveCartToDB() {
  const user = JSON.parse(localStorage.getItem("auraUser"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!user || !user.email) return;

  fetch("http://localhost:5000/api/cart/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail: user.email,
      items: cart,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("✅ Cart saved to DB:", data))
    .catch((err) => console.error("❌ Error saving cart:", err));
}

function setupAddToCart() {
  const addToCartButtons = document.querySelectorAll(".product-card .button");

  addToCartButtons.forEach((btn) => {
    // ✅ Remove existing event listener using a flag (prevents duplicate firing)
    if (!btn.classList.contains("bound")) {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        if (!card) return;

        const product = {
          name: card.querySelector("h3").innerText.trim(),
          price: card.querySelector("p.price").innerText.trim(),
          img: card.querySelector("img").src,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // ✅ Prevent exact duplicate item (based on name)
        const alreadyInCart = cart.find((item) => item.name === product.name);
        if (alreadyInCart) {
          alert("This item is already in your cart!");
          return;
        }

        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        saveCartToDB();
        alert(`${product.name} added to cart!`);
      });

      // ✅ Mark as bound so it doesn't double-bind later
      btn.classList.add("bound");
    }
  });
}

// ================== Auth Form Submit ==================
document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
  const email = this.querySelector('input[placeholder="Email"]').value.trim();
  const pass = this.querySelector('input[placeholder="Password"]').value;
  const confirm = this.querySelector('input[placeholder="Confirm Password"]').value;

  if (pass !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  const userData = { name, email, password: pass };
  localStorage.setItem("auraUser", JSON.stringify(userData));
  updateUserNavbar();
  closeModal();
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.querySelector('input[placeholder="Email"]').value.trim();
  const pass = this.querySelector('input[placeholder="Password"]').value;

  const user = JSON.parse(localStorage.getItem("auraUser"));

  if (!user || user.email !== email || user.password !== pass) {
    alert("Invalid email or password");
    return;
  }

  updateUserNavbar();
  closeModal();
});
