/* ===========================
   GateCHA Landing Page Scripts
   =========================== */

(function () {
  'use strict';

  // --- Mobile Navigation Toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('nav-open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Nav Link Highlighting ---
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          var active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // --- Tab Switching (Installation) ---
  var tabList = document.querySelector('[role="tablist"]');

  if (tabList) {
    var tabs = tabList.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Deactivate all
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.hidden = true; });

        // Activate clicked
        this.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(this.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      });
    });

    // Keyboard navigation for tabs
    tabList.addEventListener('keydown', function (e) {
      var currentTab = document.activeElement;
      var tabArray = Array.from(tabs);
      var index = tabArray.indexOf(currentTab);

      if (index === -1) return;

      var newIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabArray.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabArray.length) % tabArray.length;
      } else {
        return;
      }

      e.preventDefault();
      tabArray[newIndex].click();
      tabArray[newIndex].focus();
    });
  }

  // --- Copy to Clipboard ---
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var codeBlock = this.closest('.code-block');
      var code = codeBlock ? codeBlock.querySelector('code') : null;
      if (!code) return;

      var text = code.textContent;
      var button = this;

      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied!';
        setTimeout(function () { button.textContent = 'Copy'; }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          button.textContent = 'Copied!';
          setTimeout(function () { button.textContent = 'Copy'; }, 2000);
        } catch (err) {
          button.textContent = 'Error';
          setTimeout(function () { button.textContent = 'Copy'; }, 2000);
        }
        document.body.removeChild(textarea);
      });
    });
  });

  // --- FAQ Accordion Animation ---
  document.querySelectorAll('.faq-item').forEach(function (details) {
    var summary = details.querySelector('summary');
    var content = details.querySelector('.faq-answer');

    if (!summary || !content) return;

    summary.addEventListener('click', function (e) {
      e.preventDefault();

      if (details.open) {
        // Closing
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.overflow = 'hidden';
        requestAnimationFrame(function () {
          content.style.maxHeight = '0';
          content.style.paddingBottom = '0';
        });
        var onClose = function () {
          details.open = false;
          content.style.maxHeight = '';
          content.style.overflow = '';
          content.style.paddingBottom = '';
          content.removeEventListener('transitionend', onClose);
        };
        content.addEventListener('transitionend', onClose);
      } else {
        // Opening
        details.open = true;
        var height = content.scrollHeight;
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.paddingBottom = '0';
        requestAnimationFrame(function () {
          content.style.maxHeight = height + 'px';
          content.style.paddingBottom = '';
        });
        var onOpen = function () {
          content.style.maxHeight = '';
          content.style.overflow = '';
          content.removeEventListener('transitionend', onOpen);
        };
        content.addEventListener('transitionend', onOpen);
      }
    });
  });

  // Add transition to FAQ answers for smooth animation
  var style = document.createElement('style');
  style.textContent = '.faq-answer { transition: max-height 0.3s ease, padding-bottom 0.3s ease; }';
  document.head.appendChild(style);

})();
