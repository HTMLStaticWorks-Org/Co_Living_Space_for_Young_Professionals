/**
 * NESTLY CO-LIVING — MAIN APPLICATION SCRIPT (main.js)
 * Features: Theme & RTL persistence, 3D Tilt Cards, Scroll Reveal, Counters,
 *           Tabs, Accordions, Lightbox, Rooms Filter & Compare, Cost Calculator,
 *           Multi-Step Booking Wizard, Client-side Form Validation, Toasts.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME (DARK/LIGHT) & RTL PERSISTENCE
     ------------------------------------------------------------------------ */
  const THEME_KEY = 'nestly_theme';
  const DIR_KEY = 'nestly_dir';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const labelEl = btn.querySelector('.theme-label');
      if (labelEl) labelEl.textContent = theme === 'dark' ? 'Light' : 'Dark';
    });
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-theme-toggle]');
      if (!toggle) return;
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    const btns = document.querySelectorAll('[data-rtl-toggle]');
    btns.forEach((btn) => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
    });
  }

  function initRTL() {
    const saved = localStorage.getItem(DIR_KEY) || 'ltr';
    applyDirection(saved);

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-rtl-toggle]');
      if (!toggle) return;
      const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem(DIR_KEY, next);
      applyDirection(next);
    });
  }

  /* ------------------------------------------------------------------------
     2. TOAST NOTIFICATION HELPER
     ------------------------------------------------------------------------ */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }
  window.NestlyToast = showToast;

  /* ------------------------------------------------------------------------
     3. STICKY HEADER, MOBILE DRAWER & BACK TO TOP
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 30);
      if (backToTop) backToTop.classList.toggle('is-visible', y > 420);
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const openBtn = document.querySelector('[data-mobile-open]');
    const closeBtn = document.querySelector('[data-mobile-close]');
    const drawer = document.querySelector('.mobile-drawer');

    if (openBtn && drawer) {
      openBtn.addEventListener('click', () => {
        drawer.classList.add('is-open');
        openBtn.setAttribute('aria-expanded', 'true');
        const firstLink = drawer.querySelector('a, button');
        if (firstLink) firstLink.focus();
      });
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      if (openBtn) {
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDrawer();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.mobile-nav-toggle');
      if (!toggle) return;
      const item = toggle.closest('.mobile-nav-item');
      if (item) {
        const isOpen = item.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });

    // Auto-detect & highlight active navigation items across desktop and mobile hamburger drawer
    try {
      const fullPath = decodeURIComponent(window.location.pathname || '');
      const rawPath = fullPath.replace(/\\/g, '/').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
      const activeFile = (!rawPath || rawPath === '' || rawPath === '/') ? 'index.html' : rawPath;

      // 1. Mobile Drawer Nav Links (both direct links and nested submenu links)
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
      mobileNavLinks.forEach((link) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;
        const linkFile = rawHref.replace(/\\/g, '/').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
        if (linkFile === activeFile) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');

          // If inside a submenu, open and highlight parent item & toggle button
          const subMenu = link.closest('.mobile-sub-menu');
          if (subMenu) {
            const parentItem = subMenu.closest('.mobile-nav-item');
            if (parentItem) {
              parentItem.classList.add('is-open');
              const parentToggle = parentItem.querySelector('.mobile-nav-toggle');
              if (parentToggle) {
                parentToggle.classList.add('is-active');
                parentToggle.setAttribute('aria-expanded', 'true');
              }
            }
          }
        }
      });

      // 2. Desktop Navigation Items & Dropdown Links
      const desktopLinks = document.querySelectorAll('.main-nav a, .dropdown-link');
      desktopLinks.forEach((link) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;
        const linkFile = rawHref.replace(/\\/g, '/').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
        if (linkFile === activeFile) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
          const navItem = link.closest('.nav-item');
          if (navItem) {
            const topNavLink = navItem.querySelector('.nav-link');
            if (topNavLink) topNavLink.classList.add('is-active');
          }
        }
      });

      // Desktop Nav Dropdowns: Mutual Exclusion & Clean Dismissal
      const desktopNavItems = document.querySelectorAll('.main-nav .nav-item');
      desktopNavItems.forEach((item) => {
        // When hovering an item, immediately blur any other focused item so its dropdown closes
        item.addEventListener('mouseenter', () => {
          desktopNavItems.forEach((sibling) => {
            if (sibling !== item) {
              const active = document.activeElement;
              if (active && sibling.contains(active)) {
                active.blur();
              }
            }
          });
        });
      });

      // Escape key closes any active dropdown
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const active = document.activeElement;
          if (active && active.closest('.main-nav .nav-item')) {
            active.blur();
          }
        }
      });

      // Clicking outside main-nav dismisses any focused dropdown
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
          const active = document.activeElement;
          if (active && active.closest('.main-nav .nav-item')) {
            active.blur();
          }
        }
      });
    } catch (err) {
      /* silent */
    }
  }

  /* ------------------------------------------------------------------------
     4. 3D TILT CARD ENGINE (Perspective 900px, max ±10deg + radial glare)
     ------------------------------------------------------------------------ */
  function initTiltCards() {
    // 3D tilt animation permanently disabled throughout the website to prevent disturbing content
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL & ANIMATED COUNTERS
     ------------------------------------------------------------------------ */
  function initRevealAndCounters() {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach((el) => revealObs.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }

    const counters = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counters.length) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter')) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 1400;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);
            el.textContent = prefix + val.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = prefix + target.toLocaleString() + suffix;
            }
          }
          requestAnimationFrame(tick);
          counterObs.unobserve(el);
        });
      }, { threshold: 0.25 });
      counters.forEach((c) => counterObs.observe(c));
    }
  }

  /* ------------------------------------------------------------------------
     6. TABS, ACCORDIONS & FAQ SEARCH
     ------------------------------------------------------------------------ */
  function initTabsAndAccordions() {
    document.querySelectorAll('[data-tabs]').forEach((tabGroup) => {
      const buttons = tabGroup.querySelectorAll('[data-tab-target]');
      const panels = tabGroup.querySelectorAll('.tab-panel');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab-target');
          buttons.forEach((b) => {
            b.classList.toggle('is-active', b === btn);
            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
          });
          panels.forEach((p) => {
            p.classList.toggle('is-active', p.id === targetId);
          });
        });
      });
    });

    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        if (!item) return;
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    const faqSearch = document.getElementById('faqSearchInput');
    if (faqSearch) {
      faqSearch.addEventListener('input', () => {
        const q = faqSearch.value.trim().toLowerCase();
        document.querySelectorAll('.accordion-item').forEach((item) => {
          const text = item.textContent.toLowerCase();
          const match = !q || text.includes(q);
          item.style.display = match ? '' : 'none';
          if (q && match) item.classList.add('is-open');
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     7. HOME 2 COST CALCULATOR & BEFORE/AFTER TOGGLE
     ------------------------------------------------------------------------ */
  function initHome2Widgets() {
    const compareBtns = document.querySelectorAll('[data-compare-mode]');
    if (compareBtns.length) {
      compareBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-compare-mode');
          compareBtns.forEach((b) => b.classList.toggle('btn-primary', b === btn));
          compareBtns.forEach((b) => b.classList.toggle('btn-ghost', b !== btn));
          document.querySelectorAll('[data-compare-view]').forEach((view) => {
            view.style.display = view.getAttribute('data-compare-view') === mode ? 'grid' : 'none';
          });
        });
      });
    }

    const calcRent = document.getElementById('calcBaseRent');
    const calcCity = document.getElementById('calcCitySelect');
    if (calcRent) {
      function updateCalc() {
        const flatRent = parseInt(calcRent.value, 10) || 24000;
        const multiplier = calcCity ? parseFloat(calcCity.value) : 1;
        const brokerAndSetup = Math.round(6500 * multiplier);
        const utilitiesWifiHousekeeping = Math.round(5800 * multiplier);
        const traditionalTotal = flatRent + brokerAndSetup + utilitiesWifiHousekeeping;
        const nestlyAllIn = Math.round(flatRent * 0.92);
        const monthlySaved = Math.max(2500, traditionalTotal - nestlyAllIn);

        const rentValEl = document.getElementById('calcRentDisplay');
        const tradEl = document.getElementById('calcTradTotal');
        const nestlyEl = document.getElementById('calcNestlyTotal');
        const savedEl = document.getElementById('calcSavedAmount');

        if (rentValEl) rentValEl.textContent = '₹' + flatRent.toLocaleString('en-IN');
        if (tradEl) tradEl.textContent = '₹' + traditionalTotal.toLocaleString('en-IN');
        if (nestlyEl) nestlyEl.textContent = '₹' + nestlyAllIn.toLocaleString('en-IN');
        if (savedEl) savedEl.textContent = '₹' + (monthlySaved * 12).toLocaleString('en-IN') + '/yr';
      }
      calcRent.addEventListener('input', updateCalc);
      if (calcCity) calcCity.addEventListener('change', updateCalc);
      updateCalc();
    }
  }

  /* ------------------------------------------------------------------------
     8. ROOMS FILTERING, SORT, WISHLIST, COMPARE TRAY & PRICING TOGGLE
     ------------------------------------------------------------------------ */
  function initRoomsAndPricing() {
    // Wishlist toggle
    document.addEventListener('click', (e) => {
      const wishBtn = e.target.closest('.card-wishlist');
      if (!wishBtn) return;
      const active = wishBtn.classList.toggle('is-active');
      showToast(active ? 'Added room to your saved shortlist' : 'Removed from shortlist');
    });

    // Rooms live filter
    const filterForm = document.getElementById('roomsFilterBar');
    if (filterForm) {
      const locSel = document.getElementById('filterLocation');
      const typeSel = document.getElementById('filterRoomType');
      const priceInput = document.getElementById('filterMaxPrice');
      const priceLabel = document.getElementById('filterPriceLabel');
      const sortSel = document.getElementById('filterSort');
      const cardsWrap = document.getElementById('roomsListingGrid');
      const emptyState = document.getElementById('roomsEmptyState');
      const countEl = document.getElementById('roomsResultCount');

      function applyRoomFilters() {
        if (!cardsWrap) return;
        const loc = locSel ? locSel.value : 'all';
        const type = typeSel ? typeSel.value : 'all';
        const maxPrice = priceInput ? parseInt(priceInput.value, 10) : 50000;
        const sort = sortSel ? sortSel.value : 'featured';

        if (priceLabel && priceInput) {
          priceLabel.textContent = 'Up to ₹' + maxPrice.toLocaleString('en-IN');
        }

        const cards = Array.from(cardsWrap.querySelectorAll('.room-item'));
        let visibleCount = 0;

        cards.forEach((card) => {
          const cLoc = card.getAttribute('data-location') || '';
          const cType = card.getAttribute('data-type') || '';
          const cPrice = parseInt(card.getAttribute('data-price') || '0', 10);

          const matchLoc = loc === 'all' || cLoc === loc;
          const matchType = type === 'all' || cType === type;
          const matchPrice = cPrice <= maxPrice;

          if (matchLoc && matchType && matchPrice) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (sort !== 'featured') {
          cards.sort((a, b) => {
            const pA = parseInt(a.getAttribute('data-price') || '0', 10);
            const pB = parseInt(b.getAttribute('data-price') || '0', 10);
            return sort === 'price-asc' ? pA - pB : pB - pA;
          });
          cards.forEach((c) => cardsWrap.appendChild(c));
        }

        if (countEl) countEl.textContent = visibleCount + ' Rooms Available';
        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      [locSel, typeSel, priceInput, sortSel].forEach((el) => {
        if (el) el.addEventListener('input', applyRoomFilters);
      });
    }

    // Compare Rooms Tray (up to 3)
    const compareChecks = document.querySelectorAll('.compare-checkbox');
    const compareTray = document.getElementById('compareTray');
    const compareList = document.getElementById('compareTrayList');
    if (compareChecks.length && compareTray) {
      let selected = [];
      compareChecks.forEach((chk) => {
        chk.addEventListener('change', () => {
          const name = chk.getAttribute('data-room-name');
          if (chk.checked) {
            if (selected.length >= 3) {
              chk.checked = false;
              showToast('You can compare up to 3 rooms at a time.');
              return;
            }
            selected.push(name);
          } else {
            selected = selected.filter((item) => item !== name);
          }
          compareTray.classList.toggle('is-active', selected.length > 0);
          if (compareList) {
            compareList.textContent = 'Comparing (' + selected.length + '/3): ' + selected.join(' • ');
          }
        });
      });
    }

    // Pricing Plan Duration Toggle (1 / 6 / 12 months)
    const durationBtns = document.querySelectorAll('[data-billing-months]');
    if (durationBtns.length) {
      durationBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const months = btn.getAttribute('data-billing-months');
          durationBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
          document.querySelectorAll('[data-price-1m]').forEach((priceEl) => {
            const p = priceEl.getAttribute('data-price-' + months + 'm');
            if (p) priceEl.textContent = '₹' + parseInt(p, 10).toLocaleString('en-IN');
          });
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. GALLERY CATEGORY FILTER & LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  function initGalleryAndLightbox() {
    const filterBtns = document.querySelectorAll('[data-gallery-filter]');
    const items = document.querySelectorAll('[data-gallery-cat]');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-gallery-filter');
        filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        items.forEach((item) => {
          const itemCat = item.getAttribute('data-gallery-cat');
          item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
        });
      });
    });

    const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
    if (!triggers.length) return;

    let modal = document.querySelector('.lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'lightbox-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Photo Lightbox');
      modal.innerHTML =
        '<div class="lightbox-content">' +
        '  <img src="" alt="" id="lightboxImg" width="900" height="600">' +
        '  <p class="lightbox-caption" id="lightboxCaption"></p>' +
        '  <div class="btn-group" style="margin-top:16px;">' +
        '    <button type="button" class="btn btn-ghost" id="lightboxPrev" style="color:#fff;">Previous</button>' +
        '    <button type="button" class="btn btn-primary" id="lightboxClose">Close</button>' +
        '    <button type="button" class="btn btn-ghost" id="lightboxNext" style="color:#fff;">Next</button>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    const imgEl = modal.querySelector('#lightboxImg');
    const capEl = modal.querySelector('#lightboxCaption');
    let currentIndex = 0;

    function showIndex(idx) {
      currentIndex = (idx + triggers.length) % triggers.length;
      const t = triggers[currentIndex];
      imgEl.src = t.getAttribute('data-lightbox-src');
      imgEl.alt = t.getAttribute('data-lightbox-caption') || 'Nestly Co-Living Photo';
      capEl.textContent = t.getAttribute('data-lightbox-caption') || '';
      modal.classList.add('is-open');
    }

    triggers.forEach((t, i) => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        showIndex(i);
      });
    });

    modal.querySelector('#lightboxClose').addEventListener('click', () => modal.classList.remove('is-open'));
    modal.querySelector('#lightboxPrev').addEventListener('click', () => showIndex(currentIndex - 1));
    modal.querySelector('#lightboxNext').addEventListener('click', () => showIndex(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') modal.classList.remove('is-open');
      if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
    });
  }

  /* ------------------------------------------------------------------------
     10. MULTI-STEP BOOKING WIZARD & CLIENT-SIDE FORM VALIDATION
     ------------------------------------------------------------------------ */
  function initBookingAndForms() {
    const wizard = document.getElementById('bookingWizard');
    if (wizard) {
      const steps = wizard.querySelectorAll('[data-wizard-step]');
      const indicators = document.querySelectorAll('[data-step-indicator]');
      let currentStep = 1;

      function showStep(stepNum) {
        currentStep = stepNum;
        steps.forEach((s) => {
          s.style.display = parseInt(s.getAttribute('data-wizard-step'), 10) === stepNum ? 'block' : 'none';
        });
        indicators.forEach((ind) => {
          const n = parseInt(ind.getAttribute('data-step-indicator'), 10);
          ind.classList.toggle('is-active', n <= stepNum);
        });
        updateBookingSummary();
      }

      indicators.forEach((ind) => {
        ind.style.cursor = 'pointer';
        ind.addEventListener('click', () => {
          const target = parseInt(ind.getAttribute('data-step-indicator'), 10);
          if (target && target <= 5) {
            showStep(target);
          }
        });
      });

      function updateBookingSummary() {
        const loc = document.getElementById('bookLocation');
        const room = document.getElementById('bookRoomType');
        const date = document.getElementById('bookMoveDate');
        const duration = document.getElementById('bookDuration');

        const sLoc = document.getElementById('summaryLocation');
        const sRoom = document.getElementById('summaryRoom');
        const sDate = document.getElementById('summaryDate');
        const sDur = document.getElementById('summaryDuration');

        if (sLoc && loc) sLoc.textContent = loc.value;
        if (sRoom && room) sRoom.textContent = room.value;
        if (sDate && date) sDate.textContent = date.value || '1st Next Month';
        if (sDur && duration) sDur.textContent = duration.value;
      }

      wizard.querySelectorAll('[data-next-step]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = parseInt(btn.getAttribute('data-next-step'), 10);
          const currentEl = wizard.querySelector('[data-wizard-step="' + currentStep + '"]');
          const requiredInputs = currentEl ? currentEl.querySelectorAll('[required]') : [];
          let valid = true;
          requiredInputs.forEach((inp) => {
            if (!inp.value.trim()) {
              inp.classList.add('is-invalid');
              valid = false;
            } else {
              inp.classList.remove('is-invalid');
            }
          });
          if (!valid) {
            showToast('Please fill in all required fields before continuing.');
            return;
          }
          showStep(next);
        });
      });

      wizard.querySelectorAll('[data-prev-step]').forEach((btn) => {
        btn.addEventListener('click', () => {
          showStep(parseInt(btn.getAttribute('data-prev-step'), 10));
        });
      });
    }

    // Generic validated forms (Contact, Newsletter, Auth, Comments)
    document.querySelectorAll('form[data-validate]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach((field) => {
          const val = field.value.trim();
          const isEmail = field.type === 'email';
          const emailOk = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          if (!val || !emailOk) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        });

        if (!valid) {
          showToast('Please check highlighted fields and try again.');
          return;
        }

        const redirectUrl = form.getAttribute('data-redirect');
        const successMsg = form.getAttribute('data-success-msg') || 'Submitted successfully! We will be in touch shortly.';
        showToast(successMsg);
        form.reset();

        if (redirectUrl) {
          localStorage.setItem('nestly_logged_in', 'true');
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 700);
        }
      });
    });

    // Show/hide password toggle on login/register
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle-password]');
      if (!btn) return;
      e.preventDefault();
      const targetId = btn.getAttribute('data-toggle-password');
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
      btn.classList.toggle('is-visible', isPass);
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPass ? 'none' : 'block';
        eyeClosed.style.display = isPass ? 'block' : 'none';
      } else if (!eyeOpen && !eyeClosed) {
        btn.textContent = isPass ? 'Hide' : 'Show';
      }
    });

    // RSVP buttons on Community & Home 2
    document.addEventListener('click', (e) => {
      const rsvpBtn = e.target.closest('[data-rsvp-btn]');
      if (!rsvpBtn) return;
      const joined = rsvpBtn.classList.toggle('is-joined');
      rsvpBtn.textContent = joined ? 'Spot Reserved ✓' : 'RSVP Free';
      showToast(joined ? 'You are on the guest list! Calendar invite sent.' : 'RSVP cancelled.');
    });
  }

  /* ------------------------------------------------------------------------
     11. COUNTDOWN TIMER (COMING SOON PAGE)
     ------------------------------------------------------------------------ */
  function initCountdown() {
    const daysEl = document.getElementById('cdDays');
    if (!daysEl) return;
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');
    const targetDate = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);

    function updateTimer() {
      const diff = Math.max(0, targetDate - new Date());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ------------------------------------------------------------------------
     12. RUNNING MODEL MARQUEE ENGINE (Guaranteed 60FPS continuous scrolling)
     ------------------------------------------------------------------------ */
  function initMarqueeEngine() {
    const strips = document.querySelectorAll('.marquee-strip');
    strips.forEach((strip) => {
      const track = strip.querySelector('.marquee-track');
      if (!track) return;

      // Duplicate children to ensure continuous infinite loop
      if (track.children.length < 24) {
        const items = Array.from(track.children);
        items.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }

      // Stop CSS animation so JavaScript provides reliable 60FPS continuous scrolling
      track.style.animation = 'none';

      let scrollX = 0;
      let animationFrameId;

      function step() {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const speed = isRtl ? -0.85 : 0.85;
        const halfWidth = track.scrollWidth / 2;

        if (halfWidth > 0) {
          scrollX += speed;
          if (!isRtl && scrollX >= halfWidth) {
            scrollX = 0;
          } else if (isRtl && Math.abs(scrollX) >= halfWidth) {
            scrollX = 0;
          }
          track.style.transform = `translate3d(${-scrollX}px, 0, 0)`;
        }
        animationFrameId = requestAnimationFrame(step);
      }

      animationFrameId = requestAnimationFrame(step);
    });
  }

  /* ------------------------------------------------------------------------
     13. INTERACTIVE HOUSE ARCHITECTURE FLOOR SELECTOR
     ------------------------------------------------------------------------ */
  function initFloorSelector() {
    const cards = document.querySelectorAll('.floor-selector-card');
    const source = document.getElementById('floorArchitectureSource');
    const img = document.getElementById('floorArchitectureImg');
    const badge = document.getElementById('floorBadgeOverlay');

    if (!cards.length || !img) return;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => {
          c.classList.remove('is-active');
          c.style.borderColor = '';
          c.style.background = '';
        });
        card.classList.add('is-active');
        card.style.borderColor = 'var(--teal)';
        card.style.background = 'rgba(20, 116, 111, 0.08)';

        const basePath = card.getAttribute('data-floor-img');
        const badgeText = card.getAttribute('data-floor-badge');

        if (basePath) {
          if (source) source.srcset = basePath + '.webp';
          img.src = basePath + '.jpg';
        }
        if (badge && badgeText) {
          badge.textContent = badgeText;
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     INITIALIZE ON DOM READY
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initNavigation();
    initMarqueeEngine();
    initTiltCards();
    initRevealAndCounters();
    initTabsAndAccordions();
    initHome2Widgets();
    initRoomsAndPricing();
    initGalleryAndLightbox();
    initBookingAndForms();
    initCountdown();
    initFloorSelector();
  });
})();
