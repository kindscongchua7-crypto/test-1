import { useLang } from '@/context/lang-context';

const TopBar = () => {
    const { labels } = useLang();

    return (
        <div className="static box-content block w-full bg-[#3b5998] leading-[19.994px] text-[#131314]">
            <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-3 px-3 py-3 sm:h-[80px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-4 sm:py-0">
                <a href="/" title="Trang chủ" className="relative block h-[30px] w-[154px] shrink-0">
                    <span className="absolute block h-[30px] w-[154px] bg-[url('https://static.xx.fbcdn.net/rsrc.php/v4/yg/r/h6pHef1JhJs.png')] bg-[position:0px_0px] bg-no-repeat bg-auto text-[14px] leading-[1.538] text-[#131314]opacity-100" />
                </a>

                <form action="/help/search/" className="w-full sm:max-w-[660px]">
                    <input
                        type="text"
                        name="query"
                        autoComplete="new-password"
                        placeholder={labels.searchPlaceholder}
                        aria-label={labels.searchPlaceholder}
                        className="inline-block h-[36px] w-full box-border rounded-none border border-black bg-white bg-[url('https://static.xx.fbcdn.net/rsrc.php/v4/yZ/r/7pjIOVKylyJ.png')] bg-[position:8px_center] bg-no-repeat px-[8px] pl-[28px] text-[16px] font-normal leading-[20px] text-[#1c1e21] opacity-100 outline-none placeholder:text-[#6f7680] sm:max-w-[660px]"
                    />
                </form>
            </div>
        </div>
    );
};

export default TopBar;
