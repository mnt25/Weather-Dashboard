import type { WeatherData } from './weather';

export interface CityResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string; 
}

export interface WeatherResponse {
  data: WeatherData | null;
  error?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
