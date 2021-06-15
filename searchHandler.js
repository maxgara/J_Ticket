// getTicketsNow();
var tickets;
function sendSearchRequest(searchStr){
  let fetchStr = `${document.location.href}api/search/${searchStr}`;
  return fetch(fetchStr)
  .then(results => results.json());
}

async function getTicketsNow(){
  //function for testing
  tickets = await sendSearchRequest("");
    // console.log(tickets);
    // makeTableArray("count by teststr where flex=5", tickets);
    let tableArr = makeTableArray("teststr namestr thirdfield where flex=5",tickets);
    makeTable(tableArr);

}
function makeTableArray(commandStr,tickets) {
//example commandStr: "COUNT BY user, customer WHERE ticketName=test"
  let regex = /(?<tableColumns>.*)(WHERE|where)(?<wheres>.*)/g;
  let matches=regex.exec(commandStr);
  let whereStrs = matches.groups.wheres.split(" ");
  let wherefvPairs = [];
  for (let i=0;i<whereStrs.length;i++) {
    let fvPair = whereStrs[i].split('=');
    if(fvPair.length == 2){
      wherefvPairs.push(fvPair);
    }
  }
  let tableColumnFields = matches.groups.tableColumns.trim().split(" ");
  console.log(tableColumnFields);
  // console.log(byStrs);
  let filteredTickets = [];
  for (let ticket of tickets.filter(a => a.flexFields && a.flexFields)){
    let ticketPass = true;
    for (let filterPair of wherefvPairs){
      let filterPass = false;
      for (let ticketPair of ticket.flexFields){
        // console.log(`${ticketPair} against ${filterPair}`);
        if (ticketPair.length==2 && ticketPair[0]==filterPair[0] && ticketPair[1]==filterPair[1]){
            filterPass = true;
        }
    }
    if(!filterPass){
      ticketPass = false;
      break;
      }
    }
    if(ticketPass){
      filteredTickets.push(ticket);
    }
  }
  console.log(filteredTickets);
  let tableArr = [];
  tableArr.push(tableColumnFields); //header
  for(let ticket of filteredTickets){
    // console.log(ticket);
    let row = [];
    for(let field of tableColumnFields){
      let fvpair = ticket.flexFields.find(x => x[0]==field) || [field,"UNDEFINED"];
      row.push(fvpair[1]);
    }
    tableArr.push(row);
  }
  console.log(tableArr);
  return tableArr;
}

function makeTable(tableArr){
  //display array in data table
  let newTicketInput = document.querySelector('div.newTicketInput');
  newTicketInput.classList.add('collapsed');
  let newSearchInput = document.querySelector('div.SearchInput');
  newSearchInput.classList.add('collapsed');

  let table = document.createElement('table');
  let header = tableArr[0];
  tableArr.splice(0,1);
  let headerElement = document.createElement('thead');
  for (let hcell of header){
    let hcellElement = document.createElement('th');
    hcellElement.textContent=hcell;
    headerElement.appendChild(hcellElement);
  }
  table.appendChild(headerElement);
  for (let row of tableArr){
    let rowElement = document.createElement('tr');
    for (let cell of row){
      let cellElement = document.createElement('td');
      cellElement.textContent = cell;
      rowElement.appendChild(cellElement);
    }
    table.appendChild(rowElement);
  }
  document.body.innerHTML = "";
  document.body.appendChild(table);
}
