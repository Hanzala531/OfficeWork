document.addEventListener("DOMContentLoaded", () => {
  const url = "http://localhost:3000/api/v1/products";
  fetchProducts(url); // Initial fetch of all products

  const categoryLinks = document.querySelectorAll(".category-link");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const category = link.getAttribute("data");
      filterProducts(category);
    });
  });

  // Event delegation for Add to Cart buttons
  document.querySelector("#product-list").addEventListener("click", (event) => {
    if (event.target.classList.contains("AddButton")) {
      const productId = event.target.getAttribute("data-product-id");
      addToCart(productId);
    }
  });
});

async function fetchProducts(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

let allProducts = []; // Store all fetched products

fetchProducts("http://localhost:3000/api/v1/products")
  .then((products) => {
    allProducts = products.data; // Store all products
    displayProducts(allProducts); // Display all products initially
  })
  .catch((err) => {
    console.error("Error in .catch:", err);
  });

function displayProducts(productsToDisplay) {
  const productContainer = document.querySelector("#product-list");
  if (!productContainer) {
    console.error("Product container element not found!");
    return;
  }
  productContainer.innerHTML = ""; // Clear previous products

  if (productsToDisplay.length === 0) {
    productContainer.innerHTML = "<p>No products found in this category.</p>";
    return;
  }

  productsToDisplay.forEach((product) => {
    productContainer.innerHTML += `
        <div class="product">
            <img src="${product.coverImage}" alt="${
      product.name || "Product Image"
    }" class="product-image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${
                product.id
              }">Add to Cart</button>
            </div>
        </div>`;
  });
}

function filterProducts(category) {
  let filteredProducts = [];
  if (category === "ALL") {
    filteredProducts = allProducts;
  } else {
    filteredProducts = allProducts.filter(
      (product) => product.category.name === category
    ); // Assuming your API has a 'category' field
  }
  displayProducts(filteredProducts);
}

async function addToCart(productId) {
  try {
    const cartItem = {
      productId: productId,
      quantity: 1, // Default quantity
    };

    const response = await fetch("http://localhost:3000/api/v1/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Product added to cart:", result);
    // Optionally, provide user feedback (e.g., a message or update cart display)
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Optionally, handle error display to user
  }
}
