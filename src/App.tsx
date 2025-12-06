import React from "react";
import { SearchBar } from "./components/common/SearchBar";
import { CurrentWeather } from "./components/dashboard/CurrentWeather";
import { HourlyChart } from "./components/dashboard/HourlyChart";
import { ForecastList } from "./components/dashboard/ForecastList";
import { AirQualityGauge } from "./components/dashboard/AirQualityGauge";
import { SunCycle } from "./components/dashboard/SunCycle";
import { useWeather } from "./hooks/useWeather";
// import { CloudSun } from 'lucide-react';

const App: React.FC = () => {
  const { weather, loading, error, searchWeather } = useWeather();

  return (
    <div
      className="container-fluid py-4 d-flex flex-column align-items-center position-relative z-1"
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      <header
        className="container d-flex align-items-center justify-content-between mb-5 px-3"
        style={{ maxWidth: "1000px" }}
      >
        {/* <div className="d-flex align-items-center gap-2 text-dark cursor-pointer" onClick={() => window.location.reload()}>
           <CloudSun className="text-primary" size={28} />
           <span className="h5 fw-bold m-0 tracking-tight">MNT</span>
        </div> */}
      </header>

      {/* Main Content */}
      <main
        className="container d-flex flex-column gap-4 px-3 flex-grow-1"
        style={{ maxWidth: "1000px" }}
      >
        {/* Search */}
        <section className="w-100 d-flex flex-column align-items-center mb-2">
          <SearchBar onSearch={searchWeather} isLoading={loading} />
        </section>

        {/* Status Messages */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5 flex-grow-1">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="alert glass-card border-danger text-danger text-center py-3"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && weather && (
          <div className="animate-fade-in d-flex flex-column gap-4 pb-5">
            {/* Top Row: Thời tiết hiện tại*/}
            <CurrentWeather
              data={weather.current}
              city={weather.city}
              country={weather.country}
              comparison={weather.comparison}
            />

            {/* Middle Row: AQI và chu kỳ mặt trời*/}
            <div className="row g-4">
              <div className="col-md-6">
                <AirQualityGauge aqi={weather.current.aqi} />
              </div>
              <div className="col-md-6">
                <SunCycle
                  sunrise={weather.sun.sunrise}
                  sunset={weather.sun.sunset}
                />
              </div>
            </div>

            {/* Bottom Section: Biểu đồ và Dự báo*/}
            <HourlyChart data={weather.hourly} city={weather.city} />

            <ForecastList forecast={weather.forecast} city={weather.city} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-auto py-4 text-secondary-custom small text-center w-100 border-top"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <p className="m-0">
          &copy; {new Date().getFullYear()} -
          <a
            href="/"
            className="text-blue-600 text-decoration-none"
            style={{ marginLeft: "5px" }}
          >
            MNT
          </a>
          .All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
