document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("auraUser"));
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!user || !user.email) {
    cartContainer.innerHTML = "<p>Please log in to view your cart.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cart?userEmail=${user.email}`);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
// cart total logic 
    function parsePrice(priceStr) {
  return parseFloat(priceStr.replace(/[^\d.]/g, "")) || 0;
}

let total = 0;

data.items.forEach((item, index) => {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.innerHTML = `
    <img src="${item.img}" width="100" />
    <h3>${item.name}</h3>
    <p>${item.price}</p>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  cartContainer.appendChild(div);

  // ✅ Safely parse the price
  total += parsePrice(item.price);
});

// ✅ Display the total price
totalElement.innerText = `Total: ₹${total.toFixed(2)}`;

    // 🔁 Remove button logic
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        data.items.splice(index, 1); // Remove 1 item at index

        // Save updated cart back to MongoDB
        await fetch("http://localhost:5000/api/cart/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email, items: data.items }),
        });

        location.reload(); // Refresh cart view
      });
    });
  } catch (err) {
    cartContainer.innerHTML = "<p>Failed to load cart. Please try again later.</p>";
    console.error("Cart fetch error:", err);
  }
});
function clearCart() {
  localStorage.removeItem("cart"); // ✅ Clear local
  const user = JSON.parse(localStorage.getItem("auraUser"));

  if (!user || !user.email) return;

  fetch(`http://localhost:5000/api/cart/clear?userEmail=${user.email}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Cart cleared:", data);
      location.reload();
    })
    .catch((err) => {
      console.error("❌ Error clearing cart:", err);
    });
}


