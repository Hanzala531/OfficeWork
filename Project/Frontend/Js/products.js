document.addEventListener("DOMContentLoaded", function () {
  async function fetchApis() {
    try {
      // const userApi = await fetch('http://localhost:8000/api/v1/users/');
      const productApi = await fetch("http://localhost:3000/api/v1/products");
      if (!productApi.ok) {
        throw new Error(`Product API Error: ${productApi.status}`);
      }
      const productsData = await productApi.json();

      // Log the fetched data
    //   console.log("Fetched Products:", productsData.data);
      const productArray = productsData.data; // Declare productArray with const
      let counter = {
        fruitsVegetables: 0,
        Drinks: 0,
        snacks: 0,
      };

      console.log("asdasd",productArray);
      

      for (let index = 0; index < productArray.length; index++) {
        const element = productArray[index];
    
        // Check if category is null and continue to the next iteration
        if (element.category === null) continue;
    
        if (
            element.category.name === "Fruits & Vegetables" &&
            counter["fruitsVegetables"] < 5
        ) {
            document.querySelector(".fruitsVegetablesCards").innerHTML += `
                <div class="allPurchaseCards">
                    <img src="${element.coverImage}" class="imgCards" alt="..." />
                    <div class="card-body">
                        <p class="card-text">${element.name}\n${element.weight}</p>
                    </div>
                    <div class="card-body price border-top mt-0 py-2 d-flex justify-content-between">
                        <p class="prices priceFruits align-self-centre">$${element.discountedPrice}</p>
                        <p class="prices priceFruitsPrev">$${element.originalPrice}</p>
                        <button type="button" class="btn btn-outline-success">Add</button>
                    </div>
                </div>`;
            counter["fruitsVegetables"]++;
        }
    
        if (
            element.category.name === "Cold Drinks & Juices" &&
            counter["Drinks"] < 5
        ) {
            document.querySelector(".coldDrinksJuicesCards").innerHTML += `
                <div class="allPurchaseCards">
                    <img src="${element.coverImage}" class="imgCards" alt="..." />
                    <div class="card-body">
                        <p class="card-text">${element.name}\n${element.weight}</p>
                    </div>
                    <div class="card-body price border-top mt-0 py-2 d-flex justify-content-between">
                        <p class="prices priceFruits align-self-centre">$${element.discountedPrice}</p>
                        <p class="prices priceFruitsPrev">$${element.originalPrice}</p>
                        <button type="button" class="btn btn-outline-success">Add</button>
                    </div>
                </div>`;
            counter["Drinks"]++;
        }
    
        if (
            element.category.name === "Snacks & Munchies" &&
            counter["snacks"] < 5
        ) {
            document.querySelector(".snacksCards").innerHTML += `
                <div class="allPurchaseCards">
                    <img src="${element.coverImage}" class="imgCards" alt="..." />
                    <div class="card-body">
                        <p class="card-text">${element.name}\n${element.weight}</p>
                    </div>
                    <div class="card-body price border-top mt-0 py-2 d-flex justify-content-between">
                        <p class="prices priceFruits align-self-centre">$${element.discountedPrice}</p>
                        <p class="prices priceFruitsPrev">$${element.originalPrice}</p>
                        <button type="button" class="btn btn-outline-success">Add</button>
                    </div>
                </div>`;
            counter["snacks"]++;
        }
    }
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchApis();
});
