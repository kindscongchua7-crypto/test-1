import { useLang } from '@/context/lang-context';

const SubNav = () => {
    const { labels } = useLang();

    return (
        <div className="mb-4 border-t border-[#355899] bg-[#e9ebee] sm:mb-8 sm:h-[62px]">
            <div className="mx-auto flex w-full max-w-[1040px] flex-col items-start gap-1.5 px-4 py-2.5 sm:h-full sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:py-0">
                <div className="relative inline-flex items-center pb-1 sm:flex sm:h-full sm:pb-0">
                    <a
                        href="/help/"
                        className="relative inline-flex items-center pl-[22px] text-[14px] font-bold leading-[18px] text-[#3578e5] no-underline sm:hover:underline"
                    >
                        <span className="absolute left-0 top-1/2 block h-[14px] w-[14px] -translate-y-1/2 bg-[url('https://static.xx.fbcdn.net/rsrc.php/v4/yj/r/TKWV1TjN3V3.png')] bg-[position:0px_0px] bg-no-repeat bg-auto" />
                        <span>{labels.helpCenterText}</span>
                    </a>
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#3578e5] sm:h-[3px]" />
                </div>

                <button
                    type="button"
                    title="Sử dụng Facebook bằng ngôn ngữ khác."
                    className="border-0 bg-transparent p-0 text-[12px] leading-[16px] text-[#6d84b4] sm:self-auto sm:text-[11px]"
                >
                    {labels.langText}
                </button>
            </div>
        </div>
    );
};

export default SubNav;
