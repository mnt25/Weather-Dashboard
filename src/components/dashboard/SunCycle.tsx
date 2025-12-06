import React, { useEffect, useState } from "react";
import { Sunrise, Sunset } from "lucide-react";

interface SunCycleProps {
  sunrise: string;
  sunset: string;
}

export const SunCycle: React.FC<SunCycleProps> = ({ sunrise, sunset }) => {
  const [positionPercent, setPositionPercent] = useState(0);
  const [formattedSunrise, setFormattedSunrise] = useState("");
  const [formattedSunset, setFormattedSunset] = useState("");

  useEffect(() => {
    if (!sunrise || !sunset) return;

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const now = new Date();

    const formatTime = (date: Date) =>
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setFormattedSunrise(formatTime(sunriseDate));
    setFormattedSunset(formatTime(sunsetDate));

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
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between shadow-lg">
      <h3 className="text-secondary-custom fs-6 fw-semibold text-uppercase tracking-wider mb-2">
        Mặt trời
      </h3>

      <div
        className="position-relative w-100 d-flex align-items-end justify-content-center"
        style={{ height: "8rem" }}
      >
        <svg className="w-100 h-100 overflow-visible" viewBox="0 0 180 100">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="sunPathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="90"
            x2="180"
            y2="90"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />

          {/* Đường nét đứt */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          <path
            d={`M 10 90 A 80 80 0 0 1 ${isDay ? sunX : 10} ${
              isDay ? sunY : 90
            } L ${isDay ? sunX : 10} 90 Z`}
            fill="url(#sunPathGradient)"
            stroke="none"
          />

          {/* Mặt trời */}
          {isDay && (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="8" fill="#fbbf24" filter="url(#glow)" />
              <circle
                r="14"
                fill="none"
                stroke="#fbbf24"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>
      </div>

      <div className="d-flex justify-content-between align-items-center w-100 mt-2 px-2">
        <div className="d-flex flex-column align-items-center">
          <Sunrise size={20} className="text-warning mb-1" />
          <span className="small text-secondary-custom">Bình minh</span>
          <span className="fw-bold">{formattedSunrise}</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <Sunset size={20} className="text-warning mb-1" />
          <span className="small text-secondary-custom">Hoàng hôn</span>
          <span className="fw-bold">{formattedSunset}</span>
        </div>
      </div>
    </div>
  );
};
