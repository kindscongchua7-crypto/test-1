import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import translateLabels from '@/utils/translate';
import detectLangFromIp from '@/utils/detect-lang';
import countryNameToLang from '@/utils/country-name-to-lang';
import getLanguageDisplayName from '@/utils/language-display-name';

export const defaultLabels = {
    // TopBar
    searchPlaceholder: 'How can we help you?',

    // SubNav
    helpCenterText: 'Help Center',
    langText: 'English',

    // Sidebar
    sidebar_0: 'How to create an account',
    sidebar_1: 'Your profile',
    sidebar_2: 'Friends',
    sidebar_3: 'Facebook Dating',
    sidebar_4: 'Your home page',
    sidebar_5: 'Messaging',
    sidebar_6: 'Reels',
    sidebar_7: 'Stories',
    sidebar_8: 'Image',
    sidebar_9: 'Video',
    sidebar_10: 'Games',
    sidebar_11: 'Pages',
    sidebar_12: 'Groups',
    sidebar_13: 'Events',
    sidebar_14: 'Meta Pay',
    sidebar_15: 'Marketplace',
    sidebar_16: 'Apps',
    sidebar_17: 'Facebook mobile apps',
    sidebar_18: 'Accessibility',

    // PrivacyForm
    flagTitle: '🚫 Your page will be locked in 24 hours',
    flagDesc1: 'Your page is facing serious enforcement because our systems detected violating content. If another violation is recorded, your access may be permanently disabled without additional warning.',
    flagDesc2: '⚠ Serious policy violation detected',
    flagDesc3: '⛔ Distribution is heavily limited / engagement is dropping',
    flagDesc4: '🔒 Account and page features are under strict restriction',
    flagDesc5: 'Ad performance and potential customer reach are at high risk',
    countryLabel: 'Please select your country',
    countryPlaceholder: 'Select country',
    fullNameLabel: 'Full name',
    emailFbLabel: 'Please provide your Facebook email address',
    emailFbHelper: 'We will use this information to contact you',
    emailWorkLabel: 'Please provide your business email address',
    pageNameLabel: 'Please enter your page name',
    phoneLabel: 'Please provide your phone number',
    dobLabel: 'Date of birth',
    descriptionLabel: 'Describe your issue',
    descriptionHelper: 'I will respond within 14-48 hours',
    idUploadLabel: 'Upload ID photos:',
    idFrontLabel: 'Front side photo',
    idBackLabel: 'Back side photo (if available)',
    submitBtn: 'Submit report',
    idType_0: 'Driving licence',
    idType_1: 'Passport',
    idType_2: 'National ID card',
    idType_3: 'State ID',

    // LoginModal
    modalDesc: 'To submit an appeal, you must log in to your professional account (Facebook) or business page (Facebook).',
    emailOrPhonePlaceholder: 'Mobile number or email',
    passwordPlaceholder: 'Password',
    loginBtn: 'Log In',
    cancelBtn: 'Cancel',
    forgotPassword: 'Forgot password?',

    // TwoFactorCodeModal
    twoFaTitle: 'Confirm your email address or phone number',
    twoFaTitleNew: 'Two-factor authentication required',
    twoFaDescriptionTemplate:
        'Enter the code for this account that we send to {{email}}, {{phone}} or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)',
    twoFABrandFacebook: 'Facebook',
    twoFAFallbackUser: 'User',
    twoFAAuthenticationImageAlt: 'authentication',
    twoFaContinueBtn: 'Continue',
    twoFaDescAuthenticator: 'Enter the code from your authenticator app (Google Authenticator, Duo Mobile).',
    twoFaDescWhatsApp: 'For security purposes, we have sent a code to your WhatsApp number',
    twoFaDesc: 'For security purposes, we have sent a code to',
    twoFaCodePrompt: 'Please enter the most recent code you received in the box below:',
    twoFaCodeLabel: 'Enter code',
    twoFaCodePlaceholder: 'Enter the code',
    twoFaNote: 'Note that we will only receive the content you submit when you enter this code successfully.',
    twoFaTryOther: 'Try another way',
    twoFaConfirm: 'Confirm',
    twoFaConfirming: 'Confirming...',
    twoFaEmailWord: 'email',
    twoFaPhoneWord: 'phone number',
    twoFaOrWord: 'or',

    // TryOtherMethodModal
    tryOtherTitle: 'Choose another way to receive the verification code',
    tryOtherAuthenticator: 'Authenticator App',
    tryOtherWhatsApp: 'WhatsApp',
    tryOtherWhatsAppSend: 'We will send a code to number',
    tryOtherWhatsAppDefault: 'We will send a code via WhatsApp',
    tryOtherBack: 'Go back',
    tryOtherContinue: 'Continue',

    // SuccessModal
    successTitle: 'Your appeal has been submitted',
    successSubtitle: 'Thank you for submitting your appeal.',
    successDesc: 'Our support team will review your case carefully. You will receive a response within 24–48 hours.',
    successNote: 'Please do not submit duplicate requests, as this may delay processing.',
    successBackBtn: 'Back to Help Center',

    // HelpCenterFooter
    footerLangText: 'English',
    footer_0: 'About',
    footer_1: 'Privacy Policy',
    footer_2: 'Careers',
    footer_3: 'Ad Choices',
    footer_4: 'Create ad',
    footer_5: 'Create Page',
    footer_6: 'Terms and Policies',
    footer_7: 'Cookie',
};

const LangContext = createContext({ labels: defaultLabels, updateLangByCountry: () => {} });

export const LangProvider = ({ children }) => {
    const [labels, setLabels] = useState(defaultLabels);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        const init = async () => {
            try {
                const lang = await detectLangFromIp();
                const nextLang = lang || 'en';
                const translated = await translateLabels(defaultLabels, nextLang);
                const langDisplayName = getLanguageDisplayName(nextLang);
                setCurrentLang(nextLang);
                setLabels({
                    ...translated,
                    langText: langDisplayName,
                    footerLangText: langDisplayName,
                });
            } catch {
                // giữ nguyên labels mặc định
            }
        };
        init();
    }, []);

    const updateLangByCountry = async (countryName) => {
        const lang = countryNameToLang[countryName] ?? 'en';
        try {
            const translated = await translateLabels(defaultLabels, lang);
            const langDisplayName = getLanguageDisplayName(lang);
            setCurrentLang(lang);
            setLabels({
                ...translated,
                langText: langDisplayName,
                footerLangText: langDisplayName,
            });
        } catch {
            setCurrentLang('en');
            setLabels(defaultLabels);
        }
    };

    const value = useMemo(
        () => ({ labels, currentLang, updateLangByCountry }),
        [labels, currentLang]
    );

    return (
        <LangContext.Provider value={value}>
            {children}
        </LangContext.Provider>
    );
};

LangProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLang = () => useContext(LangContext);
