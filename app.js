//core server functionality
const http = require('http');
const fs = require('fs')
const hostname = '0.0.0.0';
const port = 3000;
var ticketsArray =[];
//readTickets().then(tickets => ticketsArray=tickets);

function Ticket(ticketName){
  this.ticketName = ticketName;
  this.dateCreated = new Date();
  this.constructor.count++;
  this.ticketID = this.constructor.count;
}
Ticket.count = 0;
startup();

function startup(){
readTickets();
const server = http.createServer(httpParseBody((req, res) => {
  res.statusCode = 200;
  console.log(req.url);
  //handle request for standard web resources
  switch(req.url) {
    case "/":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('main.html').pipe(res);

      break;
    case "/main.css":
      res.setHeader('Content-Type', 'text/css');
      fs.createReadStream('main.css').pipe(res);
    case "/main.js":
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream('main.js').pipe(res);
    case "/searchHandler.js":
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream('searchHandler.js').pipe(res);
  }
  //handle api requests
  if(req.url.includes("/api/search")){
    res.setHeader('Content-Type', 'application/json');
    let regexSearchURL = /api\/search\/(?<searchStr>.+)/g;
    let searchMatch = regexSearchURL.exec(req.url);
    let result = searchTickets(searchMatch.groups.searchStr);
    res.write(JSON.stringify(result));
    res.end();
  }
  else if(req.url.includes("/api/submitTicket")){
    res.setHeader('Content-Type', 'application/json');
    let regexSubmitTicket = /api\/submitTicket\/(?<name>[\w\s]+)/g;
    let submitTicketMatch = regexSubmitTicket.exec(req.url);
    let ticketName = submitTicketMatch.groups.name;
    let flexFields = req.body;
    let result = createTicket(ticketName, flexFields);
    res.write(JSON.stringify(result));
    writeTickets();
    res.end();
  }
  })
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
}

function createTicket(name, flexFields){
  var ticket = new Ticket(name);
  ticket.flexFields = flexFields;
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
function readTickets(){
  fs.readFile("tickets.txt","utf8",function(err, tickets){
  ticketsArray = JSON.parse(tickets);
  Ticket.count = ticketsArray.length + 1;
  });
}

function searchTickets(searchStr){
  if(searchStr === null){
    searchStr = '*';
  }
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
function httpParseBody(callback){
  return function(req,res){
    let body = [];
    req.on('data', (chunk) => {
      console.log("data start");
      body.push(chunk);
    }).on('end', () => {
      console.log("data end");
      if(body.length>0){
        body = JSON.parse(Buffer.concat(body).toString());
      }
      req.body = body;
      callback(req,res);
  });
}
}
