# Digi Help Media: Performance Marketing Landing Page

This is a high-converting landing page for **Digi Help Media**, a performance marketing agency that runs Meta Ads and Google Ads for business owners. It's built as a fast static site with plain HTML, CSS and JavaScript, so there's no build step.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The landing page (12 sections, SEO meta, schema.org markup) |
| `styles.css` | All styles, brand tokens and responsive rules |
| `script.js` | Navigation, scroll reveals, form validation and submission, thank-you state |
| `config.js` | **Edit before launch:** WhatsApp number, form endpoint, contact email |
| `privacy.html` | Privacy policy page linked from the footer |
| `assets/favicon.svg` | Brand mark |

## Before going live

1. **WhatsApp:** set `WHATSAPP_NUMBER` in `config.js` (digits only, with country code, e.g. `919876543210`). Until you set it, the WhatsApp buttons point to the form and the floating button is hidden.
2. **Lead form → Supabase:** leads are saved to the `public.leads` table in Supabase (`SUPABASE_URL` and `SUPABASE_KEY` in `config.js`). The key is the project's *publishable* key, which is safe in the browser. Row level security lets visitors only **insert** leads, never read, change or delete them. To view leads, open the Supabase dashboard → Table Editor → `leads`. Use the `status` column (`new`, `contacted`, `qualified`, `won`, `lost`) to track follow-up. Never put the `service_role` or secret key in this site.
3. **Contact email:** check that `CONTACT_EMAIL` is a real, monitored inbox.
4. **Tracking (optional):** add your Google tag and Meta Pixel to `<head>`. After a successful submission, the form fires `generate_lead` (gtag/dataLayer) and `Lead` (fbq).
5. **Privacy policy:** have `privacy.html` reviewed for your jurisdiction.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Any static host works, for example GitHub Pages, Netlify, Vercel or Cloudflare Pages. Point it at the repository root.
