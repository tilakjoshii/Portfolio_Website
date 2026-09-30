/* ==========================================================================
   Tilak Joshi — Portfolio interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScrollHeader();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navbar = document.getElementById("navbar");
  const menuIcon = menuBtn.querySelector("i");

  menuBtn.addEventListener("click", () => {
    const open = navbar.classList.toggle("open");
    menuIcon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  // Close the mobile menu when a link is clicked
  navbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
      menuIcon.className = "fa-solid fa-bars";
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a[href^='#']");

  const spy = () => {
    const pos = window.scrollY + 120;
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + sec.id);
        });
      }
    });
  };

  /* ---------- Custom typed effect ---------- */
  const roles = [
    "Full-Stack Engineer",
    "SAP B1 Add-on Developer",
    "DevOps & Automation",
    "MERN Stack Developer"
  ];
  const typedEl = document.getElementById("typed");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1800);
      }
      return setTimeout(typeLoop, 70);
    }

    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      return setTimeout(typeLoop, 350);
    }
    return setTimeout(typeLoop, 40);
  };
  typeLoop();

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterIO.observe(el));

  /* ---------- Hero particle network ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId = null;
    const isThin = window.matchMedia("(max-width: 820px)").matches;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.min(
        90,
        Math.max(35, Math.floor((canvas.width * canvas.height) / 16000))
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4
      }));
    };

    const linkDist = isThin ? 90 : 130;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(34, 211, 238, " + (0.12 * (1 - dist / linkDist)) + ")";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", () => {
      cancelAnimationFrame(rafId);
      resize();
      draw();
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const statusEl = document.getElementById("formStatus");
    const submitBtn = form.querySelector(".btn-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    const setError = (fieldId, message) => {
      const field = document.getElementById(fieldId);
      const wrap = field.closest(".form-field");
      const errEl = document.getElementById("err-" + fieldId);
      if (message) {
        wrap.classList.add("invalid");
        errEl.textContent = message;
      } else {
        wrap.classList.remove("invalid");
        errEl.textContent = "";
      }
    };

    const setStatus = (message, ok) => {
      statusEl.textContent = message;
      statusEl.className = "form-status mono " + (ok ? "ok" : "err");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      const subject = document.getElementById("subject");

      // Validate
      let valid = true;
      if (!name.value.trim() || name.value.trim().length < 3) {
        setError("name", "* Please enter your full name");
        valid = false;
      } else {
        setError("name", "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError("email", "* Please enter a valid email address");
        valid = false;
      } else {
        setError("email", "");
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        setError("message", "* Please enter a message (at least 10 characters)");
        valid = false;
      } else {
        setError("message", "");
      }

      if (!valid) return;

      // Send via SMTP.js
      const body =
        "Name: " + name.value.trim() +
        "<br> Email: " + email.value.trim() +
        "<br> Subject: " + (subject.value.trim() || "Portfolio inquiry") +
        "<br><br> Message: " + message.value.trim();

      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoader.hidden = false;
      setStatus("Transmitting over the wire...", true);

      Email.send({
        SecureToken: "f9ff4e7a-dc9f-464e-adfe-e279b757b97f",
        To: "tilaktilakjoshi@gmail.com",
        From: "developertapin@gmail.com",
        Subject: subject.value.trim() || "Portfolio inquiry",
        Body: body
      })
        .then((res) => {
          if (res === "OK") {
            setStatus("Message sent successfully — I'll get back to you soon!", true);
            form.reset();
          } else {
            setStatus("Something went wrong. Please email me directly at t.joshi.dev@gmail.com", false);
          }
        })
        .catch(() => {
          setStatus("Something went wrong. Please email me directly at t.joshi.dev@gmail.com", false);
        })
        .finally(() => {
          submitBtn.disabled = false;
          btnText.hidden = false;
          btnLoader.hidden = true;
        });
    });

    // Live-clear errors
    ["name", "email", "message"].forEach((id) => {
      document.getElementById(id).addEventListener("input", () => setError(id, ""));
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  /* ---------- Scroll spy binding ---------- */
  window.addEventListener("scroll", () => {
    onScrollHeader();
    spy();
  });
})();
