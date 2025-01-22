document.addEventListener("DOMContentLoaded", () => {
  const input_form = document.querySelector(".invoice_form");
  const client_name = document.querySelector("#client_name");
  const client_address = document.querySelector("#client_address");
  const town_name = document.querySelector("#town_name");
  const Shipping_Address = document.querySelector("#ship_client_address");
  const shipping_town_name = document.querySelector("#ship_town_name");
  const item_number = document.querySelector("#item_number");
  const item_name = document.querySelector("#item_name");
  const item_description = document.querySelector("#item_description");
  const item_price = document.querySelector("#item_price");
  let formData = {};

  // // Ensure that these elements exist before using .value
  if (
    !client_name ||
    !client_address ||
    !town_name ||
    !Shipping_Address ||
    !shipping_town_name ||
    !item_number ||
    !item_name ||
    !item_description ||
    !item_price
  ) {
    console.error("Missing form elements!");
    return;
  }

  // Function to save form data to localStorage
  function saveFormData() {
    formData = {
      client_name: client_name.value,
      client_address: client_address.value,
      town_name: town_name.value,
      Shipping_Address: Shipping_Address.value,
      shipping_town_name: shipping_town_name.value,
      description: [
        {
          item_number: item_number.value,
          item_name: item_name.value,
          item_description: item_description.value,
          item_price: item_price.value,
        },
      ],
    };

    console.log("Saving form data:", formData);
    const savedData = JSON.parse(localStorage.getItem('invoiceFormData')) || {};
      // localStorage.setItem("invoiceFormData", JSON.stringify(formData));
      localStorage.setItem("invoiceFormData", JSON.stringify(savedData));

   
      
      
    console.log("Form data saved to localStorage");
    }

  //   Loading content from local storage again as a sample or idea to solve the problem

  
  document.querySelector(".anotherSubmission").addEventListener("click", () => {
      const savedData = JSON.parse(localStorage.getItem('invoiceFormData')) || {};

    //   item_name.value = "";
    //   item_description.value = "";
    //   item_price.value = "";
    //   item_number.value ="";
    // console.log("Asd",savedData.description);
    const savedEntry = {
      item_number: item_number.value,
      item_name: item_name.value,
      item_description: item_description.value,
      item_price: item_price.value,
    };

    savedData.description.push(savedEntry);

    
    console.log("Updated form data:", savedData);

    localStorage.setItem("invoiceFormData", JSON.stringify(savedData));

  });

  input_form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData();
    window.location.href='index.html';

     
  });
});
