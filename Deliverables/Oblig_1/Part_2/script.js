// Elements
const currencyInput = document.getElementById('currency-input');
const searchInput = document.getElementById('search-input');
const addButton = document.getElementById('add-button');
const currencyList = document.getElementById('currency-list');

// Functions
function addCurrency(currencyName) {
    const name = currencyName.trim();
    if (name === '') return;
    
    const currencies = Array.from(currencyList.getElementsByTagName('li'));
    const exists = currencies.some(li => 
        li.textContent.toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
        alert('This currency is already in the list!');
        return;
    }
    
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = name;
    
    li.appendChild(span);
    addDeleteButton(li);
    currencyList.appendChild(li);
    currencyInput.value = '';
    
    updateDisplay();
}

function addDeleteButton(li) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => currencyList.removeChild(li));
    li.appendChild(deleteButton);
}

function startsWithCaseInsensitive(element, searchWord) {
    return element.toLowerCase().startsWith(searchWord.toLowerCase());
}

function filterList(list, searchWord) {
    if (!searchWord) return list;
    
    return list.filter(item => {
        const textContent = item.querySelector('span').textContent;
        return startsWithCaseInsensitive(textContent, searchWord);
    });
}

function updateDisplay() {
    const searchTerm = searchInput.value.trim();
    const allItems = Array.from(currencyList.getElementsByTagName('li'));
    
    if (searchTerm) {
        const filteredItems = filterList(allItems, searchTerm);
        allItems.forEach(item => {
            item.style.display = filteredItems.includes(item) ? 'flex' : 'none';
        });
    } else {
        allItems.forEach(item => {
            item.style.display = 'flex';
        });
    }
}

// Add initial currencies
window.addEventListener('DOMContentLoaded', () => {
    ['Euro', 'Norwegian Kroner', 'Canadian Dollar'].forEach(currency => {
        addCurrency(currency);
    });
});

// Event Listeners
addButton.addEventListener('click', () => {
    addCurrency(currencyInput.value.trim());
});

// document.addEventListener('keydown', (e) => {
//     // Check if backspace is pressed and the input is empty
//     if (e.key === 'Backspace' && currencyInput.value === '') {
//         const lastItem = currencyList.lastElementChild;
//         if (lastItem) {
//             currencyList.removeChild(lastItem);
//         }
//     }
// });

currencyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCurrency(currencyInput.value.trim());
    }
});

searchInput.addEventListener('input', updateDisplay);