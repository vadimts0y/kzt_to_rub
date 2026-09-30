// dom.js


export function findTextNodes(root) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }

                if (shouldSkipNode(node)) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodes = [];
    let current;

    while ((current = walker.nextNode())) {
        nodes.push(current);
    }

    return nodes;
}


export function shouldSkipNode(node) {
    const parent = node.parentNode;

    if (!parent) return true;

    // предотвращаем повторную обработку
    if (parent.dataset?.kztConverted === "true") return true;

    const tag = parent.nodeName;

    return (
        tag === 'SCRIPT' ||
        tag === 'STYLE' ||
        tag === 'NOSCRIPT' ||
        tag === 'TEXTAREA' ||
        tag === 'INPUT' ||
        tag === 'SVG' ||
        tag === 'CANVAS' ||
        parent.isContentEditable
    );
}


export function processTextNodes(root, callback) {
    const nodes = findTextNodes(root);

    for (const node of nodes) {
        callback(node);
    }
}


export function replaceText(node, newText) {
    if (node.nodeValue !== newText) {
        node.nodeValue = newText;

        const parent = node.parentNode;

        // помечаем как обработанный
        if (parent) {
            parent.dataset.kztConverted = "true";
        }
    }
}