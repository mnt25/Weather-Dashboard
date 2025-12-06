import { Cloud, CloudRain, Sun, CloudLightning, Snowflake } from "lucide-react";

export const getWeatherInfo = (
  code: number
): { condition: string; description: string } => {
  if (code === 0) return { condition: "Nắng", description: "Trời quang" };
  if (code >= 1 && code <= 3)
    return { condition: "Có mây", description: "Có mây rải rác" };
  if (code === 45 || code === 48)
    return { condition: "Sương mù", description: "Sương mù dày đặc" };
  if (code >= 51 && code <= 55)
    return { condition: "Mưa phùn", description: "Mưa phùn nhẹ" };
  if (code >= 61 && code <= 65)
    return { condition: "Mưa", description: "Trời có mưa" };
  if (code >= 66 && code <= 67)
    return { condition: "Mưa băng", description: "Mưa lạnh buốt" };
  if (code >= 71 && code <= 77)
    return { condition: "Tuyết", description: "Tuyết rơi" };
  if (code >= 80 && code <= 82)
    return { condition: "Mưa rào", description: "Mưa rào nặng hạt" };
  if (code >= 85 && code <= 86)
    return { condition: "Tuyết", description: "Bão tuyết" };
  if (code >= 95 && code <= 99)
    return { condition: "Dông bão", description: "Dông bão kèm sấm sét" };
  return { condition: "Có mây", description: "Thời tiết bình thường" };
};

export const getAirQualityInfo = (aqi: number) => {
  let status = "Tốt";
  let description = "Không khí trong lành.";
  let colorClass = "#4ade80";

  if (aqi > 50) {
    status = "Trung bình";
    description = "Chất lượng ổn định.";
    colorClass = "#facc15";
  }
  if (aqi > 100) {
    status = "Kém";
    description = "Nhạy cảm nên hạn chế.";
    colorClass = "#fb923c";
  }
  if (aqi > 150) {
    status = "Xấu";
    description = "Có hại sức khỏe.";
    colorClass = "#f87171";
  }
  if (aqi > 200) {
    status = "Rất xấu";
    description = "Cảnh báo khẩn cấp.";
    colorClass = "#c084fc";
  }
  if (aqi > 300) {
    status = "Nguy hại";
    description = "Tránh ra ngoài.";
    colorClass = "#a855f7";
  }

  return { status, description, colorClass };
};

export const getWeatherIcon = (condition: string, size = 64) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("mưa"))
    return <CloudRain size={size} className="text-info" />;
  if (lowerCondition.includes("nắng") || lowerCondition.includes("quang"))
    return <Sun size={size} className="text-warning" />;
  if (lowerCondition.includes("tuyết"))
    return <Snowflake size={size} className="text-info" />;
  if (lowerCondition.includes("bão") || lowerCondition.includes("sấm"))
    return <CloudLightning size={size} className="text-primary" />;
  return <Cloud size={size} className="text-secondary-custom" />;
};

export const getWeatherDescription = (code: number) => {
  if (code === 0) return "Trời quang";
  if (code >= 1 && code <= 3) return "Có mây";
  if (code >= 45 && code <= 48) return "Sương mù";
  if (code >= 51 && code <= 67) return "Mưa";
  if (code >= 71 && code <= 77) return "Tuyết";
  if (code >= 80 && code <= 82) return "Mưa rào";
  if (code >= 95) return "Dông bão";
  return "Bình thường";
};
