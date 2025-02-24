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
        superSaver: 0,
      };
      let categoryCards = {
        fruitsVegetables : false , 
        Drinks : false ,
        snacks : false ,
        bathBody : false ,
        DairyBreakfast : false ,
        EggsMeat : false ,
        icyDelights : false ,
      }

      

      for (let index = 0; index < productArray.length; index++) {
        const element = productArray[index];
    
        // Check if category is null and continue to the next iteration
        if (element.category === null) continue;
    //Category cards 
// Fruits and vegetables
    if(element.category.name === "Fruits & Vegetables" && categoryCards.fruitsVegetables === false){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.coverImage}"
        class=" rounded imagesCards imgCards card-img-top"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["fruitsVegetables"] = true;
        
    }

// Cold drinks and juices
    if(element.category.name === "Cold Drinks & Juices" && (categoryCards.Drinks === false)){
        if (!categoryCards["Drinks"]){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.category.coverImage}"
        class=" rounded imgCards"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["Drinks"] = true;
        }
    }

// Snacks and munchies
    if(element.category.name === "Snacks & Munchies" && (categoryCards.snacks === false)){
            document.querySelector(".catagerycards").innerHTML += `
            <a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.coverImage}"
        class=" rounded imgCards"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["snacks"] = true;
    }

// Bath and body
        if(element.category.name === "Bath & Body" && categoryCards.bathBody === false){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.category.coverImage}"
        class=" rounded imagesCards imgCards card-img-top"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["bathBody"] = true;
        
    }

 // Dairy and breakfast
      if(element.category.name === "Dairy & Breakfast" && categoryCards.DairyBreakfast === false){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.coverImage}"
        class=" rounded imagesCards imgCards card-img-top"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["DairyBreakfast"] = true;
        
    }

// Eggs and meat

   if(element.category.name === "Eggs & Meat" && categoryCards.EggsMeat === false){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.category.coverImage}"
        class=" rounded imagesCards imgCards card-img-top"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["EggsMeat"] = true;
        
    }

 // Icy delights
    
   if(element.category.name === "Icy Delights" && categoryCards.icyDelights === false){
            document.querySelector(".catagerycards").innerHTML += `<a href="#" class="text-decoration-none text-dark">
    <div class="categoryCard" >
      <img
        src="${element.category.coverImage}"
        class=" rounded imagesCards imgCards card-img-top"
        alt="..."
      />
      <div class="card-body">
        <p class=" text-center cardstext">${element.category.name}</p>
      </div>
    </div>
  </a>`;
            categoryCards["icyDelights"] = true;
        
    }




    //super saver cards
        if (element.category.name === "Super Saver" && counter["superSaver"] < 5){
            document.querySelector(".superSaverCards").innerHTML += `
                   <div class=" allPurchaseCards">
            <img
              src="${element.coverImage}"
              class="imgCards "
              alt="..."
            />
            <div class="card-body">
              <p class="card-text">${element.name}</p>
            </div>
            <div
              class="card-body price border-top mt-0 py-2 d-flex justify-content-between "
            >
              <p class="prices priceSupersaver align-self-centre">$${element.discountedPrice}</p>
              <p class="prices pricePrev ">$${element.originalPrice}</p>
              <button type="button" class="btn btn-outline-success">Add</button>
            </div>
          </div>`;
            counter["superSaver"]++;
        }

        //Fruits and vegetable cards
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
                        <p class="prices pricePrev">$${element.originalPrice}</p>
                        <button type="button" class="btn btn-outline-success">Add</button>
                    </div>
                </div>`;
            counter["fruitsVegetables"]++;
        }

        //Cold drinks and juices
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
                        <p class="prices pricePrev">$${element.originalPrice}</p>
                        <button type="button" class="btn btn-outline-success">Add</button>
                    </div>
                </div>`;
            counter["Drinks"]++;
        }

        //Snacks and munchies
    
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
                        <p class="prices pricePrev">$${element.originalPrice}</p>
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
