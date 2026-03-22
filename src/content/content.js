//content.js


import '../styles/content.css';
import { processTextNodes, replaceText } from './dom.js';
import { extractPrice, convertKztToRub, buildDisplay } from './converter.js';
import { KZT_REGEX } from '../shared/constants.js';
import { startObserver } from './observer.js';

let currentRate = 0.2;
let rateReady = false;

(async function init() {
    await ensureDOMReady();

    await updateRate();

    const handler = (node) => processNode(node);

    // первичная обработка
    processTextNodes(document.body, handler);

    // наблюдение
    startObserver(handler);

    // периодическое обновление курса (например, раз в час)
    setInterval(updateRate, 60 * 60 * 1000);
})();


function ensureDOMReady() {
    if (document.body) return Promise.resolve();

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (document.body) {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}


async function getRate() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_RATE' }, (response) => {
            resolve(typeof response === 'number' ? response : null);
        });
    });
}


async function updateRate() {
    const rate = await getRate();

    if (rate && rate > 0) {
        currentRate = rate;
        rateReady = true;
    }
}


function processNode(node) {
    if (!rateReady) return;

    const original = node.nodeValue;
    if (!original) return;

    const replaced = original.replace(KZT_REGEX, (match, number) => {
        const value = extractPrice(number);
        if (value == null) return match;

        const rub = convertKztToRub(value, currentRate);

        return buildDisplay(match, rub);
    });

    replaceText(node, replaced);
}