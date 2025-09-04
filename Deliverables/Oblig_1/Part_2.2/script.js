// Store added currencies in an array
let addedCurrencies = [];

// --------------------------
// FUNCTIONS
// --------------------------

// Function to add a currency to the list
function addCurrency(currency) {
    const currencyList = document.getElementById('currencyList');
    const listItem = createListItem(currency);
    currencyList.appendChild(listItem);
    addedCurrencies.push(currency);
}

// Function to create a delete button for a list item
function createDeleteButton(currency, listItem) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.className = 'deleteButton';
    button.onclick = function() {
        listItem.remove();
        addedCurrencies = addedCurrencies.filter(item => item !== currency);
    };
    return button;
}

// Function to create a list item with a delete button
function createListItem(currency) {
    const listItem = document.createElement('li');
    listItem.textContent = currency;

    const deleteButton = createDeleteButton(currency, listItem);
    listItem.appendChild(deleteButton);
    return listItem;
}

// Function to check if an element starts with a search word
function startsWithElement(element, searchWord) {
    return element.toLowerCase().startsWith(searchWord.toLowerCase());
}

// Function to filter the list by search word
function filterListBySearchWord(list, searchWord) {
    return list.filter(element => startsWithElement(element, searchWord));
}

// Function to update the displayed currency list
function updateCurrencyList(searchWord) {
    const currencyList = document.getElementById('currencyList');
    currencyList.innerHTML = ''; // Clear the current list

    // Determine which list to display
    // If searchWord       -> Filter currencies by input
    // else                -> Display all added currencies
    const displayList = searchWord ? filterListBySearchWord(addedCurrencies, searchWord) : addedCurrencies;

    displayList.forEach(currency => {
        const listItem = createListItem(currency);
        currencyList.appendChild(listItem);
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
document.getElementById('currencyInput').addEventListener('keydown', function(kbEvent) {
    if (kbEvent.key === 'Enter') {
        const currency = kbEvent.target.value.trim();
        if (currency) {
            addCurrency(currency);
            kbEvent.target.value = '';
        }
    }
});

// Search input updates the list
document.getElementById('searchInput').addEventListener('input', function(pageEvent) {
    const searchWord = pageEvent.target.value.trim();
    updateCurrencyList(searchWord);
});