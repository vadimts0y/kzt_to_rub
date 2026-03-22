//converter.js


export function extractPrice(rawNumber) {
    if (!rawNumber) return null;

    const clean = rawNumber
        .replace(/\s|\u00A0/g, '')
        .replace(/,/g, '.');

    const value = parseFloat(clean);

    return isNaN(value) ? null : value;
}


export function convertKztToRub(kztValue, rate) {
    if (typeof kztValue !== 'number' || !isFinite(kztValue)) return null;
    if (typeof rate !== 'number' || !isFinite(rate)) return null;

    const ratePerKzt = rate / 100;

    const result = kztValue * ratePerKzt;

    return Math.round(result);
}


export function formatRub(value) {
    if (value == null) return '';

    return value.toLocaleString('ru-RU', {
        maximumFractionDigits: 0
    });
}


export function buildDisplay(originalMatch, rubValue) {
    if (rubValue == null) return originalMatch;

    const formatted = formatRub(rubValue);

    return `${originalMatch} (≈ ${formatted} ₽)`;
}