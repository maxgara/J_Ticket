
displayNewestTickets();

//display new ticket input elements
var displayNewTicketInputButton = document.querySelector('td#newTicketButton');
displayNewTicketInputButton.addEventListener('click', function(){
  let newTicketInput = document.querySelector('div.newTicketInput');
  newTicketInput.classList.remove('collapsed');
  newSearchInput = document.querySelector('div.SearchInput');
  newSearchInput.classList.add('collapsed');
});
//display search elements
var searchButton = document.querySelector('td#searchButton');
searchButton.addEventListener('click', function(){
  let newTicketInput = document.querySelector('div.newTicketInput');
  newTicketInput.classList.add('collapsed');
  newSearchInput = document.querySelector('div.SearchInput');
  newSearchInput.classList.remove('collapsed');
})

//create a new ticket on button click
var submitTicketButton = document.querySelector('button.newTicketinput#submit');
submitTicketButton.addEventListener('click', function(){
    let ticketNameElement = document.querySelector('input#ticketName');
    let flexFieldElements = document.querySelectorAll('input#flexField');
    let flexFieldValues = [];
    for(let i=0; i<flexFieldElements.length; i++){
      flexFieldValues.push(flexFieldElements[i].value);
    }
    console.log("ticketNameElement:");
    console.log(ticketNameElement.value);
    sendTicketRequest(ticketNameElement.value,...flexFieldValues)
    .then(results => displayTickets(results));
    ticketNameElement.value = null;
});
var submitSearchButton = document.querySelector('button.searchInput#submit');
submitSearchButton.addEventListener('click', function(){
      let searchStrElement = document.querySelector('input#searchString');
      parseSearch(searchStrElement.value)
      .then(results => displayTickets(results));
});
var addFlexFieldButton = document.querySelector('button.newTicketInput#addFlexField')
addFlexFieldButton.addEventListener('click', function(){
  let newTicketInput = document.querySelector('div.newTicketInput#container');
  let flexDiv = document.createElement('div');
  flexDiv.innerHTML = `<h2 class="newTicketInput">Flex Field</h2>  <input type="text" class="newTicketInput" id="flexField">`;
  newTicketInput.appendChild(flexDiv);
});


function parseSearch(searchStr){
    let sections = searchStr.split("|");
    let mainSearch = sections[0];
    let wordRegex = /^\w*/;
    for(let i=1; i<sections.length; i++){
      let command = wordRegex.exec(sections[i])[0];
      console.log(command);
    }
    return sendSearchRequest(mainSearch);
}
//make new ticket api call
function sendTicketRequest(ticketName,...flexFieldValues){
  // if (ticketName == "") {
  //   return;
  // }
  let flexString = "";
  if (flexFieldValues.length>0){
    flexString+=`?${flexFieldValues[0]}`;
  }
  for(let i=1; i<flexFieldValues.length; i++){

    flexString += `&${flexFieldValues[i]}`;
    console.log(flexFieldValues[i]);
  }
  fetchStr = `${document.location.href}api/submitTicket/${ticketName}${flexString}`;
  return fetch(fetchStr)
  .then(results => results.json());
}
//make search api call
function sendSearchRequest(searchStr){
  fetchStr = `${document.location.href}api/search/${searchStr}`;
  return fetch(fetchStr)
  .then(results => results.json());
}
async function displayNewestTickets(){
  let allTickets = await sendSearchRequest('.*');
  let recentTickets = allTickets.slice(-10);
  displayTickets(recentTickets);
}
function displayTickets(tickets){
  if (document.querySelector('table.ticketsDisplay') !=null){
    document.querySelector('table.ticketsDisplay').remove();
  }
  let ticketTable = document.createElement('table');
  ticketTable.classList.add('ticketsDisplay');
  for(let i=tickets.length-1;i>=0;i--){
    let ticketRow = document.createElement('tr');
    let nameCell = document.createElement('td');
    let idCell = document.createElement('td');
    let dateCell = document.createElement('td');
    let additionalCells = [];
    tickets[i].additionalFields = [];
    tickets[i].additionalValues = [];
    if(tickets[i].additionalFields === undefined || tickets[i].additionalValues === undefined){
      console.log("noadditionalfields");
      tickets[i].additionalFields = [];
      tickets[i].additionalValues = [];
    }
    for(let j=0;j<tickets[i].additionalFields.length;j++){
      let newCell = document.createElement('td');
      additionalCells.push(newCell);
      additionalCells[j].textContent = tickets[i].additionalValues[j];
    }
    nameCell.textContent = tickets[i].ticketName;
    idCell.textContent = tickets[i].ticketID;
    dateCell.textContent = tickets[i].dateCreated;
    ticketRow.appendChild(nameCell);
    ticketRow.appendChild(idCell);
    ticketRow.appendChild(dateCell);
    for(let j=0;j<tickets[i].additionalFields.length;j++){
      ticketRow.appendChild(additionalCells[j]);
    }
    ticketTable.appendChild(ticketRow);

  }
  document.body.appendChild(ticketTable);
}
// async function autoRefresh(){
//   displayNewestTickets();
//   await sleep(5000);
//   autoRefresh();
// }

async function sleep(time){
    let myPromise = new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve("done");
      }, time);
    });
    return myPromise;
}
