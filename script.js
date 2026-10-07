// ================================
// DOM ELEMENTS
// ================================

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const weatherSection =
    document.getElementById("weatherSection");

const cityName =
    document.getElementById("cityName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const travelIcon =
    document.getElementById("travelIcon");

const travelTitle =
    document.getElementById("travelTitle");

const travelAdvice =
    document.getElementById("travelAdvice");

const forecastContainer =
    document.getElementById("forecastContainer");


// ================================
// API URLs
// ================================

const geocodingAPI =
    "https://geocoding-api.open-meteo.com/v1/search";

const weatherAPI =
    "https://api.open-meteo.com/v1/forecast";


// ================================
// EVENT LISTENERS
// ================================

searchButton.addEventListener(
    "click",
    getWeather
);


cityInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            getWeather();
        }

    }
);


// ================================
// MAIN FUNCTION
// ================================

async function getWeather() {

    const city =
        cityInput.value.trim();


    // Validate input

    if (city === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }


    // Show loading

    loading.style.display = "block";

    errorMessage.style.display = "none";

    weatherSection.style.display = "none";

    forecastContainer.innerHTML = "";


    try {

        // ============================
        // STEP 1: FIND CITY
        // ============================

        const geoResponse =
            await fetch(
                `${geocodingAPI}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!geoResponse.ok) {

            throw new Error(
                "Unable to search for the city."
            );
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please enter a valid city."
            );
        }


        const location =
            geoData.results[0];


        // ============================
        // STEP 2: GET WEATHER
        // ============================

        const weatherResponse =
            await fetch(
                `${weatherAPI}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );
        }


        const weatherData =
            await weatherResponse.json();


        // ============================
        // STEP 3: DISPLAY DATA
        // ============================

        displayWeather(
            location,
            weatherData
        );


        displayForecast(
            weatherData
        );


    } catch (error) {

        console.error(
            "Weather API Error:",
            error
        );

        showError(
            error.message
        );


    } finally {

        loading.style.display = "none";
    }
}


// ================================
// DISPLAY CURRENT WEATHER
// ================================

function displayWeather(
    location,
    data
) {

    const current =
        data.current;


    cityName.textContent =
        `${location.name}, ${location.country_code}`;


    temperature.textContent =
        `${current.temperature_2m}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${current.wind_speed_10m} km/h`;


    feelsLike.textContent =
        `${current.apparent_temperature}°C`;


    // Get weather information

    const weather =
        getWeatherInfo(
            current.weather_code
        );


    condition.textContent =
        weather.description;


    weatherIcon.textContent =
        weather.icon;


    // Get travel recommendation

    const recommendation =
        getTravelRecommendation(
            current.weather_code,
            current.temperature_2m
        );


    travelIcon.textContent =
        recommendation.icon;


    travelTitle.textContent =
        recommendation.title;


    travelAdvice.textContent =
        recommendation.advice;


    weatherSection.style.display =
        "grid";
}


// ================================
// WEATHER INFORMATION
// ================================

function getWeatherInfo(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️"
        };
    }


    if (
        code === 1 ||
        code === 2
    ) {

        return {
            description: "Partly Cloudy",
            icon: "⛅"
        };
    }


    if (code === 3) {

        return {
            description: "Cloudy",
            icon: "☁️"
        };
    }


    if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            description: "Rainy",
            icon: "🌧️"
        };
    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snowy",
            icon: "❄️"
        };
    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain Showers",
            icon: "🌦️"
        };
    }


    if (code >= 95) {

        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }


    return {
        description: "Unknown",
        icon: "🌤️"
    };
}


// ================================
// TRAVEL RECOMMENDATIONS
// ================================

function getTravelRecommendation(
    weatherCode,
    temperature
) {

    // Rain

    if (
        weatherCode >= 51 &&
        weatherCode <= 82
    ) {

        return {
            icon: "🌧️",
            title: "Carry an Umbrella",
            advice:
                "Rain is expected. Indoor attractions, museums and cafés are good choices today."
        };
    }


    // Thunderstorm

    if (weatherCode >= 95) {

        return {
            icon: "⛈️",
            title: "Avoid Outdoor Travel",
            advice:
                "Thunderstorms are possible. Consider postponing outdoor activities and staying indoors."
        };
    }


    // Very hot

    if (temperature >= 35) {

        return {
            icon: "🥵",
            title: "Stay Cool",
            advice:
                "The weather is very hot. Visit indoor attractions, stay hydrated and avoid strong afternoon sun."
        };
    }


    // Cold

    if (temperature <= 10) {

        return {
            icon: "🧥",
            title: "Dress Warmly",
            advice:
                "The temperature is low. Carry warm clothing and plan comfortable indoor and outdoor activities."
        };
    }


    // Good weather

    return {
        icon: "🧳",
        title: "Great Day to Explore!",
        advice:
            "The weather looks pleasant. This is a good time for sightseeing, walking tours and outdoor activities."
    };
}


// ================================
// 5-DAY FORECAST
// ================================

function displayForecast(data) {

    const daily =
        data.daily;


    forecastContainer.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const weather =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const date =
            new Date(
                daily.time[i]
            );


        const formattedDate =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                }
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>${formattedDate}</h3>

            <div class="icon">
                ${weather.icon}
            </div>

            <p>
                ${weather.description}
            </p>

            <p>
                <strong>
                    ${daily.temperature_2m_max[i]}°C
                </strong>
                /
                ${daily.temperature_2m_min[i]}°C
            </p>

        `;


        forecastContainer.appendChild(
            card
        );
    }
}


// ================================
// ERROR HANDLING
// ================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

    weatherSection.style.display =
        "none";

    forecastContainer.innerHTML = "";
}
