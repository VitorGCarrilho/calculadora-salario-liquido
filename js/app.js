import { NetSalaryController } from './controllers/net-salary-controller.js';

const controller = new NetSalaryController()
document.getElementById('submit').addEventListener('click', controller.submit);
setupMaskMoney();


function setupMaskMoney() {
    SimpleMaskMoney.setMask(document.getElementById('inputSalary'), {
            allowNegative: false,
            negativeSignAfter: false,
            prefix: 'R$ ',
            suffix: '',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
        }
    );
}

