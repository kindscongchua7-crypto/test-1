import { ipAddress, next } from '@vercel/functions';
import { evaluateEdgeGuard } from './shared-edge-guard.mjs';

/**
 * Routing Middleware (Vercel): cùng quy tắc với Netlify Edge `edge-guard`.
 * Docs: https://vercel.com/docs/routing-middleware
 */
export default function middleware(request) {
    const ip = ipAddress(request) ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    const blocked = evaluateEdgeGuard(request, ip);
    if (blocked) {
        return blocked;
    }

    return next();
}
