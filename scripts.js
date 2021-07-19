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

    blankTr(thickness, colSpan){
        var tr = document.createElement('tr');
        tr.classList.add("blank");
        tr.classList.add(thickness);
        tr.id = "blank";
        tr.appendChild(this.blankTd(colSpan, "rowSpan"));
        return tr
    } 

    blankTd(colSpan, thickness){
        var td = document.createElement("td")
        td.classList.add("blank");
        td.classList.add(thickness);
        td.id = "blank";
        td.colSpan = colSpan;
        return td
    }

    drawRemoveButton(rowData){
        var btn = document.createElement("input");
        btn.classList.add("btnRemove");
        btn.id = "btnRemove";
        btn.type = "button";
        btn.value = "remove";
        btn.addEventListener(
            "click", 
            function(){
                apiDelete(rowData["address"], rowData["message"]);
            }
        );
        return btn
    }

    drawAddButton(rowData){
        var btn = document.createElement("input");
        btn.classList.add("btnAdd");
        btn.id = "btnAdd";
        btn.type = "button";
        btn.value = "add";
        btn.addEventListener(
            "click", 
            function(){
                addNewData(rowData);
            }
        );
        return btn
    }

    drawUpdateButton(rowData){
        var btn = document.createElement("input");
        btn.classList.add("btnUpdate");
        btn.id = "btnUpdate";
        btn.type = "button";
        btn.value = "update";
        btn.addEventListener(
            "click",
            function(){
                updateData(rowData);
            }
        );
        return btn
    }

    drawInputTextField(className){
        var inp = document.createElement("intput");
        inp.classList.add(className);
        inp.id = className;
        inp.type = "text";
        inp.addEventListener(
            "input",
            function(){
                changeButton();
            }
        );
        return inp
    }

    buildTd(contents, rowSpan, className){
        var td = document.createElement("td");
        td.classList.add(className);
        td.id = this.label;
        td.rowSpan = rowSpan;
        td.appendChild(contents);
        return td
    }

    buildTr(rowData){
        if (this.isSubTable()){
            return this.subscriberRow(rowData)
        }else{
            return this.messageRow(rowData)
        }
    }

    messageRow(rowData){
        var tr = document.createElement("tr");
        tr.classList.add(this.label);
        tr.appendChild(this.buildTd(this.drawRemoveButton(rowData), 1, "control"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["address"]), 1, "address"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["message"]), 1, "message"));
        tr.appendChild(this.blankTd(1, "thin"));
        var subTable = new Table(rowData["subscribers"], "subscribers");
        tr.appendChild(this.buildTd(subTable.table, 1, "subscribers"));
        return tr
    }

    subscriberRow(rowData){
        var tr = document.createElement("tr");
        tr.classList.add(this.label);
        tr.appendChild(this.buildTd(this.drawRemoveButton(rowData), 1, "control"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["name"]), 1, "name"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["phoneNumber"]), 1, "phoneNumber"));
        return tr
    }

    inputMessageRow(rowData){
        var tr = document.createElement("tr");
        tr.classList.add("input");
        tr.appendChild(this.buildTd(this.drawAddButton(), 1, "control"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(document.createTextNode(rowData["address"]), 1, "address")); 
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(this.drawInputTextField("inpMessage"), 1, "textField"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.inputSubTable(rowData));
        return tr
    }

    inputSubTable(rowData){
        var tb = document.createElement("table");
        var tr = document.createElement("tr");
        tr.appendChild(this.buildTd(this.drawUpdateButton(rowData),1,"control"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(this.drawInputTextField("inpName"), 1, "textField"));
        tr.appendChild(this.blankTd(1, "thin"));
        tr.appendChild(this.buildTd(this.drawInputTextField("inpPhoneNumber"), 1, "textField"));
        tb.appendChild(tr);
        return tb
    }

    buildTable(){
        var table = document.createElement("table");
        table.classList.add(this.label);
        table.id = this.label;
        var thickness = "thick";
        var colSpan = 7;
        if (this.isSubTable()){
            thickness = "thin";
            colSpan = 5;
        }
        var rowData = {
            address:"0000", 
            message:"static message", 
            subscribers:{
                name:"john machado", 
                phoneNumber:"242-458-8558"
            }
        }
        table.appendChild(this.inputMessageRow(rowData));
        table.appendChild(this.blankTr(thickness, colSpan));
        for (const entry in this.data){
            table.appendChild(this.buildTr(this.data[entry]));
            if (parseInt(entry) < this.data.length - 1){
                table.appendChild(this.blankTr(thickness, colSpan));
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
            var table = new Table(data["Items"], queryId);
            try{
                removeTable(queryId);
            }
            catch{
            }
            finally{
                addTable(table.table);
            }
        }
    }else{
        try{
            removeTable(queryId);
        }catch{}
    }
}