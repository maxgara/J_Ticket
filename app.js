//core server functionality
const http = require('http');
const fs = require('fs')
const hostname = '0.0.0.0';
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
    case "/searchHandler.js":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream('searchHandler.js').pipe(res);
  }
  //handle api requests
  if(req.url.includes("/api/")){
    var regexSubmitTicketURL = /api\/submitTicket\/(?<name>[\w\s]+)\?(?<flexFields>(?:[\&\?]{0,1}[\w\s=]+)*)/g;
    var submitTicketMatch = regexSubmitTicketURL.exec(req.url);
    let regexSearchURL = /api\/search\/(.+)/g;
    let searchMatch = regexSearchURL.exec(req.url);
    let result = undefined;
    if (submitTicketMatch!=null){
      let ticketName = submitTicketMatch.groups.name;
      let flexFields = submitTicketMatch.groups.flexFields.split('&');
      console.log("&split "+flexFields);
      for(let i=0;i<flexFields.length;i++){
        flexFields[i] = flexFields[i].split("=");
        console.log("=split"+ flexFields);
        for (let j=0;j<flexFields[i].length;j++){
          flexFields[i][j] = flexFields[i][j].trim();
        }
      }
      console.log(flexFields);
      console.log(ticketName + flexFields);
      result = createTicket(ticketName,...flexFields);
    }
    else if (searchMatch!=null){
      console.log(searchMatch[1]);
      result = searchTickets(searchMatch[1]);
    }
    else{
      result = ticketsArray;
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

function createTicket(name,...flexFields){
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
readTickets();
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
