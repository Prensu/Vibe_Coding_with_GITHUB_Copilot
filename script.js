document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calculator-buttons button');
    let currentInput = '';
    let operator = '';
    let firstOperand = '';
    let resultDisplayed = false;

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            if (value >= '0' && value <= '9' || value === '.') {
                if (resultDisplayed) {
                    currentInput = '';
                    resultDisplayed = false;
                }
                currentInput += value;
                display.value = currentInput;
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput === '' && value === '-') {
                    currentInput = '-';
                    display.value = currentInput;
                    return;
                }
                if (currentInput !== '') {
                    firstOperand = currentInput;
                    operator = value;
                    currentInput = '';
                }
            } else if (value === '=') {
                if (firstOperand !== '' && operator !== '' && currentInput !== '') {
                    let expression = firstOperand + operator + currentInput;
                    try {
                        let result = eval(expression);
                        display.value = result;
                        currentInput = result.toString();
                        firstOperand = '';
                        operator = '';
                        resultDisplayed = true;
                    } catch {
                        display.value = 'Error';
                        currentInput = '';
                        firstOperand = '';
                        operator = '';
                    }
                }
            } else if (this.id === 'clear') {
                currentInput = '';
                firstOperand = '';
                operator = '';
                display.value = '';
            }
        });
    });
});
