"use strict";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function initLoader() {
  const loader = document.getElementById("loader");
  let ready = false;

  const revealSite = () => {
    if (ready) return;
    ready = true;
    document.documentElement.classList.add("is-ready");

    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    window.setTimeout(() => loader.remove(), 1400);
  };

  // The interface does not need to wait for remote fonts or images to load.
  window.setTimeout(revealSite, 320);

  window.setTimeout(revealSite, 2500);
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initNavigation() {
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));

  if (!header || !progress || !menuToggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest(".nav-shell")) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });

  const setActive = (activeLink) => {
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionLinks = new Map();

    navLinks.forEach((link) => {
      const section = document.getElementById(link.dataset.nav);
      if (section) sectionLinks.set(section, link);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(sectionLinks.get(entry.target));
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sectionLinks.forEach((link, section) => sectionObserver.observe(section));
  }

  const timeline = document.querySelector(".timeline");
  const timelineFill = document.getElementById("timelineFill");

  const updateTimeline = () => {
    if (!timeline || !timelineFill) return;

    if (prefersReduced) {
      timelineFill.style.height = "100%";
      return;
    }

    const rect = timeline.getBoundingClientRect();
    const passed = window.innerHeight * 0.6 - rect.top;
    const progressValue = Math.max(0, Math.min(1, passed / rect.height));
    timelineFill.style.height = `${progressValue * 100}%`;
  };

  let ticking = false;

  const updateScroll = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      header.classList.toggle("is-scrolled", scrollY > 24);
      progress.style.width = `${maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0}%`;

      updateTimeline();
      if (scrollY < 90) setActive(null);

      ticking = false;
    });
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();
}

