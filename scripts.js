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

function toggleButton(thisButton){
    var color = getButtonColor(thisButton);
    switch (color){
        case buttonOff():
            color = buttonOn();
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
    return "00" + selectedButton.substr(selectedButton.length - 2);
}

async function apiCall(rawBody, endPoint){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type","application/json");
    var requestOptions = {
        method : 'POST',
        headers : myHeaders,
        body : rawBody,
        redirect : 'follow'
    };
    const response = await fetch(endPoint, requestOptions);
    const ret = await response.json();
    return ret['body'];
}

async function apiScan(){
    var selectedButton = getSelectedButton();
    var rawBody = "";
    var endPoint = apiPrefix() + "scan";
    const data = await apiCall(rawBody, endPoint);
    buildScanTable(data['Items']);
    console.log(data);
}

function apiQuery(selectedButton){
    var address = generateAddress(selectedButton);
    var rawBody = JSON.stringify({"address":address});
    var endPoint = apiPrefix() + "query";
    apiCall(rawBody, endPoint);
}

function apiCreate(selectedButton){
    var address = generateAddress(selectedButton);
    var rawBody = JSON.stringify({"address":address});
    var endPoint = apiPrefix() + "create";
    apiCall(rawBody, endPoint);
}

function apiRead(selectedButton){
    var address = generateAddress(selectedButton);
    var rawBody = JSON.stringify({"address":address});
    var endPoint = apiPrefix() + "read";
    apiCall(rawBody, endPoint);
}

function apiUpdate(selectedButton){
    var address = generateAddress(selectedButton);
    var rawBody = JSON.stringify({"address":address});
    var endPoint = apiPrefix() + "update";
    apiCall(rawBody, endPoint);
}

function apiDelete(selectedButton){
    var address = generateAddress(selectedButton);
    var rawBody = JSON.stringify({"address":address});
    var endPoint = apiPrefix() + "delete";
    apiCall(rawBody, endPoint);
}

async function buildScanTable(data){
    var table = document.createElement('table');
    var tr;
    var td;
    for (const entry in data){
        tr = document.createElement('tr');
        buildTd(tr, data[entry]["address"]);
        buildTd(tr, data[entry]["message"]);
        buildTd(tr, data[entry]["subscribers"]);
        table.appendChild(tr)
    }
    document.getElementsByTagName("body")[0].appendChild(table);
}

async function buildTd(tr, data){
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(data));
    tr.appendChild(td);
}