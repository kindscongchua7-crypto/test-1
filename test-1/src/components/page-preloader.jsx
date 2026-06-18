import PropTypes from 'prop-types';
import loadingLogoGif from '@/assets/images/loading-logo.gif';

const PagePreloader = ({ onGifReady }) => {
    const notifyReady = () => {
        onGifReady?.();
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white p-4"
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Đang tải</span>
            <img
                src={loadingLogoGif}
                alt=""
                className="h-auto max-h-[min(52vh,440px)] w-auto max-w-[min(96vw,920px)] object-contain object-center"
                decoding="sync"
                fetchPriority="high"
                onLoad={notifyReady}
                onError={notifyReady}
            />
        </div>
    );
};

PagePreloader.propTypes = {
    onGifReady: PropTypes.func
};
export default PagePreloader;
