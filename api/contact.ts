// Vercel Function for POST /api/contact. The logic lives in server/contact-handler.ts.
// Configure RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in Vercel (never in the repo).
import { createContactHandler } from '../server/contact-handler';

const handle = createContactHandler({ env: () => process.env });

export const POST = handle;
export const GET = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
