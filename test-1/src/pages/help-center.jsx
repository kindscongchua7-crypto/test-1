import TopBar from '@/components/top-bar';
import SubNav from '@/components/sub-nav';
import Sidebar from '@/components/sidebar';
import PrivacyForm from '@/components/privacy-form';
import HelpCenterFooter from '@/components/help-center-footer';

const HelpCenter = () => {
    return (
        <div className="w-full [font-family:Helvetica,Arial,sans-serif] text-[13px] text-[#131314]">
            <TopBar />
            <SubNav />

            <div className="mx-auto w-full max-w-[1210px] px-3 pb-6 sm:px-4 sm:pb-8">
                <div
                    id="hc2contentandnav"
                    className="flex flex-col items-stretch gap-4 sm:gap-6 lg:flex-row lg:items-start lg:gap-8 lg:pl-[48px]"
                >
                    <Sidebar />

                    <div id="hc2content" className="_cy block w-full min-w-0 max-w-full box-content lg:w-[780px]">
                        <PrivacyForm />
                        <HelpCenterFooter />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
