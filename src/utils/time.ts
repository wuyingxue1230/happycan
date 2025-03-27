export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  return `${years ? years + '年' : ''}${months % 12 ? (months % 12) + '月' : ''}${days % 30 ? (days % 30) + '日' : ''}${hours % 24 ? (hours % 24) + '时' : ''}${minutes % 60 ? (minutes % 60) + '分' : ''}${seconds % 60 ? (seconds % 60) + '秒' : ''}`;
};

export const calculateProgress = (startTime: number, endTime: number): number => {
  const now = Date.now();
  const total = endTime - startTime;
  const elapsed = now - startTime;
  
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  
  return Math.floor((elapsed / total) * 100);
};

export const getProgressColor = (progress: number): string => {
  if (progress <= 30) return '#ee0a24';
  if (progress <= 70) return '#ff976a';
  return '#07c160';
};