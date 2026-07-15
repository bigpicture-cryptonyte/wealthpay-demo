# WealthPay Demo App

A **static demo** of the WLTH Pay customer sign-up. It captures an initial WLTH signup, hands
the user off to our separately-built **Pay frontend** (dev) via a WLTH SSO token, and lets the
Pay UI prefill KYC from the signup.

This is throwaway/demo scaffolding — it is **not** the real WealthPay platform (we don't have
access to that). It exists so we can demonstrate the full sign-up → onboarding flow end-to-end.

## Pages

- **`/` ([`index.html`](./index.html)) — the sign-up landing.** Choose **WLTH** or
  **WLTH / Juno Money**:
  - **WLTH account** — a prefilled WLTH registration form. **Create account** POSTs to the dev
    BFF's temp `/signup-draft` endpoint (which saves the signup in its **own collection** and
    mints a `wlthId`), then shows a success modal. **Continue to WealthPay** saves the account and
    redirects to `/home` (mimicking login).
  - **WLTH / Juno Money account** — hands the customer off to Juno Money.
- **`/home` ([`home.html`](./home.html)) — the signed-in WealthPay shell.** Header matches the Pay
  UI (WLTH logo + product switcher + org chip / bell / avatar). Choosing **Pay** in the product
  switcher (or the **Open WLTH Pay** button) mints a WLTH SSO token for the created `wlthId` and
  hands off to the dev Pay UI, which prefills KYC from the saved signup. Other products are demo
  placeholders.
- **`/dev` ([`dev.html`](./dev.html)) — dev tools.** Jump straight into the demo/KYC account on
  dev, or approve an account.
- **`/signup` ([`signup.html`](./signup.html)) — older standalone sign-up demo** (self-contained
  business-onboarding walkthrough), kept for reference.

## Configure the endpoints

Shared config + SSO token minting live in one place — [`wlth-sso.js`](./wlth-sso.js):

```js
window.JUNO_REDIRECT_URL = "https://dev.junomoney.org/invite-to-register/ru02k2fwck/business";
window.WLTH_SSO = {
  ssoUrl: "https://dev-wealthpay.junomoney.org/api/sso/wlth", // dev BFF SSO endpoint (API base = ssoUrl without /sso/wlth)
  demoAccount: { ... }, kycAccount: { ... },
  privateKeyPkcs8Pem: `-----BEGIN PRIVATE KEY-----…`,          // DEV-ONLY RS256 key (public half = dev BFF WLTH_SSO_PUBLIC_KEY)
};
```

Both `index.html` and `dev.html` load `wlth-sso.js`, so the key/URLs are defined once.

## Run locally

It's a single static file — just open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy to Vercel

No build step. Either:

- **Dashboard:** import the GitHub repo, framework preset **Other**, leave build/output empty.
- **CLI:**
  ```bash
  npm i -g vercel
  vercel --prod
  ```

## Notes

- Icons are inline [Lucide](https://lucide.dev) SVGs (no external dependencies).
- Font falls back to a system stack; WLTH's real font (SuisseIntl) is proprietary.
