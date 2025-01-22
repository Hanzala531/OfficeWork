const savedData = JSON.parse(localStorage.getItem('invoiceFormData'));
const printbutton=document.querySelector('.print-button')

if (savedData) {
    console.log("Loaded data from localStorage:", savedData);
    document.querySelector('.client_info').innerHTML = `<div class="left">
    <h1 class="name">${savedData.client_name}</h1>
    <div class="address">
      <span class="street span">${savedData.client_address}</span>
      <span class="town span">${savedData.town_name}</span>
      <div class="left_bottom">
        <span class="ship_to">Ship To</span>
        <div class="address" id="Shiping_address">
          <span class="ship_address span">${savedData.Shipping_Address}</span>
          <span class="ship_town span">${savedData.shipping_town_name}</span>
        </div>
      </div>
    </div>
    </div>
    <div class="item_description">
    <div class="item_header items-header">
      <div class="item-number hash">#</div>
      <div class="item-details centre">ITEM & DESCRIPTION</div>
      <div class="item-price">AMOUNT</div>
    </div>
    <div class="itemDiv items-header id="items_display">
    
    </div>`;
} else {
    console.log("No data found in localStorage");
}

console.log("data" , savedData);
const stringdata = JSON.stringify(savedData);
// console.log(savedData.d);

savedData.description.forEach((element ) => {
  // console.log(object);
  let item = document.createElement('div'); 
item.setAttribute('class', 'items-header');
  item.innerHTML = `
  <div class="item-number ">${element.item_number}</div>
    <div class="item_name centre">
    <div class="item-details">${element.item_name} <p><span class="item_description">${element.item_description}</span></p></div>
    </div>
    <div class="item-price">${element.item_price}</div>`
    document.querySelector('.itemDiv').appendChild(item);
});


printbutton.addEventListener('click', () => {
  document.getElementById('print-button').style.display = 'none';
    window.print();
})