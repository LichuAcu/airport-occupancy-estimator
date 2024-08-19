export function formatHour(hour: number): string {
  return hour === 0
    ? "12 am"
    : hour < 12
    ? `${hour} am`
    : hour === 12
    ? "12 pm"
    : `${hour - 12} pm`;
}
