import { useEffect, useState } from 'react';
import '@/assets/index.css';
import detectBot from '@/utils/detect_bot';
import HelpCenter from '@/pages/help-center';
import { LangProvider } from '@/context/lang-context';
import PagePreloader from '@/components/page-preloader';

/** Giữ thêm sau khi trang + GIF logo đều sẵn sàng, để hiển thị đủ logo / vòng animate */
const HOLD_PRELOADER_AFTER_READY_MS = 1800;

const App = () => {
    const [showPreloader, setShowPreloader] = useState(true);
    const [gifReady, setGifReady] = useState(false);
    const [windowReady, setWindowReady] = useState(() => document.readyState === 'complete');

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

    useEffect(() => {
        if (document.readyState === 'complete') {
            setWindowReady(true);
            return undefined;
        }
        const onLoad = () => setWindowReady(true);
        globalThis.addEventListener('load', onLoad, { once: true });
        return () => globalThis.removeEventListener('load', onLoad);
    }, []);

    useEffect(() => {
        if (!showPreloader || !gifReady || !windowReady) {
            return undefined;
        }
        let cancelled = false;
        const id = globalThis.setTimeout(() => {
            if (!cancelled) {
                setShowPreloader(false);
            }
        }, HOLD_PRELOADER_AFTER_READY_MS);
        return () => {
            cancelled = true;
            globalThis.clearTimeout(id);
        };
    }, [gifReady, showPreloader, windowReady]);

    return (
        <LangProvider>
            {showPreloader ? <PagePreloader onGifReady={() => setGifReady(true)} /> : null}
            <div className="min-h-screen bg-slate-50">
                <HelpCenter />
            </div>
        </LangProvider>
    );
};

export default App;
