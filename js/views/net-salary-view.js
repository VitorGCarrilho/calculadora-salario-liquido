export class NetSalaryView {

    constructor() {
        this.clearPreviewResult();
    }


    clearPreviewResult = function () {
        document.getElementById("row-header").innerHTML = "";
        document.getElementById("table-body").innerHTML = ""
    }

    showResult = function (deductions) {
        this.showHeader("Evento", "Ref.", "Proventos", "Descontos");
        this.showBody(deductions);
    }

    showHeader = function (...headerColumns) {
        const header = document.getElementById("row-header");
        headerColumns.forEach(headerColumn => this.addTableElement(header, "TH", "col", headerColumn));
    }

    showBody = function (deductions) {
        const body = document.getElementById("table-body");
        this.addTableLine(body, "Salário Bruto", "-", `R$ ${deductions.grossSalary.toFixed(2)}`, "-");
        this.addTableLine(body, "INSS", `${deductions.inss.percentage}%`, "-", `R$ ${deductions.inss.value.toFixed(2)}`);
        this.addTableLine(body, "IRRF", `${deductions.irrf.percentage}%`, "-", `R$ ${deductions.irrf.value.toFixed(2)}`);
        this.addTableLine(body, "Totais", "-", `R$ ${deductions.grossSalary}`, `R$ ${(deductions.inss.value + deductions.irrf.value).toFixed(2)}`);
        this.addTableLine(body, "Salario Liquido", "", "", `R$ ${(deductions.grossSalary - (deductions.inss.value + deductions.irrf.value)).toFixed(2)}`);

    }

    addTableLine = function (body, rowHeader, ...tableDataText) {
        const row = document.createElement("tr");
        this.addTableElement(row, "TH", "row", rowHeader);
        tableDataText.forEach(text => this.addTableElement(row, "TD", null, text))
        body.appendChild(row);
    }


    addTableElement = function (row, element, scope, text) {
        const tableElement = document.createElement(element);
        const textNode = document.createTextNode(text);
        if (scope) {
            tableElement.setAttribute("scope", scope);
        }
        tableElement.appendChild(textNode);
        row.appendChild(tableElement);
    }

    createAlert = function(message) {
        const alertDiv = document.getElementById('alert-div');
    
        const div = document.createElement("DIV");
        const text = document.createTextNode(message);
        const button = document.createElement("BUTTON");
        const span = document.createElement("SPAN");
    
        div.classList.add("alert");
        div.classList.add("alert-danger");
    
        button.classList.add("close");
        button.setAttribute("type", "button");
        button.setAttribute("data-dismiss", "alert");
        button.setAttribute("aria-label", "Close");
    
        span.setAttribute("aria-hidden", "true");
        span.appendChild(document.createTextNode('x'));
    
    
        div.appendChild(text);
        div.appendChild(button);
        button.appendChild(span);
        alertDiv.appendChild(div);
    }

}