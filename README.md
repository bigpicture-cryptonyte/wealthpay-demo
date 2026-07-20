# WealthPay Demo App

A **static demo** of the WLTH Pay customer sign-up. It captures an initial WLTH signup, hands
the user off to our separately-built **Pay frontend** (dev) via a WLTH SSO token, and lets the
Pay UI prefill KYC from the signup.

This is throwaway/demo scaffolding — it is **not** the real WealthPay platform (we don't have
access to that). It exists so we can demonstrate the full sign-up → onboarding flow end-to-end.

## Pages

- **`/` ([`index.html`](./index.html)) — public home page** for WLTH.com: hero + product cards, with
  **Log in** / **Sign up** CTAs. If a session already exists it shows "Continue to WLTH" (`/home`).
- **`/signup` ([`signup.html`](./signup.html)) — sign-up.** A prefilled WLTH registration form
  (incl. a password). **Create account** POSTs to the dev BFF's `/signup-draft` (saves the signup in
  its **own collection**, stores a scrypt-hashed password, mints a `wlthId`), then shows a success
  modal. **Continue** saves the session and redirects to `/home`.
- **`/login` ([`login.html`](./login.html)) — log in.** Email + password → `POST /signup-draft/login`
  (validated against the stored hash) → saves the session → `/home`. Same credentials as sign-up.
- **`/home` ([`home.html`](./home.html)) — the signed-in WLTH landing.** Requires a session
  (redirects to `/login` otherwise); has a **Log out**. Header matches the Pay UI (WLTH logo +
  product switcher + org chip / bell / avatar). Choosing **Pay** (or **Open WLTH Pay**) mints a WLTH
  SSO token for the `wlthId` and **redirects in the same tab** into the dev Pay UI, which prefills KYC
  from the saved signup. Other products are demo placeholders.
- **`/dev` ([`dev.html`](./dev.html)) — dev tools.** Jump straight into the demo/KYC account on
  dev, or approve an account.

## Configure the endpoints

Shared config + SSO token minting live in one place — [`wlth-sso.js`](./wlth-sso.js):

```js
window.JUNO_REDIRECT_URL = "https://dev2.junomoney.org/invite-to-register/ru02k2fwck/business";
window.WLTH_SSO = {
  ssoUrl: "https://dev-wealthpay.junomoney.org/api/sso/wlth", // dev BFF SSO endpoint (API base = ssoUrl without /sso/wlth)
  demoAccount: { ... }, kycAccount: { ... },
  privateKeyPkcs8Pem: `-----BEGIN PRIVATE KEY-----…`,          // DEV-ONLY RS256 key (public half = dev BFF WLTH_SSO_PUBLIC_KEY)
};
```

Every page loads `wlth-sso.js`, so the key/URLs — and the shared `login` / `handoff` / session
helpers — are defined once.

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
