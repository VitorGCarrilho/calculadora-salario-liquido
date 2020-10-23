import { NetSalaryController } from './controllers/net-salary-controller.js';

const controller = new NetSalaryController()
document.getElementById('submit').addEventListener('click', controller.submit);

