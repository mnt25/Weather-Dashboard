import React from "react";
import {
  Wind,
  Droplets,
  TrendingUp,
  Gauge,
  Sun as SunIcon,
  Calendar,
  MapPin,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import type { CurrentWeatherProps } from "../../types/currentweather";
import { getWeatherIcon } from "../../utils/weatherUtils.tsx";

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  city,
  country,
  comparison,
  tempMin,
  tempMax
}) => {
  return (
    <div className="glass-card p-4 p-md-5 animate-fade-in w-100 position-relative overflow-hidden">
      {/* Delicate background ambient circle */}
      <div
        className="position-absolute top-50 start-25 translate-middle rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      ></div>

      <div className="row align-items-center g-4 g-lg-5 position-relative z-1">
        {/* Main Info (Left) */}
        <div className="col-lg-6 text-center text-lg-start current-weather-info">
          <div className="d-flex flex-column mb-1 align-items-center align-items-lg-start">
            <h2 className="display-6 fw-bold m-0 d-flex align-items-center gap-2">
              <span className="opacity-75" style={{ color: "var(--accent-color)" }}>
                <MapPin size={22} />
              </span>
              {city}
            </h2>
            {country && (
              <span className="text-secondary-custom fs-5 fw-light mt-1">
                {country}
              </span>
            )}
            <Clock utcOffsetSeconds={data.utcOffsetSeconds} initialLocalTime={data.localTime} />
          </div>

          <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4 my-3">
            <span
              className="fw-thin tracking-tighter display-1 text-gradient"
              style={{ lineHeight: 0.9 }}
            >
              {Math.round(data.temp)}°
            </span>
            <div className="d-flex flex-column align-items-start gap-1">
              {getWeatherIcon(data.condition, 56)}
              <span className="fs-4 fw-medium text-capitalize text-secondary-custom">
                {data.description}
              </span>
            </div>
          </div>

          {/* Today's Low / High Temperatures */}
          {(tempMin !== undefined && tempMax !== undefined) && (
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mt-1 mb-3 text-secondary-custom">
              <div className="d-flex align-items-center gap-1">
                <ArrowDown size={16} className="text-info" />
                <span>Thấp nhất:</span>
                <strong className="text-primary">{Math.round(tempMin)}°C</strong>
              </div>
              <span className="opacity-40">|</span>
              <div className="d-flex align-items-center gap-1">
                <ArrowUp size={16} className="text-danger" />
                <span>Cao nhất:</span>
                <strong className="text-danger">{Math.round(tempMax)}°C</strong>
              </div>
            </div>
          )}

          {comparison && (
            <div
              className="mt-3 d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-white bg-opacity-20 border shadow-sm"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <TrendingUp size={16} className="text-warning" />
              <small className="fw-semibold text-secondary-custom">
                {comparison}
              </small>
            </div>
          )}
        </div>

        {/* Details Grid (Right) */}
        <div className="col-lg-6 col-12 weather-details-grid">
          <div className="row g-3">
            {[
              {
                label: "Độ ẩm",
                value: `${data.humidity}%`,
                icon: Droplets,
                color: "#3b82f6", // Blue
              },
              {
                label: "Tốc độ gió",
                value: `${data.windSpeed} km/h`,
                icon: Wind,
                color: "#10b981", // Green
              },
              {
                label: "Áp suất",
                value: `${Math.round(data.pressure)} hPa`,
                icon: Gauge,
                color: "#8b5cf6", // Purple
              },
              {
                label: "Chỉ số UV",
                value: data.uvIndex,
                icon: SunIcon,
                color: "#f59e0b", // Amber
              },
            ].map((item, idx) => (
              <div key={idx} className="col-6">
                <div className="p-3 h-100 glass-card-item d-flex align-items-center gap-3">
                  <div 
                    className="p-2 rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                    style={{ background: "rgba(255,255,255,0.4)", border: "1px solid var(--glass-border)" }}
                  >
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <div className="d-flex flex-column text-start">
                    <span className="small text-secondary-custom fw-semibold" style={{ fontSize: "0.75rem" }}>
                      {item.label}
                    </span>
                    <span className="fs-5 fw-bold" style={{ color: "var(--text-primary)" }}>
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Clock: React.FC<{ utcOffsetSeconds: number; initialLocalTime: string }> = ({ utcOffsetSeconds, initialLocalTime }) => {
  const [timeStr, setTimeStr] = React.useState(initialLocalTime);

  React.useEffect(() => {
    const updateTime = () => {
      const now = Date.now(); // UTC timestamp
      const cityTimeMs = now + (utcOffsetSeconds * 1000);
      const cityDateObj = new Date(cityTimeMs);

      const hours = String(cityDateObj.getUTCHours()).padStart(2, '0');
      const minutes = String(cityDateObj.getUTCMinutes()).padStart(2, '0');
      const seconds = String(cityDateObj.getUTCSeconds()).padStart(2, '0');

      const simpleTime = `${hours}:${minutes}:${seconds}`;

      const dayIndex = cityDateObj.getUTCDay();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const currentDayName = days[dayIndex];
      const datePart = `${String(cityDateObj.getUTCDate()).padStart(2, '0')}/${String(cityDateObj.getUTCMonth() + 1).padStart(2, '0')}/${String(cityDateObj.getUTCFullYear()).padStart(2, '0')}`;

      setTimeStr(`${currentDayName}, ${datePart} | ${simpleTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [utcOffsetSeconds]);

  return (
    <div 
      className="d-flex align-items-center gap-2 mt-2 text-secondary-custom small px-3 py-2 rounded-pill fit-content shadow-sm border"
      style={{ 
        background: "rgba(255, 255, 255, 0.25)", 
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(5px)"
      }}
    >
      <Calendar size={14} className="text-secondary-custom opacity-75" />
      <span className="fw-semibold text-gradient">{timeStr}</span>
    </div>
  );
};
