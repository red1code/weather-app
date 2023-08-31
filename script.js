document.getElementById('currentYear').textContent = new Date().getFullYear();

const container = document.getElementById('container');
const innerContainer = document.getElementById('innerContainer');
const animation = document.getElementById('animation');
const locationTarget = document.getElementById('location');
const temperature = document.getElementById('temperature');
const otherDetails = document.getElementById('otherDetails');
const form = document.querySelector('form');

const API_KEY = 'b9ec1ddbb680e5149292a4a0b9e05a38';

displayBox('initApp');

form.onsubmit = async (evt) => {
  if (!form.checkValidity()) return;
  evt.preventDefault();
  displayBox('loadingData');
  const city = evt.target.elements['city'].value.trim();
  try {
    const geocodingData = await getGeocoding(city);
    const weatherData = await getWeatherData(city);
    displayBox('showData');
    setBodyBackground(weatherData.weather[0].main);
    locationTarget.innerText = `${geocodingData[0].name}, ${geocodingData[0].country}`
    temperature.innerText = kelvinToCelsius(weatherData.main.temp);
    otherDetails.innerHTML = getWeatherDetails(weatherData);      
  } 
  catch (error) {
    console.error(error);
    alert(error);
    displayBox('initApp');
  }  
}

function displayBox(status = 'initApp') {
  if (status === 'initApp') {
    container.style.opacity = 0;
    innerContainer.style.display = 'none';
    animation.style.display = 'none';
  }
  if (status === 'loadingData') {
    container.style.opacity = 1;
    innerContainer.style.display = 'none';
    animation.style.display = 'block';
  }
  if (status === 'showData') {
    container.style.opacity = 1
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    innerContainer.style.display = 'block';
    animation.style.display = 'none';
  }
}

async function getWeatherData(cityName) {
	const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const response = await fetch(apiURL, { mode: 'cors', referrerPolicy: 'unsafe-url' });
  return response.json();
}

async function getGeocoding(cityName) {
  const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
  const response = await fetch(apiURL, { mode: 'cors', referrerPolicy: 'unsafe-url' });
  return response.json();
}

function kelvinToCelsius(temperature) {
  return (temperature - 273.15).toFixed(2);
}

function getVisibility(num) {
  return num > 1000 ? `${num/1000} km` : `${num} m`;
}

function setBodyBackground(weatherCondition) {
  switch (weatherCondition) {
    case 'Thunderstorm':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Thunderstorm.webp)';
      break;
    case 'Drizzle':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Drizzle)';
      break;
    case 'Rain':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Rain.webp)';
      break;
    case 'Snow':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Snow.webp)';
      break;
    case 'Clear':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Clear.webp)';
      break;
    case 'Clouds':
      document.body.style.backgroundImage = 'url(assets/Weather-Conditions/Clouds.webp)';
      break;
  }
}

function getWeatherDetails(weatherData) {
  return `Weather: 
    <span class="bold">
      ${weatherData.weather[0].description}
    </span><br>
  Feels like: 
    <span class="bold">
      ${kelvinToCelsius(weatherData.main.feels_like)} °C
    </span><br>
  Max temperature: 
    <span class="bold">
      ${kelvinToCelsius(weatherData.main.temp_max)} °C
    </span><br>
  Min temperature: 
    <span class="bold">
      ${kelvinToCelsius(weatherData.main.temp_min)} °C
    </span><br>
  Humidity: 
    <span class="bold">
      ${weatherData.main.humidity} %
    </span><br>
  Pressure: 
    <span class="bold">
      ${weatherData.main.pressure} hPa
    </span><br>
  Visibility: 
    <span class="bold">
      ${getVisibility(weatherData.visibility)}
    </span><br>
  Wind speed: 
    <span class="bold">
      ${weatherData.wind.speed} meter/sec
    </span><br>
  Sunrise: 
    <span class="bold">
      ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
    </span><br>
  Sunset: 
    <span class="bold">
      ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
    </span>`;
}
