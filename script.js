(() => {
  document.documentElement.classList.add("js-enabled");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const header = document.querySelector(".site-header");
  const mobileConsultCta = document.querySelector(".mobile-consult-cta");

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  if (mobileConsultCta) {
    let previousScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const movingDown = currentScrollY > previousScrollY + 4;
      const movingUp = currentScrollY < previousScrollY - 4;
      const isFocused = mobileConsultCta.contains(document.activeElement);
      if (currentScrollY < 120 || movingUp || isFocused) {
        mobileConsultCta.classList.remove("is-hidden");
        mobileConsultCta.inert = false;
      } else if (movingDown) {
        mobileConsultCta.classList.add("is-hidden");
        mobileConsultCta.inert = true;
      }
      previousScrollY = currentScrollY;
    }, { passive: true });
    window.addEventListener("resize", () => {
      mobileConsultCta.classList.remove("is-hidden");
      mobileConsultCta.inert = false;
      previousScrollY = window.scrollY;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      const headerOffset = header?.getBoundingClientRect().height ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const demoCounters = document.querySelectorAll("[data-demo-counter]");
  const renderCounter = (element, value) => {
    const format = element.dataset.counterFormat;
    const digits = Math.round(value);
    if (format === "currency") {
      element.textContent = `$${new Intl.NumberFormat("en-US").format(digits)}`;
    } else {
      element.textContent = String(digits).padStart(2, "0");
    }
  };
  const animateCounter = (element) => {
    const target = Number(element.dataset.demoCounter);
    if (reducedMotion || !Number.isFinite(target)) {
      renderCounter(element, target);
      return;
    }
    const startedAt = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      renderCounter(element, target * (1 - (1 - progress) ** 3));
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    demoCounters.forEach((counter) => counterObserver.observe(counter));
  } else {
    demoCounters.forEach(animateCounter);
  }

  const heroSlides = [...document.querySelectorAll(".hero__slide")];
  const heroCount = document.querySelector(".hero__slide-count b");
  let activeHeroSlide = 0;
  let heroTimer;

  const showHeroSlide = (index) => {
    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    if (heroCount) heroCount.textContent = String(index + 1).padStart(2, "0");
    activeHeroSlide = index;
  };

  if (heroSlides.length > 1 && !reducedMotion) {
    heroTimer = window.setInterval(() => {
      showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
    }, 6500);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearInterval(heroTimer);
      } else {
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(() => {
          showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
        }, 6500);
      }
    });
  }

  const testimonialSlides = [...document.querySelectorAll(".testimonial-slide")];
  const currentCount = document.querySelector("[data-testimonial-current]");
  const totalCount = document.querySelector("[data-testimonial-total]");
  const carousel = document.querySelector(".testimonial-carousel");
  let activeTestimonial = 0;
  let testimonialTimer;

  if (totalCount) totalCount.textContent = String(testimonialSlides.length).padStart(2, "0");

  const showTestimonial = (index) => {
    if (!testimonialSlides.length) return;
    activeTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeTestimonial;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (currentCount) currentCount.textContent = String(activeTestimonial + 1).padStart(2, "0");
  };

  const stopTestimonialTimer = () => window.clearInterval(testimonialTimer);
  const startTestimonialTimer = () => {
    stopTestimonialTimer();
    if (!reducedMotion && !document.hidden && testimonialSlides.length > 1) {
      testimonialTimer = window.setInterval(() => showTestimonial(activeTestimonial + 1), 7000);
    }
  };

  document.querySelector("[data-testimonial-prev]")?.addEventListener("click", () => {
    showTestimonial(activeTestimonial - 1);
    startTestimonialTimer();
  });
  document.querySelector("[data-testimonial-next]")?.addEventListener("click", () => {
    showTestimonial(activeTestimonial + 1);
    startTestimonialTimer();
  });
  carousel?.addEventListener("mouseenter", stopTestimonialTimer);
  carousel?.addEventListener("mouseleave", startTestimonialTimer);
  carousel?.addEventListener("focusin", stopTestimonialTimer);
  carousel?.addEventListener("focusout", startTestimonialTimer);
  document.addEventListener("visibilitychange", startTestimonialTimer);
  startTestimonialTimer();

  const dateField = document.querySelector("#preferred-date");
  if (dateField) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateField.min = localDate;
  }

  const form = document.querySelector("#consultation-form");
  const formError = document.querySelector("#form-error");
  const formSuccess = document.querySelector("#form-success");
  if (form && formError && formSuccess) {
    form.addEventListener("input", (event) => {
      event.target.removeAttribute("aria-invalid");
      formError.hidden = true;
      formSuccess.hidden = true;
    });

    form.addEventListener("change", (event) => {
      event.target.removeAttribute("aria-invalid");
      formError.hidden = true;
      formSuccess.hidden = true;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formSuccess.hidden = true;
      const invalidField = [...form.elements].find((field) => (
        field.willValidate && !field.validity.valid
      ));

      if (invalidField) {
        invalidField.setAttribute("aria-invalid", "true");
        formError.textContent = invalidField.validity.valueMissing
          ? "Please complete this required field."
          : "Please enter a valid value for this field.";
        formError.hidden = false;
        invalidField.focus();
        return;
      }

      const phoneField = form.querySelector('input[name="phone"]');
      const phoneValue = phoneField?.value.trim() ?? "";
      const phoneDigits = phoneValue.replace(/\D/g, "");
      const phoneCharactersAreValid = /^[0-9+().\s-]+$/.test(phoneValue);
      if (phoneField && (
        !phoneCharactersAreValid || phoneDigits.length < 7 || phoneDigits.length > 15
      )) {
        phoneField.setAttribute("aria-invalid", "true");
        formError.textContent = "Please enter a phone number with 7 to 15 digits.";
        formError.hidden = false;
        phoneField.focus();
        return;
      }

      formError.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
