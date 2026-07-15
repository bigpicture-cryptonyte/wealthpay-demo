# WealthPay Demo App

A **static demo** of the WealthPay (WLTH) platform shell. Its only job is to mimic the
WLTH top bar with the **Pay** service dropdown and hand the user off to our separately-built
**Pay frontend** when they click **Pay**.

This is throwaway/demo scaffolding — it is **not** the real WealthPay platform (we don't have
access to that). It exists so we can demonstrate the full hand-off flow end-to-end.

## What it does

- A minimal WLTH platform shell: logo + **Demo** tag, the **Pay** service switcher
  (Broker / Pay / Shareholder / Dashboard / Customer), account chip + avatar.
- A simple welcome hero with a **Launch Pay** button.
- Clicking **Pay** in the dropdown (or **Launch Pay**) redirects to the Pay frontend.
- The other four services are demo-only (they show a small "demo only" toast).

> Note: there are no Pay pages here on purpose. Payments / payees / cards etc. live in the
> separate **Pay frontend** repo — this shell only launches it.

## Sign-up page (`/signup`)

[`signup.html`](./signup.html) is a standalone demo of the WLTH Pay customer sign-up, served at
`/signup` (Vercel `cleanUrls`). It offers the two onboarding journeys from the WLTH onboarding doc:

- **WLTH account** — a click-through demo of the full WLTH-direct journey, prefilled at each step:
  1. **Stage 1 – account registration** (name, DOB, contact, residential address, password, T&Cs /
     Privacy consent). Hitting **Create account** shows an account-created / signed-in screen with a
     **Start business onboarding** button.
  2. **Stage 2 – WLTH Pay business onboarding** — a 7-step wizard inside one form (business
     details, activities, directors, beneficial owners, authorised representative, supporting
     documents, declaration).
  3. **Submit application** opens a completion modal summarising the details submitted for
     WLTH Pay verification and the verification → WLTH Pay activation status.
- **WLTH / Juno Money account** — hands the customer off to Juno Money, which on-boards them and
  shares their details back with WLTH.

## Configure the redirect targets

The hand-off URLs each live in one place at the top of their file:

```html
<!-- index.html -->
<script>
  window.PAY_REDIRECT_URL = "https://wealth-pay-web-ui.vercel.app/"; // deployed Pay frontend
</script>

<!-- signup.html -->
<script>
  window.JUNO_REDIRECT_URL = "https://dev2.junomoney.org/invite-to-register/ru02k2fwck/business"; // Juno Money onboarding
</script>
```

Update them here if either URL ever changes.

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
