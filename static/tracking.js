/* Delivery Elite — tracking base
   Eventos: page_view (auto), video_progress, video_complete, cta_unlock, click_cta
   Todos os eventos sao empurrados para o dataLayer (GTM-WG68M2TS). */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "fbclid",
    "ttclid"
  ];
  var STORAGE_KEY = "de_utm";

  function safeStore(action, key, value) {
    try {
      if (action === "get") return window.localStorage.getItem(key);
      if (action === "set") window.localStorage.setItem(key, value);
    } catch (err) {
      /* modo privado / storage bloqueado */
    }
    return null;
  }

  /* Captura UTMs da URL e persiste para sobreviver a navegacao interna. */
  function collectUtms() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = {};
    var found = false;

    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        fromUrl[key] = value;
        found = true;
      }
    });

    if (found) {
      safeStore("set", STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }

    var stored = safeStore("get", STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored) || {};
    } catch (err) {
      return {};
    }
  }

  var utms = collectUtms();

  /* Repassa as UTMs capturadas para o link de checkout. */
  function decorate(url) {
    if (!url) return url;
    try {
      var target = new URL(url, window.location.href);
      Object.keys(utms).forEach(function (key) {
        if (!target.searchParams.has(key)) target.searchParams.set(key, utms[key]);
      });
      return target.toString();
    } catch (err) {
      return url;
    }
  }

  function track(event, payload) {
    var data = { event: event };
    Object.keys(utms).forEach(function (key) {
      data[key] = utms[key];
    });
    if (payload) {
      Object.keys(payload).forEach(function (key) {
        data[key] = payload[key];
      });
    }
    window.dataLayer.push(data);
  }

  window.DE = {
    track: track,
    decorate: decorate,
    utms: utms
  };

  /* Compatibilidade com o padrao de LP do workspace. */
  window.trackCTA = function (label) {
    track("click_cta", { cta_label: label || "cta_principal" });
  };

  track("page_view", {
    page_path: window.location.pathname,
    page_title: document.title
  });
})();
