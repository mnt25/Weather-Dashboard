
export interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  precipitationProb: number;
}

export interface HourlyData {
  hour: string;
  temp: number;
  weatherCode: number;
  precipitationProb: number;
  windSpeed: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    description: string;
    uvIndex: number;
    pressure: number;
    aqi: number;
    utcOffsetSeconds: number;
    localTime: string;
  };
  sun: {
    sunrise: string;
    sunset: string;
  };
  comparison: string; 
  forecast: ForecastDay[];
  hourly: HourlyData[];
}
