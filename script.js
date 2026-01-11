const API_KEY = '7bf3f09e01f4eabee9483d21e48df0ed';
const ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('searchBtn');
const statusEl = document.getElementById('status');

const result = document.getElementById('result');
const cityName = document.getElementById('cityName');
const desc = document.getElementById('desc');
const temp = document.getElementById('temp');
const icon = document.getElementById('icon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const localTime = document.getElementById('localTime');

function showStatus(message, error = false) {
  statusEl.textContent = message;
  statusEl.style.color = error ? 'salmon' : '';
}

function formatTime(seconds, offset) {
  const date = new Date((seconds + offset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function getWeather(city) {
  const url = `${ENDPOINT}?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('City not found');
  }

  return response.json();
}

function updateUI(data) {
  const w = data.weather[0];

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  desc.textContent = w.description;
  temp.textContent = Math.round(data.main.temp);
  icon.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
  humidity.textContent = data.main.humidity;
  wind.textContent = `${data.wind.speed} m/s`;
  sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
  sunset.textContent = formatTime(data.sys.sunset, data.timezone);
  localTime.textContent = formatTime(Date.now() / 1000, data.timezone);

  result.classList.remove('hidden');
  showStatus('Weather loaded');
}

async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showStatus('Please enter a city', true);
    return;
  }

  try {
    showStatus('Loading...');
    const data = await getWeather(city);
    updateUI(data);
  } catch (err) {
    showStatus(err.message, true);
  }
}

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchWeather();
});
