'use strict';

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. SIDEBAR TOGGLE (Mobile)
  // ==========================================
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", function () {
      sidebar.classList.toggle("active");
    });
  }


  // ==========================================
  // 2. PAGE NAVIGATION
  // ==========================================
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach(link => {
    link.addEventListener("click", function () {
      const targetPage = this.innerText.trim().toLowerCase();

      pages.forEach(page => {
        if (page.dataset.page.toLowerCase() === targetPage) {
          page.classList.add("active");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          page.classList.remove("active");
        }
      });

      navigationLinks.forEach(navBtn => navBtn.classList.remove("active"));
      this.classList.add("active");
    });
  });


  // ==========================================
  // 3. PROJECT FILTERING
  // ==========================================
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtns = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterProjects = function (selectedValue) {
    const val = selectedValue.trim().toLowerCase();

    filterItems.forEach(item => {
      const itemCategory = (item.dataset.category || "").toLowerCase();

      if (val === "all" || itemCategory.includes(val) || val === itemCategory) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  // Mobile select dropdown toggle
  if (select) {
    select.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }

  // Mobile select items
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const text = this.innerText.trim();
      if (selectValue) selectValue.innerText = text;
      if (select) select.classList.remove("active");
      filterProjects(text);

      // sync desktop buttons
      filterBtns.forEach(btn => {
        if (btn.innerText.trim().toLowerCase() === text.toLowerCase()) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  });

  // Desktop filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const text = this.innerText.trim();
      if (selectValue) selectValue.innerText = text;

      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      filterProjects(text);
    });
  });


  // ==========================================
  // 4. SHOW MORE PROJECTS TOGGLE
  // ==========================================
  const btnShowMore = document.getElementById("btn-show-more-projects");

  if (btnShowMore) {
    btnShowMore.addEventListener("click", function () {
      const hiddenProjects = document.querySelectorAll(".project-item.hidden-project");
      hiddenProjects.forEach(item => {
        item.classList.remove("hidden-project");
      });
      this.parentElement.style.display = "none";
    });
  }


  // ==========================================
  // 5. CAROUSEL FUNCTIONALITY (Modal Image Gallery)
  // ==========================================
  const initCarousels = function () {
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach(carousel => {
      const imagesContainer = carousel.querySelector(".carousel-images");
      if (!imagesContainer) return;

      const slides = imagesContainer.children;
      const total = slides.length;
      if (total <= 1) {
        const prevBtn = carousel.querySelector(".prev");
        const nextBtn = carousel.querySelector(".next");
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        return;
      }

      let currentIndex = 0;

      const updateSlide = () => {
        imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      };

      const nextBtn = carousel.querySelector(".next");
      const prevBtn = carousel.querySelector(".prev");

      if (nextBtn) {
        nextBtn.onclick = function (e) {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % total;
          updateSlide();
        };
      }

      if (prevBtn) {
        prevBtn.onclick = function (e) {
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + total) % total;
          updateSlide();
        };
      }

      updateSlide();
    });
  };

  initCarousels();


  // ==========================================
  // 6. TYPING EFFECT (Sidebar Title)
  // ==========================================
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const titleElement = document.querySelector(".sidebar-info .title");
  const titles = [
    "AI Engineer | Generative AI & RAG",
    "GenAI & RAG Systems Engineer",
    "AI Automation Specialist",
    "Production ML Engineer"
  ];

  if (titleElement) {
    if (prefersReducedMotion) {
      titleElement.textContent = titles[0];
    } else {
      let titleIdx = 0;
      let charIdx = 0;
      let isDeleting = false;

      const typeEffect = function () {
        const currentTitle = titles[titleIdx];

        if (isDeleting) {
          titleElement.textContent = currentTitle.substring(0, charIdx - 1);
          charIdx--;
        } else {
          titleElement.textContent = currentTitle.substring(0, charIdx + 1);
          charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentTitle.length) {
          isDeleting = true;
          speed = 2200; // Pause at end of title
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          titleIdx = (titleIdx + 1) % titles.length;
          speed = 400; // Pause before typing next title
        }

        setTimeout(typeEffect, speed);
      };

      typeEffect();
    }
  }


  // ==========================================
  // 7. COUNT-UP ANIMATION FOR IMPACT STATS
  // ==========================================
  const countUpElements = document.querySelectorAll(".count-up");

  if (countUpElements.length > 0) {
    if (prefersReducedMotion) {
      countUpElements.forEach(el => {
        el.textContent = el.getAttribute("data-target") || el.textContent;
      });
    } else {
      const animateCount = function (el) {
        const targetStr = el.getAttribute("data-target");
        if (!targetStr) return;

        const isDecimal = targetStr.includes(".");
        const targetVal = parseFloat(targetStr);
        const duration = 1600; // ms
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = targetVal * easeProgress;

          if (isDecimal) {
            el.textContent = currentVal.toFixed(1);
          } else {
            el.textContent = Math.floor(currentVal);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = isDecimal ? targetVal.toFixed(1) : targetVal;
          }
        };

        requestAnimationFrame(updateCounter);
      };

      const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      countUpElements.forEach(el => statObserver.observe(el));
    }
  }


  // ==========================================
  // 8. SCROLL REVEAL ANIMATIONS
  // ==========================================
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const scrollItems = document.querySelectorAll(
      ".service-item, .project-card, .timeline-item, .metric-card, .skill-action-card, .cert-card, .pipeline-step"
    );

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "slideInUp 0.6s ease forwards";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    scrollItems.forEach(item => {
      item.style.opacity = "0";
      scrollObserver.observe(item);
    });
  }


  // ==========================================
  // 9. SKILL TABS & SEARCH FILTERING
  // ==========================================
  const skillTabBtns = document.querySelectorAll("[data-skill-tab]");
  const skillCards = document.querySelectorAll(".skill-action-card");
  const skillSearchInput = document.getElementById("skill-search-input");

  let currentCategory = "all";

  const applySkillFilter = function () {
    const query = (skillSearchInput ? skillSearchInput.value : "").trim().toLowerCase();

    skillCards.forEach(card => {
      const cardCategory = (card.getAttribute("data-skill-category") || "").toLowerCase();
      const cardText = (card.textContent || "").toLowerCase();
      const matchesCategory = currentCategory === "all" || cardCategory.includes(currentCategory);
      const matchesSearch = !query || cardText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = "block";
        if (!prefersReducedMotion) {
          card.style.animation = "scaleUp 0.25s ease forwards";
        }
      } else {
        card.style.display = "none";
      }
    });
  };

  skillTabBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      currentCategory = (this.getAttribute("data-skill-tab") || "all").toLowerCase();
      skillTabBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applySkillFilter();
    });
  });

  if (skillSearchInput) {
    skillSearchInput.addEventListener("input", function () {
      applySkillFilter();
    });
  }


  // ==========================================
  // 10. SKILL CARD EXPAND / COLLAPSE
  // ==========================================
  skillCards.forEach(card => {
    card.addEventListener("click", function (e) {
      // Don't toggle if user clicked on an inner link
      if (e.target.closest("a") || e.target.closest(".used-in-tag")) {
        return;
      }
      this.classList.toggle("expanded");
    });
  });


  // ==========================================
  // 11. INTERACTIVE BUILD PIPELINE & STAGE DEEP DIVE
  // ==========================================
  const pipelineSteps = document.querySelectorAll(".pipeline-step");
  const pDetailBadge = document.getElementById("p-detail-badge");
  const pDetailTitle = document.getElementById("p-detail-title");
  const pDetailFocus = document.getElementById("p-detail-focus");
  const pDetailApp = document.getElementById("p-detail-application");
  const pFooterChips = document.getElementById("p-footer-chips");

  const pipelineStages = {
    problem: {
      badge: "Stage 1 of 6 • Customer Understanding",
      title: "Customer Problem & Business Bottlenecks",
      focus: "Analyze user pain points, failure modes, latency constraints, and measurable business KPIs before choosing models or writing code.",
      application: "At ARK Learning Arena, prospective NEET candidates experienced slow response times (~6.5s) and admissions counselors lost leads in manual spreadsheets. Established hard constraints: sub-2 second responses, multi-language support (English, Tamil, Tanglish), and automated hot-lead triage.",
      skills: ["LLMs & Prompt Engineering", "FastAPI & Flask", "Zapier Workflows"],
      tags: ["llm", "automation", "backend"]
    },
    architecture: {
      badge: "Stage 2 of 6 • System Design & Trade-offs",
      title: "Architecture & Technology Selection",
      focus: "Evaluate latency, infrastructure cost, and compute budgets. Select the leanest, most reliable architecture for production scale.",
      application: "Evaluated traditional vector database embeddings vs. hierarchical Page-Indexed retrieval. Migrating to Page-Index cut response latency by ~70% on low-resource cloud hosting while preserving exact factual grounding.",
      skills: ["RAG (Vector & Page-Index)", "FastAPI & Flask", "Supabase & PostgreSQL"],
      tags: ["retrieval", "backend", "databases"]
    },
    data: {
      badge: "Stage 3 of 6 • Grounding & Curation",
      title: "Data Curation, Grounding & Schemas",
      focus: "Transform unstructured institutional documents, spreadsheets, and policies into clean, validated, hallucination-resistant knowledge bases.",
      application: "Structured course curricula, fee schedules, and NEET admissions criteria into chunked markdown pages with relational metadata in PostgreSQL/Supabase, preventing synthetic hallucinations.",
      skills: ["Python, Pandas, NumPy", "Supabase & PostgreSQL", "Feature Engineering"],
      tags: ["data", "databases", "ml"]
    },
    retrieval: {
      badge: "Stage 4 of 6 • Search & Reasoning",
      title: "Retrieval & LLM Reasoning Engine",
      focus: "Implement sub-second retrieval ranking, structured prompt engineering, and conversational state machines.",
      application: "Built LangChain chains with JSON schema enforcement, few-shot examples, and context window compression, achieving accurate multi-turn Q&A in English, Tamil, and Thanglish under 2 seconds.",
      skills: ["LLMs & Prompt Engineering", "RAG (Vector & Page-Index)", "LangChain & LangGraph", "ChromaDB & Pinecone"],
      tags: ["retrieval", "llm"]
    },
    automation: {
      badge: "Stage 5 of 6 • Production Integration",
      title: "Event-Driven Workflow Automation",
      focus: "Bridge conversational AI with institutional systems, databases, payment flows, and human-in-the-loop escalation.",
      application: "Connected AiSensy WhatsApp API webhooks to FastAPI endpoints and Zapier multi-step pipelines. Automatically routed hot leads to Google Sheets, notified admissions counselors via email, and triggered automated follow-up sequences.",
      skills: ["WhatsApp Business API (AiSensy)", "Zapier Workflows", "Email & Workflow Automation", "REST API Design"],
      tags: ["automation", "backend"]
    },
    impact: {
      badge: "Stage 6 of 6 • Telemetry & Measurement",
      title: "Production Telemetry & Business ROI",
      focus: "Instrument continuous telemetry, latency benchmarking, campaign analytics, and business impact measurement.",
      application: "Verified ~70% chatbot latency reduction (<2s roundtrip), analyzed district-level demographic patterns across 1.5 lakh NEET student campaign records, and deployed 45+ automated operational communication templates.",
      skills: ["EDA, Statistics & Dashboards", "FastAPI & Flask", "Supabase & PostgreSQL"],
      tags: ["dashboard", "data", "automation"]
    }
  };

  pipelineSteps.forEach(step => {
    step.addEventListener("click", function () {
      const stepName = (this.getAttribute("data-pipeline-step") || "").toLowerCase();
      const stageData = pipelineStages[stepName];

      pipelineSteps.forEach(s => s.classList.remove("active"));
      this.classList.add("active");

      if (stageData && pDetailBadge && pDetailTitle && pDetailFocus && pDetailApp && pFooterChips) {
        pDetailBadge.textContent = stageData.badge;
        pDetailTitle.textContent = stageData.title;
        pDetailFocus.textContent = stageData.focus;
        pDetailApp.textContent = stageData.application;
        pFooterChips.innerHTML = stageData.skills.map(s => `<span>${s}</span>`).join("");
      }

      // Highlight matching skills in action grid
      skillCards.forEach(card => {
        const tags = (card.getAttribute("data-pipeline-tags") || "").toLowerCase();
        const stageTags = stageData ? stageData.tags : [stepName];
        const hasMatch = stageTags.some(t => tags.includes(t));

        if (hasMatch) {
          card.classList.add("highlighted");
        } else {
          card.classList.remove("highlighted");
        }
      });
    });
  });


  // ==========================================
  // 12. MORE CERTIFICATES TOGGLE
  // ==========================================
  const btnToggleCerts = document.getElementById("btn-toggle-certs");
  const moreCertsContainer = document.querySelector(".more-certs-container");

  if (btnToggleCerts && moreCertsContainer) {
    btnToggleCerts.addEventListener("click", function () {
      const isOpen = moreCertsContainer.classList.toggle("open");
      this.innerHTML = isOpen
        ? `<span>Show fewer certificates</span> <ion-icon name="chevron-up-outline"></ion-icon>`
        : `<span>Show more certificates (${moreCertsContainer.children.length})</span> <ion-icon name="chevron-down-outline"></ion-icon>`;
    });
  }


  // ==========================================
  // 13. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById("contact-form") || document.querySelector("[data-form]");
  const formFeedback = document.querySelector(".form-feedback");
  const formSubmitBtn = document.querySelector("[data-form-btn]");

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("[data-form-input]");

    const checkFormValidity = () => {
      if (contactForm.checkValidity()) {
        if (formSubmitBtn) formSubmitBtn.removeAttribute("disabled");
      } else {
        if (formSubmitBtn) formSubmitBtn.setAttribute("disabled", "");
      }
    };

    inputs.forEach(input => {
      input.addEventListener("input", checkFormValidity);
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      if (formSubmitBtn) {
        formSubmitBtn.setAttribute("disabled", "");
        formSubmitBtn.innerHTML = `<ion-icon name="hourglass-outline"></ion-icon> <span>Sending...</span>`;
      }

      const formData = new FormData(contactForm);
      const dataObj = Object.fromEntries(formData.entries());

      // Attempt submit to Formspree endpoint or fallback to mailto
      fetch("https://formspree.io/f/arravi1015@gmail.com", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
      })
      .then(response => {
        if (formFeedback) {
          formFeedback.className = "form-feedback success";
          formFeedback.textContent = "✓ Message sent successfully! I will get back to you shortly.";
        }
        contactForm.reset();
      })
      .catch(error => {
        // Fallback: trigger mailto directly
        const subject = encodeURIComponent("Portfolio Inquiry from " + (dataObj.fullname || "Recruiter"));
        const body = encodeURIComponent(`Name: ${dataObj.fullname}\nEmail: ${dataObj.email}\n\nMessage:\n${dataObj.message}`);
        window.location.href = `mailto:arravi1015@gmail.com?subject=${subject}&body=${body}`;

        if (formFeedback) {
          formFeedback.className = "form-feedback success";
          formFeedback.textContent = "✓ Opening email client to send message...";
        }
      })
      .finally(() => {
        if (formSubmitBtn) {
          formSubmitBtn.removeAttribute("disabled");
          formSubmitBtn.innerHTML = `<ion-icon name="paper-plane"></ion-icon> <span>Send Message</span>`;
        }
      });
    });
  }

});


// ==========================================
// 14. GLOBAL MODAL FUNCTIONS (Open & Close)
// ==========================================
window.openModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Reposition carousel if present in modal
  const carousel = modal.querySelector(".carousel");
  if (carousel) {
    const imagesContainer = carousel.querySelector(".carousel-images");
    if (imagesContainer) imagesContainer.style.transform = "translateX(0)";
  }

  requestAnimationFrame(() => {
    modal.classList.add("show");
    modal.classList.remove("hide");
  });
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("hide");
  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("hide");

    // Only restore scroll if no other modal is visible
    const anyModalOpen = document.querySelector(".modal.show");
    if (!anyModalOpen) {
      document.body.style.overflow = "";
    }
  }, 220);
};

// Aliases for legacy compatibility
window.openModall = window.openModal;
window.closeModall = window.closeModal;

// Close modal on click outside content
window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    window.closeModal(event.target.id);
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const openModals = document.querySelectorAll(".modal.show");
    openModals.forEach(m => window.closeModal(m.id));
  }
});

