import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Clock, Thermometer, Wind } from "lucide-react";
import type { WeatherData } from "../../types/weather";

interface HourlyChartProps {
  data: WeatherData["hourly"];
  city: string;
}

export const HourlyChart: React.FC<HourlyChartProps> = ({ data, city }) => {
  const [activeTab, setActiveTab] = useState<"temp" | "wind_rain">("temp");

  const formattedData = data.map((item) => ({
    ...item,
    tempRound: Math.round(item.temp),
    rainVal: item.precipitationProb,
    windVal: Math.round(item.windSpeed),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 shadow-lg border rounded-4 text-start" 
          style={{ 
            background: "var(--glass-bg)", 
            borderColor: "var(--glass-border)",
            backdropFilter: "blur(12px)",
            color: "var(--text-primary)"
          }}
        >
          <p className="fw-bold mb-2 small text-secondary-custom">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="d-flex align-items-center gap-2 mb-1">
              <div 
                className="rounded-circle" 
                style={{ width: "8px", height: "8px", backgroundColor: p.stroke || p.fill }} 
              />
              <span className="small text-secondary-custom">{p.name}:</span>
              <strong className="fw-bold" style={{ color: "var(--text-primary)" }}>
                {p.value}{p.name === "Nhiệt độ" ? "°C" : p.name === "Khả năng mưa" ? "%" : " km/h"}
              </strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-4 hover-scale w-100 animate-fade-in">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <h3 className="fs-5 fw-bold m-0 d-flex align-items-center gap-2 text-start">
          <Clock size={20} className="text-secondary-custom" style={{ color: "var(--accent-color)" }} />
          Dự báo 24 giờ tới tại {city}
        </h3>

        {/* Tab Selection */}
        <div className="chart-tab-container border shadow-sm" style={{ borderColor: "var(--glass-border)" }}>
          <button
            onClick={() => setActiveTab("temp")}
            className={`chart-tab d-flex align-items-center gap-1 ${
              activeTab === "temp" ? "active" : ""
            }`}
          >
            <Thermometer size={14} />
            Nhiệt độ
          </button>
          <button
            onClick={() => setActiveTab("wind_rain")}
            className={`chart-tab d-flex align-items-center gap-1 ${
              activeTab === "wind_rain" ? "active" : ""
            }`}
          >
            <Wind size={14} />
            Gió & Mưa
          </button>
        </div>
      </div>

      <div className="w-100" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "temp" ? (
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-item-border)" />
              <XAxis
                dataKey="hour"
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--card-item-border)", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="tempRound"
                name="Nhiệt độ"
                stroke="var(--accent-color)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                animationDuration={1500}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-item-border)" />
              <XAxis
                dataKey="hour"
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--card-item-border)", strokeWidth: 1 }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                type="monotone"
                dataKey="rainVal"
                name="Khả năng mưa"
                stroke="#3b82f6" // Custom Blue
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="windVal"
                name="Tốc độ gió"
                stroke="#10b981" // Custom Green
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
