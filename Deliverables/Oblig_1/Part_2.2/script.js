// Functions
function addCurrency(currency) {
    const ul = document.getElementById('currencyList');
    const li = document.createElement('li');
    li.textContent = currency;
    ul.appendChild(li);
}

// Event listeners
// Add button appends to list
document.getElementById('addButton').addEventListener('click', function() {
    const input = document.getElementById('currencyInput').value.trim();
    const currency = input;
    if (currency) {
        addCurrency(currency);
        currencyInput.value = '';
    }
});

// Enter key appends to list
document.getElementById('currencyInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const currency = this.value.trim();
        if (currency) {
            addCurrency(currency);
            this.value = ''; // Clear the text-box
        }
    }
});