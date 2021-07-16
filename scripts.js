function buttonOn(){
    return "rgb(200, 0, 0)";
}

function buttonOff(){
    return "rgb(102, 102, 102)";
}

function apiPrefix(){
    return "https://p1ba5tufy8.execute-api.us-east-2.amazonaws.com/emp-iot-andon/"
}

function getButtonColor(thisButton){
    return getComputedStyle(thisButton)["background-color"];
}

function getPromise(data){
    return data;
}

function scanId(){
    return "scanAllButtons"
}

function queryId(){
    var id = "queryButton"
    return id
}


function toggleButton(thisButton){
    var color = getButtonColor(thisButton);
    switch (color){
        case buttonOff():
            color = buttonOn();
            var address = generateAddress(thisButton);
            updateTable(address);
            break;
        case buttonOn():
            color = buttonOff();
            break;
    }
    return color;
}

function toggleGroup(thisButton){
    var buttons = document.getElementsByClassName("kp8Button");
    var color;
    var evalBtnId = thisButton.id;
    var idxBtnId;
    for (var pBtn in buttons){
        if (pBtn == "length"){
            break;
        }
        idxBtnId = buttons[pBtn].id;
        if (idxBtnId == evalBtnId){
            color = toggleButton(thisButton);
        }else{
            color = buttonOff();
            try {
                removeTable(queryId());
            }catch{}
        }
        buttons[pBtn].style.backgroundColor = color;
    }
}

function getSelectedButton(){
    var buttons = document.getElementsByClassName("kp8Button");
    var color;
    var selectedButton = "none";
    for (var pBtn in buttons){
        if (pBtn == "length"){
            break;
        }
        color = getButtonColor(buttons[pBtn]);
        if (color == buttonOn()){
            selectedButton = buttons[pBtn].id;
            break;
        }
    }
    return selectedButton;
}

function generateAddress(selectedButton){
    return "00" + selectedButton.id.substr(selectedButton.id.length - 2);
}

async function apiCall(rawBody, endPoint){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type","application/json");
    var requestOptions = {
        method : "POST",
        headers : myHeaders,
        body : rawBody,
        redirect : "follow"
    };
    const response = await fetch(endPoint, requestOptions);
    const ret = await response.json();
    return ret["body"];
}

async function apiScan(){
    var rawBody = "";
    var endPoint = apiPrefix() + "scan";
    const data = await apiCall(rawBody, endPoint);
    var table = buildTable("scan", data["Items"], scanId());
    drawTable(table, "body", 0);
}

async function apiQuery(address){
    var rawBody = JSON.stringify(
        {
            "address":address
        }
    );
    var endPoint = apiPrefix() + "query";
    const data = await apiCall(rawBody, endPoint);
    var table = buildTable(address, data["Items"], queryId());
    drawTable(table, "body", 0);
}

function apiCreate(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix() + "create";
    apiCall(rawBody, endPoint);
    updateTable(address);
}

function apiRead(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix() + "read";
    apiCall(rawBody, endPoint);
    updateTable(address);
}

function apiUpdate(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix() + "update";
    apiCall(rawBody, endPoint);
}

function apiDelete(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix() + "delete";
    apiCall(rawBody, endPoint);
    updateTable(address);
}

function buildTable(address, data, type){
    var table = document.createElement("table");
    table.className += type;
    table.id = type;
    table.appendChild(dataEntryRow(address));
    table.appendChild(blankRow());
    for (const entry in data){
        table.appendChild(buildTr(data[entry], type));
        buildSubTd(table, data[entry]["subscribers"], type);
        if (parseInt(entry) < data.length - 1){
            table.appendChild(blankRow());
        }
    }
    return table
}

function buildTr(data, type){
    var tr = document.createElement("tr");
    tr.className += type;
    var rowSpan = data["subscribers"].length;
    tr.appendChild(addRemoveButton(data));
    tr.appendChild(buildTd(data["address"], rowSpan, type));
    tr.appendChild(buildTd(data["message"], rowSpan, type));
    return tr
}

function buildTd(data, rowSpan, type){
    var td = document.createElement("td");
    td.className += type;
    td.id = type;
    td.rowSpan = rowSpan;
    td.appendChild(document.createTextNode(data));
    return td
}

