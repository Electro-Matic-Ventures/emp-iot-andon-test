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

/*
var callAPI = (firstName,lastName)=>{
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"firstName":firstName,"lastName":lastName});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://bpr3fcc8ua.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
}
*/