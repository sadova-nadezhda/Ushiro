const header = document.querySelector("header");

window.addEventListener("load", function () {
  // ====== Header / Burger ======
  const link = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__nav");
  const sectionTop = document.querySelector(".section-top");

  if (menu && link) {
    link.addEventListener("click", function () {
      link.classList.toggle("active");
      menu.classList.toggle("open");
    });

    window.addEventListener("scroll", () => {
      if (menu.classList.contains("open")) {
        link.classList.remove("active");
        menu.classList.remove("open");
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target;

      if (
        !target.closest(".header__nav") &&
        !target.closest(".header__burger")
      ) {
        link.classList.remove("active");
        menu.classList.remove("open");
      }
    });
  }

  function addPadTop(headerEl, section) {
    if (!headerEl || !section) return;
    const headerHeight = headerEl.offsetHeight;
    section.style.marginTop = `${headerHeight}px`;
  }

  if (sectionTop && header) {
    addPadTop(header, sectionTop);
  }

  // ====== Preloader ======

  const innerBars = document.querySelectorAll(".inner-bar");
  const hasSeenPreloader = localStorage.getItem('preloaderShown') === '1';

  function runPreloaderTimeline() {
    const preloaderTl = gsap.timeline({
      onComplete() {
        localStorage.setItem('preloaderShown', '1');

        if (window.openModal) {
          window.openModal('welcome');
        }
      },
    });

    preloaderTl.to(".preloader-overlay", {
      transform: "translateX(0)",
      duration: 0.5,
      ease: "none",
      delay: 0.4,
    });
      preloaderTl.to(".preloader", {
        display: "none",
        duration: 0,
        ease: "none",
      });
      preloaderTl.to(".site-main", {
        display: "block",
        duration: 0,
      });
      preloaderTl.to(".site-main", {
        opacity: 1,
        transform: "translateY(0)",
        duration: 0.4,
        ease: "none",
      });
  }

  function animateBars(startIndex = 0) {
    if (!innerBars.length) {
      runPreloaderTimeline();
      return;
    }

    const group = Array.from(innerBars).slice(startIndex, startIndex + 2);

    if (!group.length) {
      runPreloaderTimeline();
      return;
    }

    group.forEach((bar) => {
      if (!bar) return;
      const randomWidth = Math.floor(Math.random() * 101);
      gsap.to(bar, {
        width: `${randomWidth}%`,
        duration: 0.2,
        ease: "none",
      });
    });

    setTimeout(() => {
      group.forEach((bar) => {
        if (!bar) return;
        gsap.to(bar, {
          width: "100%",
          duration: 0.2,
          ease: "none",
        });
      });

      animateBars(startIndex + group.length);
    }, 200);
  }

  // Старт
  if (hasSeenPreloader) {
    const preloader = document.querySelector('.preloader');
    const overlay = document.querySelector('.preloader-overlay');
    const siteMain = document.querySelector('.site-main');

    if (preloader) preloader.style.display = 'none';
    if (overlay) overlay.style.transform = "translateX(0)";
    if (siteMain) {
      siteMain.style.display = 'block';
      siteMain.style.opacity = 1;
      siteMain.style.transform = 'translateY(0)';
    }

    if (window.openModal) {
      window.openModal('welcome');
    }
  } else {
    setTimeout(() => {
      animateBars();
    }, 1000);
  }

  // ====== Lenis ======

  const lenis = new Lenis({
    autoRaf: true,
  });

  window.lenis = lenis;

  // ====== Size / Multiplier ======

  function getWidthMultiplier() {
    const w = window.innerWidth;

    if (w <= 767) {
      return Math.min(window.innerWidth, window.innerHeight) / 375;
    }

    if (w <= 1024) {
      return Math.min(window.innerWidth, window.innerHeight) / 768;
    }

    return window.innerWidth / 1280;
  }

  let _multiplier = getWidthMultiplier();

  function s(value) {
    return value * _multiplier;
  }

  // ====== Swiper ======

  const heroSwiper = new Swiper(".heroSwiper", {
    loop: true,
    effect: "fade",
    navigation: {
      nextEl: ".hero-next",
      prevEl: ".hero-prev",
    },
    pagination: {
      el: ".hero-pagination",
    },
  });

  const shopSwiper = new Swiper(".shopSwiper", {
    slidesPerView: "auto",
    spaceBetween: s(140),
    initialSlide: 1,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".shop-next",
      prevEl: ".shop-prev",
    },
    pagination: {
      el: ".shop-pagination",
      clickable: true,
    },
  });

  // ====== Product Slider ======

  const navSliderEl = document.querySelector('.js-prod-nav-slider');
  const mainSliderEl = document.querySelector('.js-prod-slider');

  if (navSliderEl && mainSliderEl) {
    const isMobile = window.innerWidth <= 1024;
    const removeHrefMobile = () => {
      const navSlides = navSliderEl.querySelectorAll('.swiper-slide');
      navSlides.forEach(slide => {
        if (slide.hasAttribute('href')) {
          slide.dataset.href = slide.getAttribute('href');
          slide.removeAttribute('href');
        }
      });
    };

    // =============== MOBILE: Swiper + thumbs ===============
    const initMobile = () => {
      removeHrefMobile();

      const swiperNavProd = new Swiper('.js-prod-nav-slider', {
        grabCursor: true,
        lazy: true,
        slidesPerView: 5,
        spaceBetween: 8,
        breakpoints: {
          1025: {
            direction: 'vertical',
            slidesPerView: 6
          }
        }
      });

      const swiperProd = new Swiper('.js-prod-slider', {
        grabCursor: true,
        lazy: true,
        spaceBetween: 8,
        navigation: {
          nextEl: '.prod-button-next',
          prevEl: '.prod-button-prev'
        },
        thumbs: {
          swiper: swiperNavProd
        }
      });
    };

    // =============== DESKTOP: без Swiper ===============
    const initDesktop = () => {
      const navSlides = navSliderEl.querySelectorAll('.swiper-slide');
      const mainSlides = mainSliderEl.querySelectorAll('.swiper-slide[id]');

      if (!navSlides.length || !mainSlides.length) return;

      const idToNav = new Map();
      navSlides.forEach(slide => {
        const href = slide.getAttribute('href');
        if (href && href.startsWith('#')) {
          idToNav.set(href.slice(1), slide);
        }
      });

      const setActiveById = (id) => {
        navSlides.forEach(slide => slide.classList.remove('active'));
        const nav = idToNav.get(id);
        if (nav) nav.classList.add('active');
      };

      setActiveById(mainSlides[0].id);

      navSlides.forEach(slide => {
        slide.addEventListener('click', (e) => {
          e.preventDefault();
          const href = slide.getAttribute('href');
          if (!href) return;

          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            setActiveById(target.id);
          }
        });
      });

      const onScroll = () => {
        let closest = null;
        let closestOffset = Infinity;

        mainSlides.forEach(slide => {
          const rect = slide.getBoundingClientRect();
          const refY = window.innerHeight * 0.3;
          const offset = Math.abs(rect.top - refY);
          if (offset < closestOffset) {
            closestOffset = offset;
            closest = slide;
          }
        });

        if (closest) setActiveById(closest.id);
      };

      onScroll();
      window.addEventListener('scroll', onScroll);
    };

    if (isMobile) {
      initMobile();
    } else {
      initDesktop();
    }
  }

  // ====== Accordion ======

  const AccItems = document.querySelectorAll(".accordion__item");

  AccItems.forEach((item) => {
    item.addEventListener("click", function () {
      AccItems.forEach((el) => {
        if (el !== item) {
          el.classList.remove("active");
          const body = el.querySelector(".accordion__body");
          if (body) body.style.maxHeight = null;
        }
      });

      this.classList.toggle("active");
      const accBody = this.querySelector(".accordion__body");

      if (this.classList.contains("active") && accBody) {
        accBody.style.maxHeight = accBody.scrollHeight + "px";
      } else if (accBody) {
        accBody.style.maxHeight = null;
      }
    });
  });

  // ====== Modals ======

  const modalWrapper = document.querySelector('.modals');
  if (!modalWrapper) return;

  const modals = Array.from(modalWrapper.querySelectorAll('.modal'));
  const body = document.body;

  const getModalByType = (type) =>
    modalWrapper.querySelector(`.modal[data-type="${type}"]`);

  const showWrapper = () => {
    modalWrapper.style.opacity = 1;
    modalWrapper.style.pointerEvents = 'all';

    if (window.lenis) {
      window.lenis.stop();
    }
  };

  const hideWrapper = () => {
    modalWrapper.style.opacity = 0;
    modalWrapper.style.pointerEvents = 'none';

    if (window.lenis) {
      window.lenis.start();
    }
  };

  const openModal = (type) => {
    modals.forEach((m) => {
      m.style.display = 'none';
      m.style.removeProperty('transform');
    });

    const modal = getModalByType(type);
    if (!modal) return;

    modal.style.display = 'block';
    showWrapper();

    if (window.gsap) {
      gsap.fromTo(
        modal,
        { y: '-100%' },
        { y: '0%', duration: 0.5, ease: 'power3.out' }
      );
    }
  };

  window.openModal = openModal;

  const getModalTypeFromUrl = () => {
    let type = null;

    try {
      const url = new URL(window.location.href);

      // ?modal=type
      const fromQuery = url.searchParams.get('modal');
      if (fromQuery) return fromQuery;

      if (url.hash) {
        const hash = url.hash.replace('#', '');
        if (!hash) return null;

        const [key, value] = hash.split('=');
        if (key === 'modal' && value) {
          return value;
        }

        return hash;
      }
    } catch (e) {}

    return type;
  };

  const openModalFromUrlOrPath = () => {
    const typeFromUrl = getModalTypeFromUrl();
    if (typeFromUrl && getModalByType(typeFromUrl)) {
      openModal(typeFromUrl);
      return;
    }

    const path = window.location.pathname.split('/').filter(Boolean);
    const last = path[path.length - 1];

    if (!last) return;

    if (getModalByType(last)) {
      openModal(last);
    }
  };

  openModalFromUrlOrPath();

  const closeCurrentModal = () => {
    const current = modals.find((m) => m.style.display !== 'none');

    const finishClose = () => {
      if (current) current.style.display = 'none';
      hideWrapper();

      const url = new URL(window.location.href);

      if (url.searchParams.has('modal')) {
        url.searchParams.delete('modal');
      }

      if (url.hash) {
        url.hash = '';
      }

      history.replaceState(null, '', url.toString());
    };

    if (current && window.gsap) {
      gsap.to(current, {
        y: '-100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          current.style.removeProperty('transform');
          finishClose();
        },
      });
    } else {
      finishClose();
    }
  };

  document.querySelectorAll('.modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.dataset.type;
      if (type) openModal(type);
    });
  });

  modalWrapper.addEventListener('click', (e) => {
    if (e.target === modalWrapper || e.target.closest('.modal__close')) {
      closeCurrentModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrapper.style.pointerEvents === 'all') {
      closeCurrentModal();
    }
  });

  // ====== Search ======

  const searchBtn = document.getElementById('search-btn');
  const search = document.getElementById('search');
  const searchInput = search.querySelector('.search-input');

  let isSearchOpen = false;

  const openSearch = () => {
    if (isSearchOpen) return;
    isSearchOpen = true;

    search.style.display = 'block';

    if (window.lenis) {
      window.lenis.stop();
    }
    document.body.classList.add('search-open');

    if (window.gsap) {
      gsap.fromTo(
        search,
        { y: '-100%' },
        { y: '0%', duration: 0.5, ease: 'power3.out' }
      );
    }

    if (searchInput) {
      searchInput.focus();
    }
  };

  const closeSearch = () => {
    if (!isSearchOpen) return;
    isSearchOpen = false;

    if (window.gsap) {
      gsap.to(search, {
        y: '-100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete() {
          search.style.display = 'none';
          search.style.removeProperty('transform');
        },
      });
    } else {
      search.style.display = 'none';
      search.style.removeProperty('transform');
    }

    if (window.lenis) {
      window.lenis.start();
    }
    document.body.classList.remove('search-open');
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  // клик по иконке в шапке
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSearch();
  });

  // закрытие по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSearchOpen) {
      closeSearch();
    }
  });

  // ====== Form: profile ======

  const form = document.getElementById("profileForm");

  if (form) {
    const saveButton = form.querySelector(".form__button");
    const inputs = form.querySelectorAll("input");

    if (saveButton && inputs.length) {
      const initialValues = {};

      inputs.forEach((input) => {
        if (!input.name) return;
        initialValues[input.name] = input.value;
      });

      function checkChanges() {
        let changed = false;

        inputs.forEach((input) => {
          if (!input.name) return;
          if (input.value !== initialValues[input.name]) {
            changed = true;
          }
        });

        saveButton.disabled = !changed;
      }

      inputs.forEach((input) => {
        input.addEventListener("input", checkChanges);
      });

      checkChanges();
    }
  }

  // ====== Form: password ======

  document.querySelectorAll('.password-field').forEach(field => {
    const input = field.querySelector('input');
    const toggle = field.querySelector('.toggle-password');

    toggle.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.classList.toggle('active', isPassword);
    });
  });

  // ====== Form: support ======

  const supportForm = document.getElementById("supportForm");

  if (supportForm) {
    const textarea = supportForm.querySelector("textarea");
    const button = supportForm.querySelector(".form__button");

    if (textarea && button) {
      function checkTextarea() {
        button.disabled = textarea.value.trim().length === 0;
      }

      textarea.addEventListener("input", checkTextarea);
      checkTextarea();
    }
  }

  // ====== Inputs with floating labels ======

  function initField(field) {
    const labelText = field.getAttribute("data-placeholder");
    if (!labelText) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrap");

    const parent = field.parentNode;
    if (!parent) return;

    parent.insertBefore(wrapper, field);
    wrapper.appendChild(field);

    if (!field.id) {
      field.id = field.name || `field-${Math.random().toString(36).slice(2)}`;
    }

    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = labelText;

    wrapper.insertBefore(label, field);

    if (field.value.trim() !== "") {
      label.classList.add("active");
    }

    field.addEventListener("focus", () => {
      label.classList.add("active");
    });

    field.addEventListener("blur", () => {
      if (field.value.trim() === "") {
        label.classList.remove("active");
      }
    });
  }

  // ====== Favorite Card ======
  document.addEventListener("click", function (e) {
    const fav = e.target.closest(".catalog__favorites");
    if (!fav) return;

    fav.classList.toggle("active");

    e.preventDefault();
  });

  document
    .querySelectorAll('input[data-placeholder], textarea[data-placeholder]')
    .forEach(initField);

  // ====== Mask for phone ======

  [].forEach.call(
    document.querySelectorAll('input[type="tel"]'),
    function (input) {
      let keyCode;

      function mask(event) {
        if (event.keyCode) keyCode = event.keyCode;
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();

        const matrix = "+7 (___) ___ ____";
        let i = 0;
        const def = matrix.replace(/\D/g, "");
        const val = this.value.replace(/\D/g, "");
        let new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });

        i = new_value.indexOf("_");
        if (i !== -1) {
          if (i < 5) i = 3;
          new_value = new_value.slice(0, i);
        }

        const reg = new RegExp(
          "^" +
            matrix
              .substring(0, this.value.length)
              .replace(/_+/g, function (a) {
                return "\\d{1," + a.length + "}";
              })
              .replace(/[+()]/g, "\\$&") +
            "$"
        );

        if (
          !reg.test(this.value) ||
          this.value.length < 5 ||
          (keyCode > 47 && keyCode < 58)
        ) {
          this.value = new_value;
        }

        if (event.type === "blur" && this.value.length < 5) {
          this.value = "";
        }
      }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    }
  );

  // ====== Resize ======

  window.addEventListener("resize", () => {
    if (sectionTop && header) {
      addPadTop(header, sectionTop);
    }

    _multiplier = getWidthMultiplier();

    if (shopSwiper) {
      shopSwiper.params.spaceBetween = s(140);
      shopSwiper.update();
    }
  });
});