document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();
  const bestSellingProducts = document.getElementById("bestSellingProducts");
  //   // You're not using this yet
  // const designerProducts = document.getElementById('designerProducts'); // You're not using this yet
  const url = "http://localhost:3000/api/v1/products";
  fetchProducts(url);
});
// Making a variable as counter for controlling the number of card in the product list
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

    // Check if the response is successful and data exists.
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
    <button class="AddButton" data-product-id="${product.id}">Add to Cart</button> </div>
</div>
              `;
          counter.bestSelling++;
        }
        if (product.category.name === "Men" && counter.Men < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
            <div class="product">
                <img src="${product.coverImage}" alt="product image" />
                <h3>${product.name}</h3>
                <div id="details">
    <p class="price">$${product.price}</p>
    <button class="AddButton" data-product-id="${product.id}">Add to Cart</button> </div>
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
    <button class="AddButton" data-product-id="${product.id}">Add to Cart</button> </div>
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
    <button class="AddButton" data-product-id="${product.id}">Add to Cart</button> </div>
</div>
                      </div>
                      `;
          counter.Children++;
        }

        if (product.category.name === "Children" && counter.Accessories < 2) {
          const allproducts = document.getElementById("product-list");
          allproducts.innerHTML += `
                        <div class="product">
                            <img src="${product.coverImage}" alt="product image" />
                            <h3>${product.name}</h3>
                            <div id="details">
    <p class="price">$${product.price}</p>
    <button class="AddButton" data-product-id="${product.id}">Add to Cart</button> </div>
</div>
                          </div>
                          `;
          counter.Accessories++;
        }
      });
    } else {
      console.error(
        "Error fetching products:",
        products.message || "Unknown error"
      );
      // Display an error message to the user:
      const bestSellingProducts = document.getElementById(
        "bestSellingProducts"
      );
      bestSellingProducts.innerHTML = "<p>Error loading products.</p>";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    const bestSellingProducts = document.getElementById("bestSellingProducts");
    bestSellingProducts.innerHTML = "<p>Error loading products.</p>"; // User-friendly error message
  }
};