function initReveals() {
  const elements = Array.from(document.querySelectorAll(".reveal"));

  document
    .querySelectorAll(".service-grid, .stack-grid, .project-list, .facts")
    .forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (child.classList.contains("reveal")) {
          child.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 0.08, 0.32)}s`
          );
        }
      });
    });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function initAtomHero() {
  const hero = document.querySelector(".hero");
  const visual = document.getElementById("heroVisual");
  const tiltLayer = document.getElementById("atomTilt");
  const stage = visual ? visual.querySelector(".visual-stage") : null;
  const orbitH = document.getElementById("orbitH");
  const innerOrbit = visual ? visual.querySelector(".orbit-a") : null;

  if (!hero || !visual || !tiltLayer || !stage || !orbitH || !innerOrbit) return;

  const orbitPeriod = 12000;
  const maxRotateY = 25;
  const maxRotateX = 20;

  let centerX = 0;
  let centerY = 0;
  let radius = 0;
  let angle = -Math.PI / 2;
  let orbitFrame = 0;
  let orbitLast = 0;
  let orbitInView = true;

  orbitH.style.left = "0px";
  orbitH.style.top = "0px";

  const measureOrbit = () => {
    centerX = stage.offsetWidth / 2;
    centerY = stage.offsetHeight / 2;
    radius = innerOrbit.offsetWidth / 2;
  };

  const positionOrbitH = () => {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    orbitH.style.transform =
      `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;
  };

  const orbitStep = (now) => {
    if (!orbitInView || document.hidden || prefersReduced) {
      orbitFrame = 0;
      return;
    }

    if (!orbitLast) orbitLast = now;
    const delta = Math.min(now - orbitLast, 64);
    orbitLast = now;

    angle = (angle + (delta / orbitPeriod) * Math.PI * 2) % (Math.PI * 2);
    positionOrbitH();
    orbitFrame = window.requestAnimationFrame(orbitStep);
  };

  const startOrbit = () => {
    if (prefersReduced || orbitFrame || !orbitInView || document.hidden) return;
    orbitLast = 0;
    orbitFrame = window.requestAnimationFrame(orbitStep);
  };

  const stopOrbit = () => {
    if (orbitFrame) window.cancelAnimationFrame(orbitFrame);
    orbitFrame = 0;
    orbitLast = 0;
  };

  measureOrbit();
  positionOrbitH();

  if (!prefersReduced) {
    if ("IntersectionObserver" in window) {
      const orbitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            orbitInView = entry.isIntersecting;
            if (orbitInView) startOrbit();
            else stopOrbit();
          });
        },
        { threshold: 0 }
      );

      orbitObserver.observe(visual);
    }

    startOrbit();
  }

  window.addEventListener("resize", () => {
    measureOrbit();
    positionOrbitH();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopOrbit();
    else startOrbit();
  });

  if (!finePointer || prefersReduced) return;

  let targetRotateY = 0;
  let targetRotateX = 0;
  let currentRotateY = 0;
  let currentRotateX = 0;
  let velocityY = 0;
  let velocityX = 0;
  let tiltFrame = 0;
  let tiltLast = 0;

  const tiltStep = (now) => {
    if (document.hidden) {
      tiltFrame = 0;
      return;
    }

    if (!tiltLast) tiltLast = now;
    const delta = Math.min(now - tiltLast, 40);
    tiltLast = now;
    const frame = Math.max(delta / 16.667, 0.001);
    const damping = Math.pow(0.82, frame);

    velocityY =
      (velocityY + (targetRotateY - currentRotateY) * 0.06 * frame) * damping;
    velocityX =
      (velocityX + (targetRotateX - currentRotateX) * 0.06 * frame) * damping;
    currentRotateY += velocityY * frame;
    currentRotateX += velocityX * frame;

    tiltLayer.style.transform =
      `rotateX(${currentRotateX.toFixed(3)}deg) rotateY(${currentRotateY.toFixed(3)}deg)`;

    const settled =
      Math.abs(velocityY) < 0.01 &&
      Math.abs(velocityX) < 0.01 &&
      Math.abs(targetRotateY - currentRotateY) < 0.02 &&
      Math.abs(targetRotateX - currentRotateX) < 0.02;

    if (settled) {
      currentRotateY = targetRotateY;
      currentRotateX = targetRotateX;
      velocityY = 0;
      velocityX = 0;
      tiltLayer.style.transform =
        `rotateX(${currentRotateX.toFixed(3)}deg) rotateY(${currentRotateY.toFixed(3)}deg)`;
      tiltFrame = 0;
      tiltLast = 0;
      return;
    }

    tiltFrame = window.requestAnimationFrame(tiltStep);
  };

  const startTilt = () => {
    if (tiltFrame || document.hidden) return;
    tiltLast = 0;
    tiltFrame = window.requestAnimationFrame(tiltStep);
  };

  hero.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;

      const rect = hero.getBoundingClientRect();
      const x = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5)
      );
      const y = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5)
      );

      targetRotateY = x * (maxRotateY * 2);
      targetRotateX = -y * (maxRotateX * 2);
      startTilt();
    },
    { passive: true }
  );

  const resetTilt = () => {
    targetRotateY = 0;
    targetRotateX = 0;
    startTilt();
  };

  hero.addEventListener("pointerleave", resetTilt);
  hero.addEventListener("pointercancel", resetTilt);
  window.addEventListener("blur", resetTilt);
}

function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");

  if (!glow || !finePointer || prefersReduced) return;

  let targetX = -200;
  let targetY = -200;
  let currentX = -200;
  let currentY = -200;
  let running = false;

  const animate = () => {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (
      Math.abs(targetX - currentX) > 0.5 ||
      Math.abs(targetY - currentY) > 0.5
    ) {
      window.requestAnimationFrame(animate);
    } else {
      running = false;
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("is-active");

      if (!running) {
        running = true;
        window.requestAnimationFrame(animate);
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    glow.classList.remove("is-active");
  });

  document.addEventListener("mouseenter", () => {
    glow.classList.add("is-active");
  });
}

function initIconLabels() {
  document.querySelectorAll(".icon-tile[data-tip]").forEach((tile) => {
    tile.setAttribute("role", "img");
    tile.setAttribute("aria-label", tile.dataset.tip);
  });
}

function initSpotlights() {
  if (!finePointer || prefersReduced) return;

  document.querySelectorAll(".service").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--mx", `${x}%`);
        card.style.setProperty("--my", `${y}%`);
      },
      { passive: true }
    );
  });
}

