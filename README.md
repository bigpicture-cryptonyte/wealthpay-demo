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

## Configure the redirect target

The hand-off URL lives in one place at the top of [`index.html`](./index.html):

```html
<script>
  window.PAY_REDIRECT_URL = "https://wealth-pay-web-ui.vercel.app/"; // deployed Pay frontend
</script>
```

Points to the deployed Pay frontend. Update it here if that URL ever changes.

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
