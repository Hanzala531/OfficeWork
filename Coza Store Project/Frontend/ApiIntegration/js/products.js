document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching products...");

        const productApi = await fetch("http://localhost:3000/api/v1/products");
        if (!productApi.ok) {
            throw new Error(`Product API Error: ${productApi.status}`);
        }
        const productsData = await productApi.json();

        console.log("Fetched Products:", productsData.data);

        if (!productsData.data || !Array.isArray(productsData.data)) {
            throw new Error("Invalid product data received");
        }

        renderProducts(productsData.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});

function renderProducts(products) {
    const productGrid = document.getElementById("products");
    
    if (!productGrid) {
        console.error("Product grid element not found!");
        return;
    }

    products.innerHTML = "";

    products.forEach(product => {
        const productHTML = `
            <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.category.name}">
                <div class="block2">
                    <div class="block2-pic hov-img0">
                        <img src="${product.coverImage[0]}" alt="${product.name}">
                        <a href="#" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                            Quick View
                        </a>
                    </div>
                    <div class="block2-txt flex-w flex-t p-t-14">
                        <div class="block2-txt-child1 flex-col-l">
                            <a href="product-detail.html" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                ${product.name}
                            </a>
                            <span class="stext-105 cl3">
                                $${product.price}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        products.insertAdjacentHTML("beforeend", productHTML);
    });

    console.log("Products rendered successfully.");
}
