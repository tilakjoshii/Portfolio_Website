/* ==========================================================================
   Tilak Joshi — Portfolio interactions
   Vanilla JavaScript, progressive enhancement only.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (id) {
    return document.getElementById(id);
  };

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mark the document as JS-capable. CSS only hides .reveal elements under .js,
  // so content stays visible if this file (or JS) never runs.
  document.documentElement.classList.add("js");

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = $("themeToggle");

  var currentTheme = function () {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  };

  var applyTheme = function (theme) {
    root.setAttribute("data-theme", theme);
    if (!themeToggle) return;
    var icon = themeToggle.querySelector("i");
    themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
    if (icon) {
      icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  };

  if (themeToggle) {
    applyTheme(currentTheme());
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable — theme still applies for this visit */
      }
    });
  }

  /* ---------- Header scroll state ---------- */
  var header = $("header");
  var onScrollHeader = function () {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 24);
    }
  };
  onScrollHeader();

  /* ---------- Mobile menu (checkbox-driven; works without JS too) ---------- */
  var navToggle = $("nav-toggle");
  var menuBtn = $("menuBtn");
  var navbar = $("navbar");

  var setMenuOpen = function (open) {
    if (navToggle) navToggle.checked = open;
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (navToggle && menuBtn) {
    navToggle.addEventListener("change", function () {
      menuBtn.setAttribute("aria-expanded", navToggle.checked ? "true" : "false");
    });
    menuBtn.addEventListener("keydown", function (e) {
      // The label is focusable via the checkbox; Enter/Space toggle it natively.
      if (e.key === "Escape") {
        setMenuOpen(false);
        navToggle.focus();
      }
    });
  }

  if (navbar) {
    navbar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (
      navToggle &&
      navToggle.checked &&
      header &&
      !header.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navToggle && navToggle.checked) {
      setMenuOpen(false);
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".navbar a[href^='#']");

  var spy = function () {
    var pos = window.scrollY + 140;
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(function (link) {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + sec.id
          );
        });
      }
    });
  };

  // rAF-throttled, passive scroll handler — keeps scroll work off the main thread
  var scrollTicking = false;
  var onScroll = function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      spy();
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  spy();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Contact form: honest mailto fallback ---------- */
  var form = $("contactForm");
  if (form) {
    var statusEl = $("formStatus");

    var setError = function (fieldId, message) {
      var field = $(fieldId);
      var errEl = $("err-" + fieldId);
      if (!field || !errEl) return;
      var wrap = field.closest(".form-field");
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (wrap) wrap.classList.toggle("invalid", Boolean(message));
      errEl.textContent = message;
    };

    var setStatus = function (message, ok) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = "form-status mono " + (ok ? "ok" : "err");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = $("name");
      var email = $("email");
      var subject = $("subject");
      var message = $("message");

      var valid = true;

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError("name", "Please enter your full name.");
        valid = false;
      } else {
        setError("name", "");
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError("email", "Please enter a valid email address.");
        valid = false;
      } else {
        setError("email", "");
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        setError("message", "Please enter a message (at least 10 characters).");
        valid = false;
      } else {
        setError("message", "");
      }

      if (!valid) {
        setStatus("Please fix the highlighted fields and try again.", false);
        return;
      }

      var subjectText = subject.value.trim() || "Portfolio inquiry";
      var bodyText =
        "Name: " + name.value.trim() +
        "\nEmail: " + email.value.trim() +
        "\n\n" + message.value.trim();

      var mailto =
        "mailto:me@tilakjoshi.com.np" +
        "?subject=" + encodeURIComponent(subjectText) +
        "&body=" + encodeURIComponent(bodyText);

      try {
        window.location.href = mailto;
        setStatus(
          "Your email app should now be open. Please send the message from there — it is not sent until you press send in your email app.",
          true
        );
      } catch (err) {
        setStatus(
          "Could not open your email app automatically. Please email me directly at me@tilakjoshi.com.np",
          false
        );
      }
    });

    ["name", "email", "message"].forEach(function (id) {
      var field = $(id);
      if (field) {
        field.addEventListener("input", function () {
          setError(id, "");
        });
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = $("currentYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
