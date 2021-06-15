
displayNewestTickets();
//display new ticket input elements
function init(){
  let displayNewTicketInputButton = document.querySelector('td#newTicketButton');
  displayNewTicketInputButton.addEventListener('click', function(){
    let newTicketInput = document.querySelector('div.newTicketInput');
    newTicketInput.classList.remove('collapsed');
    newSearchInput = document.querySelector('div.SearchInput');
    newSearchInput.classList.add('collapsed');
  });
  //display search elements
  let searchButton = document.querySelector('td#searchButton');
  searchButton.addEventListener('click', function(){
    let newTicketInput = document.querySelector('div.newTicketInput');
    newTicketInput.classList.add('collapsed');
    newSearchInput = document.querySelector('div.SearchInput');
    newSearchInput.classList.remove('collapsed');
  })

  //create a new ticket on button click
  let submitTicketButton = document.querySelector('button.newTicketinput#submit');
  submitTicketButton.addEventListener('click', function(){
      let ticketNameElement = document.querySelector('input#ticketName');
      let flexFieldElements = document.querySelectorAll('input#flexField');
      let flexFieldValues = [];
      for(let i=0; i<flexFieldElements.length; i++){
        flexFieldValues.push(flexFieldElements[i].value);
      }
      // console.log("ticketNameElement:");
      // console.log(ticketNameElement.value);
      sendTicketRequest(ticketNameElement.value,...flexFieldValues)
      .then(results => makeTable(results));
      // ticketNameElement.value = null;
  });
  let submitSearchButton = document.querySelector('button.searchInput#submit');
  submitSearchButton.addEventListener('click', function(){
        let searchStrElement = document.querySelector('input#searchString');
        sendSearchRequest(searchStrElement.value)
        .then(results => displayTickets(results));
  });
  let addFlexFieldButton = document.querySelector('button.newTicketInput#addFlexField')
  addFlexFieldButton.addEventListener('click', function(){
    let newTicketInput = document.querySelector('div.newTicketInput#container');
    let flexDiv = document.createElement('div');
    flexDiv.innerHTML = `<h2 class="newTicketInput">Flex Field</h2>  <input type="text" class="newTicketInput" id="flexField">`;
    newTicketInput.appendChild(flexDiv);
  });
}

function sendTicketRequest(ticketName,...flexFieldValues){
  let fetchStr = `${document.location.href}api/submitTicket/${ticketName}`;
  return fetch(fetchStr, {
    method:"POST",
    body:JSON.stringify(flexFieldValues)
  })
  .then(results => results.json());
}
function sendSearchRequest(searchStr){
  let fetchStr = `${document.location.href}api/search/${searchStr}`;
  return fetch(fetchStr)
  .then(results => results.json());
}

async function displayNewestTickets(){
  let allTickets = await sendSearchRequest('.*');
  let recentTickets = allTickets.slice(-10);
  makeTable(recentTickets);
}

async function sleep(time){
    let myPromise = new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve("done");
      }, time);
    });
    return myPromise;
}