function initMagneticControls() {
  if (!finePointer || prefersReduced) return;

  const controls = Array.from(
    document.querySelectorAll(".btn:not([disabled]), .nav-cta")
  );

  controls.forEach((control) => {
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let currentX = 0;
    let currentY = 0;
    let currentScale = 1;
    let velocityX = 0;
    let velocityY = 0;
    let velocityScale = 0;
    let frame = 0;
    let last = 0;

    const render = () => {
      control.style.transform =
        `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) ` +
        `scale(${currentScale.toFixed(3)})`;
    };

    const step = (now) => {
      if (!last) last = now;
      const delta = Math.min(now - last, 40);
      last = now;
      const frameScale = Math.max(delta / 16.667, 0.001);
      const damping = Math.pow(0.78, frameScale);

      velocityX =
        (velocityX + (targetX - currentX) * 0.14 * frameScale) * damping;
      velocityY =
        (velocityY + (targetY - currentY) * 0.14 * frameScale) * damping;
      velocityScale =
        (velocityScale + (targetScale - currentScale) * 0.18 * frameScale) *
        damping;

      currentX += velocityX * frameScale;
      currentY += velocityY * frameScale;
      currentScale += velocityScale * frameScale;
      render();

      const settled =
        Math.abs(velocityX) < 0.01 &&
        Math.abs(velocityY) < 0.01 &&
        Math.abs(velocityScale) < 0.001 &&
        Math.abs(targetX - currentX) < 0.02 &&
        Math.abs(targetY - currentY) < 0.02 &&
        Math.abs(targetScale - currentScale) < 0.002;

      if (settled) {
        currentX = targetX;
        currentY = targetY;
        currentScale = targetScale;
        velocityX = 0;
        velocityY = 0;
        velocityScale = 0;
        render();
        frame = 0;
        last = 0;
        return;
      }

      frame = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = window.requestAnimationFrame(step);
    };

    control.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") return;

        const rect = control.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - currentX;
        const centerY = rect.top + rect.height / 2 - currentY;
        const normalizedX = Math.max(
          -1,
          Math.min(1, (event.clientX - centerX) / (rect.width / 2))
        );
        const normalizedY = Math.max(
          -1,
          Math.min(1, (event.clientY - centerY) / (rect.height / 2))
        );

        targetX = normalizedX * 7;
        targetY = normalizedY * 7;
        control.style.setProperty(
          "--gloss-x",
          `${((event.clientX - rect.left) / rect.width) * 100}%`
        );
        control.style.setProperty(
          "--gloss-y",
          `${((event.clientY - rect.top) / rect.height) * 100}%`
        );
        start();
      },
      { passive: true }
    );

    control.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      start();
    });

    control.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      targetScale = 0.965;
      start();
    });

    control.addEventListener("pointerup", () => {
      targetScale = 1;
      start();
    });

    control.addEventListener("pointercancel", () => {
      targetScale = 1;
      start();
    });
  });
}

function initContactBoot() {
  const section = document.getElementById("contact");
  const bootLines = document.getElementById("bootLines");

  if (!section || !bootLines) return;

  const lines = Array.from(bootLines.querySelectorAll(".boot-text"));
  if (!lines.length) return;

  const fillAll = () => {
    lines.forEach((line) => {
      line.textContent = line.dataset.text || "";
    });
  };

  if (prefersReduced) {
    fillAll();
    return;
  }

  let started = false;
  let lineIndex = 0;
  let timer = 0;

  const typeText = (element, text, done) => {
    let index = 0;

    const typeNext = () => {
      index += 1;
      element.textContent = text.slice(0, index);

      if (index < text.length) {
        timer = window.setTimeout(typeNext, 16 + Math.random() * 18);
        return;
      }

      done();
    };

    typeNext();
  };

  const typeLine = () => {
    if (lineIndex >= lines.length) return;

    const element = lines[lineIndex];
    const text = element.dataset.text || "";

    typeText(element, text, () => {
      lineIndex += 1;

      if (lineIndex < lines.length) {
        timer = window.setTimeout(typeLine, 230);
      }
    });
  };

  const start = () => {
    if (started) return;
    started = true;
    timer = window.setTimeout(typeLine, 280);
  };

  if ("IntersectionObserver" in window) {
    const bootObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          start();
          bootObserver.disconnect();
        });
      },
      { threshold: 0.2 }
    );

    bootObserver.observe(section);
  } else {
    start();
  }

  window.addEventListener("pagehide", () => {
    if (timer) window.clearTimeout(timer);
    fillAll();
  });
}

