
export const getDayName = (dateStr: string, referenceDateStr?: string): string => {
  const date = new Date(dateStr);
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();

  const d = new Date(date); d.setUTCHours(0,0,0,0);
  const r = new Date(refDate); r.setUTCHours(0,0,0,0);
  
  if (d.getTime() === r.getTime()) return "Hôm nay";
  
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[date.getUTCDay()];
};
