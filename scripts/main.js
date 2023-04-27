import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";
  array.forEach((item) => {
     refStuff += card(item);
  });
  
  
  
  renderToDom("#cards", refStuff);
}

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
   //destructuring - as in similar to splitting a string. (.split) splits an array//
   const [, id] = event.target.id.split('--');
    // converts id string  to a number
   const index = referenceList.findIndex(item => item.id === Number(id))
    //boolean statement checking if the card, which is identifgied by the index function using its index position, is the cart or not in the cart
   referenceList[index].inCart = !referenceList[index].inCart
   //this is the variable that gets called out in order to display how much is on the cart. there's no paramenters assigned to it. but if you scroll down, there's a bunch of other functions that are calling back to it
   cartTotal();
   //the function below just keeps rendering the cards again to the DOM
   renderCards(referenceList);
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const eventLC = event.target.value.toLowerCase();
  const searchResult  = referenceList.filter(item => 
    item.title.toLowerCase().includes(eventLC)||
    item.author.toLowerCase().includes(eventLC) ||
    item.description.toLowerCase().includes(eventLC)
    )
    renderCards(searchResult);
    // seachresult is passed because it's the code block that executes the function that enables you to pass values through the search bar
    // const search it the entire code function that enables you to search
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    const free = referenceList.filter(item => item.price <= 0);
    renderCards(free);
  }
  if(event.target.id.includes('cartFilter')) {
    const wishlist = referenceList.filter(wantItem => wantItem.inCart);
    renderCards(wishlist);
  }
  if(event.target.id.includes('books')) {
    const books = referenceList.filter(item => item.type.toLowerCase() === 'book');
    renderCards(books);
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList);
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().forEach(item => {
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  // this function gives us all the items in the cart
  const cart = referenceList.filter(item => item.inCart);
  //a,b = the parameters passed
  // a is the constant initial value
  //b is the value it's looking at when it's looping through
  //a + b.price = .reduce is about adding values. .price is the key we're targetubg
  // 0 is the default/initial value
  const total = cart.reduce((a, b) => a + b.price, 0);
  //.some method just sees if theres any instances of the condition passed (it's a boolean type of function - answer true or false)
  const freeItem = cart.some(item => item.price <= 0);
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (freeItem) {
    document.querySelector('#includes-free').innerHTML = 'INCLUDES FREE ITEMS'
  } else {
    document.querySelector('#includes-free').innerHTML = ' '
  }
  }


// RESHAPE DATA TO RENDER TO DOM
// .map()
const productList = () => {
  return referenceList.map(item => ({ 
    title: item.title, 
    price: item.price, 
    type: item.type
  }));
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