function initMatrixRain() {
  const canvas = document.getElementById("matrixRain");
  const section = document.getElementById("contact");

  if (!canvas || !section || prefersReduced) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const glyphs =
    "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン";
  const desktopGlyphs = "0123456789ABCDEF<>/\\|=+*#";
  const characters = glyphs + desktopGlyphs;

  let width = 0;
  let height = 0;
  let columns = 0;
  let fontSize = 13;
  let columnWidth = 18;
  let drops = [];
  let frame = 0;
  let lastDraw = 0;
  let inView = false;
  let isMobile = false;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    isMobile = window.matchMedia("(max-width: 768px)").matches;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = isMobile ? 10 : 13;
    columnWidth = fontSize + (isMobile ? 6 : 5);
    columns = Math.max(1, Math.ceil(width / columnWidth));
    drops = Array.from({ length: columns }, () => Math.random() * -32);
    context.clearRect(0, 0, width, height);
  };

  const draw = () => {
    context.fillStyle = "rgba(4, 7, 5, 0.16)";
    context.fillRect(0, 0, width, height);
    context.font = `${fontSize}px "JetBrains Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowBlur = isMobile ? 0 : 5;
    context.shadowColor = "rgba(57, 255, 136, 0.42)";

    const step = width / columns;

    for (let index = 0; index < columns; index += 1) {
      if (isMobile && Math.random() > 0.55) {
        drops[index] += 0.6;
        continue;
      }

      const x = (index + 0.5) * step;
      const y = drops[index] * fontSize;
      const character =
        characters[Math.floor(Math.random() * characters.length)];

      context.fillStyle =
        Math.random() > 0.94
          ? "rgba(205, 255, 226, 0.82)"
          : "rgba(57, 255, 136, 0.6)";
      context.fillText(character, x, y);

      drops[index] += isMobile ? 0.6 : 0.85;

      if (y > height && Math.random() > 0.975) {
        drops[index] = Math.random() * -24;
      }
    }
  };

  const loop = (now) => {
    frame = 0;

    if (!inView || document.hidden) return;

    if (!lastDraw) lastDraw = now;

    if (now - lastDraw >= 55) {
      lastDraw = now;
      draw();
    }

    frame = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (frame || !inView || document.hidden) return;
    lastDraw = 0;
    frame = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastDraw = 0;
  };

  resize();

  if ("IntersectionObserver" in window) {
    const rainObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (inView) start();
          else stop();
        });
      },
      { rootMargin: "80px 0px" }
    );

    rainObserver.observe(section);
  } else {
    inView = true;
    start();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (inView) start();
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (inView) draw();
    }, 150);
  });
}

function initContactConnection() {
  const frame = document.getElementById("contactConsole");
  const status = document.getElementById("connectionStatus");

  if (!frame || !status) return;

  const links = Array.from(frame.querySelectorAll("[data-connection]"));
  let timer = 0;

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (timer) window.clearTimeout(timer);

      frame.classList.remove("is-pulsing");
      void frame.offsetWidth;
      frame.classList.add("is-pulsing");
      status.classList.add("is-connecting");
      status.textContent = "CONNECTING...";

      timer = window.setTimeout(() => {
        frame.classList.remove("is-pulsing");
        status.classList.remove("is-connecting");
        status.textContent = "CHANNEL: GITHUB UPLINK ACTIVE";
        timer = 0;
      }, 1600);
    });
  });
}

function initSystemBoot() {
  const boot = document.getElementById("systemBoot");
  const root = document.documentElement;
  if (!boot || !root.classList.contains("boot-pending")) return;
  const canvas = document.getElementById("bootRain");
  const context = canvas && canvas.getContext("2d");
  const timers = [];
  let frame = 0;
  let done = false;
  let drops = [];
  const resize = () => {
    if (!context) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array.from({ length: Math.ceil(canvas.width / 20) }, () => Math.random() * -30);
  };
  let last = 0;
  const rain = (now) => {
    if (done) return;
    if (now - last > 65) {
      last = now;
      context.fillStyle = "rgba(0, 0, 0, 0.14)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(57, 255, 136, 0.8)";
      context.font = "13px monospace";
      drops.forEach ( (drop, i) => {
        context.fillText("01<>アイウエオ"[Math.floor(Math.random() * 10)], i * 20, drop * 16);
        drops[i] = drop * 16 > canvas.height && Math.random() > 0.97 ? 0 : drop + 1;
      });
    }
    frame = requestAnimationFrame(rain);
  };
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    try { sessionStorage.setItem("hato.boot.v1", "1"); } catch (error) {}
    boot.classList.add("is-leaving");
    root.classList.remove("boot-pending");
  };
  document.getElementById("bootSkip").addEventListener("click", finish);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finish();
  });
  boot.querySelectorAll("[data-boot-line]").forEach((line, index) => {
    timers.push(setTimeout(() => line.classList.add("is-visible"), 450 + index * 850));
  });
  if (context) {
    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(rain);
  }
  timers.push(setTimeout(finish, 5200));
}

function initDossiers() {
  const dialog = document.getElementById("projectDossier");
  const content = document.getElementById("dossierContent");
  let opener = null;
  let current = null;
  let returnToProjects = false;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const render = (project) => {
    current = project;
    const index = PROJECTS.indexOf(project);
    content.classList.remove("is-revealing");
    content.replaceChildren();
    content.append(element("p", "dossier-kicker", `PROJECT FILE // ${String(index + 1).padStart(3, "0")}`));
    const title = element("h2", "dossier-title", project.name);
    title.id = "dossierTitle";
    content.append(title, element("p", "dossier-meta", `${project.category}  //  ${project.status}`), element("p", "dossier-intro", project.description));
    const tech = element("p", "dossier-tech", `TECHNOLOGIES // ${project.stack.map(([name]) => name).join(" · ")}`);
    content.append(tech);
    const sections = [
      ["The problem", project.problem], ["The solution", project.solution],
      ["My contribution", project.contribution], ["Technical implementation", project.implementation],
      ["Features", project.features], ["Project gallery", null], ["Challenges and lessons", project.lessons],
    ];
    sections.forEach(([heading, value]) => {
      const section = element("section", "dossier-section");
      section.append(element("h3", "", heading));
      if (Array.isArray(value)) {
        const list = document.createElement("ul");
        value.forEach((item) => list.append(element("li", "", item)));
        section.append(list);
      } else if (value) {
        section.append(element("p", value.startsWith("Review needed:") ? "dossier-review" : "", value));
      } else if (project.image) {
        const figure = element("figure", "dossier-promo");
        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.imageCaption || `${project.name} promotional artwork`;
        image.loading = "lazy";
        figure.append(image, element("figcaption", "", project.imageCaption || "Promotional artwork · not a product screenshot"));
        section.append(figure);
      } else {
        section.append(element("div", "dossier-gallery", "PROJECT MEDIA // No verified local screenshots available. Add genuine project media here."));
      }
      content.append(section);
    });
    const actions = element("section", "dossier-section dossier-actions");
    actions.append(element("h3", "", "Project actions"));
    [["Live website ↗", project.live], ["Source code ↗", project.source]].forEach(([label, url]) => {
      if (!url) return;
      const link = element("a", "", label);
      link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
      actions.append(link);
    });
    content.append(actions);
    void content.offsetWidth;
    content.classList.add("is-revealing");
    dialog.scrollTop = 0;
  };
  const sync = () => {
    const match = location.hash.match(/^#project-([a-z0-9-]+)$/);
    const project = match && PROJECTS.find((item) => item.id === match[1]);
    if (project) {
      render(project);
      if (!dialog.open) { dialog.showModal(); document.getElementById("dossierClose").focus(); }
    } else if (dialog.open) {
      dialog.close();
      if (returnToProjects) document.getElementById("projects").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      else if (opener && opener.isConnected) opener.focus();
      returnToProjects = false;
    }
  };
  const open = (id, replace = false) => {
    const project = PROJECTS.find((item) => item.id === id);
    if (!project) return;
    if (!dialog.open) opener = document.activeElement;
    const url = `#project-${id}`;
    if (replace && dialog.open) history.replaceState(history.state, "", url);
    else history.pushState({ hatoDossier: true }, "", url);
    sync();
  };
  const close = (toProjects = false) => {
    returnToProjects = toProjects;
    if (history.state && history.state.hatoDossier) history.back();
    else { history.replaceState(null, "", toProjects ? "#projects" : location.pathname + location.search); sync(); }
  };
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-project]");
    if (trigger) open(trigger.dataset.openProject);
  });
  document.getElementById("dossierClose").addEventListener("click", () => close());
  document.getElementById("dossierBack").addEventListener("click", () => close(true));
  document.getElementById("dossierPrevious").addEventListener("click", () => open(PROJECTS[(PROJECTS.indexOf(current) + PROJECTS.length - 1) % PROJECTS.length].id, true));
  document.getElementById("dossierNext").addEventListener("click", () => open(PROJECTS[(PROJECTS.indexOf(current) + 1) % PROJECTS.length].id, true));
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  window.addEventListener("popstate", sync);
  window.addEventListener("hashchange", sync);
  document.querySelectorAll("[data-project-summary]").forEach((node) => {
    const project = PROJECTS.find((item) => item.id === node.dataset.projectSummary);
    if (project) node.textContent = project.description;
  });
  document.querySelectorAll("[data-project-source]").forEach((link) => {
    const project = PROJECTS.find((item) => item.id === link.dataset.projectSource);
    if (project && project.source) link.href = project.source;
  });
  sync();
  return open;
}

