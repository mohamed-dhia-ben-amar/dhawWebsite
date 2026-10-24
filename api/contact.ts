// Vercel Function for POST /api/contact. The logic lives in server/contact-handler.ts.
// Configure RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in Vercel (never in the repo).
// Compiled by Vercel with api/tsconfig.json (CommonJS, NodeNext): relative imports need explicit
// `.js` extensions. server/function-smoke.spec.ts compiles and loads it the same way.
import { createContactHandler } from '../server/contact-handler.js';

const handle = createContactHandler({ env: () => process.env });

export const POST = handle;
export const GET = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
