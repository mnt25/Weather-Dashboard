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
    <div className="glass-card p-4 mt-4 shadow-lg w-100">
      <h3 className="text-secondary-custom fs-6 fw-semibold tracking-wider mb-4 ps-1 d-flex align-items-center gap-2">
        <Calendar size={18} />
        Dự báo {city} 7 ngày
      </h3>

      {/* Header */}
      <div
        className="row text-secondary-custom small fw-bold mb-3 px-2 opacity-75 border-bottom pb-2 text-uppercase"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          borderColor: "rgba(0,0,0,0.05)",
        }}
      >
        <div className="col-3 col-sm-2">Ngày</div>
        <div className="col-3 col-sm-3 ps-sm-4">Thời tiết</div>
        <div className="col-1 text-end opacity-75">Thấp</div>
        <div className="col-4 col-sm-5 text-center">Nhiệt độ</div>
        <div className="col-1 text-start opacity-75">Cao</div>
      </div>

      <div className="d-flex flex-column gap-1">
        {forecast.map((day, index) => {
          const leftPercent = ((day.tempMin - weeklyMin) / range) * 100;
          const widthPercent = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div
              key={index}
              className="row align-items-center g-0 py-3 border-bottom border-white-10 hover-scale"
              style={{
                borderBottomColor:
                  index === forecast.length - 1
                    ? "transparent"
                    : "rgba(0,0,0,0.05)",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {/* Tên ngày */}
              <div className="col-3 col-sm-2 text-start">
                <span
                  className={`fw-medium ${
                    day.day === "Hôm nay"
                      ? "text-primary fw-bold"
                      : "text-secondary-custom"
                  }`}
                >
                  {day.day}
                </span>
              </div>

              {/* Biểu tượng thời tiết & Xác suất mưa */}
              <div className="col-3 col-sm-3 d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-sm-start gap-1 gap-sm-3 ps-sm-4">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "30px" }}
                >
                  {getWeatherIcon(day.condition, 24)}
                </div>
                <div className="d-flex align-items-center gap-1 bg-info bg-opacity-10 px-2 py-1 rounded-pill">
                  <Droplets size={10} className="text-info" />
                  <span
                    className="text-info fw-bold small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {day.precipitationProb}%
                  </span>
                </div>
              </div>

              {/* Nhiệt độ tối thiểu */}
              <div className="col-2 col-sm-1 text-end pe-2 d-flex align-items-center justify-content-end gap-1">
                <Moon size={14} className="text-secondary-custom opacity-75" />
                <span className="text-info text-opacity-75 fw-medium small">
                  {Math.round(day.tempMin)}°
                </span>
              </div>

              {/* Thanh nhiệt độ */}
              <div className="col-3 col-sm-5 px-2">
                {/* Track */}
                <div
                  className="position-relative rounded-pill overflow-hidden"
                  style={{ height: "6px", backgroundColor: "rgba(0,0,0,0.05)" }}
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
                      opacity: 1,
                    }}
                  ></div>
                </div>
              </div>

              {/* Nhiệt độ tối đa */}
              <div className="col-2 col-sm-1 text-start ps-2 d-flex align-items-center justify-content-start gap-1">
                <span className="text-dark fw-bold small">
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
