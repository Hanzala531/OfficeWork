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
    }">Add to Cart</button> </div>
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
