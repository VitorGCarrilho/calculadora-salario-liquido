export class Inss {

    constructor(grossSalary) {
        this.grossSalary = grossSalary;
    }

    getInssDeduction = () => {
        const inssBase = this.getInssBase();
        const percentage = this.getInssPercentage(inssBase)
        const inssToPay = this.calculateInssToPay(percentage, inssBase.maxValue)
        return {
            value: inssToPay,
            percentage: percentage
        }
    }

    calculateInssToPay = (percentage, maxValue) => {
        let inssToPay = this.grossSalary * (percentage / 100);
        return inssToPay > maxValue ? maxValue : inssToPay;
    }

    getInssPercentage = (inssBase) => {
        let percentage;
        inssBase.base.forEach(b => {
            if (b.min <= this.grossSalary && b.max >= this.grossSalary) {
                percentage = b.percentage;
            }
        });
        return percentage;
    }

    getInssBase = () => {
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