function initPage() {
    // Variable Definition
    const currentWeatherPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const historyListEl = document.getElementById("history");
    const currentCityEl = document.getElementById("enter-city");
    const searchButtonEl = document.getElementById("search-button");
    const clearHistEl = document.getElementById("clear-history");
    const cityNameEl = document.getElementById("city-name");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    

    // Unique API Key from sign-up with weatherapp
    const APIKey = "e3413672771339a0f2fb70b10a507cd5";

    // Get Weather Function by searching City Name
    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                // Removes Display Styling to show weather list
                todayweatherEl.classList.remove("d-none");
                // Displays current day data from API response
                const currentDay = new Date(response.data.dt * 1000);
                const day = currentDay.getDate();
                const month = currentDay.getMonth() + 1;
                const year = currentDay.getFullYear();
                cityNameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentWeatherPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentWeatherPicEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                
             
                // Shows 5-day forecast from API response from searched city
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");
                        
                    // Displays 5-day data from API response
                     const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);

                    // Appends 5-day data into HTML
                        const forecastWeatherEl = document.createElement("img");
                        const forecastTempEl = document.createElement("p");
                        const forecastHumidityEl = document.createElement("p");
                        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastWeatherEl);
                        forecastEls[i].append(forecastTempEl);
                        forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }
    // Temperature calculation function
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }
    
    // Render Search History function
    function renderSearchHistory() {
        historyListEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyListEl.append(historyItem);
        }
    }

    // Get history from local storage
    searchButtonEl.addEventListener("click", function () {
        const searchTerm = currentCityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear History Event Listener
    clearHistEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

   

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

initPage();