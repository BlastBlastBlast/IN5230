// Functions
function addCurrency(currency) {
    const ul = document.getElementById('currencyList');
    const li = document.createElement('li');
    li.textContent = currency;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.className = 'deleteButton';
    deleteBtn.onclick = function() {
        ul.removeChild(li);
    }
    
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

// Event listeners
// Add button appends to list
document.getElementById('addButton').addEventListener('click', function() {
    const input = document.getElementById('currencyInput');
    const currency = input.value.trim();
    if (currency) {
        addCurrency(currency);
        input.value = '';
    }
});

// Enter key appends to list
document.getElementById('currencyInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const currency = this.value.trim();
        if (currency) {
            addCurrency(currency);
            this.value = '';
        }
    }
});