import { createBrowserRouter } from 'react-router';
import App from '@/app';
import NotFound from '@/pages/not-found';

export const PATHS = {
    INDEX: '/',
    TIMEACTIVE: '/live'
};

const router = createBrowserRouter([
    {
        path: PATHS.INDEX,
        element: <NotFound />
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
