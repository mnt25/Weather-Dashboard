import React from "react";
import type { ForecastDay } from "../../types/weather";
import { Sun, Droplets, Calendar, Moon } from "lucide-react";
import { getWeatherIcon } from "../../utils/weatherUtils.tsx";

interface ForecastListProps {
  forecast: ForecastDay[];
  city: string;
}

export const ForecastList: React.FC<ForecastListProps> = ({
  forecast,
  city,
}) => {
  const weeklyMin = Math.min(...forecast.map((d) => d.tempMin));
  const weeklyMax = Math.max(...forecast.map((d) => d.tempMax));
  const range = weeklyMax - weeklyMin || 1;

  return (
    <div className="glass-card p-4 shadow-lg w-100">
      <h3 className="text-secondary-custom fs-6 fw-semibold tracking-wider mb-4 ps-1 d-flex align-items-center gap-2">
        <Calendar size={18} className="text-secondary-custom" style={{ color: "var(--accent-color)" }} />
        Dự báo 7 ngày tới tại {city}
      </h3>

      {/* Header */}
      <div
        className="row text-secondary-custom small fw-bold mb-3 px-3 opacity-75 border-bottom pb-2 text-uppercase forecast-header"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="col-3 col-sm-2 text-start">Ngày</div>
        <div className="col-3 col-sm-3 ps-sm-4 text-center text-sm-start">Thời tiết</div>
        <div className="col-2 col-sm-1 text-end opacity-75">Thấp</div>
        <div className="col-2 col-sm-5 text-center">Nhiệt độ tuần</div>
        <div className="col-2 col-sm-1 text-start opacity-75">Cao</div>
      </div>

      <div className="d-flex flex-column gap-2">
        {forecast.map((day, index) => {
          const leftPercent = ((day.tempMin - weeklyMin) / range) * 100;
          const widthPercent = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div
              key={index}
              className="row align-items-center g-0 py-3 px-3 glass-card-item hover-scale mx-0 forecast-row"
              style={{
                borderColor: "var(--card-item-border)",
              }}
            >
              {/* Day Name */}
              <div className="col-3 col-sm-2 text-start">
                <span
                  className={`fw-semibold ${
                    day.day === "Hôm nay"
                      ? "text-gradient fw-bold"
                      : "text-secondary-custom"
                  }`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {day.day}
                </span>
              </div>

              {/* Weather Icon & Rain Probability */}
              <div className="col-3 col-sm-3 d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-sm-start gap-1 gap-sm-3 ps-sm-4">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "30px" }}
                >
                  {getWeatherIcon(day.condition, 24)}
                </div>
                <div 
                  className="d-flex align-items-center gap-1 px-2 py-0.5 rounded-pill shadow-xs"
                  style={{ 
                    backgroundColor: "rgba(59, 130, 246, 0.12)", 
                    border: "1px solid rgba(59, 130, 246, 0.25)" 
                  }}
                >
                  <Droplets size={10} className="text-primary" style={{ color: "var(--accent-color)" }} />
                  <span
                    className="fw-bold small"
                    style={{ fontSize: "0.7rem", color: "var(--accent-color)" }}
                  >
                    {day.precipitationProb}%
                  </span>
                </div>
              </div>

              {/* Min Temp */}
              <div className="col-2 col-sm-1 text-end pe-2 d-flex align-items-center justify-content-end gap-1">
                <Moon size={14} className="text-secondary-custom opacity-75" />
                <span className="text-primary fw-semibold small" style={{ fontSize: "0.85rem" }}>
                  {Math.round(day.tempMin)}°
                </span>
              </div>

              {/* Temp Bar */}
              <div className="col-2 col-sm-5 px-2">
                {/* Track */}
                <div
                  className="position-relative rounded-pill overflow-hidden w-100"
                  style={{ height: "6px", backgroundColor: "rgba(0,0,0,0.06)" }}
                >
                  {/* Active Bar */}
                  <div
                    className="position-absolute rounded-pill h-100 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 5)}%`,
                      minWidth: "6px",
                      background:
                        "linear-gradient(90deg, #60a5fa 0%, #fbbf24 100%)",
                      opacity: 0.9,
                    }}
                  ></div>
                </div>
              </div>

              {/* Max Temp */}
              <div className="col-2 col-sm-1 text-start ps-2 d-flex align-items-center justify-content-start gap-1">
                <span className="fw-bold small" style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {Math.round(day.tempMax)}°
                </span>
                <Sun size={14} className="text-warning" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
