document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:3000/api/v1/products";
  fetchProducts(url);
});

// Counter for controlling the number of cards in the product list
let counter = {
  bestSelling: 0,
  Men: 0,
  Women: 0,
  Children: 0,
  Accessories: 0,
};

// Function to fetch the products from the API
const fetchProducts = async (url) => {
  try {
    const response = await fetch(url);
    const products = await response.json();

    // Check if the response is successful and data exists
    if (products.success && products.data) {
      products.data.forEach((product) => {
        // Display the product in the bestSellingProducts section
        if (
          product.category.name === "Best Selling" &&
          counter.bestSelling < 3
        ) {
          const bestSellingProducts = document.getElementById(
            "bestSellingProducts"
          );
          bestSellingProducts.innerHTML += `
            <div class="product">
              <img src="${product.coverImage}" alt="product image" />
              <h3>${product.name}</h3>
              <div id="details">
                <p class="price">$${product.price}</p>
                <button class="AddButton" data-productid="${product._id}">Add to Cart</button>
              </div>
            </div>
          `;
          counter.bestSelling++;
        }

        // Repeat for other categories (Men, Women, Children, Accessories)
        if (product.category.name === "Men" && counter.Men < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
            <div class="product">
              <img src="${product.coverImage}" alt="product image" />
              <h3>${product.name}</h3>
              <div id="details">
                <p class="price">$${product.price}</p>
                <button class="AddButton" data-productid="${product._id}">Add to Cart</button>
              </div>
            </div>
          `;
          counter.Men++;
        }

        if (product.category.name === "Women" && counter.Women < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
            <div class="product">
              <img src="${product.coverImage}" alt="product image" />
              <h3>${product.name}</h3>
              <div id="details">
                <p class="price">$${product.price}</p>
                <button class="AddButton" data-productid="${product._id}">Add to Cart</button>
              </div>
            </div>
          `;
          counter.Women++;
        }

        if (product.category.name === "Children" && counter.Children < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
            <div class="product">
              <img src="${product.coverImage}" alt="product image" />
              <h3>${product.name}</h3>
              <div id="details">
                <p class="price">$${product.price}</p>
                <button class="AddButton" data-productid="${product._id}">Add to Cart</button>
              </div>
            </div>
          `;
          counter.Children++;
        }

        if (product.category.name === "Accessories" && counter.Accessories < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
            <div class="product">
              <img src="${product.coverImage}" alt="product image" />
              <h3>${product.name}</h3>
              <div id="details">
                <p class="price">$${product.price}</p>
                <button class="AddButton" data-productid="${product._id}">Add to Cart</button>
              </div>
            </div>
          `;
          counter.Accessories++;
        }
      });

      // Add event listeners for "Add to Cart" buttons after rendering products
      addCartEventListeners();
    } else {
      console.error(
        "Error fetching products:",
        products.message || "Unknown error"
      );
      const bestSellingProducts = document.getElementById(
        "bestSellingProducts"
      );
      bestSellingProducts.innerHTML = "<p>Error loading products.</p>";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    const bestSellingProducts = document.getElementById("bestSellingProducts");
    bestSellingProducts.innerHTML = "<p>Error loading products.</p>";
  }
};

// Function to add a product to the cart
const addToCart = async (productId, quantity) => {
  console.log("Asdasdasd",productId, quantity);
  
  try {
    const response = await fetch("http://localhost:3000/api/v1/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the user's token for authentication
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    
    console.log("daaata",data);
    
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Function to add event listeners to "Add to Cart" buttons
const addCartEventListeners = () => {
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("AddButton")) {
      const productId = e.target.dataset.productid;
      console.log(productId);
      
      const quantity = 1; // Default quantity (you can allow users to change this)

      try {
        // Call the backend API to add the product to the cart
        const response = await addToCart(productId, quantity);

        if (response.success) {
          alert("Product added to cart!"); // Show a success message
          // Optionally, update the cart UI or counter
        } else {
          alert("Failed to add product to cart."); // Show an error message
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred. Please try again."); // Show an error message
      }
    }
  });
};