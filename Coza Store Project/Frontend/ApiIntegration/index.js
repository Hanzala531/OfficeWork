      const apiBaseUrl = "http://localhost:3000/api/v1"; // Replace with your backend API base URL

      // Side Menu Functionality
      const sideMenu = document.getElementById("side-menu");
      const closeMenuButton = document.getElementById("close-menu");
      const overlay = document.getElementById("overlay");
      const profileButton = document.getElementById("profile-button");

      // Function to open the side menu
      function openMenu() {
        sideMenu.classList.add("active");
        overlay.classList.add("active");
      }

      // Function to close the side menu
      function closeMenu() {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
      }

      // Open the side menu when the profile button is clicked
      profileButton.addEventListener("click", openMenu);

      // Close the side menu when the close button is clicked
      closeMenuButton.addEventListener("click", closeMenu);

      // Close the side menu when clicking outside
      overlay.addEventListener("click", closeMenu);

      // Update the navigation bar based on the user's login status
      document.addEventListener("DOMContentLoaded", function () {
        const isLoggedIn = localStorage.getItem("accessToken");

        if (isLoggedIn) {
          // Hide Login Button and Show Profile Button
          document.getElementById("login-button").style.display = "none";
          profileButton.style.display = "block";
        }

        // Adding admin privileges
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin === "true") {
          const dashboard = document.getElementById("Dashboard");
          dashboard.addEventListener("click", () => {
            window.location.href = "./ApiIntegration/adminPannel.html";
          });

          document
            .getElementById("logout")
            .addEventListener("click", async () => {
              try {
                const token = localStorage.getItem("accessToken");
                if (!token)
                  throw new Error("No access token found. Please login.");

                const response = await fetch(
                  "http://localhost:3000/api/v1/users/logout",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                    errorData.message ||
                      `HTTP error! Status: ${response.status}`
                  );
                }

                console.log("Logout successful");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("isAdmin");
                window.location.href = "./ApiIntegration/login.html";
              } catch (error) {
                console.error("Logout error:", error);
                console.log("Logout failed: " + error.message);
              }
            });
        }
      });

      // Cart Popup Functionality
      // Function to toggle the cart popup
      function toggleCart() {
        const cartPopup = document.querySelector(".cart-popup");
        const cartOverlay = document.querySelector(".cart-overlay");
        cartPopup.classList.toggle("open");
        cartOverlay.classList.toggle("open");

        // Refresh the cart whenever it is opened
        if (cartPopup.classList.contains("open")) {
          fetchCart();
        }
      }

      // Close cart popup when clicking outside
      document
        .querySelector(".cart-overlay")
        .addEventListener("click", toggleCart);

      // Fetch and display the cart when the page loads
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
                <div class="quantity-controls">
                  <button onclick="updateQuantity('${item.productId._id}', ${
              item.quantity - 1
            })">-</button>
                  <input
                    type="number"
                    id="quantity-${item.productId._id}"
                    value="${item.quantity}"
                    min="1"
                    readonly
                  />
                  <button onclick="updateQuantity('${item.productId._id}', ${
              item.quantity + 1
            })">+</button>
                </div>
              </div>
              <button id="removeButton" onclick="removeFromCart('${
                item.productId._id
              }')">Remove</button>
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
      async function checkout() {
        try {
          const accessToken = localStorage.getItem("accessToken");
      
          if (!accessToken) {
            alert("Please log in to proceed with checkout.");
            window.location.href = "/login";
            return;
          }
      
          // Fetch the user's cart
          const cartResponse = await fetch(`${apiBaseUrl}/cart`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          const cartData = await cartResponse.json();
      
          if (!cartData.success || cartData.data.products.length === 0) {
            alert("Your cart is empty. Add items to proceed with checkout.");
            return;
          }
      
          // Check if stock is available for each product
          for (const item of cartData.data.products) {
            if (item.quantity > item.productId.stock) {
              alert(`Not enough stock available for ${item.productId.name}.`);
              return;
            }
          }
      
          // Create an order
          const orderResponse = await fetch(`${apiBaseUrl}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId: cartData.data.userId, // Assuming the cart response includes userId
            }),
          });
      
          const orderData = await orderResponse.json();
      
          if (orderData.success) {
            alert("Order created successfully!");
            fetchCart(); // Refresh the cart to show it's empty
          } else {
            alert("Failed to create order. Please try again.");
          }
        } catch (error) {
          console.error("Error during checkout:", error);
          alert("An error occurred during checkout. Please try again.");
        }
      }
      
      // Fetch and display the cart when the page loads
      fetchCart();