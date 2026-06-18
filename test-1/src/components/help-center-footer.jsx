import type { FC } from 'react';
import { useLang } from '@/context/lang-context';

const footerHrefs = [
    ['https://about.meta.com/', '/privacy/policy/?entry_point=facebook_page_footer', '/careers/?ref=pf'],
    ['https://www.facebook.com/help/568137493302217', '/ad_campaign/landing.php?placement=pf&campaign_id=466780656697650&nav_source=unknown&extra_1=auto', '/pages/create/?ref_type=site_footer'],
    ['/policies?ref=pf', '/policies/cookies/'],
];

const HelpCenterFooter: FC = () => {
    const { labels } = useLang();

    const linkColumns = [
        [
            { label: labels.footer_0, href: footerHrefs[0][0] },
            { label: labels.footer_1, href: footerHrefs[0][1] },
            { label: labels.footer_2, href: footerHrefs[0][2] },
        ],
        [
            { label: labels.footer_3, href: footerHrefs[1][0] },
            { label: labels.footer_4, href: footerHrefs[1][1] },
            { label: labels.footer_5, href: footerHrefs[1][2] },
        ],
        [
            { label: labels.footer_6, href: footerHrefs[2][0] },
            { label: labels.footer_7, href: footerHrefs[2][1] },
        ],
    ];

    return (
        <footer
            aria-label="Liên kết trang web Facebook"
            className="mt-6 border-t border-[#d7d8da] pt-3 text-[11px] text-[#8a8d91]"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex shrink-0 flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[#bec3c9]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                        </svg>
                        <span className="text-[12px]">Meta © 2026</span>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-1 text-[11px] text-[#8a8d91] hover:underline"
                        aria-label="Sử dụng Facebook bằng ngôn ngữ khác."
                    >
                        <span>{labels.footerLangText}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                            className="h-2.5 w-2.5"
                            aria-hidden="true"
                        >
                            <path d="M1.5 4L6 8.5 10.5 4H1.5z" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-8">
                    {linkColumns.map((col) => (
                        <div key={col[0].href} className="flex flex-col gap-1">
                            {col.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-[#8a8d91] hover:underline"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default HelpCenterFooter;
