// ====================
// ELEMENTS
// ====================
// Currency App Elements
const currencyInput = document.getElementById('currency-input');
const searchInput = document.getElementById('search-input');
const addButton = document.getElementById('add-button');
const currencyList = document.getElementById('currency-list');

// Population App Elements
const countryInput = document.getElementById('country-input');
const addCountryButton = document.getElementById('add-country');
const populationList = document.getElementById('population-list');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Functions
function addCurrency(currencyName) {
    const name = currencyName.trim();
    if (name === '') return;
    
    const currencies = Array.from(currencyList.getElementsByTagName('li'));
    const exists = currencies.some(li => {
        // Get only the text content of the span (excluding the delete button)
        const span = li.querySelector('span');
        return span && span.textContent.toLowerCase() === name.toLowerCase();
    });
    
    if (exists) {
        // Only show alert for user-initiated additions, not initial population
        if (currencyInput && currencyInput.value) {
            alert('This currency is already in the list!');
        }
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

// Initialize the currency list with default values
function initializeCurrencies() {
    // Clear existing list items
    while (currencyList.firstChild) {
        currencyList.removeChild(currencyList.firstChild);
    }
    
    // Add initial currencies directly to avoid duplicate checks
    const initialCurrencies = ['Euro', 'Norwegian Kroner', 'Canadian Dollar'];
    initialCurrencies.forEach(currency => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = currency;
        li.appendChild(span);
        addDeleteButton(li);
        currencyList.appendChild(li);
    });
    
    // Update the display
    updateDisplay();
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCurrencies);
} else {
    initializeCurrencies();
}

// ====================
// TAB FUNCTIONALITY
// ====================
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// ====================
// CURRENCY APP (Assignments 1-4)
// ====================
addButton.addEventListener('click', () => {
    addCurrency(currencyInput.value.trim());
});

currencyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCurrency(currencyInput.value.trim());
    }
});

searchInput.addEventListener('input', updateDisplay);

// ====================
// POPULATION APP (Assignments 5-6)
// ====================
// Mock country data since the population.io API is not working
const mockCountries = [
    'Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland',
    'Germany', 'France', 'Spain', 'Italy', 'United Kingdom',
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
    'China', 'Japan', 'South Korea', 'India', 'Australia'
];

// Mock population data
const mockPopulations = {
    'Norway': 5421241,
    'Sweden': 10353442,
    'Denmark': 5831404,
    'Finland': 5540720,
    'Iceland': 366425,
    'Germany': 83783942,
    'France': 65273511,
    'Spain': 46754778,
    'Italy': 60461826,
    'United Kingdom': 67886011,
    'United States': 331002651,
    'Canada': 37742154,
    'Mexico': 128932753,
    'Brazil': 212559417,
    'Argentina': 45195774,
    'China': 1439323776,
    'Japan': 126476461,
    'South Korea': 51269185,
    'India': 1380004385,
    'Australia': 25499884
};

let populationData = {}; // Cache for population data

// Mock fetch countries
function fetchCountries() {
    return mockCountries;
}

// Mock fetch population data
async function fetchPopulationData(country) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPopulations[country] || null;
}

// Add a country to the population list
async function addCountry(countryName) {
    const name = countryName.trim();
    if (!name) return;

    // Check if country is valid (case-insensitive match)
    const normalizedInput = name.toLowerCase();
    const country = mockCountries.find(c => c.toLowerCase() === normalizedInput);
    
    if (!country) {
        alert('Country not found. Please enter a valid country name.\n\nTry: ' + 
              mockCountries.slice(0, 5).join(', ') + '...');
        return;
    }

    // Check if already in the list
    if (populationData[country]) {
        alert('This country is already in the list!');
        return;
    }

    // Show loading state
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-msg';
    loadingMsg.textContent = `Fetching population data for ${country}...`;
    populationList.appendChild(loadingMsg);

    try {
        // Fetch population data
        const population = await fetchPopulationData(country);
        
        // Remove loading message
        populationList.removeChild(loadingMsg);
        
        if (population === null) {
            alert('Could not fetch population data for this country.');
            return;
        }

        // Add to data cache
        populationData[country] = {
            population: population,
            element: null,
            lastUpdate: Date.now()
        };

        // Create and add list item
        updatePopulationDisplay(country);
        
        // Start population counter if not already running
        if (Object.keys(populationData).length === 1) {
            startPopulationCounter();
        }
    } catch (error) {
        populationList.removeChild(loadingMsg);
        alert('An error occurred while fetching population data.');
        console.error('Error in addCountry:', error);
    }
}

