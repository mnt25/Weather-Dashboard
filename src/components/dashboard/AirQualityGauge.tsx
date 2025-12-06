import React from "react";
import { getAirQualityInfo } from "../../utils/weatherUtils.tsx";

interface AirQualityGaugeProps {
  aqi: number;
}

export const AirQualityGauge: React.FC<AirQualityGaugeProps> = ({ aqi }) => {
  const { status, description, colorClass } = getAirQualityInfo(aqi);

  const radius = 80;
  const strokeWidth = 8;
  const normalizedAQI = Math.min(aqi, 350);
  const maxAQI = 350;

  const circumference = Math.PI * radius;
  const percentage = normalizedAQI / maxAQI;
  const strokeDashoffset = circumference * (1 - percentage);

  // Bộ tách cho thước đo
  const separators = [36, 72, 108, 144].map((angle) => {
    const radian = (angle * Math.PI) / 180;
    const x1 = 100 + 72 * Math.cos(radian);
    const y1 = 100 - 72 * Math.sin(radian);
    const x2 = 100 + 98 * Math.cos(radian);
    const y2 = 100 - 98 * Math.sin(radian);
    return { x1, y1, x2, y2 };
  });

  return (
    <div className="glass-card p-4 h-100 d-flex flex-column align-items-center shadow-lg hover-scale">
      <h3 className="text-secondary-custom fs-6 fw-semibold text-uppercase tracking-wider mb-4">
        Chất lượng không khí
      </h3>

      <div
        className="position-relative d-flex align-items-end justify-content-center"
        style={{ width: "12rem", height: "6.5rem" }}
      >
        <svg className="w-100 h-100 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <mask id="gauge-mask">
              <rect x="0" y="0" width="200" height="200" fill="white" />
              {separators.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="black"
                  strokeWidth="3"
                />
              ))}
            </mask>

            <linearGradient id="aqiSmoothGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="30%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <g mask="url(#gauge-mask)">
            {/* Đường dẫn nền */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Tiến độ giá trị */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#aqiSmoothGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition:
                  "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </g>
        </svg>

        <div className="position-absolute bottom-0 d-flex flex-column align-items-center text-center translate-y-2">
          <span
            className="fw-thin display-4 fw-bold"
            style={{
              fontSize: "2rem",
              lineHeight: 0.8,
              letterSpacing: "-0.05em",
            }}
          >
            {aqi}
          </span>
          <span
            className="fw-bold text-uppercase mt-2 px-3 py-1 rounded-pill"
            style={{
              fontSize: "0.7rem",
              backgroundColor: `${colorClass}33`,
              color: colorClass,
            }}
          >
            {status}
          </span>
        </div>
      </div>

      <p className="text-secondary-custom small text-center mt-3 mb-0 fw-light">
        {description}
      </p>
    </div>
  );
};
