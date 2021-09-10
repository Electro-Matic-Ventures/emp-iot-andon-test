/** Spans
 * row and column span as an object
 * @typedef Spans
 * @property {number} rows - rowspan
 * @property {number} columns - colspan
 */

/** ClassList
 * standardized class list as an object
 * @typedef ClassList
 * @property {string} row - the row number in the base table
 * @property {string} type - what kind of html element is it
 * @property {string} operation - the functional description
 */

/** RowData
 * data for the API
 * @typedef RowData
 * @property {string} address - the address of the button
 * @property {string} message - message being modified
 * @property {Subscribers} subscribers - the subscriber list for this message
 */

/** Subscribers
 * an array of all subscribers to a message
 * @typedef Subscribers
 * @property {Array<Subscriber>} subscribers - the subscriber list for this message
 */

/** Subscriber
 * a single subscriber
 * @typedef Subscriber
 * @property {string} name
 * @property {string} phoneNumber - remove delimeters before submitting
 */

 const buttonOn = "rgb(200, 0, 0)";
 const buttonOff = "rgb(100, 100, 100)";
 const queryId = "queryButton";
 const apiPrefix = "https://p1ba5tufy8.execute-api.us-east-2.amazonaws.com/emp-iot-andon/";
 const sleepTime = 500;
 
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
 
     constructor(){
     }
 
     /**
      * Draws a blank row for formatting.
      * @param {Spans} spans - row and column spans. passed to cell. 
      * @param {string} thickness - thickness of row. valid entries: 'thick', 'thin'
      * @returns 
      */
     blankTr(spans, thickness){
         var tr = document.createElement('tr');
         tr.classList.add("blank");
         tr.classList.add(thickness);
         tr.id = "blank";
         tr.appendChild(this.blankTd(spans, "rowSpan"));
         return tr
     } 
 
     /**
      * Draws a blank column for formatting.
      * @param {Spans} spans - row and column spans for the cell.
      * @param {string} thickness - thickness of the column. valid entries: 'thick', 'thin'
      */
     blankTd(spans, thickness){
         var td = document.createElement("td")
         td.classList.add("blank");
         td.classList.add(thickness);
         td.id = "blank";
         td.rowSpan = spans.rows;
         td.colSpan = spans.columns;
         return td
     }
 
     /**
      * 
      * @param {*} contents - what will be in the td. this project expects either an object or string. 
      * @param {Spans} spans - row and column span
      * @param {ClassList} classList - class list for css and identification
      * @returns 
      */
     buildTd(contents, spans, classList){
         var td = document.createElement("td");
         td.classList.add(classList.row, classList.type, classList.operation);
         td.id = classList.row + classList.type + classList.operation;
         td.rowSpan = spans.rows;
         td.colSpan = spans.columns;
         if (typeof contents == 'string') {
             td.innerText = contents;
         }else{
             td.appendChild(contents);
         }
         return td
     }
 
     getSubscribersValidLength (subscribers) {
         if (subscribers.lenght == 0) {
             return 0;
         }
         if (subscribers[0].name.length == 0) {
             return 0;
         }
         var ret = 0;
         for (var i in subscribers) {
             if (subscribers[i].name.length > 0) {
                 ret++;
             }
         } 
         return ret;
     }
 
 }
 
 class Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      */
     constructor (rowData, classList){
         this.rowData = rowData;
         this.classList = classList;
     }
 
     buildButton(value){
         var button = document.createElement("button");
         button.classList.add(this.classList.row, this.classList.type, this.classList.operation);
         button.id = this.classList.row + this.classList.type + this.classList.operation;
         button.type = "button";
         button.innerText = this.formatForDisplay(value);
         return button
     }
 
     buildTextField(value) {        
         var textField = document.createElement("input");
         textField.classList.add(this.classList.row, this.classList.type, this.classList.operation);
         textField.id = this.classList.row + this.classList.type + this.classList.operation;
         textField.type = "text";
         textField.value = value;
         return textField;
     }
 
     /**
      * Replaces delimeters with spaces and capitalizes.
      * @param {string} string 
      * @returns string
      */
     formatForDisplay (string) {
         var ret = string;
         if (ret.includes('_')) {
             ret = ret.replace('_', ' ').toUpperCase();
         } else {
             ret = ret.toUpperCase();
         }
         return ret;
     } 
 }
 
 class Button_Add_Subscriber extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      */
     constructor(rowData, classList) {
         super(rowData, classList);
         var button = this.buildButton(classList.operation);
         button.addEventListener(
             "click", 
             function(){
                 var row = this.classList[0].toString();
                 var names = document.getElementsByClassName(row + ' name');
                 var phoneNumbers = document.getElementsByClassName(row + ' phoneNumber');
                 var subscribers = [];
                 for (var i in names) {
                     if (typeof names[i] != 'object') {
                         continue;
                     }
                     if (names[i].value.length == 0) {
                         continue;
                     }
                     if (phoneNumbers[i].value.length == 0) {
                         continue;
                     }
                     subscribers.push(
                         {
                             name: names[i].value,
                             phoneNumber: phoneNumbers[i].value.replace(/\D/g, '')
                         }
                     )
                 }
                 /** @type RowData */
                 var rowData = {
                     address: document.getElementById(row + 'textFieldaddress').value,
                     message: document.getElementById(row + 'textFieldmessage').value,
                     subscribers: subscribers
                 };
                 var pRemove = null;
                 var pPut = null;
                 var table = null;
                 if (row == 0) {
                     pRemove = '0_new_message_UI_table';
                     pPut = 'new_message_table_host_td';
                     table = new New_Message_User_Interface(rowData);
                 } else {
                     pRemove = 'message_[#]_UI_table'.replace('[#]', row.toString());
                     pPut = 'message_[#]_table_host_td'.replace('[#]', row.toString());
                     table = new Message_User_Interface(row, rowData);
                 }
                 removeTable(pRemove);
                 document.getElementById(pPut).appendChild(table.table);
             }
         );
        this.button = button;
         }
 }
 
 class Button_Add_Message extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      */
     constructor(rowData, classList) {
         super(rowData, classList);
         var button = this.buildButton(classList.operation);
         button.addEventListener(
             "click", 
             function(){
                 var row = this.classList[0].toString();
                 var names = document.getElementsByClassName(row + ' name');
                 var phoneNumbers = document.getElementsByClassName(row + ' phoneNumber');
                 var subscribers = [];
                 for (var i in names) {
                     if (typeof names[i] != 'object') {
                         continue;
                     }
                     if (names[i].value.length == 0) {
                         continue;
                     }
                     if (phoneNumbers[i].value.length == 0) {
                         continue;
                     }
                     subscribers.push(
                         {
                             name: names[i].value,
                             phoneNumber: phoneNumbers[i].value.replace(/\D/g, '')
                         }
                     )
                 }
                 /** @type RowData */
                 var rowData = {
                     address: document.getElementById(row + 'textFieldaddress').value,
                     message: document.getElementById(row + 'textFieldmessage').value,
                     subscribers: subscribers
                 };
                 apiCreate(rowData.address, rowData.message, rowData.subscribers);
                 removeTable(queryId);
                 setTimeout(function(){updateTable(rowData.address);}, sleepTime);
             }
         );
        this.button = button;
     }
 }
 
 class Button_Remove_Message extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      */
     constructor (rowData, classList) {
         super(rowData, classList);
         var button = this.buildButton('REMOVE');
         button.addEventListener(
             "click", 
             function(){
                 var row = this.classList[0].toString();
                 var names = document.getElementsByClassName(row + ' name');
                 var phoneNumbers = document.getElementsByClassName(row + ' phoneNumber');
                 var subscribers = [];
                 for (var i in names) {
                     if (typeof names[i] != 'object') {
                         continue;
                     }
                     if (names[i].value.length == 0) {
                         continue;
                     }
                     if (phoneNumbers[i].value.length == 0) {
                         continue;
                     }
                     subscribers.push(
                         {
                             name: names[i].value,
                             phoneNumber: phoneNumbers[i].value.replace(/\D/g, '')
                         }
                     )
                 }
                 /** @type RowData */
                 var rowData = {
                     address: document.getElementById(row + 'textFieldaddress').value,
                     message: document.getElementById(row + 'textFieldmessage').value,
                     subscribers: subscribers
                 };
                 apiDelete(rowData.address, rowData.message);
                 removeTable(queryId);
                 setTimeout(function(){updateTable(rowData.address);}, sleepTime);
             }
         );
         this.button = button;
     }
 }
 
 class Button_Update_Message extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      */
     constructor(rowData, classList) {
         super(rowData, classList);
         var button = this.buildButton('UPDATE');
         button.addEventListener(
             "click",
             async function(){
                 var row = this.classList[0].toString();
                 var names = document.getElementsByClassName(row + ' name');
                 var phoneNumbers = document.getElementsByClassName(row + ' phoneNumber');
                 var subscribers = [];
                 for (var i in names) {
                     if (typeof names[i] != 'object') {
                         continue;
                     }
                     if (names[i].value.length == 0) {
                         continue;
                     }
                     if (phoneNumbers[i].value.length == 0) {
                         continue;
                     }
                     subscribers.push(
                         {
                             name: names[i].value,
                             phoneNumber: phoneNumbers[i].value.replace(/\D/g, '')
                         }
                     )
                 }
                 /** @type RowData */
                 var rowData = {
                     address: document.getElementById(row + 'textFieldaddress').value,
                     message: document.getElementById(row + 'textFieldmessage').value,
                     subscribers: subscribers
                 };
                 removeTable(queryId);
                 setTimeout(function(){updateTable(rowData.address);}, sleepTime);
             }
         );
        this.button = button;        
     }
 }
 
 class TextField extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      * @param {string} value - default text field text
      */
     constructor(rowData, classList, value) {
         super(rowData, classList);
         var textField = this.buildTextField(value);
         /*
         textField.addEventListener(
             'input',
             function(){
                 // some function
             }
         )
         */
        this.textField = textField;
     }
 }
 
 class TextField_Address extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      * @param {string} value - default text field text
      */
     constructor(rowData, classList) {
         super(rowData, classList);
         var textField = this.buildTextField(rowData.address);
         textField.disabled = true;
         /*
         textField.addEventListener(
             'input',
             function(){
                 // some function
             }
         )
         */
        this.textField = textField;
     }
 }
 
 class TextField_Message extends Controls {
 
     /**
      * @param {RowData} rowData - data for the API
      * @param {ClassList} classList - standardized class list as an object
      * @param {string} value - default text field text
      */
     constructor(rowData, classList) {
         super(rowData, classList);
         var textField = this.buildTextField(rowData.message);
         /*
         textField.addEventListener(
             'input',
             function(){
                 // some function
             }
         )
         */
        this.textField = textField;
     }
 }
 
 class Subscriber_User_Interface extends Table {
      
     /**
      * @param {RowData} rowData - data for the api 
      * @param {*} table - Each message is presented in a table. All messages tables are embedded in cells of the base table. This value should be the reference to the  table for the relevant message and not the reference to the base table.
      * @param {Subscribers} subscribers - the subscriber list for this message
      */
     constructor (row, rowData) {
         super();
         this.row = row;
         this.rowData = rowData;
         this.subscribers = rowData.subscribers;
     }
 
     /** the new subscirber section is an add button, a blank row, and a subscriber row with empty text fields
      * @returns retuns an array of html table rows
      */
     addNewSubscriberSection () {
         
         var ret = [];
 
         // ONLY 2 KINDS OF SPANS ARE NEEDED
         /** @type Spans */
         const span3Cols = {rows: 1, columns: 3};
         
         // ADD BUTTON
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'button',
             operation: 'add_subscriber'
         }
         var add = new Button_Add_Subscriber(this.rowData, classList);
         var tr = document.createElement('tr');
         classList.type = 'hostTd';
         classList.operation = 'control';
         tr.appendChild(this.buildTd(add.button, span3Cols, classList));
         ret.push(tr);
         
         // BLANK ROW
         tr = document.createElement('tr');
         tr.appendChild(this.blankTd(span3Cols, 'thin'));
         ret.push(tr);
         
         // SUBSCRIBER ROW
         /** @type Subscriber */
         const subscriber = {
             name: '',
             phoneNumber: ''
         };
         tr = document.createElement('tr');
         tr = this.addSubScriberRow(subscriber);
         ret.push(tr);
 
         // RETURN
         return ret;
     }
 
     /** the subscriber section is a blak row and a subscriber row for each subscriber in the array 
      * @param {Subscribers} subscribers - an array of all subscribers to a message
      * @returns returns an array of html table rows
     */
     addSubscribersSection (subscribers) {
 
         var ret = [];
 
         // ONLY 1 KIND OF SPANS ARE NEEDED
         /** @type Spans */
         const span3Cols = {rows: 1, columns: 3};
 
         /** @type Subscriber */
         var subscriber = {
             name: '',
             phoneNumber: ''
         };
 
         // FOR EACH SUBSCRIBER, ADD A BLANK ROW AND THEN A POPULATED SUBSCRIBER ROW
         var tr = null;
         for (var i in subscribers) {
             
             // DATA FOR THIS SUBSCRIBER
             subscriber = subscribers[i];
 
             // CHECK FOR NULL SUBSCRIBER
             if (subscriber.name.length == 0) {
                 break;
             }
             if (typeof subscriber.name == 'null') {
                 break;
             }
 
             // BLANK ROW
             tr = document.createElement('tr');
             tr.appendChild(this.blankTd(span3Cols, 'thin'));
             ret.push(tr);
 
             // SUBSCRIBER ROW
             tr = document.createElement('tr');
             tr = this.addSubScriberRow(subscriber);
             ret.push(tr);
         }
 
         // RETURN
         return ret;
 
     }
 
     /** adds a single subscriber row 
      * @param {Subscriber} subscriber - a single subscriber
      * @returns returns an html row 
     */
     addSubScriberRow (subscriber) {
 
         // SETUP
         var tr = document.createElement('tr');
         /** @type Spans */
         const span1Cols = {rows: 1, columns: 1};
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'button',
             operation: 'add'
         }
 
         // NAME
         classList.type = 'textField';
         classList.operation = 'name';
         var name = new TextField(this.rowData, classList, subscriber.name);
         classList.type = 'hostTd';
         classList.operation = 'control'
         tr.appendChild(this.buildTd(name.textField, span1Cols, classList));
         
         // BLANK
         tr.appendChild(this.blankTd(span1Cols, 'thin'));
         
         // PHONE NUMBER
         classList.type = 'textField';
         classList.operation = 'phoneNumber';
         var pn = subscriber.phoneNumber;
         if (pn.length > 0) {
             pn = pn.slice(0,3) + '-' + pn.slice(3,6) + '-' + pn.slice(6);
         }
         var phoneNumber = new TextField(this.rowData, classList, pn);
         classList.type = 'hostTd'
         classList.operation = 'control';
         tr.appendChild(this.buildTd(phoneNumber.textField, span1Cols, classList));
         
         // ADD THE ROW
         return tr;
 
     }
 }
 
 class New_Message_User_Interface extends Table {
 
     constructor (rowData) {
         const tableId = '_new_message_UI_table';
         const tableClass = 'new_message_UI_table';
         super();
         this.row = 0;
         this.rowData = rowData;
         this.spans = {rows: 3, columns: 1};
         this.table = document.createElement('table');
         this.table.id = this.row + tableId;
         this.table.classList.add(tableClass);
         this.table.appendChild(document.createElement('tbody'));
         this.buildTable();
     }
 
     addAddButtonTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'button',
             operation: 'add_message'
         }
         var addButton = new Button_Add_Message(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(addButton.button, this.spans, classList);
     }
 
     addAddressTextField () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'textField',
             operation: 'address'
         };
         var addressTextField = new TextField_Address(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(addressTextField.textField, this.spans, classList);
     }
 
     addBlankTd () {
         return this.blankTd(this.spans, 'thin');
     }
 
     addMessageTextFieldTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'textField',
             operation: 'message'
         };
         var messageTextField = new TextField_Message(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(messageTextField.textField, this.spans, classList);
     }
 
     addSubscriberUI (tr) {
         var subUI = new Subscriber_User_Interface(this.row, this.rowData);
         var rows = subUI.addNewSubscriberSection();
         for (var i in rows) {
             if (i == 0) {
                 tr.appendChild(rows[i].firstChild);
                 this.table.firstChild.appendChild(tr);
             }else{
                 tr = rows[i];
                 this.table.firstChild.appendChild(tr);
             }
         }
         rows = subUI.addSubscribersSection(this.rowData.subscribers);
         for (var i in rows) {
             tr = rows[i];
             this.table.firstChild.appendChild(tr);
         }
     }
 
     buildTable () {
         var subLen = this.getSubscribersValidLength(this.rowData.subscribers);
         if (subLen > 0) {
             this.spans = {rows: this.spans.rows + 2 * subLen, columns: 1};
         }
         var tr = document.createElement('tr');
         tr.appendChild(this.addAddButtonTd());
         tr.appendChild(this.addBlankTd());
         tr.appendChild(this.addAddressTextField());
         tr.appendChild(this.addBlankTd());
         tr.appendChild(this.addMessageTextFieldTd());
         tr.appendChild(this.addBlankTd());
         this.addSubscriberUI(tr);
     }
             
 }
 
 class Message_User_Interface extends Table {
 
     constructor (row, rowData) {
         super();
         this.row = row;
         this.rowData = rowData;
         this.subLen = this.getSubscribersValidLength(this.rowData.subscribers);
         this.tableRowCount = this.subLen * 2 + 3;
         this.spans1Third = {rows: Math.floor(this.tableRowCount / 2) , columns: 1};
         this.spansHx1 = {rows: this.tableRowCount, columns: 1};
         this.spans1x1 = {rows: 1, columns: 1};
         this.coordinates = {
             updateButton: {row: 0, column: 0},
             interUpdateRemove: {row: Math.floor(this.tableRowCount / 2), column: 0},
             removeButton: {row: Math.floor(this.tableRowCount / 2) + 1, column: 0},
             interBtnsAddress: {row: 0, column: 1},
             addressTextField: {row: 0, column: 2},
             interAddressMessage: {row: 0, column: 3},
             messageTextField: {row: 0, column: 4},
             interMessageSub: {row: 0, column: 5},
             addSubButton: {row: 0, column: 6},
             subs: new Array(this.subLen * 2 - 1)
         }
         this.calculateSubCoordinates();
         this.table = this.createTable();
     }
 
     addUpdateButtonTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'button',
             operation: 'update_message'
         }
         var button = new Button_Update_Message(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(button.button, this.spans1Third, classList);
     }    
 
     addRemoveButtonTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'button',
             operation: 'remove_message'
         }
         var button = new Button_Remove_Message(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(button.button, this.spans1Third, classList);
     } 
 
     addAddressTextFieldTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'textField',
             operation: 'address'
         };
         var addressTextField = new TextField_Address(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(addressTextField.textField, this.spansHx1, classList);
     }
 
     addMessageTextFieldTd () {
         /** @type ClassList */
         var classList = {
             row: this.row.toString(),
             type: 'textField',
             operation: 'message'
         };
         var messageTextField = new TextField_Message(this.rowData, classList);
         classList.type = 'hostTd';
         classList.operation = 'control';
         return this.buildTd(messageTextField.textField, this.spansHx1, classList);
     }
 
     createTable () {
         const flag = '[#]';
         const tableId = 'message_[#]_UI_table';
         const tableClass = 'message_UI_table';
         var table = document.createElement('table');
         table.id = tableId.replace(flag, this.row.toString());
         table.classList.add(tableClass);
         table.appendChild(document.createElement('tbody'));
         this.populateTable(this.tableRowCount, table.firstChild);
         return(table);
     }
 
     populateTable (rowCount, tableBody) {
         var tr = null;
         for (var i = 0; i < rowCount; i++) {
             tr = document.createElement('tr');
             tableBody.appendChild(tr);
         }
         for (var key in this.coordinates) {
             this.addElement(key, this.coordinates[key], tableBody);
         }
     }
 
     addElement (key, coordinates, tableBody) {
         if (key != 'subs') {
             var tr = tableBody.childNodes[coordinates.row];
         }
         switch (key) {
             case 'updateButton':
                 tr.appendChild(this.addUpdateButtonTd());
                 break;
             case 'interUpdateRemove':
                 tr.appendChild(this.blankTd(this.spans1x1, 'thin'));
                 break;
             case 'removeButton':
                 tr.appendChild(this.addRemoveButtonTd());
                 break;
             case 'interBtnsAddress':
                 tr.appendChild(this.blankTd(this.spansHx1, 'thin'));
                 break;
             case 'addressTextField':
                 tr.appendChild(this.addAddressTextFieldTd());
                 break;
             case 'interAddressMessage':
                 tr.appendChild(this.blankTd(this.spansHx1, 'thin'));
                 break
             case 'messageTextField':
                 tr.appendChild(this.addMessageTextFieldTd());
                 break;
             case 'interMessageSub':
                 tr.appendChild(this.blankTd(this.spansHx1, 'thin'));
                 break;
             case 'subs':
                 var tr = null;
                 var subUI = new Subscriber_User_Interface(this.row, this.rowData);
                 var subs = subUI.addNewSubscriberSection();
                 var subs = subs.concat(subUI.addSubscribersSection(this.rowData.subscribers));
                 for (var i = 0; i < subs.length; i++) {
                     tr = tableBody.childNodes[coordinates[i].row];
                     if (i == 0) {
                         tr.appendChild(subs[i].firstChild);
                     } else {
                         for (var j = 0; j < subs[i].childNodes.length; j++) {
                             tr.appendChild(subs[i].childNodes[j].cloneNode(true));
                         }
                     }
                 }
                 break;
         }
     }
 
     calculateSubCoordinates () {
         for (var i = 0; i < 3; i++){
             this.coordinates.subs[i] = {row: i, column: 6};
         }
         if (this.subLen == 0) {
             return;
         }
         for (var i = 3; i < this.tableRowCount; i++) {
             this.coordinates.subs[i] = {row: i, column: 6};
         }
     }
 
 }
 
 class Base_Table extends Table {
 
     constructor (data, tableId, buttonNumber) {
         super();
         this.buttonNumber = buttonNumber;
         this.data = data;
         this.table = document.createElement("table");
         this.table.classList.add(tableId);
         this.table.id = tableId;
         this.table.appendChild(document.createElement("tbody"));
         this.addNewMessageTable(this.table.firstChild);
         if (this.data.length > 0) {
             this.addMessageTable(this.table.firstChild);
         }
     }
 
     addNewMessageTable (tableBody) {
         /** @type Subscribers */
         const subscribers = [
             {
                 name: '',
                 phoneNumber: ''
             }
         ];
         /** @type RowData */
         const rowData = {
             address: '000' + this.buttonNumber,
             message: '',
             subscribers: subscribers
         }
         var nmt = new New_Message_User_Interface(rowData);
         var tr = document.createElement('tr');
         var td = document.createElement('td');
         td.id = 'new_message_table_host_td'
         td.appendChild(nmt.table);
         tr.appendChild(td);
         tableBody.appendChild(tr);
         tableBody.appendChild(this.blankTr({rows: 1, columns: 1}, 'thick'));
     }
 
     addMessageTable (tableBody) {
         const flag = '[#]';
         const trId = 'message_[#]_table_host_tr';
         const trClass = 'message_[#]_table_host_tr';
         const tdId = 'message_[#]_table_host_td';
         const tdClass = 'message_[#]_table_host_td';
         var rowData = null;
         var row = 0;
         var table = null;
         var tr = null;
         var td = null;
         for (var i in this.data) {
             rowData = this.data[i];
             row = parseInt(i) + 1;
             table = new Message_User_Interface(row, rowData);
             tr = document.createElement('tr');
             tr.id = trId.replace(flag, row.toString());
             tr.classList.add(trClass.replace(flag, row.toString()));
             td = document.createElement('td');
             td.id = tdId.replace(flag, row.toString());
             td.classList.add(tdClass.replace(flag, row.toString()));
             td.appendChild(table.table);
             tr.appendChild(td);
             tableBody.appendChild(tr);
             tableBody.appendChild(this.blankTr({rows: 1, columns: 1}, 'thick'));
         }
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
 
 async function updateTable(address){
     var data = await apiQuery(address);
     var table = new Base_Table(data["Items"], queryId, address.slice(-1));
     addTable(table.table);
 }
 
 function changeButton(){
     var stopHere = true;
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
         var table = new Base_Table(data["Items"], queryId, thisButton.id.slice(-1));
         try{
             removeTable(queryId);
         }
         catch{
         }
         finally{
             addTable(table.table);
         }
     }else{
         try{
             removeTable(queryId);
         }catch{}
     }
 }