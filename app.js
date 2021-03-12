//core server functionality
const http = require('http');
const fs = require('fs')
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  console.log(req.url);
  //handle request for standard web resources
  switch(req.url) {
    case "/":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('main.html').pipe(res);
      break;
    case "/main.css":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/css');
      fs.createReadStream('main.css').pipe(res);
    case "/main.js":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream('main.js').pipe(res);
  }
  //handle api requests
  if(req.url.includes("/api/")){
    let regexSubmitTicketURL = /api\/submitTicket\/(.+)/g;
    let submitTicketMatch = regexSubmitTicketURL.exec(req.url);
    let regexSearchURL = /api\/search\/(.+)/g;
    let searchMatch = regexSearchURL.exec(req.url);
    if (submitTicketMatch!=null){
      console.log(submitTicketMatch[1]);
      var result = createTicket(submitTicketMatch[1]);
    }
    else if (searchMatch!=null){
      console.log(searchMatch[1]);
      var result = searchTickets(searchMatch[1]);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(result));
    res.end();
    writeTickets();
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//ticket handling
var ticketsArray =[];
//readTickets().then(tickets => ticketsArray=tickets);
function Ticket(ticketName){
  this.ticketName = ticketName;
  this.dateCreated = new Date();
  this.constructor.count++;
  this.ticketID = this.constructor.count;
}
Ticket.count = 0;

function createTicket(name){
  var ticket = new Ticket(name);
  ticketsArray.push(ticket);
  return ticketsArray;
}

function writeTickets(){
  fs.writeFile("tickets.txt", JSON.stringify(ticketsArray), function(err){
    if (err!==null){
      console.log(`error writing:${err}`);
    }
  });
}
readTickets();
function readTickets(){
  fs.readFile("tickets.txt","utf8",function(err, tickets){
  ticketsArray = JSON.parse(tickets);
  Ticket.count = ticketsArray.length + 1;
  });
}

function searchTickets(searchStr){
  let results = ticketsArray.filter(ticket => checkTicketMatch(searchStr, ticket));
  return results;
  function checkTicketMatch(searchStr, ticket){
    let searchRegex = new RegExp(searchStr);
    let nameMatch = searchRegex.test(ticket.ticketName);
    let IDMatch = searchRegex.test(ticket.ticketID);
    let dateMatch = searchRegex.test(ticket.dateCreated);
    return (nameMatch || IDMatch || dateMatch);
  }
}
