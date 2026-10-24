'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.resendSender = resendSender;
/** Sends through Resend's REST API (https://resend.com/docs/api-reference/emails/send-email). */
function resendSender(apiKey, fetchFn = fetch) {
  return async (email) => {
    const response = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
      }),
    });
    return response.ok;
  };
}
