import * as api from "api.js";

const buttonOn = "rgb(200, 0, 0)";
const buttonOff = "rgb(102, 102, 102)";
const queryId = "queryButton";



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