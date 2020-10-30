export class Irrf {
    constructor(grossSalary, dependent, inssDeduction) {
        this.grossSalary = grossSalary;
        this.dependent = dependent
        this.inssDeduction = inssDeduction
    }

    getIrrfDeduction = () => {
        const calculationBase = this.getCalculationBase();
        const aliquot = this.findIrrfAliquot(calculationBase);
        const irrf = calculationBase * (aliquot.percentage / 100) - aliquot.deduction;
        return {
            value: irrf,
            percentage: aliquot.percentage
        }
    }

    getCalculationBase = () => {
        return this.grossSalary - this.inssDeduction.value - 0 - this.dependent * 189.59;
    }

    findIrrfAliquot = (calculationBase) => {
        const irrfAliquot = this.getIrrfAliquot();
        const aliquot = irrfAliquot.base.filter(b => b.min <= calculationBase && b.max >= calculationBase)[0];
        return aliquot;
    }


    getIrrfAliquot = () => {
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