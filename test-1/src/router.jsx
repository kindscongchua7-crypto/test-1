import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import NotFound from '@/pages/not-found';
import PagePreloader from '@/components/page-preloader';

const App = lazy(() => import('@/app'));

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
        element: (
            <Suspense fallback={<PagePreloader />}>
                <App />
            </Suspense>
        ),
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
