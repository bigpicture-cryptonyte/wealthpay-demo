// ============================================================
//  Shared WLTH SSO config + client-side token minting (dev demo)
//  Used by both the landing (index.html) and the dev tools (/dev).
//
//  The landing captures a signup, saves it to the dev BFF's temp
//  /signup-draft endpoint (mints a wlthId), then mints a WLTH SSO
//  token for THAT wlthId and hands off to the dev BFF — which creates
//  the session and drops the user into the Pay web UI's KYC.
//
//  privateKeyPkcs8Pem is the dev RS256 key (public half is the dev
//  BFF's WLTH_SSO_PUBLIC_KEY). DEV ONLY — visible in page source, so
//  this must never point at a real/prod key.
// ============================================================
window.JUNO_REDIRECT_URL = "https://dev2.junomoney.org/invite-to-register/ru02k2fwck/business";
window.WLTH_SSO = {
  ssoUrl: "https://dev-wealthpay.junomoney.org/api/sso/wlth",
  demoAccount: { wlthId: "wlth-4ed90f5f-86a9-44bf-904f-41a1c31e1675", email: "test@test.com", name: "Nikhil Sahani" },
  // Existing user to jump straight into — opens whatever KYC state they're in.
  kycAccount: { wlthId: "wlth-30f906ec-aaae-4fac-a646-0f03c7bb4bc2" },
  privateKeyPkcs8Pem: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmk8wXUHhNCTCt
agVkHcrVoe8wn3YmzY4zV35XGAls8fGSVz/kiBa+SRlEjnnWqGOFP2IxA5ZgSaH0
CfYDnYn8t8pLmR4b6KcnvXEFnAYiyZYx/Aj/6y/ys/223tsU6Pr6Ux+0NE2NnPZo
ZVnL+47V5jJIoZHX3Oolh16lZWWR71IzyVbOituoCsKKKTLmmdO4gYSm8dNnW3uf
Zux6uRxDNl/RumPF61ROwFoHddQbicpCHboG0GYTQ6noUypUqU6QQELSIHHj4ENt
Z/Z1h+1jvB3zKarSTt/naCKohBNYE0V9wjEFtorjcQa52nBeJInLYP2cjKtJQ3NO
Vy5wXYcrAgMBAAECggEAJal99/l8MaK1zEePz3qC7TlPLLWpD43jLE2IZaWsH+M2
BKnQatmwFrbNTThPaM6qrapOh5lxivSq9tO3uUqJs8dUKDKG4bWA8ZW985A6vOvK
FyQOXtpsfVnfr9SEQR6J/EYGAYbfz/hgp+reWiXWvhrtXImXQXCTygdoyUl7JPrT
DkLG9a2Fzfabp5K4B3n1seSQXTuUGdMDJICjb+ndtfYJljGTEjSWF0oTy0ZBOfBq
gWiZIID7DLTWkFObWxDELQE8PdvHEOkzvJ6mwxGK0wTw81RXsc159UTAgH6f6Sa9
XG46gYsUmB1N49MvgEEx6xjOor6xGAXv04kQUQGIlQKBgQDBjo35bHzR0rqYFszL
IpX8SCc4R/zwYp2R/zlYpnoe9wTQT6fKBf76FgQHcIPZYwEUmdH9zn21MauBsI4n
ZNfm6aDgIMAAqEo1A3VFW39/g+gyfFxvgVo6W+S/ofaYLEec4/eB4MZPc6dMXlq5
Ie9hax9cMa+AtG9uJHXjgQ9qbwKBgQDcUQ/XLVW0AroWmKwrvhJrly/IvfIgGAv6
jFJyhLTtht7E3Rw+wZis6S5vVQ8d5t49XJHNC8FmcwHPIq4iPU+vnOxVGl4wYXp0
NlXWT/Cs5AEVAGpfgAg775X7DsqiXhX9+udJf/FchvMLpsgTBQNn7rwcYnhpEW2u
6Mhflow9BQKBgCbzzmSkzZXYZ87Vv88dnbuQtbvg2OlznyxThbHuhuMWaTSW4ziH
7mFb7uGkZhRolT4VGqqOVMQTQ+Wsp18ML1r8J3EThjBbrdtvX7leiZEa9a67Ukrq
aEMYXTenm53SQ3MyeYv8tUwmBUQcNPvO9YLQcRY3tY8cQNSUp9jqDzUnAoGAYnph
aD89Zb8qSttnag4F0c28cDBnP+0/vXhnigTDksCMZtamv25tvixksyMEJMuDX043
Zb3xbsfNcTcBOxDIw6iTAt9MZrfLspJu/+Kvo7guu6J56cIi7BeFpLjR3o3LqsEy
DOqBimhPz093cvj0sspFjzJ8vAosStiGaCO0/7kCgYAhrMt9mtBtN41uzIfKurXc
s4xccXzgR+WRyDZUe+QnZ6QBeIJ62JEFpVDZA2TEeQzq1C0MT9o0YxayZPQdJFuH
09wLeKpYuKWu/3ZFuun9rHBsAc/I/1LNOOuJbKBoZLHuT3r10fVaBtMK48QH2hPJ
2e/0+cUsYKHePVZg7fsOKQ==
-----END PRIVATE KEY-----`,
};

window.WlthSso = (function () {
  var cfg = window.WLTH_SSO;
  function apiBase() { return (cfg.ssoUrl || "").replace(/\/sso\/wlth\/?$/, ""); }
  function b64url(bytes) { var a = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), s = ""; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64urlStr(str) { return b64url(new TextEncoder().encode(str)); }
  function pemToPkcs8(pem) { var b = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""), r = atob(b), u = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) u[i] = r.charCodeAt(i); return u.buffer; }
  async function mintToken(claims) {
    var key = await crypto.subtle.importKey("pkcs8", pemToPkcs8(cfg.privateKeyPkcs8Pem), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    var now = Math.floor(Date.now() / 1000);
    var header = b64urlStr(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    var payload = b64urlStr(JSON.stringify(Object.assign({ iat: now, exp: now + 300 }, claims)));
    var data = header + "." + payload;
    var sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(data));
    return data + "." + b64url(sig);
  }
  // Mint a WLTH SSO token for `claims` and open the dev BFF hand-off (new tab).
  async function handoff(claims) {
    if (!cfg.privateKeyPkcs8Pem) { alert("Dev SSO key not configured."); return; }
    try {
      var token = await mintToken(claims);
      window.open(cfg.ssoUrl + "?token=" + encodeURIComponent(token), "_blank", "noopener");
    } catch (e) { alert("Could not mint SSO token: " + e.message); }
  }
  return { apiBase: apiBase, handoff: handoff };
})();
