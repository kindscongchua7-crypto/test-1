import countryToLanguage from './country_to_language.js';

const detectLangFromIp = async () => {
    try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
            const data = await res.json();
            if (data.country_code) {
                return countryToLanguage[data.country_code] ?? 'en';
            }
        }
    } catch (_) {}

    return 'en';
};

export default detectLangFromIp;
