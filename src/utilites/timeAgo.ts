export function timeAgo(iso: string | number | Date, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (sec < 10) return "Just now"; // also covers small clock skew / future times
  if (sec < 60) return `${sec} seconds ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min > 1 ? "s" : ""} ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;

  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const startOf = (d: Date): number =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(date)) / 86_400_000);

  if (days === 1) return `Yesterday at ${time}`;
  if (days < 7) return `${date.toLocaleDateString([], { weekday: "long" })} at ${time}`;

  const sameYear = date.getFullYear() === now.getFullYear();
  const day = date.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  return `${day} at ${time}`;
}

