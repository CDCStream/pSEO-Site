import Anthropic from '@anthropic-ai/sdk';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function geocode(query) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  if (!res.ok) throw new Error('Geocoding service unavailable');
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const r = data.results[0];
  return { name: r.name, admin: r.admin1 || r.country, lat: r.latitude, lon: r.longitude, timezone: r.timezone };
}

async function getWeather(lat, lon, timezone) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_probability_max,weather_code',
    timezone: timezone || 'auto',
    forecast_days: '2',
  });
  const res = await fetch(`${WEATHER_URL}?${params}`);
  if (!res.ok) throw new Error('Weather service unavailable');
  return res.json();
}

function weatherCodeToLabel(code) {
  const map = {
    0: 'Sunny', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
    85: 'Light Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Thunderstorm + Heavy Hail',
  };
  return map[code] || 'Unknown';
}

function weatherCodeToEmoji(code) {
  if (code <= 1) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌧️';
  if (code <= 65) return '🌧️';
  if (code <= 67) return '🧊';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

export async function POST(request) {
  try {
    const { location } = await request.json();

    if (!location || location.trim().length < 2) {
      return Response.json({ error: 'Please enter a valid location.', success: false }, { status: 400 });
    }

    const geo = await geocode(location.trim());
    if (!geo) {
      return Response.json({ error: `Could not find location "${location}". Please try a city name like "Boston" or "New York".`, success: false }, { status: 404 });
    }

    const weather = await getWeather(geo.lat, geo.lon, geo.timezone);
    const daily = weather.daily;
    const current = weather.current;

    const days = daily.time.map((date, i) => ({
      date,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      snowfall: daily.snowfall_sum[i],
      precipProb: daily.precipitation_probability_max[i],
      weatherCode: daily.weather_code[i],
      label: weatherCodeToLabel(daily.weather_code[i]),
      emoji: weatherCodeToEmoji(daily.weather_code[i]),
    }));

    const currentTemp = Math.round(current.temperature_2m);
    const currentHumidity = current.relative_humidity_2m;
    const currentWind = Math.round(current.wind_speed_10m);

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are a snow day prediction expert. Analyze the weather data below and predict the probability of a school snow day for tomorrow.

Location: ${geo.name}, ${geo.admin}
Current Temperature: ${currentTemp}°C
Current Humidity: ${currentHumidity}%
Current Wind Speed: ${currentWind} km/h

Today (${days[0].date}):
- Weather: ${days[0].label}
- High: ${days[0].tempMax}°C, Low: ${days[0].tempMin}°C
- Snowfall: ${days[0].snowfall} cm
- Precipitation Probability: ${days[0].precipProb}%

Tomorrow (${days[1].date}):
- Weather: ${days[1].label}
- High: ${days[1].tempMax}°C, Low: ${days[1].tempMin}°C
- Snowfall: ${days[1].snowfall} cm
- Precipitation Probability: ${days[1].precipProb}%

Based on this data, return your analysis in EXACTLY this JSON format (no extra text):
{
  "probability": <number 0-100>,
  "label": "<one of: No chance, Very unlikely, Unlikely, Possible, Likely, Very likely, Almost certain>",
  "analysis": "<2-3 sentence analysis of conditions and school closure likelihood>",
  "tip": "<1 short actionable sentence tip for the user>"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    let ai;
    try {
      let raw = message.content[0].text.trim();
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) raw = jsonMatch[1].trim();
      ai = JSON.parse(raw);
    } catch (parseErr) {
      console.error('Claude response parse error:', parseErr, 'Raw:', message.content[0].text);
      return Response.json({ error: 'AI analysis failed. Please try again.', success: false }, { status: 500 });
    }

    return Response.json({
      success: true,
      location: { name: geo.name, admin: geo.admin },
      probability: ai.probability,
      label: ai.label,
      analysis: ai.analysis,
      tip: ai.tip,
      days: days.map((d, i) => ({
        ...d,
        temp: i === 0 ? currentTemp : Math.round((d.tempMax + d.tempMin) / 2),
        wind: i === 0 ? currentWind : null,
        humidity: i === 0 ? currentHumidity : null,
        snowChance: d.snowfall > 0 ? d.precipProb : 0,
      })),
      current: { temp: currentTemp, humidity: currentHumidity, wind: currentWind },
    });
  } catch (error) {
    console.error('Snow Day API Error:', error);
    return Response.json(
      { error: 'Something went wrong. Please try again later.', success: false },
      { status: 500 }
    );
  }
}
