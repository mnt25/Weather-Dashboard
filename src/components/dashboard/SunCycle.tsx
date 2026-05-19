import React, { useEffect, useState } from "react";
import { Sunrise, Sunset, SunDim } from "lucide-react";

interface SunCycleProps {
  sunrise: string;
  sunset: string;
}

export const SunCycle: React.FC<SunCycleProps> = ({ sunrise, sunset }) => {
  const [positionPercent, setPositionPercent] = useState(0);
  const [formattedSunrise, setFormattedSunrise] = useState("");
  const [formattedSunset, setFormattedSunset] = useState("");
  const [daylightDuration, setDaylightDuration] = useState("");

  useEffect(() => {
    if (!sunrise || !sunset) return;

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const now = new Date();

    const formatTime = (date: Date) =>
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setFormattedSunrise(formatTime(sunriseDate));
    setFormattedSunset(formatTime(sunsetDate));

    // Calculate Daylight Duration
    const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
    if (diffMs > 0) {
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setDaylightDuration(`${diffHrs} giờ ${diffMins} phút`);
    } else {
      setDaylightDuration("");
    }

    const totalDuration = sunsetDate.getTime() - sunriseDate.getTime();
    const elapsed = now.getTime() - sunriseDate.getTime();

    let percent = (elapsed / totalDuration) * 100;
    percent = Math.max(0, Math.min(100, percent));

    setPositionPercent(percent);
  }, [sunrise, sunset]);

  const radius = 80;
  const centerX = 90;
  const centerY = 90;

  const angle = Math.PI - (positionPercent / 100) * Math.PI;
  const sunX = centerX + radius * Math.cos(angle);
  const sunY = centerY - radius * Math.sin(angle);

  const isDay = positionPercent > 0 && positionPercent < 100;

  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between hover-scale">
      <h3 className="text-secondary-custom fs-6 fw-semibold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
        <SunDim size={16} className="text-warning" />
        Chu kỳ mặt trời
      </h3>

      <div
        className="position-relative w-100 d-flex align-items-end justify-content-center"
        style={{ height: "7rem" }}
      >
        <svg className="w-100 h-100 overflow-visible" viewBox="0 0 180 100">
          <defs>
            <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="sunPathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizon line */}
          <line
            x1="0"
            y1="90"
            x2="180"
            y2="90"
            stroke="var(--glass-border)"
            strokeWidth="1.5"
          />

          {/* Dotted path */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="4,5"
            className="opacity-25"
          />

          {/* Daylight shading */}
          <path
            d={`M 10 90 A 80 80 0 0 1 ${isDay ? sunX : 10} ${
              isDay ? sunY : 90
            } L ${isDay ? sunX : 10} 90 Z`}
            fill="url(#sunPathGradient)"
            stroke="none"
          />

          {/* Animated Glowing Sun Icon */}
          {isDay && (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="7" fill="#fbbf24" filter="url(#sun-glow)" />
              <circle
                r="12"
                fill="none"
                stroke="#fbbf24"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                style={{ transformOrigin: "center" }}
                className="animate-pulse"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Daylight Duration Badge */}
      {daylightDuration && (
        <div className="text-center my-1">
          <span 
            className="badge rounded-pill px-3 py-1.5 small fw-semibold text-secondary-custom"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.2)", 
              border: "1px solid var(--glass-border)",
              fontSize: "0.75rem"
            }}
          >
            Thời gian ban ngày: <strong>{daylightDuration}</strong>
          </span>
        </div>
      )}

      {/* Sunrise & Sunset Badge Indicators */}
      <div className="d-flex justify-content-between align-items-center w-100 mt-2 px-2">
        <div className="d-flex flex-column align-items-center">
          <div className="p-1.5 rounded-circle bg-white bg-opacity-20 border mb-1" style={{ borderColor: "var(--glass-border)" }}>
            <Sunrise size={16} className="text-warning" />
          </div>
          <span className="small text-secondary-custom" style={{ fontSize: "0.75rem" }}>Bình minh</span>
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{formattedSunrise}</span>
        </div>
        
        <div className="d-flex flex-column align-items-center">
          <div className="p-1.5 rounded-circle bg-white bg-opacity-20 border mb-1" style={{ borderColor: "var(--glass-border)" }}>
            <Sunset size={16} className="text-warning" />
          </div>
          <span className="small text-secondary-custom" style={{ fontSize: "0.75rem" }}>Hoàng hôn</span>
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{formattedSunset}</span>
        </div>
      </div>
    </div>
  );
};
