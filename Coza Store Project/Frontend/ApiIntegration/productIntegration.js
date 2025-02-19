document.addEventListener("DOMContentLoaded", function () {
  const bestSellingProducts =
    document.getElementById("bestSellingProducts");
  const allProductsList = document.getElementById("product-list");
  const categoryFilter = document.getElementById("category-filter");

  let productArray = [];

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/products"
      );
      const products = await response.json();

      if (products.success && products.data) {
        productArray = products.data; // Assign the fetched data directly
        renderProducts(productArray); // Initial render
      } else {
        console.error(
          "Error fetching products:",
          products.message || "Unknown error"
        );
        bestSellingProducts.innerHTML = "<p>Error loading products.</p>";
        allProductsList.innerHTML = "<p>Error loading products.</p>";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      bestSellingProducts.innerHTML = "<p>Error loading products.</p>";
      allProductsList.innerHTML = "<p>Error loading products.</p>";
    }
  };

  const renderProducts = (productsToRender) => {
    bestSellingProducts.innerHTML = ""; // Clear existing content
    allProductsList.innerHTML = ""; // Clear existing content

    let bestSellingCounter = 0;
    let menCounter = 0;
    let womenCounter = 0;
    let childrenCounter = 0;
    let accessoriesCounter = 0;

    productsToRender.forEach((product) => {
      if (product.category.name === "Best Selling" && bestSellingCounter < 3) {
        bestSellingProducts.innerHTML += `
          <div class="product">
            <img src="${product.coverImage}" alt="product image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `;
        bestSellingCounter++;
      }

      if (product.category.name === "Men" && menCounter < 2) {
        allProductsList.innerHTML += `
          <div class="product">
            <img src="${product.coverImage}" alt="product image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `;
        menCounter++;
      }

      if (product.category.name === "Women" && womenCounter < 2) {
        allProductsList.innerHTML += `
          <div class="product">
            <img src="${product.coverImage}" alt="product image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `;
        womenCounter++;
      }

      if (product.category.name === "Children" && childrenCounter < 2) {
        allProductsList.innerHTML += `
          <div class="product">
            <img src="${product.coverImage}" alt="product image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `;
        childrenCounter++;
      }

      if (product.category.name === "Accessories" && accessoriesCounter < 2) {
        allProductsList.innerHTML += `
          <div class="product">
            <img src="${product.coverImage}" alt="product image" />
            <h3>${product.name}</h3>
            <div id="details">
              <p class="price">$${product.price}</p>
              <button class="AddButton" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `;
        accessoriesCounter++;
      }
    });
  };

  // categoryFilter.addEventListener("change", (e) => {
  //   const selectedCategory = e.target.value;
  //   let filteredProducts;

  //   if (selectedCategory === "all") {
  //     filteredProducts = productArray;
  //   } else {
  //     filteredProducts = productArray.filter(
  //       (product) => product.category.name === selectedCategory
  //     );
  //   }

  //   renderProducts(filteredProducts);
  // });

  fetchProducts(); // Call fetchProducts to start the process
});


