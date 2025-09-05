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
function initializeApp() {
    initializeCurrencies();
    
    // Initialize tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Start the population counter if we have population data
    if (Object.keys(populationData).length > 0) {
        startPopulationCounter();
    }
}

// Check if the DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

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
const POPULATION_API_BASE = 'https://d6wn6bmjj722w.population.io/1.0';
let populationData = {}; // Cache for population data
let supportedCountries = [];

// Fetch list of supported countries from the API
async function fetchCountries() {
    // If we already have countries, return them
    if (supportedCountries.length > 0) {
        return supportedCountries;
    }
    
    const response = await fetch(`${POPULATION_API_BASE}/countries/`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.countries)) {
        throw new Error('Invalid response format from countries API');
    }
    
    // Cache the countries
    supportedCountries = data.countries;
    return supportedCountries;
}

// Fetch population data for a country
async function fetchPopulationData(country) {
    try {
        // First, check if we have the list of supported countries
        if (supportedCountries.length === 0) {
            await fetchCountries();
        }
        
        // Check if the country is in the supported list
        const countryObj = supportedCountries.find(c => c.toLowerCase() === country.toLowerCase());
        if (!countryObj) {
            throw new Error(`"${country}" is not a recognized country.`);
        }
        
        // Use the correct country name from the API
        const apiCountryName = countryObj;
        const apiUrl = `${POPULATION_API_BASE}/population/${encodeURIComponent(apiCountryName)}/today-and-tomorrow/`;
        
        console.log(`Fetching population data from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}):`, errorText);
            throw new Error('Failed to fetch population data. Please try again later.');
        }
        
        const data = await response.json();
        console.log('Population API Response:', data);
        
        if (!data || !data.total_population || data.total_population.length < 2) {
            throw new Error('No population data available for this country.');
        }
        
        const [todayData, tomorrowData] = data.total_population;
        
        if (!todayData || !todayData.population || !tomorrowData || !tomorrowData.population) {
            throw new Error('Invalid population data received.');
        }
        
        const population = todayData.population;
        const dailyChange = tomorrowData.population - population;
        
        // Calculate change per second (for smoother updates, we'll use a higher rate for visibility)
        // We'll multiply by 100 to make the changes more visible in the UI
        const perSecondChange = (dailyChange / 86400) * 100;
        
        console.log(`Population data for ${country}:`, {
            today: population,
            tomorrow: tomorrowData.population,
            dailyChange,
            perSecondChange
        });
        
        return {
            population,
            perSecondChange,
            lastUpdate: Date.now(),
            rate: perSecondChange
        };
        
    } catch (error) {
        console.error(`Error in fetchPopulationData for ${country}:`, error);
        throw error; // Re-throw to be handled by the caller
    }
}

// Add a country to the population list
async function addCountry(countryName) {
    const name = countryName.trim();
    if (!name) {
        alert('Please enter a country name');
        return;
    }
    
    // Show loading state
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-msg';
    loadingMsg.textContent = `Fetching population data for ${name}...`;
    populationList.appendChild(loadingMsg);
    
    try {
        // Ensure we have the latest list of supported countries
        const countries = await fetchCountries();
        
        // Find the correct country name with proper case
        const country = countries.find(
            c => c.toLowerCase() === name.toLowerCase()
        );
        
        if (!country) {
            // If no exact match, try to find similar countries
            const similarCountries = countries.filter(c => 
                c.toLowerCase().includes(name.toLowerCase())
            ).slice(0, 5);
            
            let errorMsg = `"${name}" is not a recognized country.`;
            if (similarCountries.length > 0) {
                errorMsg += '\n\nDid you mean one of these?\n' + similarCountries.join('\n');
            } else {
                errorMsg += '\n\nPlease check your spelling or try another country.';
            }
            
            throw new Error(errorMsg);
        }
        
        // Check if already in the list
        if (populationData[country]) {
            throw new Error(`${country} is already in the list!`);
        }
        
        // Show loading message
        loadingMsg.textContent = `Fetching population data for ${country}...`;
        
        // Fetch population data
        const data = await fetchPopulationData(country);
        
        if (!data) {
            throw new Error('No population data available for this country.');
        }
        
        // Add to population data with initial values
        populationData[country] = {
            population: data.population,
            rate: data.perSecondChange,
            lastUpdate: Date.now(),
            lastPopulation: data.population,
            element: null
        };
        
        console.log(`Added ${country} to population data:`, populationData[country]);
        
        // Update the display
        updatePopulationDisplay(country);
        
        // Start or restart the population counter
        if (populationInterval) {
            clearInterval(populationInterval);
            populationInterval = null;
        }
        startPopulationCounter();
        
        // Clear the input
        if (countryInput) {
            countryInput.value = '';
        }
        
    } catch (error) {
        console.error('Error in addCountry:', error);
        
        // Show user-friendly error message
        let errorMessage = 'An error occurred while adding the country.';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Country not found. Please check the spelling and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Always remove loading message
        if (loadingMsg && loadingMsg.parentNode === populationList) {
            populationList.removeChild(loadingMsg);
        }
    }
}

// Track total population changes
let totalPopulationChange = 0;

