document.getElementById('submit').addEventListener('click', startToCalculate);

function startToCalculate(e) {
    e.preventDefault();

    const grossSalary = document.getElementById('inputSalary').value;
    const dependent = document.getElementById('inputDependent').value;

    const view = new View();
    const inss = new Inss(grossSalary);
    const inssDeduction = inss.getInssDeduction();
    const irrf = new Irrf(grossSalary, dependent, inssDeduction)
    const service = new NetSalaryService();

    const validation = service.validate(grossSalary, dependent);

    if (validation.hasErrors) {
        validation.messages
            .forEach(message => view.createAlert(message));
        return;
    }

    const deductions = service.getDeductions(inss, irrf);

    view.showResult(deductions);

}

class View {

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

class Inss {

    constructor(grossSalary) {
        this.grossSalary = grossSalary;
    }

    getInssDeduction = function () {
        const inssBase = this.getInssBase();
        const percentage = this.getInssPercentage(inssBase)
        const inssToPay = this.calculateInssToPay(percentage, inssBase.maxValue)
        return {
            value: inssToPay,
            percentage: percentage
        }
    }

    calculateInssToPay = function (percentage, maxValue) {
        let inssToPay = this.grossSalary * (percentage / 100);
        return inssToPay > maxValue ? maxValue : inssToPay;
    }

    getInssPercentage = function (inssBase) {
        let percentage;
        inssBase.base.forEach(b => {
            if (b.min <= this.grossSalary && b.max >= this.grossSalary) {
                percentage = b.percentage;
            }
        });
        return percentage;
    }

    getInssBase = function () {
        return {
            maxValue: 713.1,
            base: [
                {
                    min: 0,
                    max: 1045,
                    percentage: 7.5
                },
                {
                    min: 1045.01,
                    max: 2089.6,
                    percentage: 9
                },
                {
                    min: 2089.61,
                    max: 3134.4,
                    percentage: 12
                },
                {
                    min: 3134.41,
                    max: 6101.06,
                    percentage: 14
                },
                {
                    min: 6101.07,
                    max: Number.POSITIVE_INFINITY,
                    percentage: 14
                }
            ]
        };
    }
}

class Irrf {
    constructor(grossSalary, dependent, inssDeduction) {
        this.grossSalary = grossSalary;
        this.dependent = dependent
        this.inssDeduction = inssDeduction
    }

    getIrrfDeduction = function () {
        const calculationBase = this.getCalculationBase();
        const aliquot = this.findIrrfAliquot(calculationBase);
        const irrf = calculationBase * (aliquot.percentage / 100) - aliquot.deduction;
        return {
            value: irrf,
            percentage: aliquot.percentage
        }
    }

    getCalculationBase = function () {
        return this.grossSalary - this.inssDeduction.value - 0 - this.dependent * 189.59;
    }

    findIrrfAliquot = function (calculationBase) {
        const irrfAliquot = this.getIrrfAliquot();
        const aliquot = irrfAliquot.base.filter(b => b.min <= calculationBase && b.max >= calculationBase)[0];
        return aliquot;
    }


    getIrrfAliquot = function () {
        return {
            base: [
                {
                    min: 0,
                    max: 1909.98,
                    percentage: 0,
                    deduction: 0
                },
                {
                    min: 1909.99,
                    max: 2826.65,
                    percentage: 7.5,
                    deduction: 142.8
                },
                {
                    min: 2826.66,
                    max: 3751.05,
                    percentage: 15,
                    deduction: 354.8
                },
                {
                    min: 3751.06,
                    max: 4664.68,
                    percentage: 22.5,
                    deduction: 636.13
                },
                {
                    min: 4664.69,
                    max: Number.POSITIVE_INFINITY,
                    percentage: 27.5,
                    deduction: 869.36
                }
            ]
        }
    }
}


class NetSalaryService{
    getDeductions = function(inssObj, irrfObj) {
        const inss = inssObj.getInssDeduction();
        const irrf = irrfObj.getIrrfDeduction();
        return {
            grossSalary: parseFloat(irrfObj.grossSalary),
            inss: inss,
            irrf: irrf
        }
    }

    validate = function(grossSalary, dependent) {
        const messages = this.findErrors(grossSalary, dependent);
        const alertDiv = document.getElementById('alert-div');
        alertDiv.innerHTML = '';
        return {
            hasErrors: messages.length > 0,
            messages: messages
        }
    }

    findErrors = function(grossSalary, dependent) {
        const messages = [];
    
        if (isNaN(grossSalary)) {
            messages.push('Salário Bruto deve ser um numero valido');
        }
    
        if (grossSalary < 1045) {
            messages.push('Salário Bruto deve ser maior que salário mínimo. (salário mínimo vigente: R$ 1045,00)');
        }
    
        if (isNaN(dependent)) {
            messages.push('Numero de Dependente deve ser um numero valido');
        }
    
        if (dependent < 0) {
            messages.push('Numero de Dependentes deve ser um numero postivio');
        }
    
        return messages;
    }
}