// Update the population display for a country
function updatePopulationDisplay(country) {
    const data = populationData[country];
    if (!data) return;
    
    const now = Date.now();
    const timeSinceLastChange = now - (data.lastChangeTime || now);
    
    // Create new element if it doesn't exist
    if (!data.element) {
        const item = document.createElement('div');
        item.className = 'population-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'population-name';
        nameSpan.textContent = country;
        
        const popSpan = document.createElement('span');
        popSpan.className = 'population-count';
        popSpan.textContent = data.population.toLocaleString();
        
        // Add change indicator
        const changeSpan = document.createElement('span');
        changeSpan.className = 'population-change';
        changeSpan.textContent = '';
        
        item.appendChild(nameSpan);
        item.appendChild(popSpan);
        item.appendChild(changeSpan);
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.title = 'Remove country';
        deleteBtn.setAttribute('aria-label', `Remove ${country}`);
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteCountry(country);
        };
        
        // Make the whole item clickable for potential future features
        item.onclick = () => {
            // Could show more details in the future
            console.log(`Selected ${country}`);
        };
        
        item.appendChild(deleteBtn);
        populationList.appendChild(item);
        data.element = { item, popSpan, changeSpan };
    } else {
        // Update existing element with animation
        const { popSpan, changeSpan } = data.element;
        const oldValue = parseInt(popSpan.textContent.replace(/,/g, '')) || data.population;
        const change = data.population - oldValue;
        
        // Only show change if it's significant and we have a previous value
        if (Math.abs(change) > 0 && timeSinceLastChange < 5000) {
            changeSpan.textContent = change > 0 ? `+${change.toLocaleString()}` : change.toLocaleString();
            changeSpan.className = `population-change ${change > 0 ? 'population-increase' : 'population-decrease'}`;
            
            // Fade out the change indicator after 3 seconds
            setTimeout(() => {
                if (data.element?.changeSpan) {
                    data.element.changeSpan.textContent = '';
                }
            }, 3000);
        }
        
        // Animate the population count
        const duration = 500; // Animation duration in ms
        const start = oldValue;
        const end = data.population;
        const startTime = performance.now();
        
        const animateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-in-out function
            const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
            const currentValue = Math.floor(start + (end - start) * easedProgress);
            
            if (popSpan) {
                popSpan.textContent = currentValue.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateCount);
            } else if (popSpan) {
                popSpan.textContent = end.toLocaleString();
            }
        };
        
        requestAnimationFrame(animateCount);
    }
    
    // Update the last population and timestamp
    data.lastPopulation = data.population;
    data.lastChangeTime = now;
}

// Update population counts with realistic changes
function updatePopulationCounts() {
    const now = Date.now();
    
    Object.entries(populationData).forEach(([country, data]) => {
        // Calculate time passed since last update (in hours)
        const hoursPassed = (now - (data.lastUpdate || now)) / (1000 * 60 * 60);
        
        // Calculate population change based on birth rate (per 1000 people per year)
        // Using approximate global average birth rate of 18 per 1000 per year
        const birthRate = 18 / (365 * 24); // Births per hour per 1000 people
        const deathsRate = 8 / (365 * 24);  // Deaths per hour per 1000 people
        
        // Calculate net change
        const netChange = (birthRate - deathsRate) * (data.population / 1000) * hoursPassed;
        
        // Add some randomness and round to nearest integer
        const change = Math.round(netChange * (0.8 + Math.random() * 0.4));
        
        // Update population and timestamp
        data.population = Math.max(0, data.population + change);
        data.lastUpdate = now;
        
        updatePopulationDisplay(country);
    });
}

// Start the population counter
let populationInterval;
function startPopulationCounter() {
    if (populationInterval) return;
    
    populationInterval = setInterval(() => {
        if (Object.keys(populationData).length === 0) {
            clearInterval(populationInterval);
            populationInterval = null;
            return;
        }
        updatePopulationCounts();
    }, 1000);
}

// Delete a country from the population list
function deleteCountry(country) {
    if (!populationData[country]) return;
    
    const { element } = populationData[country];
    if (element && element.item) {
        // Add fade-out animation
        element.item.style.opacity = '0';
        element.item.style.transition = 'opacity 0.3s ease';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (element.item && element.item.parentNode) {
                populationList.removeChild(element.item);
            }
        }, 300);
    }
    
    delete populationData[country];
    
    // Stop the counter if no more countries
    if (Object.keys(populationData).length === 0 && populationInterval) {
        clearInterval(populationInterval);
        populationInterval = null;
    }
}

// Event Listeners for Population App
addCountryButton.addEventListener('click', () => {
    addCountry(countryInput.value.trim());
    countryInput.value = '';
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCountry(countryInput.value.trim());
        countryInput.value = '';
    }
});

// Initialize
fetchCountries();

// ====================
// INITIALIZATION
// ====================
// Add initial currencies
window.addEventListener('DOMContentLoaded', () => {
    ['Euro', 'Norwegian Kroner', 'Canadian Dollar'].forEach(currency => {
        addCurrency(currency);
    });
});