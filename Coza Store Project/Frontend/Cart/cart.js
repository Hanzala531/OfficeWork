// Global cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add product to cart and update UI
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  openCartModal();
}
// Expose addToCart globally
window.addToCart = addToCart;

// Function to open the cart modal interface
function openCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.add("open");
  } else {
    console.error("cartModal element not found");
  }
}

// Function to close the cart modal
function closeCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.remove("open");
  }
}

// Function to update the cart UI and total
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) {
    console.error("cartItems element not found");
    return;
  }
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItemsContainer.innerHTML += `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" width="50" />
        <span>${item.name}</span>
        <span>Qty: ${item.quantity}</span>
        <span>$${item.price}</span>
        <button class="remove-item" data-product-id="${item.id}">Remove</button>
      </div>
    `;
  });
  const cartTotal = document.getElementById("cartTotal");
  if (cartTotal) {
    cartTotal.textContent = "Total: $" + total.toFixed(2);
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id != productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Event delegation for remove buttons in the cart
document.addEventListener("click", function(event) {
  if (event.target.matches(".remove-item")) {
    const productId = event.target.getAttribute("data-product-id");
    removeFromCart(productId);
  }
});

// Setup event listeners after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  // Setup cart SVG icon event listener to open modal
  const cartIcon = document.getElementById("cartSvg");
  if (cartIcon) {
    cartIcon.addEventListener("click", openCartModal);
  } else {
    console.error("Cart SVG icon not found");
  }
  // Setup modal close button event listener (assumed id "cartClose")
  const closeButton = document.getElementById("cartClose");
  if (closeButton) {
    closeButton.addEventListener("click", closeCartModal);
  }
});

