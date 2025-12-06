import type { WeatherData } from './weather';

export interface CurrentWeatherProps {
  data: WeatherData['current'];
  city: string;
  country?: string;
  comparison: string;
}