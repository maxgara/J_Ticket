
displayNewestTickets();
//display new ticket input elements
var displayNewTicketInputButton = document.querySelector('td#newTicketButton');
displayNewTicketInputButton.addEventListener('click', function(){
  let newTicketInput = document.querySelector('div.newTicketInput');
  newTicketInput.classList.remove('collapsed');
  newSearchInput = document.querySelector('div.SearchInput');
  newSearchInput.classList.add('collapsed');
});
//display ticket search elements
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
    requestNewTicket(ticketNameElement.value)
    .then(results => displayTickets(results));

});
//search for tickets on button click
var submitSearchButton = document.querySelector('button.searchInput#submit');
submitSearchButton.addEventListener('click', function(){
      let searchStrElement = document.querySelector('input#searchString');
      requestSearch(searchStrElement.value)
      .then(results => displayTickets(results));

});
//make new ticket api call
function requestNewTicket(ticketName){
  fetchStr = `${document.location.href}api/submitTicket/${ticketName}`;
  return fetch(fetchStr)
  .then(results => results.json());
}
//make search api call
function requestSearch(searchStr){
  fetchStr = `${document.location.href}api/search/${searchStr}`;
  return fetch(fetchStr)
  .then(results => results.json());
}
async function displayNewestTickets(){
  let allTickets = await requestSearch('.*');
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
    nameCell.textContent = tickets[i].ticketName;
    idCell.textContent = tickets[i].ticketID;
    dateCell.textContent = tickets[i].dateCreated;
    ticketRow.appendChild(nameCell);
    ticketRow.appendChild(idCell);
    ticketRow.appendChild(dateCell);
    ticketTable.appendChild(ticketRow);
  }
  document.body.appendChild(ticketTable);
}
