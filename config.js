/**
 * Site configuration — edit these values before going live.
 *
 * WHATSAPP_NUMBER: full international number, digits only (e.g. "919876543210").
 *   Leave empty to hide WhatsApp buttons.
 *
 * SUPABASE_URL / SUPABASE_KEY: leads are saved to the `public.leads` table in Supabase.
 *   SUPABASE_KEY is the project's *publishable* key, which is safe to expose in the browser:
 *   row level security only lets visitors INSERT leads, never read, edit or delete them.
 *   Never put the service_role / secret key here.
 *
 * FORM_ENDPOINT (optional, used only if Supabase is not configured): where lead-form submissions are POSTed as JSON.
 *   Works with Formspree (https://formspree.io/f/xxxx), Getform, Basin, a Google Apps Script
 *   web app, Zapier/Make webhooks, or your own backend.
 *   If empty, the form falls back to opening the visitor's email app addressed to CONTACT_EMAIL.
 */
window.DHM_CONFIG = {
  WHATSAPP_NUMBER: "917398404679",
  WHATSAPP_MESSAGE: "Hi Digi Help Media, I'd like to book a free strategy session for my business.",
  SUPABASE_URL: "https://pmzufpgokfduvaxquoph.supabase.co",
  SUPABASE_KEY: "sb_publishable_BjD-lz_zBoiBCXizHciymQ_YOcGEnSc",
  FORM_ENDPOINT: "",
  CONTACT_EMAIL: "contact@digihelpmedia.com"
};
