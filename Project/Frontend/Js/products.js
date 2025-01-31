document.addEventListener('DOMContentLoaded', function() {
    async function fetchApis() {
      try {
          // const userApi = await fetch('http://localhost:8000/api/v1/users/');
          const productApi = await fetch('http://localhost:3000/api/v1/products');
          if (!productApi.ok) {
              throw new Error(`Product API Error: ${productApi.status}`);
          }
          const productsData = await productApi.json(); 
  
          // Log the fetched data
          console.log("Fetched Products:", productsData.data);
          productArray = productsData.data;
          productArray.forEach(element , index => {
            console.log( "\n"
                , element.category.name , "\n"
            );
            if (element.category.name == "Fruits & Vegetables" ) {
                document.querySelector(".fruitsVegetablesCards").innerHTML += `
                   <div class=" allPurchaseCards">
            <img
              src="./slides/fruitsVegetables.jpeg"
              class="imgCards "
              alt="..."
            />
            <div class="card-body">
              <p class="card-text">Some quick example</p>
            </div>
            <div
              class="card-body price border-top mt-0 py-2 d-flex justify-content-between "
            >
              <p class="prices priceFruits align-self-centre">10</p>
              <p class="prices priceFruitsPrev">98</p>
              <button type="button" class="btn btn-outline-success">Add</button>
            </div>
          </div>`;
                console.log(element);
                
            }
        
            
          });
          
      } catch (error) {
          console.error("Error fetching data:", error); 
      }
  }
  

  fetchApis();
  })