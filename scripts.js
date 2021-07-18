const buttonOn = "rgb(200, 0, 0)";
const buttonOff = "rgb(100, 100, 100)";
const queryId = "queryButton";
const apiPrefix = "https://p1ba5tufy8.execute-api.us-east-2.amazonaws.com/emp-iot-andon/";

class Button{

    constructor(thisButton){
        this.button = thisButton;
        this.classList = thisButton.classList;
        this.color = this.getButtonColor(thisButton);
        this.id = thisButton.id;
        this.btnOn = false;
        this.address = this.generateAddress(this.id);
    }

    generateAddress(id){
        return "00" + id.substr(id.length - 2)
    }

    address(){
        return this.address
    }

    getButtonColor(thisButton){
        return getComputedStyle(thisButton)["background-color"];
    }

    toggleButton(){
        switch (this.color){
            case buttonOff:
                this.buttonOn();
                break;
            case buttonOn:
                this.buttonOff();
                break;
        }
    }

    buttonOn(){
        this.color = buttonOn;
        this.btnOn = true;
        this.classStateOn();
        this.drawColor();
    }

    buttonOff(){
        this.color = buttonOff;
        this.btnOn = false;
        this.classStateOff();
        this.drawColor();
    }

    drawColor(){
        this.button.style.backgroundColor = this.color;
    }

    classStateOn(){
        this.button.classList.add("btnOn");
        try{
            this.button.classList.remove("btnOff");
        }catch{}
    }

    classStateOff(){
        this.button.classList.add("btnOff");
           try {
               this.button.classList.remove("btnOn");
            }catch{}
    }

}

class Table{

    constructor(data, label){
        this.data = data;
        this.label = label;
        this.address = data[0]["address"];
        this.isSubTable = this.isSubTable();
        this.table = this.buildTable();
    }

    isSubTable(){
        if (this.data.length == 0){
            return false;
        }
        var keys = Object.keys(this.data[0]);
        if (keys[0] == "name"){
            return true
        }else{
            return false
        }
    }

    blankTr(){
        var tr = document.createElement('tr');
        tr.classList.add("blank");
        tr.id = "blank";
        tr.appendChild(this.blankTd(5));
        return tr
    } 

    blankTd(colSpan){
        var td = document.createElement("td")
        td.classList.add("blank");
        td.id = "blank";
        td.colSpan = colSpan;
        return td
    }

    addRemoveButton(rowData){
        var btn = document.createElement("input");
        btn.classList.add("btnRemove");
        btn.type = "button";
        btn.value = "remove";
        btn.addEventListener(
            "click", 
            function(){
                this.apiDelete(rowData["address"], rowData["message"]);
            }
        );
        return btn
    }

    buildTd(contents, rowSpan){
        var td = document.createElement("td");
        td.classList.add(this.label);
        td.id = this.label;
        td.rowSpan = rowSpan;
        td.appendChild(contents);
        return td
    }

    buildTr(rowData){
        var tr = document.createElement("tr");
        tr.classList.add(this.label);
        var rowSpan = rowData["subscribers"].length;
        tr.appendChild(this.buildTd(this.addRemoveButton(rowData), rowSpan));
        tr.appendChild(this.blankTd(1));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["address"]), rowSpan));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["message"]), rowSpan));
        var subTable = new Table(rowData["subscribers"]);
        tr.appendChild(subTable.table);
        return tr
    }

    buildTable(){
        var table = document.createElement("table");
        table.classList.add(this.label);
        table.id = this.label;
        // table.appendChild(dataEntryRow(this.address));
        table.appendChild(this.blankTr());
        for (const entry in this.data){
            table.appendChild(this.buildTr(this.data[entry]));
            // this.buildSubTd(table, this.data[entry]["subscribers"], this.label);
            if (parseInt(entry) < this.data.length - 1){
                table.appendChild(this.blankTr());
            }
        }
        return table;
    }

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
    const data = await response.json();
    return data["body"];
}

async function apiScan(){
    var rawBody = "";
    var endPoint = apiPrefix + "scan";
    const data = await apiCallr(rawBody, endPoint);
    return data
}

async function apiQuery(address){
    var rawBody = JSON.stringify(
        {
            "address":address
        }
    );
    var endPoint = apiPrefix + "query";
    const data = await apiCall(rawBody, endPoint);
    return data
}

async function apiCreate(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix + "create";
    const data = await apiCall(rawBody, endPoint);
    return data
}

async function apiRead(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix + "read";
    const data = await apiCall(rawBody, endPoint);
    return data
}

async function apiUpdate(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix + "update";
    const data = await apiCall(rawBody, endPoint);
    return data
}

async function apiDelete(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix + "delete";
    const data = await apiCall(rawBody, endPoint);
    return data
}

function removeTable(id){
    document.getElementById(id).remove();
}

function updateTable(address){
    try{
        removeTable(queryId);
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

function toggleGroup(evalBtn){
    var buttons = document.getElementsByClassName(evalBtn.classList[0]);
    var idxBtn;
    for (var pBtn in buttons){
        if (pBtn == "length"){
            break;
        }
        idxBtn = new Button(buttons[pBtn]);
        if (idxBtn.id == evalBtn.id){
            evalBtn.toggleButton();
        }else{
            idxBtn.buttonOff();
        }
    }
}

function addTable(table){
    document.getElementsByTagName("body")[0].appendChild(table);
}

async function buttonAction(thisButton){
    var evalBtn = new Button(thisButton);
    toggleGroup(evalBtn);
    if (evalBtn.btnOn){
        var data = await apiQuery(evalBtn.address);
        if (data["Items"].length > 0){
            var table = new Table(data["Items"], "querryButton");
            addTable(table.table);
        }
        console.log(data);
    }
}