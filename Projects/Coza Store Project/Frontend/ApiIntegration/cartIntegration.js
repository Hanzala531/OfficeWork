const apiBaseUrl = "http://localhost:3000/api/v1"; // Replace with your backend API base URL

// Toggle cart popup
function toggleCart() {
  const cartPopup = document.querySelector(".cart-popup");
  const cartOverlay = document.querySelector(".cart-overlay");
  cartPopup.classList.toggle("open");
  cartOverlay.classList.toggle("open");
}

// Fetch and display the cart
async function fetchCart() {
  try {
    const response = await fetch(`${apiBaseUrl}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();

    if (data.success) {
      renderCart(data.data);
    } else {
      console.error("Failed to fetch cart:", data.message);
      alert("Failed to fetch cart. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    alert("An error occurred while fetching the cart. Please try again.");
  }
}

// Render the cart items
function renderCart(cart) {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  // Clear the cart items container
  cartItemsContainer.innerHTML = "";

  if (cart.products.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalElement.textContent = "0";
    return;
  }

  // Render each cart item
  cart.products.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    if (item.productId && item.productId.name && item.productId.price) {
      cartItem.innerHTML = `
        <div>
          <h3>${item.productId.name}</h3>
          <p>Price: $${item.productId.price}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="updateQuantity('${item.productId._id}', ${item.quantity - 1})">-</button>
          <input
            type="number"
            id="quantity-${item.productId._id}"
            value="${item.quantity}"
            min="1"
            readonly
          />
          <button onclick="updateQuantity('${item.productId._id}', ${item.quantity + 1})">+</button>
        </div>
        <button onclick="removeFromCart('${item.productId._id}')">Remove</button>
      `;
    }

    cartItemsContainer.appendChild(cartItem);
  });

  // Update the total price
  cartTotalElement.textContent = cart.total.toFixed(2);
}

// Update the quantity of a product in the cart
async function updateQuantity(productId, newQuantity) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please log in to update the quantity.");
      window.location.href = "/login";
      return;
    }

    if (newQuantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }

    const response = await fetch(`${apiBaseUrl}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ productId, quantity: newQuantity }),
    });

    const data = await response.json();

    if (data.success) {
      fetchCart(); // Refresh the cart
    } else {
      alert("Failed to update quantity.");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("An error occurred. Please try again.");
  }
}

// Remove a product from the cart
async function removeFromCart(productId) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please log in to remove items from your cart.");
      window.location.href = "/login";
      return;
    }

    const response = await fetch(`${apiBaseUrl}/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Product removed from cart!");
      fetchCart(); // Refresh the cart
    } else {
      alert("Failed to remove product from cart.");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    alert("An error occurred. Please try again.");
  }
}

// Clear the entire cart
async function clearCart() {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please log in to clear your cart.");
      window.location.href = "/login";
      return;
    }

    const response = await fetch(`${apiBaseUrl}/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      alert("Cart cleared successfully!");
      fetchCart(); // Refresh the cart
    } else {
      alert("Failed to clear cart.");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("An error occurred. Please try again.");
  }
}

// Checkout (placeholder function)
function checkout() {
  alert("Checkout functionality is not implemented yet.");
}

// Fetch and display the cart when the page loads
fetchCart();
