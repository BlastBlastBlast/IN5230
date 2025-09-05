// --------------------------
// GLOBAL VARIABLES
// --------------------------
// Currency Array
let addedCurrencies = [];

// --------------------------
// FUNCTIONS
// --------------------------

function addCurrency(currency) {
    const currencyList = document.getElementById('currencyList');
    const listItem = createListItem(currency);
    currencyList.appendChild(listItem);
    addedCurrencies.push(currency);
}

function createDeleteButton(currency, listItem) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.className = 'deleteButton';
    button.onclick = function() {
        listItem.remove();
        addedCurrencies = addedCurrencies.filter(item => {
            if (item !== currency) {
                return true;
            } else {
                return false;
            }
        });
    };
    return button;
}

function createListItem(currency) {
    const listItem = document.createElement('li');
    listItem.textContent = currency;

    const deleteButton = createDeleteButton(currency, listItem);
    listItem.appendChild(deleteButton);
    return listItem;
}

function startsWithElement(element, searchWord) {
    return element.toLowerCase().startsWith(searchWord.toLowerCase());
}

function filterListBySearchWord(list, searchWord) {
    return list.filter(element => startsWithElement(element, searchWord));
}

function updateCurrencyList(searchWord) {
    const currencyList = document.getElementById('currencyList');
    currencyList.innerHTML = '';

    let displayList;
    if (searchWord) {
        displayList = filterListBySearchWord(addedCurrencies, searchWord);
    } else {
        displayList = addedCurrencies;
    }

    displayList.forEach(currency => {
        const listItem = createListItem(currency);
        currencyList.appendChild(listItem);
    });
}

// --------------------------
// EVENT LISTENERS
// --------------------------

// Add button appends to currency list
document.getElementById('addButton').addEventListener('click', function() {
    const input = document.getElementById('currencyInput');
    const currency = input.value.trim();
    if (currency) {
        addCurrency(currency);
        input.value = '';
    }
});

// Enter key appends to currency list
document.getElementById('currencyInput').addEventListener('keydown', function(kbEvent) {
    if (kbEvent.key === 'Enter') {
        const currency = kbEvent.target.value.trim();
        if (currency) {
            addCurrency(currency);
            kbEvent.target.value = '';
        }
    }
});

// Search input updates the currency list
document.getElementById('searchInput').addEventListener('input', function(pageEvent) {
    const searchWord = pageEvent.target.value.trim();
    updateCurrencyList(searchWord);
});