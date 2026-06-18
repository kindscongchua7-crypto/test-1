const normalizeLangCode = (langCode) => {
    if (!langCode || typeof langCode !== 'string') return 'en';
    return langCode.toLowerCase().split('-')[0].trim();
};

const getLanguageDisplayName = (langCode) => {
    const normalized = normalizeLangCode(langCode);
    const supportedLocale = Intl.DisplayNames.supportedLocalesOf([normalized])[0];

    if (supportedLocale) {
        const languageNames = new Intl.DisplayNames([supportedLocale], { type: 'language' });
        return languageNames.of(normalized) || 'English';
    }

    const fallbackNames = {
        vi: 'Tiếng Việt',
        en: 'English',
    };

    return fallbackNames[normalized] || 'English';
};

export default getLanguageDisplayName;
