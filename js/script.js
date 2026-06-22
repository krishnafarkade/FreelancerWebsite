const siteConfig = {
  formSubmitEmail: "krishnafarkade477@gmail.com",
  whatsappNumber: "7620429632"
};

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initTheme();
  initTyping();
  initCounters();
  initProgressBars();
  initContactForm();
  initBackToTop();
  initActiveNav();

  if (window.AOS) {
    AOS.init({ duration: 850, once: true, offset: 80 });
  }
});

function initLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 200);
  });
}

function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") document.body.classList.add("light-mode");
  updateThemeIcon(toggle);

  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeIcon(toggle);
  });
}

function updateThemeIcon(toggle) {
  if (!toggle) return;
  toggle.innerHTML = document.body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
}

function initTyping() {
  const target = document.querySelector("[data-typing]");
  if (!target) return;
  const words = ["Software Engineer", "Freelance Developer", "Full Stack Learner", "Java and Python Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = words[wordIndex];
    target.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);

    if (!deleting && charIndex > word.length + 6) deleting = true;
    if (deleting && charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(tick, deleting ? 45 : 85);
  };
  tick();
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        current += step;
        counter.textContent = current >= target ? target : current;
        if (current >= target) clearInterval(timer);
      }, 24);
      observer.unobserve(counter);
    });
  }, { threshold: .5 });

  counters.forEach(counter => observer.observe(counter));
}

function initProgressBars() {
  const bars = document.querySelectorAll(".progress-bar[data-progress]");
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = `${entry.target.dataset.progress}%`;
      observer.unobserve(entry.target);
    });
  }, { threshold: .35 });

  bars.forEach(bar => observer.observe(bar));
}

function initContactForm() {
  const form = document.querySelector("#contactForm");
  if (!form) return;
  const messageBox = document.querySelector("#formMessage");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const errors = validateInquiry(data);

    if (errors.length) {
      showFormMessage(messageBox, errors[0], "error");
      return;
    }

    const inquiries = JSON.parse(localStorage.getItem("portfolioInquiries") || "[]");
    inquiries.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem("portfolioInquiries", JSON.stringify(inquiries));

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${siteConfig.formSubmitEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("FormSubmit request failed");
      form.reset();
      showFormMessage(messageBox, "Thank you. Your inquiry has been sent successfully.", "success");
    } catch (error) {
      showFormMessage(messageBox, "Your inquiry was saved locally. Email delivery needs internet/FormSubmit setup.", "error");
    }
  });
}
function validateInquiry(data) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Clean phone input (remove spaces, +, - etc.)
  const phone = (data.phone || "").replace(/\D/g, "");
  // Name
  if (!data.name?.trim()) {
    errors.push("Name is required.");
  }
  // Phone (India: 10 digits, starts with 6-9)
  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(phone)) {
    errors.push("Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
  }
  // Email
  if (!emailPattern.test(data.email || "")) {
    errors.push("Enter a valid email address.");
  }
  // Subject
  if (!data.subject?.trim()) {
    errors.push("Subject is required.");
  }
  // Message
  if (!data.message?.trim()) {
    errors.push("Message is required.");
  }

  return errors;
}

function showFormMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = `form-message ${type}`;
}

function initBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;
  window.addEventListener("scroll", () => {
    button.classList.toggle("show", window.scrollY > 500);
  });
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
}
