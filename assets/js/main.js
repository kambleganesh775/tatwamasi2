/* -------------------------------------------------------------
 * TATWAMASI FOUNDATION - MAIN CORE JAVASCRIPT
 * Coordinating interactions, smooth scroll, modal popups, and scroll animations
 * ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  let lenisInstance;

  // 1. Mobile Menu Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav");
  
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navMenu.classList.toggle("open");
      
      // Prevent body scrolling when menu is open
      if (navMenu.classList.contains("open")) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        if (lenisInstance) lenisInstance.stop();
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (lenisInstance) lenisInstance.start();
      }
    });
  }

  // 1.5. Mobile Initiatives Dropdown Accordion Toggle
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = dropdownToggle.closest(".nav-dropdown");
        if (parent) {
          parent.classList.toggle("active");
        }
      }
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector(".header");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check

  // 3. Donation Modal Simulator Logic
  const modalOverlay = document.getElementById("donation-modal");
  const modalClose = document.querySelector(".modal-close");
  const triggerBtns = document.querySelectorAll("[data-open-modal]");
  const amountBtns = document.querySelectorAll(".btn-amt");
  const customAmtInput = document.getElementById("custom-amount");
  const donationForm = document.getElementById("modal-donation-form");
  const successMessage = document.getElementById("modal-success-message");
  const modalCloseSuccessBtn = document.getElementById("modal-close-success");
  
  // Open modal
  triggerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal
  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
      // Reset form states
      if (donationForm && successMessage) {
        donationForm.style.display = "block";
        successMessage.style.display = "none";
        donationForm.reset();
      }
    }
  };

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  if (modalCloseSuccessBtn) {
    modalCloseSuccessBtn.addEventListener("click", closeModal);
  }

  // Handle amount selections
  amountBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      amountBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (customAmtInput) {
        customAmtInput.value = btn.dataset.amount;
      }
    });
  });

  if (customAmtInput) {
    customAmtInput.addEventListener("input", () => {
      // Deactivate quick buttons when typing a custom value
      amountBtns.forEach(b => b.classList.remove("active"));
    });
  }

  // Handle donation form submission simulation
  if (donationForm) {
    donationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const donorName = document.getElementById("donor-name").value;
      const donorEmail = document.getElementById("donor-email").value;
      const finalAmt = customAmtInput ? customAmtInput.value : "1000";

      if (!donorName || !donorEmail || !finalAmt || parseFloat(finalAmt) <= 0) {
        alert("Please provide a valid name, email and amount to continue.");
        return;
      }

      // Display animated checkout loader
      const submitBtn = donationForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i> Processing Secure Payment...";

      setTimeout(() => {
        // Hide form and show beautiful success screen
        donationForm.style.display = "none";
        successMessage.style.display = "block";
        
        const successAmtSpan = document.getElementById("success-donation-amount");
        if (successAmtSpan) {
          successAmtSpan.textContent = "₹" + parseFloat(finalAmt).toLocaleString("en-IN");
        }
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 2000);
    });
  }

  // 4. Counter Animation logic
  const counters = document.querySelectorAll(".counter-num");
  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // ms
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString("en-IN");
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString("en-IN");
        }
      }, stepTime);
    });
  };

  // 5. Scroll Animations: Fallback Intersection Observer
  // In case external GSAP script fails to load, this serves as a robust fallback.
  const animateOnScroll = () => {
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // If the element contains counters, fire counter logic
          if (entry.target.classList.contains("impact-section")) {
            runCounters();
            // Disconnect to run only once
            observer.unobserve(entry.target);
          } else {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => {
      observer.observe(reveal);
    });
    
    // Fallback trigger for impact counters if the class is not on the section directly
    const impactSec = document.querySelector(".impact-section");
    if (impactSec) {
      observer.observe(impactSec);
    }
  };

  // Add styles dynamically for reveal effects
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    .reveal {
      opacity: 0;
      transform: translateY(45px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-45px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(45px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.active,
    .reveal-left.active,
    .reveal-right.active {
      opacity: 1;
      transform: translate(0);
    }
    .reveal-delay-1 { transition-delay: 0.15s; }
    .reveal-delay-2 { transition-delay: 0.3s; }
    .reveal-delay-3 { transition-delay: 0.45s; }
  `;
  document.head.appendChild(styleEl);
  
  // Fire animation reveal script
  animateOnScroll();

  // 5.5. Hero Slider Cycle
  const heroSlides = document.querySelectorAll(".hero-slide");
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add("active");
    }, 5000);
  }
  
  // 6. Init GSAP if loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero visual parallax scale zoom on scroll
    gsap.to(".hero-visual img", {
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Horizontal Scroll Story Timeline (index.html)
    const timelineContainer = document.querySelector(".timeline-horizontal-scroll");
    if (timelineContainer) {
      const rect = timelineContainer.getBoundingClientRect();
      const offsetLeft = rect.left > 0 ? rect.left : (window.innerWidth * 0.1);
      const translateAmount = timelineContainer.scrollWidth - (window.innerWidth - offsetLeft);

      gsap.to(timelineContainer, {
        x: -translateAmount,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-section",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + translateAmount,
          invalidateOnRefresh: true
        }
      });
    }
  }

  // 7. Init Lenis Smooth Scroll if loaded
  if (typeof Lenis !== "undefined") {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple easeOutQuint
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Coordinate Lenis scrolling with GSAP ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
});
