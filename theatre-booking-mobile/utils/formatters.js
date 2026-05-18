export function firstValue(item, keys) {
  return keys
    .map(key => item?.[key])
    .find(value => value !== undefined && value !== null && value !== '');
}

export function displayValue(item, keys, fallback = null) {
  const value = firstValue(item, keys);
  return value === undefined ? fallback : String(value);
}

export function formatDate(value) {
  if (!value) return null;

  const dateText = String(value);
  const datePart = dateText.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  const date = datePart ? new Date(`${datePart}T00:00:00`) : new Date(dateText);

  if (Number.isNaN(date.getTime())) return dateText;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTime(value) {
  if (!value) return null;

  const timeText = String(value);
  const match = timeText.match(/(\d{1,2}):(\d{2})/);

  if (match) {
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }

  const date = new Date(timeText);
  if (Number.isNaN(date.getTime())) return timeText;

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatPrice(value) {
  if (value === undefined || value === null || value === '') return null;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return String(value);

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(numberValue);
}
