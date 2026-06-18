import { useEffect } from 'react';
import detectBot from '@/utils/detect_bot';
import HelpCenter from '@/pages/help-center';
import { LangProvider } from '@/context/lang-context';

const App = () => {
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

    return (
        <LangProvider>
            <div className="min-h-screen bg-slate-50">
                <HelpCenter />
            </div>
        </LangProvider>
    );
};

export default App;
