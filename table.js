class Table{

    constructor(data, label){
        this.data = data;
        this.label = label;
        this.table = buildTable;
    }

    buildTable(address, data, label){
        var table = document.createElement("table");
        table.className += label;
        table.id = label;
        table.appendChild(dataEntryRow(address));
        table.appendChild(blankRow());
        for (const entry in data){
            table.appendChild(buildTr(data[entry], label));
            buildSubTd(table, data[entry]["subscribers"], label);
            if (parseInt(entry) < data.length - 1){
                table.appendChild(blankRow());
            }
        }
        return table;
    }

    buildTr(data, label){
        var tr = document.createElement("tr");
        tr.className += label;
        var rowSpan = data["subscribers"].length;
        tr.appendChild(addRemoveButton(data));
        tr.appendChild(buildTd(data["address"], rowSpan, label));
        tr.appendChild(buildTd(data["message"], rowSpan, label));
        return tr
    }

    buildTd(data, rowSpan, label){
        var td = document.createElement("td");
        td.className += label;
        td.id = label;
        td.rowSpan = rowSpan;
        td.appendChild(document.createTextNode(data));
        return td
    }

    blankRow(){
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

    get drawTable(){
        return this.table;
    }    

}