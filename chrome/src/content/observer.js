//observer.js


import { processTextNodes } from './dom.js';

export function startObserver(callback) {
    const nodesToProcess = new Set();
    const processedRoots = new WeakSet();

    let scheduled = false;

    function schedule() {
        if (scheduled) return;
        scheduled = true;

        const run = () => {
            scheduled = false;

            for (const root of nodesToProcess) {
                if (!root || processedRoots.has(root)) continue;

                processedRoots.add(root);
                processTextNodes(root, callback);
            }

            nodesToProcess.clear();
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(run, { timeout: 200 });
        } else {
            requestAnimationFrame(run);
        }
    }

    function normalizeNode(node) {
        if (!node) return null;

        if (node.nodeType === Node.TEXT_NODE) {
            return node.parentNode;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            return node;
        }

        return null;
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Добавленные ноды
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    const el = normalizeNode(node);
                    if (el) nodesToProcess.add(el);
                }
            }

            // Изменение текста
            if (mutation.type === 'characterData') {
                const el = normalizeNode(mutation.target);
                if (el) nodesToProcess.add(el);
            }
        }

        schedule();
    });

    function start(root) {
        if (!root) return;

        observer.observe(root, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // первичная обработка
        nodesToProcess.add(root);
        schedule();
    }

    function init() {
        if (document.body) {
            start(document.body);
        } else {
            const interval = setInterval(() => {
                if (document.body) {
                    clearInterval(interval);
                    start(document.body);
                }
            }, 50);
        }
    }

    init();

    // 🔹 API для возможной остановки (полезно для тестов)
    return {
        disconnect() {
            observer.disconnect();
        }
    };
}