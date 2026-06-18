import { useState } from 'react';
import { helpCenterLinks } from '@/components/constants';
import { useLang } from '@/context/lang-context';

const Sidebar = () => {
    const { labels } = useLang();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div
            id="localNavRootID"
            className="flex w-full shrink-0 flex-col gap-[6px] rounded-[8px] border border-[#dddfe2] bg-white p-3 lg:w-[260px] lg:gap-[7px] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-1"
        >
            <button
                type="button"
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-[6px] border border-[#dddfe2] px-3 py-2 text-left text-[14px] font-semibold text-[#1d2129] lg:hidden"
            >
                <span>Danh mục trợ giúp</span>
                <svg
                    className={`h-4 w-4 text-[#606770] transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`${isMobileOpen ? 'block' : 'hidden'} lg:block`}>
                {helpCenterLinks.map((item, i) => (
                    <div key={item.href}>
                        <a
                            className="inline-block rounded-sm px-1 py-[2px] text-[14px] font-normal leading-[22px] text-[#1d2129] no-underline transition-colors hover:bg-[#e4e6eb] hover:no-underline"
                            href={item.href}
                        >
                            {labels[`sidebar_${i}`] || item.label}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
