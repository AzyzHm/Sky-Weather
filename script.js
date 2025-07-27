// DOM elements
const searchInput = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const loadingOverlay = document.getElementById('loading');

// Weather info elements
const weatherInfo = document.getElementById('info');
const locationTitle = document.getElementById('country');
const temperature = document.getElementById('temp');
const weatherCondition = document.getElementById('weather');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const timezone = document.getElementById('timezone');

// Not found elements
const notFound = document.getElementById('not-found');

// Show loading state
function showLoading() {
    loadingOverlay.style.display = 'flex';
    searchButton.disabled = true;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
}

// Hide loading state
function hideLoading() {
    loadingOverlay.style.display = 'none';
    searchButton.disabled = false;
    searchButton.innerHTML = '<span class="btn-text">Search</span><i class="fas fa-arrow-right btn-icon"></i>';
}

// Show weather information
function showWeatherInfo(data) {
    // Populate weather data
    locationTitle.textContent = data.country;
    temperature.textContent = data.temperature;
    weatherCondition.textContent = data.weather;
    windSpeed.textContent = data.wind_speed;
    humidity.textContent = data.humidity;
    pressure.textContent = data.pressure;
    visibility.textContent = data.visibility;
    sunrise.textContent = data.sunrise;
    sunset.textContent = data.sunset;
    timezone.textContent = data.timezone;
    
    // Show weather info and hide not found
    weatherInfo.style.display = 'block';
    notFound.style.display = 'none';
    
    // Scroll to weather info smoothly
    weatherInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show not found message
function showNotFound() {
    notFound.style.display = 'block';
    weatherInfo.style.display = 'none';
    
    // Scroll to not found message smoothly
    notFound.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error message
function showError(message) {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Validate city name
function validateCityName(cityName) {
    const trimmedCity = cityName.trim();
    
    if (!trimmedCity) {
        showError('Please enter a city name');
        return false;
    }
    
    if (trimmedCity.length < 2) {
        showError('City name must be at least 2 characters long');
        return false;
    }
    
    if (!/^[a-zA-Z\s\-'.,]+$/u.test(trimmedCity)) {
        showError('Please enter a valid city name');
        return false;
    }
    
    return trimmedCity;
}

// Fetch weather data
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`/weather/${encodeURIComponent(cityName)}`);
        
        if (response.status === 404) {
            showNotFound();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        showWeatherInfo(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather service. Please check your internet connection.');
        } else {
            showError(error.message || 'An unexpected error occurred. Please try again.');
        }
    }
}

// Handle search
async function handleSearch() {
    const cityName = validateCityName(searchInput.value);
    
    if (!cityName) {
        return;
    }
    
    showLoading();
    
    try {
        await fetchWeatherData(cityName);
    } finally {
        hideLoading();
    }
}

// Event listeners
searchButton.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});

// Auto-focus on search input when page loads
document.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to clear search and hide results
    if (event.key === 'Escape') {
        searchInput.value = '';
        weatherInfo.style.display = 'none';
        notFound.style.display = 'none';
        searchInput.focus();
    }
});

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
