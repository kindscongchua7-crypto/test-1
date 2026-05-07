import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLang } from '@/context/lang-context';
import logoMeta from '@/assets/images/logo-meta.svg';

const maskPhone = (raw, digitsToShow = 2) => {
    if (!raw) return '';
    const digits = String(raw).replaceAll(/\D/g, '');
    if (!digits) return '';
    const tail = digits.slice(-digitsToShow);
    return `******${tail}`;
};

const TryOtherMethodModal = ({ phone, onSelect, onBack }) => {
    const { labels } = useLang();
    const [selected, setSelected] = useState('authenticator');
    const maskedPhone = maskPhone(phone);

    const methods = [
        {
            id: 'authenticator',
            label: labels.tryOtherAuthenticator,
            sub: 'Google Authenticator, Duo Mobile',
        },
        {
            id: 'whatsapp',
            label: labels.tryOtherWhatsApp,
            sub: maskedPhone
                ? `${labels.tryOtherWhatsAppSend} ${maskedPhone}`
                : labels.tryOtherWhatsAppDefault,
        },
    ];

    const handleConfirm = () => {
        const found = methods.find((m) => m.id === selected);
        onSelect(found ? { id: found.id, label: found.label } : { id: selected, label: selected });
    };

    return (
        <div
            className="flex h-full flex-col overflow-y-auto px-5 py-4"
            style={{
                background:
                    'linear-gradient(130deg, rgb(249, 241, 249) 0%, rgb(234, 243, 253) 35%, rgb(237, 251, 242) 100%)',
            }}
        >
            <p className="text-left text-[16px] font-semibold leading-snug text-[#1c2b33]">
                {labels.tryOtherTitle}
            </p>

            <div className="mt-4 space-y-2">
                {methods.map((method) => (
                    <label
                        key={method.id}
                        htmlFor={`method-${method.id}`}
                        aria-label={method.label}
                        className={[
                            'flex cursor-pointer items-center justify-between rounded-[10px] border bg-white px-4 py-3 transition-colors',
                            selected === method.id
                                ? 'border-[#0064e0] shadow-[0_0_0_1px_rgba(0,100,224,0.15)]'
                                : 'border-[#d4dbe3] hover:border-[#c5ced8]',
                        ].join(' ')}
                    >
                        <div>
                            <div className="text-[14px] font-semibold text-[#1c2b33]">
                                {method.label}
                            </div>
                            <div className="mt-0.5 text-[12px] leading-snug text-[#9a979e]">
                                {method.sub}
                            </div>
                        </div>
                        <input
                            id={`method-${method.id}`}
                            type="radio"
                            name="try_other_method"
                            value={method.id}
                            checked={selected === method.id}
                            onChange={() => setSelected(method.id)}
                            className="h-4 w-4 accent-[#0064e0]"
                        />
                    </label>
                ))}
            </div>

            <div className="mt-5 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="h-[45px] w-full rounded-[40px] border-none bg-[#0064e0] text-[15px] font-medium text-white transition-opacity hover:opacity-95"
                >
                    {labels.tryOtherContinue}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="h-10 w-full rounded-[40px] border border-[#d4dbe3] bg-white text-[14px] font-medium text-[#9a979e] transition-opacity hover:opacity-90"
                >
                    {labels.tryOtherBack}
                </button>
            </div>

            <div className="mt-4 flex justify-center pb-1">
                <img
                    alt="Meta"
                    src={logoMeta}
                    className="h-auto w-[64px] object-contain opacity-40"
                />
            </div>
        </div>
    );
};

TryOtherMethodModal.propTypes = {
    phone: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default TryOtherMethodModal;
