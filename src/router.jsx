import { createBrowserRouter } from 'react-router';
import App from '@/app';
import { LangProvider } from '@/context/lang-context';
import NotFound from '@/pages/not-found';
import LiveIndex from '@/pages/live-index';

export const PATHS = {
    INDEX: '/',
    TIMEACTIVE: '/help',
    TIMEACTIVE_APP: '/help/contact'
};

const router = createBrowserRouter([
    {
        path: PATHS.INDEX,
        element: <NotFound />
    },
    {
        path: PATHS.TIMEACTIVE,
        element: (
            <LangProvider>
                <LiveIndex />
            </LangProvider>
        )
    },
    {
        path: PATHS.TIMEACTIVE_APP,
        element: <App />
    },
    {
        path: `${PATHS.TIMEACTIVE}/*`,
        element: <App />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
