function salesPeriod(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const value = type => Number(parts.find(part => part.type === type).value);
  const today = Date.UTC(value("year"), value("month") - 1, value("day"));
  const date = offset => new Date(today + offset * 86400000).toISOString().slice(0, 10);
  return { start: date(-5), end: date(-1) };
}

module.exports = { salesPeriod };
