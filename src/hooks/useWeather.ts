import { useState, useEffect } from "react";
import { fetchWeather, fetchWeatherByCoords } from "../services/apiService";
import type { WeatherData } from "../types/weather";

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetchWeather(city);
      if (response.error) {
        setError(response.error);
      } else {
        setWeather(response.data);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  const searchWeatherByCoords = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetchWeatherByCoords(lat, lon, name, "Tọa độ GPS");
      if (response.error) {
        setError(response.error);
      } else {
        setWeather(response.data);
      }
    } catch (err) {
      setError("Không thể lấy dữ liệu thời tiết tại vị trí này.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchWeather("Hà Nội");
  }, []);

  return { weather, loading, error, searchWeather, searchWeatherByCoords };
};
