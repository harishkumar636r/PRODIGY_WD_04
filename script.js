const apiKey = '5e0830117e42232729ed25197df4b765'; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

const locationEl = document.getElementById('location');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city) fetchWeather(city);
});

// Fetch weather by city (India)
async function fetchWeather(city) {
    try {
        // Automatically append ',IN' for Indian cities
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if(data.cod === 200) {
            displayWeather(data);
        } else {
            alert(`City not found! Please try a different name.\n(${data.message})`);
        }
    } catch (error) {
        console.error(error);
        alert("Error fetching weather data!");
    }
}

// Fetch weather by geolocation (for India)
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        });
    }
};

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error(error);
    }
}

// Display weather data
function displayWeather(data) {
    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `Temperature: ${data.main.temp}°C`;
    conditionEl.textContent = `Condition: ${capitalizeFirstLetter(data.weather[0].description)}`;
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
    windEl.textContent = `Wind: ${data.wind.speed} m/s`;
    weatherIcon.textContent = getWeatherIcon(data.weather[0].id);
}

// Capitalize first letter of condition
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Map weather ID to emoji
function getWeatherIcon(id) {
    if(id >= 200 && id < 300) return "⛈️"; // Thunderstorm
    if(id >= 300 && id < 500) return "🌦️"; // Drizzle
    if(id >= 500 && id < 600) return "🌧️"; // Rain
    if(id >= 600 && id < 700) return "❄️"; // Snow
    if(id >= 700 && id < 800) return "🌫️"; // Atmosphere
    if(id === 800) return "☀️"; // Clear
    if(id > 800 && id < 900) return "☁️"; // Clouds
    return "🌈"; // Default
}
