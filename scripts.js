const buttonOn = "rgb(200, 0, 0)";
const buttonOff ="rgb(102, 102, 102)";
const queryId = "queryButton";

function getButtonColor(thisButton){
    return getComputedStyle(thisButton)["background-color"];
}


function toggleButton(thisButton){
    var color = getButtonColor(thisButton);
    switch (color){
        case buttonOff:
            color = buttonOn;
            break;
        case buttonOn:
            color = buttonOff;
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
            color = buttonOff;
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
        if (color == buttonOn){
            selectedButton = buttons[pBtn].id;
            break;
        }
    }
    return selectedButton;
}

function generateAddress(selectedButton){
    return "00" + selectedButton.id.substr(selectedButton.id.length - 2);
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