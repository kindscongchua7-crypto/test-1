import { create } from 'zustand';

const FALLBACK_COUNTRY = 'vn';

const usePhoneStore = create((set, get) => ({
    countryCode: null,
    dialCode: null,
    isFetching: false,
    hasResolvedGeo: false,

    setCountry: (countryCode, dialCode = null) => set({ countryCode, dialCode }),

    fetchGeoCountry: async () => {
        if (get().hasResolvedGeo || get().isFetching) {
            return get().countryCode || FALLBACK_COUNTRY;
        }

        set({ isFetching: true });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const res = await fetch(`https://ipapi.co/json/?t=${Date.now()}`, {
                signal: controller.signal,
                cache: 'no-store',
                headers: { Accept: 'application/json' },
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            const code = data.country_code?.toLowerCase();
            const resolved = code?.length === 2 ? code : FALLBACK_COUNTRY;

            set({ countryCode: resolved, isFetching: false, hasResolvedGeo: true });

            return resolved;
        } catch {
            clearTimeout(timeoutId);
            set({ countryCode: FALLBACK_COUNTRY, isFetching: false, hasResolvedGeo: true });

            return FALLBACK_COUNTRY;
        }
    },
}));

export default usePhoneStore;
