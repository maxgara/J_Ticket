//core server functionality
const http = require('http');
const fs = require('fs')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(req.url);
  if(req.url == "/"){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('index.html').pipe(res);
  }
  else if(req.url == "/main.css"){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css');
    fs.createReadStream('main.css').pipe(res);
  }
  else if(req.url == "/main.js"){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream('main.js').pipe(res);
  }
  else if(req.url.includes("/api/submitTicket/")){
    let rex = /api\/submitTicket\/(.+)/g;
    let ticketName = rex.exec(req.url)[1];
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let result = createTicket(ticketName);
    res.write(JSON.stringify(result));
    res.end();
    writeTickets();
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//ticket handling

var ticketsArray = [];
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
    console.log(`error writing:${err}`);
  });
}

function searchTickets(searchStr){
  let searchRegex = new RegExp(searchStr);
  let results = ticketsArray.filter(ticket => searchRegex.test(ticket.name));
  return results;
}
