// define the callAPI function that takes a first name and last name as parameters

function selectButton(thisButton){
    const btnGray = "rgb(102, 102, 102)";
    const btnRed = "rgb(200, 0, 0)";
    var color = getComputedStyle(thisButton)["background-color"];
    switch (color){
        case btnGray:
            color = btnRed;
            break;
        case btnRed:
            color = btnGray;
            break;
    }
    thisButton.style.backgroundColor = color;
}

var callAPI = (firstName,lastName)=>{
    field = document.getElementById("lName");
    field.value = 'newname';
    // // instantiate a headers object
    // var myHeaders = new Headers();
    // // add content type header to object
    // myHeaders.append("Content-Type", "application/json");
    // // using built in JSON utility package turn object to string and store in a variable
    // var raw = JSON.stringify({"firstName":firstName,"lastName":lastName});
    // // create a JSON object with parameters for API call and store in a variable
    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    // };
    // // make API call with parameters and use promises to get response
    // fetch("https://bpr3fcc8ua.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
    // .then(response => response.text())
    // .then(result => alert(JSON.parse(result).body))
    // .catch(error => console.log('error', error));
}