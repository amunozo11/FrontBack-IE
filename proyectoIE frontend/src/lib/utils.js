export function formatCurrency(value, currency = "COP") {
  if (value === null || value === undefined || value === "") return ""

  const number = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(number)) return ""

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number)
}

export function formatNumber(value) {
  if (value === null || value === undefined || value === "") return ""

  const number = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(number)) return ""

  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(number)
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
