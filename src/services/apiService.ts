import type { WeatherData } from "../types/weather";
import type { WeatherResponse, CityResult } from "../types/api";
import { getWeatherInfo } from "../utils/weatherUtils.tsx";
import { getDayName } from "../utils/dateUtils";

export const searchCities = async (query: string): Promise<CityResult[]> => {
  try {
    if (!query || query.length < 2) return [];
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=vi&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
      admin1: item.admin1,
      countryCode: item.country_code
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};

export const fetchWeatherByCoords = async (
  latitude: number,
  longitude: number,
  name: string,
  country: string
): Promise<WeatherResponse> => {
  try {
    // Chuẩn bị URL API thời tiết và chất lượng không khí
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,weather_code,uv_index,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto&past_days=1&forecast_days=8`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`;

    // Truy vấn dữ liệu song song
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl)
    ]);

    const weatherDataRaw = await weatherRes.json();
    const aqiDataRaw = await aqiRes.json();

    if (weatherDataRaw.error) throw new Error(weatherDataRaw.reason);

    // Tính toán múi giờ địa phương
    let cityDateStr = "";
    let localTime = "";
    let cityDateObj = new Date();
    
    try {
      const utcOffsetSeconds = weatherDataRaw.utc_offset_seconds ?? 0;
      const nowUtc = Date.now(); 
      const cityTimeMs = nowUtc + (utcOffsetSeconds * 1000);
      cityDateObj = new Date(cityTimeMs);
  
      const hours = String(cityDateObj.getUTCHours()).padStart(2, '0');
      const minutes = String(cityDateObj.getUTCMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      const dayIndex = cityDateObj.getUTCDay();
      const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const currentDayName = days[dayIndex];

      const dateStr = `${String(cityDateObj.getUTCDate()).padStart(2, '0')}/${String(cityDateObj.getUTCMonth() + 1).padStart(2, '0')}`;
      
      localTime = `${currentDayName}, ${dateStr} | ${timeStr}`;
      
      // Định dạng YYYY-MM-DD
      const year = cityDateObj.getUTCFullYear();
      const month = String(cityDateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(cityDateObj.getUTCDate()).padStart(2, '0');
      cityDateStr = `${year}-${month}-${day}`;
    } catch (e) {
      console.warn("Timezone calculation failed, falling back to local system time", e);
      const now = new Date();
      cityDateObj = now;
      
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const dayName = getDayName(now.toISOString());
      const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      localTime = `${dayName}, ${dateStr} | ${timeStr}`;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      cityDateStr = `${year}-${month}-${day}`;
    }

    // Xử lý dữ liệu thời tiết hiện tại
    const currentInfo = getWeatherInfo(weatherDataRaw.current.weather_code);
    
    // So sánh nhiệt độ giữa hôm nay và hôm qua
    const currentDayIndex = weatherDataRaw.daily.time.findIndex((t: string) => t === cityDateStr);
    const validCurrentIndex = currentDayIndex !== -1 ? currentDayIndex : 1;
    const yesterdayIndex = validCurrentIndex - 1;

    const yesterdayMax = weatherDataRaw.daily.temperature_2m_max[yesterdayIndex];
    const todayMax = weatherDataRaw.daily.temperature_2m_max[validCurrentIndex];
    
    let comparison = "";
    if (yesterdayMax !== undefined && todayMax !== undefined) {
      const diff = Math.round(todayMax - yesterdayMax);
      if (diff > 0) comparison = `Nhiệt độ cao hơn hôm qua ${diff}°C`;
      else if (diff < 0) comparison = `Nhiệt độ thấp hơn hôm qua ${Math.abs(diff)}°C`;
      else comparison = "Nhiệt độ tương đương hôm qua";
    } else {
      comparison = "Dữ liệu đang cập nhật";
    }

    // Xử lý dữ liệu dự báo 7 ngày tiếp theo
    const forecast = [];
    for (let i = validCurrentIndex; i < validCurrentIndex + 7; i++) {
      if (weatherDataRaw.daily.time[i]) {
        forecast.push({
          day: getDayName(weatherDataRaw.daily.time[i], cityDateStr),
          tempMax: weatherDataRaw.daily.temperature_2m_max[i],
          tempMin: weatherDataRaw.daily.temperature_2m_min[i],
          condition: getWeatherInfo(weatherDataRaw.daily.weather_code[i]).condition,
          precipitationProb: weatherDataRaw.daily.precipitation_probability_max[i] || 0
        });
      }
    }

    // Xử lý dữ liệu hàng giờ (24 giờ tiếp theo)
    const currentHourStrStart = `${cityDateStr}T${String(cityDateObj.getUTCHours()).padStart(2, '0')}`;
    
    let currentHourIndex = weatherDataRaw.hourly.time.findIndex((t: string) => t.startsWith(currentHourStrStart));
    if (currentHourIndex === -1) {
      currentHourIndex = 0;
    }
    
    const startIndex = currentHourIndex;
    const currentUVIndex = weatherDataRaw.hourly.uv_index[startIndex] || 0;
 
    const hourly = weatherDataRaw.hourly.time.slice(startIndex, startIndex + 24).map((time: string, index: number) => ({
      hour: time.split("T")[1].split(":")[0] + ":00",
      temp: Math.round(weatherDataRaw.hourly.temperature_2m[startIndex + index]),
      weatherCode: weatherDataRaw.hourly.weather_code[startIndex + index],
      precipitationProb: weatherDataRaw.hourly.precipitation_probability[startIndex + index],
      windSpeed: weatherDataRaw.hourly.wind_speed_10m[startIndex + index]
    }));

    // Lấy chỉ số chất lượng không khí AQI
    const aqi = aqiDataRaw.current ? aqiDataRaw.current.us_aqi : 0;

    const weatherData: WeatherData = {
      city: name,
      country: country,
      current: {
        temp: weatherDataRaw.current.temperature_2m,
        condition: currentInfo.condition,
        humidity: weatherDataRaw.current.relative_humidity_2m,
        windSpeed: weatherDataRaw.current.wind_speed_10m,
        description: currentInfo.description,
        uvIndex: currentUVIndex,
        pressure: weatherDataRaw.current.pressure_msl,
        aqi: aqi,
        utcOffsetSeconds: weatherDataRaw.utc_offset_seconds ?? 0,
        localTime: localTime 
      },
      sun: {
        sunrise: weatherDataRaw.daily.sunrise[validCurrentIndex], 
        sunset: weatherDataRaw.daily.sunset[validCurrentIndex]
      },
      comparison: comparison,
      forecast: forecast,
      hourly: hourly
    };

    return { data: weatherData };

  } catch (error: any) {
    console.error("Weather API Error:", error);
    return { data: null, error: "Không thể tải dữ liệu thời tiết. Vui lòng thử lại." };
  }
};

export const fetchWeather = async (cityQuery: string): Promise<WeatherResponse> => {
  try {
    // Lấy tọa độ bằng Geocoding
    const locationResults = await searchCities(cityQuery);
    
    if (locationResults.length === 0) {
      return { data: null, error: `Không tìm thấy địa điểm "${cityQuery}"` };
    }

    const location = locationResults[0];
    const { latitude, longitude, name, country } = location;

    return fetchWeatherByCoords(latitude, longitude, name, country);
  } catch (error: any) {
    console.error("Weather Fetch Error:", error);
    return { data: null, error: "Không thể kết nối đến máy chủ thời tiết." };
  }
};