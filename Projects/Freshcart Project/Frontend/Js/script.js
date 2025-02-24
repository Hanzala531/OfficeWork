document.addEventListener('DOMContentLoaded', function() {
  async function fetchApis() {
    try {
        // const userApi = await fetch('http://localhost:8000/api/v1/users/');
        const productApi = await fetch('http://localhost:8000/api/v1/products');
        if (!productApi.ok) {
            throw new Error(`Product API Error: ${productApi.status}`);
        }
        const productsData = await productApi.json(); 

        // Log the fetched data
        console.log("Fetched Products:", productsData);
        
        
    } catch (error) {
        console.error("Error fetching data:", error); 
    }
}

for (i=0;i<7;i++){ 
  // console.log(product.name);
  document.querySelector('.catagerycards').innerHTML += `
  <a href="#" class="text-decoration-none text-dark">
  <div class="categoryCard" >
    <img
      src="/slides/Lays.jpeg"
      class=" rounded imagesCards card-img-top"
      alt="..."
    />
    <div class="card-body">
      <p class=" text-center cardstext">Dairy & Vegetables</p>
    </div>
  </div>
</a>
      `;
}
// fetchApis();
})