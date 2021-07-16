const apiPrefix = "https://p1ba5tufy8.execute-api.us-east-2.amazonaws.com/emp-iot-andon/";

async function call(rawBody, endPoint){
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

async function scan(){
    var rawBody = "";
    var endPoint = apiPrefix() + "scan";
    const data = await call(rawBody, endPoint);
    return data
}

async function query(address){
    var rawBody = JSON.stringify(
        {
            "address":address
        }
    );
    var endPoint = apiPrefix() + "query";
    const data = await call(rawBody, endPoint);
    return data
}

async function create(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix() + "create";
    const data = await call(rawBody, endPoint);
    return data
}

async function read(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix() + "read";
    const data = await call(rawBody, endPoint);
    return data
}

async function update(address, message, subscribers){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message, 
            "subscribers":subscribers
        }
    );
    var endPoint = apiPrefix() + "update";
    const data = await call(rawBody, endPoint);
    return data
}

async function del(address, message){
    var rawBody = JSON.stringify(
        {
            "address":address, 
            "message":message
        }
    );
    var endPoint = apiPrefix() + "delete";
    const data = await call(rawBody, endPoint);
    return data
}
