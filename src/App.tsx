import React, { useEffect } from "react";
import { SearchBar } from "./components/common/SearchBar";
import { CurrentWeather } from "./components/dashboard/CurrentWeather";
import { HourlyChart } from "./components/dashboard/HourlyChart";
import { ForecastList } from "./components/dashboard/ForecastList";
import { AirQualityGauge } from "./components/dashboard/AirQualityGauge";
import { SunCycle } from "./components/dashboard/SunCycle";
import { useWeather } from "./hooks/useWeather";
import { CloudSun } from "lucide-react";

const getThemeFromWeather = (condition: string, localTimeStr: string): string => {
  if (!localTimeStr) return "sunny";
  
  try {
    const parts = localTimeStr.split("|");
    if (parts.length >= 2) {
      const timePart = parts[1].trim(); 
      const hour = parseInt(timePart.split(":")[0]);
      if (hour < 6 || hour >= 18) {
        return "night";
      }
    }
  } catch (e) {
    console.warn("Error parsing time for weather theme:", e);
  }

  const lower = condition.toLowerCase();
  if (lower.includes("bão") || lower.includes("sấm") || lower.includes("dông")) return "stormy";
  if (lower.includes("mưa")) return "rainy";
  if (lower.includes("tuyết")) return "snowy";
  if (lower.includes("sương mù")) return "cloudy";
  if (lower.includes("mây")) return "cloudy";
  return "sunny";
};

const App: React.FC = () => {
  const { weather, loading, error, searchWeather, searchWeatherByCoords } = useWeather();

  // Cập nhật theme theo thời tiết thực tế
  useEffect(() => {
    if (weather) {
      const theme = getThemeFromWeather(weather.current.condition, weather.current.localTime);
      document.body.className = `theme-${theme}`;
    } else {
      document.body.className = "theme-sunny";
    }
  }, [weather]);

  return (
    <div
      className="container-fluid py-4 d-flex flex-column align-items-center position-relative z-1"
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      <header
        className="container d-flex align-items-center justify-content-between mb-4 px-3"
        style={{ maxWidth: "1100px" }}
      >
        <div className="d-flex align-items-center gap-2">
          <div 
            className="p-2 rounded-4 bg-white bg-opacity-25 border border-white border-opacity-50 shadow-sm d-flex align-items-center justify-content-center text-primary"
            style={{ color: "var(--accent-color)" }}
          >
            <CloudSun size={28} className="text-warning" style={{ filter: "drop-shadow(0 0 6px #fbbf24)" }} />
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main
        className="container d-flex flex-column gap-4 px-2 px-sm-3 flex-grow-1"
        style={{ maxWidth: "1100px" }}
      >
        {/* Tìm kiếm */}
        <section className="w-100 d-flex flex-column align-items-center mb-1">
          <SearchBar 
            onSearch={searchWeather} 
            onCoordsSearch={searchWeatherByCoords} 
            isLoading={loading} 
          />
        </section>

        {/* Trạng thái tải dữ liệu */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5 flex-grow-1 animate-fade-in">
            <div 
              className="spinner-border" 
              role="status" 
              style={{ width: "3.5rem", height: "3.5rem", color: "var(--accent-color)" }}
            >
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Trạng thái lỗi */}
        {error && (
          <div
            className="alert glass-card border-danger text-danger text-center py-4 my-4 animate-fade-in w-100 max-w-500 mx-auto"
            role="alert"
            style={{ maxWidth: "500px" }}
          >
            <p className="m-0 fw-semibold">{error}</p>
            <button 
              onClick={() => searchWeather("Hà Nội")} 
              className="btn btn-sm glass-btn mt-3 px-4 py-2 text-xs"
            >
              Quay lại Hà Nội
            </button>
          </div>
        )}

        {/* Hiển thị thông tin thời tiết */}
        {!loading && !error && weather && (
          <div className="animate-fade-in d-flex flex-column gap-4 pb-5">
            {/* Thời tiết hiện tại */}
            <CurrentWeather
              data={weather.current}
              city={weather.city}
              country={weather.country}
              comparison={weather.comparison}
              tempMin={weather.forecast[0]?.tempMin}
              tempMax={weather.forecast[0]?.tempMax}
            />

            {/* Chỉ số không khí & Chu kỳ mặt trời */}
            <div className="row g-4">
              <div className="col-lg-6 col-md-6 col-12">
                <AirQualityGauge aqi={weather.current.aqi} />
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <SunCycle
                  sunrise={weather.sun.sunrise}
                  sunset={weather.sun.sunset}
                />
              </div>
            </div>

            {/* Biểu đồ & Dự báo */}
            <HourlyChart data={weather.hourly} city={weather.city} />

            <ForecastList forecast={weather.forecast} city={weather.city} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-auto py-4 text-secondary-custom small text-center w-100 border-top"
        style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(5px)" }}
      >
        <p className="m-0 fw-medium">
          &copy; {new Date().getFullYear()} - 
          <a
            href="/"
            className="text-decoration-none fw-bold text-gradient"
            style={{ marginLeft: "5px" }}
          >
            Phạm Sơn
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
