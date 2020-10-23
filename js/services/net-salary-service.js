export class NetSalaryService{
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