function initDeveloperTerminal(openProject) {
  const form = document.getElementById("developerForm");
  const input = document.getElementById("developerInput");
  const output = document.getElementById("developerOutput");
  if (!form || !input || !output) return;
  const historyEntries = [];
  let historyIndex = 0;
  let draft = "";
  const commands = {
    help: () => `Commands: help, about, projects, skills, ${PROJECTS.map((project) => `open ${project.id}`).join(", ")}, radar, stack, journey, contact, github, clear, whoami, status`,
    about: () => "Keletso Hato is a Lesotho-based software developer and software engineering student, learning through practical web and desktop projects.",
    whoami: () => "Keletso Hato // Software engineering student and self-taught developer in Lesotho.",
    projects: () => PROJECTS.map((project) => `${project.name} (open ${project.id})`).join(" · "),
    skills: () => "Frontend: HTML5, CSS3, JavaScript, React, Next.js. Backend: Node.js, Express.js, Python, MySQL. Desktop: Java, JavaFX. Tools: Git, GitHub, VS Code, Figma.",
    status: () => "HATO INTERFACE // ONLINE · PROJECT FILES AVAILABLE · LOCAL SESSION",
    github: () => { window.open("https://github.com/Hato444", "_blank", "noopener,noreferrer"); return "Opening GitHub."; },
    clear: () => { output.replaceChildren(); return null; },
  };
  ["radar", "stack", "journey", "contact"].forEach((id) => {
    commands[id] = () => {
      document.getElementById(id).scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      return `Navigating to ${id}.`;
    };
  });
  PROJECTS.forEach((project) => { commands[`open ${project.id}`] = () => { openProject(project.id); return `Opening ${project.name} project file.`; }; });
  const execute = (value) => {
    const command = value.trim().toLowerCase().replace(/\s+/g, " ");
    if (!command) return;
    historyEntries.push(command); historyIndex = historyEntries.length; draft = "";
    input.value = "";
    const entry = document.createElement("p");
    entry.textContent = `visitor@hato:~$ ${command}`;
    output.append(entry);
    const result = Object.hasOwn(commands, command) ? commands[command]() : "Command not found. Type help for available commands.";
    if (result) {
      const response = document.createElement("p");
      response.className = "terminal-response";
      response.textContent = result;
      output.append(response);
    }
    output.scrollTop = output.scrollHeight;
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); execute(input.value); });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && historyEntries.length) {
      event.preventDefault();
      if (historyIndex === historyEntries.length) draft = input.value;
      historyIndex = Math.max(0, historyIndex - 1); input.value = historyEntries[historyIndex];
    } else if (event.key === "ArrowDown" && historyEntries.length) {
      event.preventDefault(); historyIndex = Math.min(historyEntries.length, historyIndex + 1);
      input.value = historyIndex === historyEntries.length ? draft : historyEntries[historyIndex];
    } else if (event.key === "Tab" && input.value.trim()) {
      const matches = Object.keys(commands).filter((name) => name.startsWith(input.value.toLowerCase()));
      if (matches.length === 1) { event.preventDefault(); input.value = matches[0]; }
    }
  });
  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => { execute(button.dataset.command); if (!document.getElementById("projectDossier").open) input.focus(); });
  });
}

