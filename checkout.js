document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("auraUser"));
  const cartContainer = document.getElementById("checkout-cart");

  if (!user || !user.email) {
    cartContainer.innerHTML = "<p>Please log in to view your cart.</p>";
    return;
  }

  fetch(`http://localhost:5000/api/cart/get?userEmail=${user.email}`)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }

      let subtotal = 0;
      cartContainer.innerHTML = ""; // Clear any existing message

      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <img src="${item.img}" width="100" />
          <h3>${item.name}</h3>
          <p>${item.price}</p>
        `;
        cartContainer.appendChild(div);

        subtotal += parsePrice(item.price);
      });

      // Calculate breakdown
      const discount = subtotal > 1000 ? 0.1 * subtotal : 0;
      const gst = 0.18 * (subtotal - discount);
      const delivery = subtotal > 1000 ? 0 : 50;
      const grandTotal = subtotal - discount + gst + delivery;

      // Update existing HTML spans
      document.getElementById("subtotal-amt").innerText = subtotal.toFixed(2);
      document.getElementById("discount-amt").innerText = discount.toFixed(2);
      document.getElementById("gst-amt").innerText = gst.toFixed(2);
      document.getElementById("delivery-amt").innerText = delivery.toFixed(2);
      document.getElementById("grand-total").innerText = grandTotal.toFixed(2);
    })
    .catch(err => {
      console.error("❌ Failed to load cart:", err);
      cartContainer.innerHTML = "<p>Error loading cart. Please try again.</p>";
    });
});

function parsePrice(priceStr) {
  return parseFloat(priceStr.replace(/[^\d.]/g, "")) || 0;
}

// Form submission
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector("input[placeholder='Full Name']").value.trim();
  const phone = this.querySelector("input[placeholder='Phone Number']").value.trim();
  const address = this.querySelector("textarea").value.trim();
  const user = JSON.parse(localStorage.getItem("auraUser"));

  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail: user.email,
      name,
      phone,
      address,
    }),
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Order placed successfully!");
      window.location.href = "Fashion.html";
    })
    .catch(err => {
      console.error("❌ Order failed:", err);
      alert("Something went wrong.");
    });
});
