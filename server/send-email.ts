export interface OutgoingEmail {
  readonly from: string;
  readonly to: string;
  readonly replyTo: string;
  readonly subject: string;
  /** Plain text only: submitted input is never put into HTML. */
  readonly text: string;
}

export type SendEmail = (email: OutgoingEmail) => Promise<boolean>;

/** Sends through Resend's REST API (https://resend.com/docs/api-reference/emails/send-email). */
export function resendSender(apiKey: string, fetchFn: typeof fetch = fetch): SendEmail {
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
