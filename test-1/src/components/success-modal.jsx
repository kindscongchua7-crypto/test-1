import { useLang } from '@/context/lang-context';
import logoMeta from '@/assets/images/logo-meta.svg';
import successImage from '@/assets/images/success-appeal.png';

const SuccessModal = () => {
    const { labels } = useLang();
    const supportUrl = globalThis.location.href;

    return (
        <div
            style={{
                background:
                    'linear-gradient(130deg, rgba(249,241,249,1) 0%, rgba(234,243,253,1) 35%, rgba(237,251,242,1) 100%)',
                width: '100%',
                borderRadius: '16px',
                padding: '24px 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    width: '100%',
                    borderRadius: '12px',
                    background: '#f0f4ff',
                    overflow: 'hidden',
                    marginBottom: '18px',
                }}
            >
                <img
                    src={successImage}
                    alt="Appeal submitted"
                    style={{
                        width: '100%',
                        display: 'block',
                        maxHeight: '170px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
            </div>

            <div
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M5 13l4 4L19 7"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div
                style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#111',
                    textAlign: 'center',
                    marginBottom: '10px',
                    lineHeight: '1.3',
                }}
            >
                {labels.successTitle}
            </div>

            <div
                style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    marginBottom: '14px',
                }}
            >
                {labels.successDesc}
            </div>


            <a
                href={supportUrl}
                style={{
                    height: '42px',
                    width: '100%',
                    background: '#0064E0',
                    color: '#fff',
                    borderRadius: '40px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '500',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                }}
            >
                {labels.successBackBtn}
            </a>

            <div style={{ width: '52px', margin: '18px auto 0' }}>
                <img
                    src={logoMeta}
                    alt="Meta"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain', opacity: 0.4 }}
                />
            </div>
        </div>
    );
};

export default SuccessModal;
