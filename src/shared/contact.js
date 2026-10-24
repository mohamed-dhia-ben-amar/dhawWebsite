'use strict';
// Contact form rules shared by the Angular form and the /api/contact function (brief §7), so the
// client and the server can never disagree on what is valid.
Object.defineProperty(exports, '__esModule', { value: true });
exports.CONTACT_ENDPOINT =
  exports.HONEYPOT_FIELD =
  exports.EMAIL_PATTERN =
  exports.CONTACT_LIMITS =
    void 0;
exports.CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
};
/** Deliberately simple: something@something.tld, no spaces. Same check on both sides. */
exports.EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Hidden field that people never fill in; bots that do are dropped silently. */
exports.HONEYPOT_FIELD = 'website';
exports.CONTACT_ENDPOINT = '/api/contact';
