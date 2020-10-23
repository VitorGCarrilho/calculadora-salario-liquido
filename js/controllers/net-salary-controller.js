import { NetSalaryView } from './../views/net-salary-view.js';
import { Inss } from './../models/Inss.js';
import { Irrf } from './../models/Irrf.js';
import { NetSalaryService } from './../services/net-salary-service.js'

export class NetSalaryController {
    submit(e) {
        e.preventDefault();
    
        const grossSalary = document.getElementById('inputSalary').value;
        const dependent = document.getElementById('inputDependent').value;
    
        const view = new NetSalaryView();
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
}