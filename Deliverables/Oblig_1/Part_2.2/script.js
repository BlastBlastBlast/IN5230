// Store added currencies in an array
let addedCurrencies = [];

// --------------------------
// FUNCTIONS
// --------------------------

function addCurrency(currency) {
    const ul = document.getElementById('currencyList');
    const li = document.createElement('li');
    li.textContent = currency;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.className = 'deleteButton';
    deleteBtn.onclick = function() {
        ul.removeChild(li);
        addedCurrencies = addedCurrencies.filter(item => item !== currency); // Remove from added list
    }
    
    li.appendChild(deleteBtn);
    ul.appendChild(li);
    addedCurrencies.push(currency); // Add to the list of added currencies
}

function startsWithElement(element, searchWord) {
    return element.toLowerCase().startsWith(searchWord.toLowerCase());
}

function filterListBySearchWord(list, searchWord) {
    return list.filter(element => startsWithElement(element, searchWord));
}

function updateCurrencyList(searchWord) {
    const ul = document.getElementById('currencyList');
    ul.innerHTML = ''; // Clear the current list

    // Determine which list to display
    const displayList = searchWord ? filterListBySearchWord(addedCurrencies, searchWord) : addedCurrencies;

    // Add filtered or full list to the display
    displayList.forEach(currency => {
        const li = document.createElement('li');
        li.textContent = currency;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.className = 'deleteButton';
        deleteBtn.onclick = function() {
            ul.removeChild(li);
            addedCurrencies = addedCurrencies.filter(item => item !== currency); // Remove from added list
        }

        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

// --------------------------
// EVENT LISTENERS
// --------------------------
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

// Search input updates the list
document.getElementById('searchInput').addEventListener('input', function() {
    const searchWord = this.value.trim();
    updateCurrencyList(searchWord);
});