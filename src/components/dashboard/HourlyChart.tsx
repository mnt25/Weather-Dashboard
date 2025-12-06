import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HourlyData } from "../../types/weather";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Droplets,
} from "lucide-react";
import { getWeatherDescription } from "../../utils/weatherUtils";

interface HourlyChartProps {
  data: HourlyData[];
  city: string;
}

// Icon helper
const getChartIcon = (code: number) => {
  if (code === 0) return <Sun size={24} className="text-warning" />;
  if (code >= 1 && code <= 3)
    return <Cloud size={24} className="text-secondary-custom" />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return <CloudRain size={24} className="text-info" />;
  if (code >= 71 && code <= 77)
    return <Snowflake size={24} className="text-info" />;
  if (code >= 95) return <CloudLightning size={24} className="text-primary" />;
  return <CloudFog size={24} className="text-secondary-custom" />;
};

export const HourlyChart: React.FC<HourlyChartProps> = ({ data, city }) => {
  const CustomAxisTick = ({ x, y, payload, index }: any) => {
    const item = data[index];
    if (!item) return null;

    return (
      <g transform={`translate(${x},${y})`}>
        {/* 1. Thời gian */}
        <text
          x="0"
          y="0"
          dy="10"
          textAnchor="middle"
          fill="#64748b"
          fontSize="12"
          fontWeight="500"
        >
          {payload.value}
        </text>

        {/* 2. Icon Thời tiết*/}
        <foreignObject x="-12" y="20" width="24" height="24">
          <div className="d-flex justify-content-center align-items-center h-100">
            {getChartIcon(item.weatherCode)}
          </div>
        </foreignObject>

        {/* 3. Nhiệt độ  (Big & Clear) */}
        <text
          x="0"
          y="65"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="16"
          fontWeight="bold"
        >
          {item.temp}°
        </text>

        {/* 4. Xác suất mưa */}
        {item.precipitationProb > 0 ? (
          <foreignObject x="-20" y="75" width="40" height="20">
            <div className="d-flex justify-content-center align-items-center gap-1">
              <Droplets size={10} className="text-info" />
              <span className="text-info fw-bold" style={{ fontSize: "11px" }}>
                {item.precipitationProb}%
              </span>
            </div>
          </foreignObject>
        ) : (
          <text
            x="0"
            y="88"
            textAnchor="middle"
            fill="rgba(0,0,0,0.1)"
            fontSize="10"
          ></text>
        )}

        {/* 5. Tốc độ gió */}
        <foreignObject x="-25" y="95" width="50" height="20">
          <div className="d-flex justify-content-center align-items-center gap-1 opacity-75">
            <Wind size={12} className="text-secondary-custom" />
            <span
              className="text-secondary-custom small fw-medium"
              style={{ fontSize: "11px" }}
            >
              {Math.round(item.windSpeed)} km/h
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div
          className="glass-card p-3 shadow-lg border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            minWidth: "180px",
            borderColor: "rgba(0,0,0,0.05)",
          }}
        >
          <p
            className="fw-bold text-dark mb-2 border-bottom pb-1"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          >
            {label}
          </p>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="text-secondary-custom small">Thời tiết:</span>
              <span className="text-dark fw-medium small">
                {getWeatherDescription(dataPoint.weatherCode)}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="text-secondary-custom small">Nhiệt độ:</span>
              <span className="text-warning fw-bold">{dataPoint.temp}°C</span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="text-secondary-custom small">Mưa:</span>
              <span className="text-info fw-medium">
                {dataPoint.precipitationProb}%
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="text-secondary-custom small">Gió:</span>
              <span className="text-dark fw-medium">
                {Math.round(dataPoint.windSpeed)} km/h
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-4 mt-4 shadow-lg w-100 position-relative overflow-hidden">
      <h3 className="text-secondary-custom fs-6 fw-semibold  tracking-wider mb-4 ps-1">
        {" "}
        Thời tiết {city} hàng giờ
      </h3>

      <div
        className="w-100 overflow-auto pb-2 custom-scrollbar"
        style={{ cursor: "grab" }}
      >
        <div style={{ minWidth: "1200px", height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                interval={0}
                tick={<CustomAxisTick />}
                axisLine={false}
                tickLine={false}
                height={140}
              />
              <YAxis hide={true} domain={["dataMin - 3", "dataMax + 3"]} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(0,0,0,0.1)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