function initShowcaseCards(openProject) {
  document.querySelectorAll("[data-project-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openProject(card.dataset.projectCard);
    });
    if (!finePointer || prefersReduced) return;
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--card-x", `${x * 100}%`);
      card.style.setProperty("--card-y", `${y * 100}%`);
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function initProjectRadar() {
  const layout = document.getElementById("radarLayout");
  const markers = document.getElementById("radarMarkers");
  const sweep = document.getElementById("radarSweep");
  const popup = document.getElementById("targetPopup");
  const connector = document.getElementById("radarLinkLayer");
  const line = document.getElementById("radarLinkLine");
  if (!layout || !markers || !sweep || !popup || !connector || !line) return;
  const projects = PROJECTS;
  const ns = "http://www.w3.org/2000/svg";
  const close = document.getElementById("targetClose");
  let selected = null;
  let closeTimer = 0;
  const position = () => {
    if (!selected || window.innerWidth <= 768) return;
    const bounds = layout.getBoundingClientRect();
    const rect = document.getElementById("radarStage").getBoundingClientRect();
    const x = rect.left + rect.width * selected.x / 600 - bounds.left;
    const y = rect.top + rect.height * selected.y / 600 - bounds.top;
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    const clampX = (value) => Math.max(12, Math.min(bounds.width - width - 12, value));
    const clampY = (value) => Math.max(12, Math.min(bounds.height - height - 12, value));
    const right = x + 32;
    const left = x - width - 32;
    const sides = right + width <= bounds.width - 12 ? [right, left] : [left, right];
    const positions = [];
    sides.forEach((side, sideIndex) => {
      [y - height / 2, y + 32, y - height - 32, 12, bounds.height - height - 12].forEach((top) => {
        const candidate = { x: clampX(side), y: clampY(top), sideIndex };
        const covered = projects.filter((other) => {
          if (other === selected) return false;
          const ox = rect.left + rect.width * other.x / 600 - bounds.left;
          const oy = rect.top + rect.height * other.y / 600 - bounds.top;
          return ox >= candidate.x - 12 && ox <= candidate.x + width + 12 &&
            oy >= candidate.y - 12 && oy <= candidate.y + height + 12;
        }).length;
        candidate.score = covered * 10000 + sideIndex * 100 + Math.abs(candidate.y + height / 2 - y);
        positions.push(candidate);
      });
    });
    positions.sort((a, b) => a.score - b.score);
    const px = positions[0].x;
    const py = positions[0].y;
    popup.style.left = `${px}px`;
    popup.style.top = `${py}px`;
    popup.style.transformOrigin = px > x ? "left center" : "right center";
    connector.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    line.setAttribute("x1", x); line.setAttribute("y1", y);
    line.setAttribute("x2", px > x ? px : px + width);
    line.setAttribute("y2", Math.max(py + 12, Math.min(py + height - 12, y)));
  };
  const dismiss = (restoreFocus = false) => {
    if (!selected) return;
    const previous = selected.element;
    previous.classList.remove("is-selected");
    previous.setAttribute("aria-expanded", "false");
    selected = null;
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    popup.inert = true;
    connector.classList.remove("is-active");
    if (restoreFocus) previous.focus();
    closeTimer = setTimeout(() => { if (!selected) popup.hidden = true; }, 240);
  };
  popup.hidden = true;
  const select = (project, keyboard) => {
    clearTimeout(closeTimer);
    popup.classList.remove("is-open");
    if (selected) {
      selected.element.classList.remove("is-selected");
      selected.element.setAttribute("aria-expanded", "false");
    }
    selected = project;
    project.element.classList.add("is-selected");
    project.element.classList.remove("is-locking");
    void project.element.getBoundingClientRect();
    project.element.classList.add("is-locking");
    project.element.setAttribute("aria-expanded", "true");
    document.getElementById("targetMark").textContent = project.mark;
    document.getElementById("targetTitle").textContent = project.name;
    document.getElementById("targetCategory").textContent = project.category;
    document.getElementById("targetDescription").textContent = project.description;
    const stack = document.getElementById("targetStack");
    stack.replaceChildren();
    project.stack.forEach(([name, icon]) => {
      const item = document.createElement("span");
      item.className = "target-tech";
      if (icon) {
        const image = document.createElement("img");
        image.src = `assets/icons/${icon}.svg`;
        image.alt = "";
        if (icon === "nextjs" || icon === "express") image.className = "icon-mono";
        item.append(image);
      }
      item.append(document.createTextNode(name));
      stack.append(item);
    });
    const links = document.getElementById("targetLinks");
    links.replaceChildren();
    const details = document.createElement("button");
    details.type = "button";
    details.dataset.openProject = project.id;
    details.textContent = "View details ↗";
    links.append(details);
    const destinations = [["View project", project.live || project.source]];
    if (project.source) destinations.push(["Source code", project.source]);
    destinations.forEach(([label, url]) => {
      const link = document.createElement("a");
      link.href = url; link.textContent = `${label} ↗`; link.target = "_blank"; link.rel = "noopener noreferrer";
      links.append(link);
    });
    popup.hidden = false;
    popup.inert = false;
    popup.setAttribute("aria-hidden", "false");
    position();
    void popup.offsetWidth;
    requestAnimationFrame(() => { if (selected) { popup.classList.add("is-open"); connector.classList.add("is-active"); } });
    if (keyboard) close.focus();
  };
  projects.forEach((project) => {
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", "radar-target");
    group.setAttribute("transform", `translate(${project.x} ${project.y})`);
    group.setAttribute("role", "button"); group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `Open ${project.name} project details`);
    group.setAttribute("aria-controls", "targetPopup"); group.setAttribute("aria-expanded", "false");
    const badgeX = project.x > 300 ? -196 : 38;
    const bridgeX = project.x > 300 ? -38 : 0;
    group.innerHTML = `<circle class="radar-target-hit" r="44"/><circle class="radar-target-ping" r="14"/><circle class="radar-target-ring" r="9"/><circle class="radar-target-core" r="3"/><path class="target-bracket" d="M-15 -9v-6h6 M9 -15h6v6 M15 9v6h-6 M-9 15h-6v-6"/><path class="target-lock-frame" d="M-20 -12v-8h8 M12 -20h8v8 M20 12v8h-8 M-12 20h-8v-8"/><g class="radar-identity"><rect class="radar-identity-bridge" x="${bridgeX}" y="-22" width="38" height="44"/><line class="radar-identity-line" x1="${project.x > 300 ? -12 : 12}" y1="0" x2="${project.x > 300 ? -38 : 38}" y2="0"/><foreignObject x="${badgeX}" y="-22" width="158" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="radar-identity-chip"><span class="project-monogram"></span><span class="radar-identity-name"></span></div></foreignObject></g>`;
    group.querySelector(".project-monogram").textContent = project.mark;
    group.querySelector(".radar-identity-name").textContent = project.name;
    group.addEventListener("click", (event) => select(project, event.detail === 0));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(project, true); }
    });
    markers.append(group); project.element = group;
    project.angle = (Math.atan2(project.x - 300, 300 - project.y) + Math.PI * 2) % (Math.PI * 2);
  });
  close.addEventListener("click", () => dismiss(true));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && selected && !document.getElementById("projectDossier").open) dismiss(true); });
  document.addEventListener("pointerdown", (event) => {
    if (selected && !popup.contains(event.target) && !event.target.closest(".radar-target")) dismiss(popup.contains(document.activeElement));
  });
  window.addEventListener("resize", position);
  if (!prefersReduced) {
    let start = 0;
    let previousAngle = 0;
    const scan = (now) => {
      if (!start) start = now;
      const angle = ((now - start) % 8000) / 8000 * Math.PI * 2;
      sweep.setAttribute("transform", `rotate(${angle * 180 / Math.PI} 300 300)`);
      projects.forEach((project) => {
        const crossed = angle >= previousAngle ? project.angle > previousAngle && project.angle <= angle : project.angle > previousAngle || project.angle <= angle;
        if (crossed) {
          project.element.classList.remove("is-scanning");
          void project.element.getBoundingClientRect();
          project.element.classList.add("is-scanning");
          setTimeout(() => project.element.classList.remove("is-scanning"), 1000);
        }
      });
      previousAngle = angle;
      requestAnimationFrame(scan);
    };
    requestAnimationFrame(scan);
  }
}

initSystemBoot();
const openProjectDossier = initDossiers();
initDeveloperTerminal(openProjectDossier);
initShowcaseCards(openProjectDossier);
initProjectRadar();
initLoader();
initYear();
initNavigation();
initReveals();
initAtomHero();
initCursorGlow();
initIconLabels();
initSpotlights();
initMagneticControls();
initContactBoot();
initMatrixRain();
initContactConnection();