function buildSubTd(table, data, type){
    var tr;
    var name;
    var pn;
    for (const entry in data){
        name = data[entry]["name"];
        pn = data[entry]["phoneNumber"];
        if (entry=="0"){
            tr = table.rows[table.rows.length - 1];
            tr.appendChild(buildTd(name, 1, type));
            tr.appendChild(buildTd(pn, 1, type));
        }else{
            tr = document.createElement('tr');
            tr.className += type;
            tr.appendChild(buildTd(name, 1, type));
            tr.appendChild(buildTd(pn, 1, type));
            table.appendChild(tr);
        }
    }
}

function drawTable(table, element, index){
    document.getElementsByTagName(element)[index].appendChild(table);
}

function blankRow(){
    var tr = document.createElement('tr');
    tr.className += "blank";
    tr.id = "blank";
    var td = document.createElement("td")
    td.className += "blank";
    td.id = "blank";
    td.colSpan = 4;
    tr.appendChild(td);
    return tr
}

function removeTable(id){
    document.getElementById(id).remove();
}

function addRemoveButton(data){
    var td = document.createElement("td");
    td.className += "btnRemove";
    td.id = "btnRemove";
    td.rowSpan = data["subscribers"].length;
    var btn = document.createElement("input");
    btn.className += "btnRemove";
    btn.type = "button";
    btn.value = "remove";
    btn.addEventListener("click", function(){apiDelete(data["address"], data["message"]);});
    td.appendChild(btn);
    return td
}

async function addNewData(){
    var address = document.getElementById("inpAddress").innerText;
    var message = document.getElementById("inpMessage").value;
    var name;
    var phoneNumber;
    var subscribers = [];
    for (var entry in document.getElementsByClassName("inpName")){
        if (entry == "length") {
            break;
        }
        name = document.getElementsByClassName("inpName")[entry].value;
        phoneNumber = document.getElementsByClassName("inpPhoneNumber")[entry].value;
        subscribers.push(
            {
                "name":name,
                "phoneNumber":phoneNumber
            }
        );
    }
    apiCreate(address, message, subscribers);
}

function addAddButton(){
    var td = document.createElement("td");
    td.className += "btnAdd";
    td.id = "btnAdd";
    td.rowSpan = 1;
    var btn = document.createElement("input");
    btn.className += "btnAdd";
    btn.id = "btnAdd";
    btn.type = "button";
    btn.value = "add";
    btn.addEventListener("click", function(){addNewData();});
    td.appendChild(btn);
    return td
}

function dataEntryRow(address){
    var tr = document.createElement("tr");
    tr.className += "dataEntry";
    tr.id = "dataEntry";
    tr.appendChild(addAddButton());
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(address));
    td.className = "Address";
    td.id = "Address";
    tr.appendChild(td);
    tr.appendChild(dataEntryElement("Message"));
    tr.appendChild(makeSubscribersEntryCell);
    // tr.appendChild(dataEntryElement("Name"));
    // tr.appendChild(dataEntryElement("PhoneNumber"));
    return tr;
}

function makeSubscribersEntryCell(){
    var td = document.createElement("td");
    td.classNmae += "subscribers";
    td.id = "subscribers";
    td.appendChild(makeNewSubscriberDataEntryTable());
    return td
}

function makeNewSubscriberDataEntryTable(rowsNeeded){
    var table = document.createElement("table");
    table.className += "subscribers";
    table.id = "subscribers";
    for (var row = 0; row < rowsNeeded; row++){
        table.className(makeSubscriberEntryRow());
    }
    return table
}

function makeSubscriberEntryRow(){
    var tr = document.createElement("tr");
    tr.className = "subscriber";
    tr.id = "subscriber";
    tr.appendChild(makeSubscriberEntryCell("name"));
    tr.appendChild(makeSubscriberEntryCell("phoneNumber"));
    return tr
}

function dataEntryElement(label){
    tdLbl = label;
    inpLbl = "inp" + label;
    var td = document.createElement("td");
    td.className = tdLbl;
    td.id = tdLbl;
    td.appendChild(dataEntryInput(label));
    return td
}

function dataEntryInput(label){
    var inpLbl = "inp" + label;
    var input = document.createElement("input");
    input.type = "text";
    input.className = inpLbl;
    input.id = inpLbl;
    if (inpLbl=="inpName"|inpLbl=="inpPhoneNumber"){
        input.addEventListener("input", function(){addNewSubscriberDataEntryRow();});
    }
    return input
}

function updateTable(address){
    try{
        removeTable(queryId());
    }
    catch{
        // needed for first button press of newly loaded page
    }    
    finally{
        setTimeout(
            function(){apiQuery(address);}, 
            500
        );
    }
}