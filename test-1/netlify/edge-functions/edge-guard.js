/**
 * Netlify Edge: gọi cùng `evaluateEdgeGuard` với middleware Vercel (shared-edge-guard.mjs).
 */
import { evaluateEdgeGuard } from '../../shared-edge-guard.mjs';

export default async (request, context) => {
    const ip = context.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    const blocked = evaluateEdgeGuard(request, ip);
    if (blocked) {
        return blocked;
    }

    return context.next();
};
