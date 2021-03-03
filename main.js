//display new ticket input elements
var newTicketButton = document.querySelector('td#newTicketButton');
newTicketButton.addEventListener('click',function(){
  newTicketInput = document.querySelector('div.newTicketInput');
  newTicketInput.classList.remove('collapsed');
});
//create a new ticket
var submitTicketButton = document.querySelector('button#submit');
submitTicketButton.addEventListener('click', function(){
    let ticketNameElement = document.querySelector('input#ticketName');
    fetchStr = `${document.location.href}api/submitTicket/${ticketNameElement.value}`;
    console.log(fetch(fetchStr));
})
