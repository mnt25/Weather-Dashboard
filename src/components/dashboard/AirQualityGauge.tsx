import React from "react";
import { getAirQualityInfo } from "../../utils/weatherUtils.tsx";
import { ShieldAlert } from "lucide-react";

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

  return (
    <div 
      className="glass-card p-4 h-100 d-flex flex-column align-items-center justify-content-between hover-scale"
      style={{
        boxShadow: `var(--glass-shadow), 0 8px 30px ${colorClass}12`,
        borderColor: `${colorClass}35`,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <h3 className="text-secondary-custom fs-6 fw-semibold text-uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
        <ShieldAlert size={16} style={{ color: colorClass }} />
        Chất lượng không khí
      </h3>

      <div
        className="position-relative d-flex align-items-end justify-content-center"
        style={{ width: "12rem", height: "6.5rem" }}
      >
        <svg className="w-100 h-100 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="aqiSmoothGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="30%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <g>
            {/* Background path */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Gauge progress */}
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
                  "stroke-dashoffset 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </g>
        </svg>

        <div className="position-absolute bottom-0 d-flex flex-column align-items-center text-center translate-y-2">
          <span
            className="fw-bold"
            style={{
              fontSize: "2.2rem",
              lineHeight: 0.8,
              letterSpacing: "-0.05em",
              color: "var(--text-primary)"
            }}
          >
            {aqi}
          </span>
          <span
            className="fw-bold text-uppercase mt-2 px-3 py-1 rounded-pill shadow-xs"
            style={{
              fontSize: "0.7rem",
              backgroundColor: `${colorClass}20`,
              color: colorClass,
              border: `1px solid ${colorClass}40`,
              letterSpacing: "0.05em"
            }}
          >
            {status}
          </span>
        </div>
      </div>

      <p className="text-secondary-custom small text-center mt-3 mb-0 fw-medium opacity-90 px-2">
        {description}
      </p>
    </div>
  );
};
