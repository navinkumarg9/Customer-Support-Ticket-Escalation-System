// Convert UTC timestamp to IST for display
export function formatIST(utcTime) {
  if (!utcTime) return "—";

  return new Date(utcTime).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Calculate remaining SLA time safely using UTC
export function getRemainingTimeUTC(deadline) {
  if (!deadline) return { text: "—", expired: false };

  const now = Date.now(); // UTC based
  const end = new Date(deadline).getTime(); // UTC

  const diff = end - now;

  if (diff <= 0) {
    return { text: "Expired", expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return {
    text: `${hours}h ${minutes}m`,
    expired: false,
  };
}
