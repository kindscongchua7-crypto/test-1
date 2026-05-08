/**
 * Logic guard dùng chung: Vercel (middleware.js) và Netlify (edge-functions).
 * Chặn UA automation + rate limit theo IP chỉ cho request document (Sec-Fetch-Dest).
 */

export const AUTOMATION_UA =
    /headless|playwright|puppeteer|selenium|webdriver|phantomjs|curl\/|wget\/|python-requests|go-http-client|scrapy|aiohttp|httpclient|libwww-perl|bytespider|petalbot|gptbot/i;

const WINDOW_MS = 60_000;
/** Số lần mở trang (document) tối đa mỗi IP mỗi phút — tăng nếu NAT đông người. */
const MAX_DOC_REQUESTS_PER_WINDOW = 90;

const ipHits = new Map();

const pruneHits = (now) => {
    if (ipHits.size < 5000) {
        return;
    }
    for (const [ip, rec] of ipHits) {
        if (now - rec.start > WINDOW_MS) {
            ipHits.delete(ip);
        }
    }
};

const rateLimitDocument = (ip, now) => {
    pruneHits(now);
    let rec = ipHits.get(ip);
    if (!rec || now - rec.start > WINDOW_MS) {
        rec = { start: now, n: 0 };
        ipHits.set(ip, rec);
    }
    rec.n += 1;
    return rec.n <= MAX_DOC_REQUESTS_PER_WINDOW;
};

/** @returns {Response | null} Response chặn, hoặc null để tiếp tục pipeline. */
export const evaluateEdgeGuard = (request, clientIp) => {
    const ua = request.headers.get('user-agent') || '';
    if (AUTOMATION_UA.test(ua)) {
        return new Response('Forbidden', {
            status: 403,
            headers: {
                'content-type': 'text/plain; charset=utf-8',
                'cache-control': 'private, no-store',
            },
        });
    }

    const dest = request.headers.get('sec-fetch-dest');
    if (dest === 'document') {
        const ip = clientIp || 'unknown';
        const now = Date.now();
        if (!rateLimitDocument(ip, now)) {
            return new Response('Too Many Requests', {
                status: 429,
                headers: {
                    'content-type': 'text/plain; charset=utf-8',
                    'cache-control': 'private, no-store',
                    'retry-after': '60',
                },
            });
        }
    }

    return null;
};
