import React from "react";

import {
  Wind,
  Droplets,
  TrendingUp,
  Gauge,
  Sun as SunIcon,
} from "lucide-react";
import type { CurrentWeatherProps } from "../../types/currentweather";
import { getWeatherIcon } from "../../utils/weatherUtils.tsx";

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  city,
  country,
  comparison,
}) => {
  return (
    <div className="glass-card p-4 p-md-5 animate-fade-in w-100 position-relative overflow-hidden">
      {/* Hiệu ứng ánh sáng tinh tế phía sau nhiệt độ chính */}
      <div
        className="position-absolute top-50 start-25 translate-middle rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      ></div>

      <div className="row align-items-center g-5 position-relative z-1">
        {/* Main Info (Left) */}
        <div className="col-lg-6 text-center text-lg-start">
          <div className="d-flex flex-column mb-1">
            <h2 className="display-6 fw-bold m-0 d-flex align-items-center justify-content-center justify-content-lg-start gap-2">
              <span className="text-info opacity-75">
                <MapPinIcon />
              </span>
              {city}
            </h2>
            {country && (
              <span className="text-secondary-custom fs-5 fw-light">
                {country}
              </span>
            )}
            <Clock utcOffsetSeconds={data.utcOffsetSeconds} initialLocalTime={data.localTime} />
          </div>

          <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4 my-2">
            <span
              className="fw-thin tracking-tighter display-1 text-gradient-gold"
              style={{ fontSize: "7.5rem", lineHeight: 0.9 }}
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

          {comparison && (
            <div
              className="mt-4 d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-white border shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.05)" }}
            >
              <TrendingUp size={18} className="text-warning" />
              <small className="fw-medium text-secondary-custom">
                {comparison}
              </small>
            </div>
          )}
        </div>

        {/* Details Grid (Right) */}
        <div className="col-lg-6">
          <div className="row g-3">
            {[
              {
                label: "Độ ẩm",
                value: `${data.humidity}%`,
                icon: Droplets,
                color: "#60a5fa",
              },
              {
                label: "Gió",
                value: `${data.windSpeed} km/h`,
                icon: Wind,
                color: "#86efac",
              },
              {
                label: "Áp suất",
                value: `${Math.round(data.pressure)} hPa`,
                icon: Gauge,
                color: "#c4b5fd",
              },
              {
                label: "UV Index",
                value: data.uvIndex,
                icon: SunIcon,
                color: "#fdba74",
              },
            ].map((item, idx) => (
              <div key={idx} className="col-6">
                <div
                  className="p-3 h-100 rounded-4 bg-white border d-flex align-items-center gap-3 hover-scale"
                  style={{
                    transition: "background 0.2s, transform 0.2s",
                    borderColor: "rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,1)")
                  }
                >
                  <div className="p-2 rounded-circle bg-light d-flex justify-content-center align-items-center shadow-sm">
                    <item.icon size={24} style={{ color: item.color }} />
                  </div>
                  <div className="d-flex flex-column">
                    <span className="small text-secondary-custom fw-medium">
                      {item.label}
                    </span>
                    <span className="fs-5 fw-semibold text-dark">
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

      const simpleTime = `${hours}:${minutes}`;

      const dayIndex = cityDateObj.getUTCDay();
      const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const currentDayName = days[dayIndex];
      const datePart = `${String(cityDateObj.getUTCDate()).padStart(2, '0')}/${String(cityDateObj.getUTCMonth() + 1).padStart(2, '0')}/${String(cityDateObj.getUTCFullYear()).padStart(2, '0')}`;

      setTimeStr(`${currentDayName}, ${datePart} | ${simpleTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [utcOffsetSeconds]);

  return (
    <div className="d-flex align-items-center gap-2 mt-2 text-secondary-custom opacity-75 small bg-secondary bg-opacity-10 px-3 py-1 rounded-pill fit-content">
      <span className="fw-bold" style={{ color: "#0D6EFD" }}>{timeStr}</span>
    </div>
  );
};

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
