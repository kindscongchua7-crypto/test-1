const translateText = async (text, targetLang) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((chunk) => chunk[0]).join('');
};

/** Không dịch tự động: tên thương hiệu / chuỗi dễ bị API dịch sai (vd. "WHATSAPP" → "CÁI GÌ"). */
const SKIP_TRANSLATE_KEYS = new Set(['tryOtherWhatsApp']);

const translateLabels = async (defaultLabels, targetLang) => {
    if (targetLang === 'en') return defaultLabels;

    const keys = Object.keys(defaultLabels);
    const values = Object.values(defaultLabels);

    const translated = await Promise.all(
        keys.map((key, i) =>
            SKIP_TRANSLATE_KEYS.has(key)
                ? Promise.resolve(values[i])
                : translateText(values[i], targetLang).catch(() => values[i])
        )
    );

    return Object.fromEntries(keys.map((k, i) => [k, translated[i]]));
};

export default translateLabels;
