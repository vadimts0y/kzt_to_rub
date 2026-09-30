//background.js


const CACHE_KEY = 'kzt_rub_rate';
const TTL = 1000 * 60 * 60; // 1 час

let pendingRequest = null;

async function getCachedRate() {
    const result = await chrome.storage.local.get(CACHE_KEY);
    const cached = result[CACHE_KEY];

    if (!cached) return null;

    if (Date.now() - cached.timestamp > TTL) {
        return null;
    }

    return cached.value;
}

async function saveRate(rate) {
    await chrome.storage.local.set({
        [CACHE_KEY]: {
            value: rate,
            timestamp: Date.now()
        }
    });
}

/**
 * Получаем курс KZT -> RUB через курс USD от ЦБ
 * (ЦБ не даёт прямой курс KZT)
 */
async function fetchRate() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(
            'https://www.cbr-xml-daily.ru/daily_json.js',
            { signal: controller.signal }
        );

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        const usdToRub = data?.Valute?.USD?.Value;
        const kztToRub = data?.Valute?.KZT?.Value;

        if (typeof usdToRub !== 'number' || typeof kztToRub !== 'number') {
            throw new Error('Invalid API response');
        }

        /**
         * Логика:
         * ЦБ даёт курсы вида:
         * 1 USD = X RUB
         * 1 KZT = Y RUB
         *
         * Если нужен прямой KZT → RUB:
         * используем Y
         */
        const rate = kztToRub;

        await saveRate(rate);
        return rate;

    } finally {
        clearTimeout(timeout);
    }
}

async function getRate() {
    // 1. Проверяем кэш
    const cached = await getCachedRate();
    if (cached !== null) {
        return cached;
    }

    // 2. Если уже есть запрос — ждём его
    if (pendingRequest) {
        return pendingRequest;
    }

    // 3. Делаем новый запрос
    pendingRequest = (async () => {
        try {
            return await fetchRate();
        } catch (e) {
            console.error('Failed to fetch rate:', e);

            // fallback к кэшу (даже если TTL истёк)
            const fallback = await getCachedRate();
            if (fallback !== null) {
                return fallback;
            }

            // последний fallback (приближённое значение)
            return 0.18;
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GET_RATE') {
        getRate()
            .then(sendResponse)
            .catch(() => sendResponse(0.18));

        return true; // async response
    }
});