// Update the population display for a country
function updatePopulationDisplay(country) {
    const data = populationData[country];
    if (!data) return;
    
    // Initialize total change tracking if it doesn't exist
    if (data.totalChange === undefined) {
        data.totalChange = 0;
    }
    
    const now = Date.now();
    const timeSinceLastChange = now - (data.lastUpdate || now);
    
    // Create new element if it doesn't exist
    if (!data.element) {
        const item = document.createElement('div');
        item.className = 'population-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'population-name';
        nameSpan.textContent = country;
        
        const popSpan = document.createElement('span');
        popSpan.className = 'population-count';
        popSpan.textContent = Math.round(data.population).toLocaleString();
        
        // Add change indicator
        const changeSpan = document.createElement('span');
        changeSpan.className = 'population-change';
        changeSpan.textContent = '';
        
        // Add total change display
        const totalChangeSpan = document.createElement('span');
        totalChangeSpan.className = 'total-change';
        totalChangeSpan.textContent = '';
        
        const infoContainer = document.createElement('div');
        infoContainer.className = 'population-info';
        
        const changeContainer = document.createElement('div');
        changeContainer.className = 'change-container';
        changeContainer.appendChild(changeSpan);
        changeContainer.appendChild(totalChangeSpan);
        
        infoContainer.appendChild(popSpan);
        infoContainer.appendChild(changeContainer);
        
        item.appendChild(nameSpan);
        item.appendChild(infoContainer);
        
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
        const oldValue = data.lastPopulation || data.population;
        const change = data.population - oldValue;
        
        // Only show change if it's significant and we have a previous value
        if (Math.abs(change) > 0 && timeSinceLastChange < 5000) {
            const roundedChange = Math.round(change);
            changeSpan.textContent = roundedChange > 0 ? `+${roundedChange.toLocaleString()}` : roundedChange.toLocaleString();
            changeSpan.className = `population-change ${roundedChange > 0 ? 'population-increase' : 'population-decrease'}`;
            
            // Update total change
            data.totalChange += roundedChange;
            totalPopulationChange += roundedChange;
            
            // Update total change display
            const totalChangeSpan = data.element.item.querySelector('.total-change');
            if (totalChangeSpan) {
                totalChangeSpan.textContent = ` (${data.totalChange > 0 ? '+' : ''}${data.totalChange.toLocaleString()})`;
                totalChangeSpan.className = `total-change ${data.totalChange > 0 ? 'population-increase' : data.totalChange < 0 ? 'population-decrease' : ''}`;
            }
            
            // Fade out the change indicator after 3 seconds, but keep total
            setTimeout(() => {
                if (data.element?.item) {
                    const changeSpan = data.element.item.querySelector('.population-change');
                    if (changeSpan) {
                        changeSpan.textContent = '';
                        changeSpan.className = 'population-change';
                    }
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

// Update population counts with real-time data
function updatePopulationCounts() {
    const now = Date.now();
    let needsUpdate = false;
    
    Object.entries(populationData).forEach(([country, data]) => {
        if (!data || data.rate === undefined) {
            console.log(`Skipping ${country}: No rate data`);
            return;
        }
        
        // Make sure we have an element
        if (!data.element) {
            console.log(`Creating element for ${country}`);
            updatePopulationDisplay(country);
            if (!data.element) {
                console.error(`Failed to create element for ${country}`);
                return;
            }
        }
        
        // Calculate time passed since last update (in seconds)
        const secondsPassed = (now - (data.lastUpdate || now)) / 1000;
        
        // Calculate population change based on the rate
        const change = Math.round(data.rate * secondsPassed);
        
        if (change !== 0) {
            needsUpdate = true;
            
            // Update population and timestamp
            const newPopulation = Math.max(0, data.population + change);
            
            // Only update if the population actually changed
            if (newPopulation !== data.population) {
                data.lastPopulation = data.population;
                data.population = newPopulation;
                data.lastUpdate = now;
                
                // Update the display
                updatePopulationDisplay(country);
            }
        }
    });
    
    return needsUpdate;
}

// Start the population counter
let populationInterval = null;
let lastUpdateTime = 0;

function startPopulationCounter() {
    // Clear any existing animation frame to prevent multiple counters
    if (populationInterval !== null) {
        cancelAnimationFrame(populationInterval);
        populationInterval = null;
    }
    
    lastUpdateTime = Date.now();
    console.log('Starting population counter...', {
        numCountries: Object.keys(populationData).length,
        countries: Object.keys(populationData),
        populationData: populationData
    });
    
    // Use requestAnimationFrame for smoother animations
    function updateCounter() {
        try {
            const now = Date.now();
            lastUpdateTime = now;
            
            // Only update if we have countries to track
            if (Object.keys(populationData).length === 0) {
                return;
            }
            
            // Update population counts
            const needsUpdate = updatePopulationCounts();
            
            // Continue the animation loop
            if (needsUpdate) {
                populationInterval = requestAnimationFrame(updateCounter);
            } else {
                // If no updates needed, check again in 1 second
                setTimeout(() => {
                    populationInterval = requestAnimationFrame(updateCounter);
                }, 1000);
            }
        } catch (error) {
            console.error('Error in population counter:', error);
            // If there's an error, try to restart the counter after a delay
            setTimeout(() => {
                if (Object.keys(populationData).length > 0) {
                    startPopulationCounter();
                }
            }, 1000);
        }
    }
    
    // Start the animation loop
    populationInterval = requestAnimationFrame(updateCounter);
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