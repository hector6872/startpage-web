import { t } from "../locales/index.js";

export const weatherContext = {
  state: null
};

export function setupWeatherContext(context) {
  Object.assign(weatherContext, context);
}

// Weather System (Open-Meteo)
export async function loadWeather() {
  const weatherWidget = document.getElementById('weather-widget');
  if (weatherContext.state.settings.showWeather === false) {
    weatherWidget.classList.add('hidden');
    return;
  }
  weatherWidget.classList.remove('hidden');
  weatherWidget.classList.add('loading');

  try {
    let lat, lon, cityName = 'Madrid';
    
    if (weatherContext.state.settings.city) {
      cityName = weatherContext.state.settings.city;
      // Geocoding city name via Open-Meteo
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=${weatherContext.state.lang}`);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        cityName = geoData.results[0].name;
      } else {
        throw new Error("City not found");
      }
    } else {
      const err = new Error("Unconfigured");
      err.isUnconfigured = true;
      throw err;
    }

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&hourly=precipitation_probability,weathercode`);
    const weatherData = await weatherRes.json();
    
    if (weatherData.current) {
      weatherWidget.classList.remove('unconfigured');
      const temp = Math.round(weatherData.current.temperature_2m);
      const apparentTemp = Math.round(weatherData.current.apparent_temperature);
      const code = weatherData.current.weather_code;
      const desc = getWeatherDesc(code);
      
      weatherWidget.querySelector('.weather-temp').textContent = `${temp}°C`;
      weatherWidget.querySelector('.weather-feels').textContent = t('weather-feels-like', { temp: apparentTemp }, weatherContext.state.lang);
      weatherWidget.querySelector('.weather-desc').textContent = desc;
      weatherWidget.querySelector('.weather-loc').textContent = cityName;

      // Calculate precipitation in next 24h
      let precipHTML = '';
      if (weatherData.hourly && weatherData.hourly.precipitation_probability && weatherData.hourly.weathercode) {
        const currentHourStr = weatherData.current.time;
        const startIndex = weatherData.hourly.time.indexOf(currentHourStr);
        const start = startIndex !== -1 ? startIndex : 0;
        const next24Probs = weatherData.hourly.precipitation_probability.slice(start, start + 24);
        const next24Codes = weatherData.hourly.weathercode.slice(start, start + 24);
        const maxProb = Math.max(...next24Probs);

        // Only show precipitation expected badge if probability is at least 20%
        if (maxProb >= 20) {
          let hasStorm = false;
          let hasSnow = false;
          for (let i = 0; i < next24Codes.length; i++) {
            if (next24Probs[i] >= 20) {
              const c = next24Codes[i];
              if (c >= 95 && c <= 99) hasStorm = true;
              else if ((c >= 71 && c <= 77) || (c >= 85 && c <= 86)) hasSnow = true;
            }
          }

          let typeKey = 'weather-rain';
          let icon = '☔';
          if (hasStorm) {
            typeKey = 'weather-storm';
            icon = '⛈️';
          } else if (hasSnow) {
            typeKey = 'weather-snow';
            icon = '❄️';
          }

          const label = t(typeKey, { prob: maxProb }, weatherContext.state.lang);
          precipHTML = `<span class="weather-precip-badge" title="${label}">${icon} ${label}</span>`;
        } else {
          const noPrecipText = t('weather-no-precip', {}, weatherContext.state.lang);
          precipHTML = `<span class="weather-precip-badge none" title="${noPrecipText}">☀️ ${noPrecipText}</span>`;
        }
      }
      weatherWidget.querySelector('.weather-precip').innerHTML = precipHTML;
      weatherWidget.classList.remove('loading');
    }
  } catch (err) {
    weatherWidget.classList.add('unconfigured');
    weatherWidget.querySelector('.weather-unconfigured-text').textContent = err.isUnconfigured
      ? t('weather-unconfigured', {}, weatherContext.state.lang)
      : t('weather-error', {}, weatherContext.state.lang);
    weatherWidget.classList.remove('loading');
  }
}

// Map WMO codes to human readable weather
export function getWeatherDesc(code) {
  const codes = {
    0: { en: "Clear sky", es: "Cielo despejado" },
    1: { en: "Mainly clear", es: "Mayormente despejado" },
    2: { en: "Partly cloudy", es: "Parcialmente nublado" },
    3: { en: "Overcast", es: "Cubierto" },
    45: { en: "Fog", es: "Niebla" },
    48: { en: "Fog", es: "Niebla" },
    51: { en: "Light drizzle", es: "Llovizna ligera" },
    53: { en: "Moderate drizzle", es: "Llovizna moderada" },
    55: { en: "Dense drizzle", es: "Llovizna densa" },
    61: { en: "Slight rain", es: "Lluvia ligera" },
    63: { en: "Moderate rain", es: "Lluvia moderada" },
    65: { en: "Heavy rain", es: "Lluvia fuerte" },
    71: { en: "Slight snow", es: "Nieve ligera" },
    73: { en: "Moderate snow", es: "Nieve moderada" },
    75: { en: "Heavy snow", es: "Nieve fuerte" },
    77: { en: "Snow grains", es: "Granizo suave" },
    80: { en: "Slight rain showers", es: "Chubascos de lluvia leves" },
    81: { en: "Moderate rain showers", es: "Chubascos de lluvia moderados" },
    82: { en: "Violent rain showers", es: "Chubascos de lluvia violentos" },
    95: { en: "Thunderstorm", es: "Tormenta" },
    96: { en: "Thunderstorm with hail", es: "Tormenta con granizo" },
    99: { en: "Thunderstorm with heavy hail", es: "Tormenta con granizo fuerte" }
  };
  return (codes[code] ? codes[code][weatherContext.state.lang] : codes[0][weatherContext.state.lang]);
}