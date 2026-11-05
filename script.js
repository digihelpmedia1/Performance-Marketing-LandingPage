(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var CFG = window.DHM_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- WhatsApp links ---------- */
  var waLinks = $$("[data-whatsapp]");
  if (CFG.WHATSAPP_NUMBER) {
    var waUrl = "https://wa.me/" + String(CFG.WHATSAPP_NUMBER).replace(/\D/g, "") +
      "?text=" + encodeURIComponent(CFG.WHATSAPP_MESSAGE || "");
    waLinks.forEach(function (a) { a.href = waUrl; });
  } else {
    // No number configured yet: point WhatsApp buttons to the form instead of a dead link.
    waLinks.forEach(function (a) {
      if (a.classList.contains("wa-float")) { a.remove(); return; }
      a.href = "#contact"; a.removeAttribute("target"); a.removeAttribute("rel");
      if (a.closest(".thank-you")) a.hidden = true;
    });
  }

  /* ---------- Header: scrolled state + mobile CTA ---------- */
  var header = $(".site-header");
  var mobileCta = $(".mobile-cta");
  var contact = $("#contact");
  var contactVisible = false;
  function onScroll() {
    var sy = window.scrollY;
    header.classList.toggle("scrolled", sy > 8);
    if (mobileCta) mobileCta.classList.toggle("show", sy > 600 && !contactVisible);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle");
  var mnav = $("#mobile-nav");
  function closeNav() { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); mnav.hidden = true; }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    mnav.hidden = open;
  });
  $$("a", mnav).forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mnav.hidden) { closeNav(); toggle.focus(); } });

  /* ---------- Reveal on scroll (staggered per group) ---------- */
  var reveals = $$(".reveal");
  // stagger siblings within the same parent
  var groups = new Map();
  reveals.forEach(function (el) {
    var p = el.parentElement;
    var i = groups.get(p) || 0;
    el.style.setProperty("--d", Math.min(i * 0.08, 0.48) + "s");
    groups.set(p, i + 1);
  });
  var extra = $$(".timeline, .split-visual");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.concat(extra).forEach(function (el) { io.observe(el); });

    if (contact) {
      new IntersectionObserver(function (entries) {
        contactVisible = entries[0].isIntersecting; onScroll();
      }, { threshold: 0.05 }).observe(contact);
    }

    // active nav link
    var navLinks = $$(".main-nav a");
    var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIo.observe(s); });
  } else {
    reveals.concat(extra).forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Service CTAs preselect the form ---------- */
  $$("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = $('input[name="service"][value="' + btn.getAttribute("data-service") + '"]');
      if (r) { r.checked = true; clearError(r.closest(".field")); }
    });
  });

  /* ---------- Lead form ---------- */
  var form = $("#lead-form");
  if (!form) return;
  var status = $(".form-status", form);
  var submitBtn = $('button[type="submit"]', form);

  var rules = {
    name: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
    business: function (v) { return v.trim().length >= 2 || "Please enter your business name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address."; },
    phone: function (v) { var d = v.replace(/\D/g, ""); return (d.length >= 8 && d.length <= 15) || "Please enter a valid phone or WhatsApp number."; },
    website: function (v) {
      v = v.trim(); if (!v) return true;
      return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v) || "Please enter a valid website, e.g. yourbusiness.com";
    },
    service: function () { return !!form.querySelector('input[name="service"]:checked') || "Please choose an option."; },
    challenge: function (v) { return v.trim().length >= 10 || "Please tell us a little more (at least a few words)."; }
  };

  function fieldOf(name) { var el = form.elements[name]; el = el && el.length && !el.tagName ? el[0] : el; return el ? el.closest(".field") : null; }
  function setError(field, msg) { if (!field) return; field.classList.add("invalid"); $(".error", field).textContent = msg; $$("input, textarea", field).forEach(function (i) { i.setAttribute("aria-invalid", "true"); }); }
  function clearError(field) { if (!field) return; field.classList.remove("invalid"); $(".error", field).textContent = ""; $$("input, textarea", field).forEach(function (i) { i.removeAttribute("aria-invalid"); }); }

  function validate(name) {
    var el = form.elements[name];
    var val = el && el.value !== undefined ? el.value : "";
    var res = rules[name](val);
    var f = fieldOf(name);
    if (res === true) { clearError(f); return true; }
    setError(f, res); return false;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    var els = el && el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
    els.forEach(function (input) {
      if (!input) return;
      input.addEventListener(input.type === "radio" ? "change" : "blur", function () {
        if (input.type === "radio" || input.value.trim() || fieldOf(name).classList.contains("invalid")) validate(name);
      });
      input.addEventListener("input", function () { if (fieldOf(name).classList.contains("invalid")) validate(name); });
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var ok = true, firstBad = null;
    Object.keys(rules).forEach(function (name) {
      if (!validate(name)) { ok = false; if (!firstBad) firstBad = fieldOf(name); }
    });
    if (!ok) { var t = firstBad && $("input, textarea", firstBad); if (t) t.focus(); return; }
    if (form.elements.company_url.value) return; // bot

    var data = {
      name: form.elements.name.value.trim(),
      business: form.elements.business.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      website: form.elements.website.value.trim(),
      service: form.querySelector('input[name="service"]:checked').value,
      challenge: form.elements.challenge.value.trim(),
      source: "Landing page — Free Strategy Session",
      page: location.href,
      submitted_at: new Date().toISOString()
    };

    var request = null;
    if (CFG.SUPABASE_URL && CFG.SUPABASE_KEY) {
      request = fetch(CFG.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": CFG.SUPABASE_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          full_name: data.name,
          business_name: data.business,
          email: data.email,
          phone: data.phone,
          website: data.website || null,
          service: data.service,
          challenge: data.challenge,
          source: data.source,
          page_url: data.page.slice(0, 500),
          user_agent: navigator.userAgent.slice(0, 500)
        })
      });
    } else if (CFG.FORM_ENDPOINT) {
      request = fetch(CFG.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
    }

    if (request) {
      submitBtn.classList.add("is-loading"); submitBtn.setAttribute("aria-busy", "true");
      request.then(function (r) {
        if (!r.ok) throw new Error("Bad response");
        showThanks(data);
      }).catch(function () {
        status.textContent = "Sorry, something went wrong sending your request. Please try again, or contact us on WhatsApp.";
      }).then(function () {
        submitBtn.classList.remove("is-loading"); submitBtn.removeAttribute("aria-busy");
      });
    } else {
      // Fallback: open the visitor's email app with the details prefilled.
      var body = [
        "Full Name: " + data.name,
        "Business Name: " + data.business,
        "Work Email: " + data.email,
        "Phone / WhatsApp: " + data.phone,
        "Website: " + (data.website || "-"),
        "Interested in: " + data.service,
        "",
        "Biggest marketing challenge:",
        data.challenge
      ].join("\n");
      var subject = "Free Strategy Session request — " + data.business;
      window.location.href = "mailto:" + (CFG.CONTACT_EMAIL || "") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showThanks(data);
    }
  });

  function showThanks(data) {
    var ty = $("#thank-you");
    $("#ty-name").textContent = data.name.split(" ")[0];
    form.hidden = true;
    ty.hidden = false;
    ty.focus({ preventScroll: true });
    ty.scrollIntoView({ behavior: "smooth", block: "center" });
    if (window.dataLayer) window.dataLayer.push({ event: "generate_lead", service: data.service });
    if (typeof window.fbq === "function") window.fbq("track", "Lead");
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead");
  }
})();
