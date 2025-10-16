document.addEventListener('DOMContentLoaded', () => {
  // دالة تحميل كومبوننت خارجي
  function loadComponent(id, file) {
    const mount = document.getElementById(id);
    if (!mount) return Promise.resolve(null);
    return fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`${file} fetch failed: ${res.status}`);
        return res.text();
      })
      .then(html => {
        mount.innerHTML = html;
        return mount;
      })
      .catch(err => {
        console.error('Error loading component', file, err);
        mount.innerHTML = `<!-- failed to load ${file} -->`;
        return mount;
      });
  }

  // تهيئة الـ FAQ
  function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item, idx) => {
      const btn = item.querySelector('.faq-question');
      const ans = item.querySelector('.faq-answer');
      if (!btn || !ans) return;

      // امنع التهيئة المتكررة
      if (btn._faqInit) return;
      btn._faqInit = true;

      // اضبط aria attributes
      if (!ans.id) ans.id = `faq-answer-${idx + 1}`;
      btn.setAttribute('aria-controls', ans.id);
      btn.setAttribute('aria-expanded', 'false');
      ans.setAttribute('aria-hidden', 'true');

      // كليك على السؤال
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = item.classList.contains('active');

        // اقفل أي عنصر مفتوح غيره (لو عايز multiple مفتوحين شيل الجزء ده)
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            closeFAQItem(other);
          }
        });

        if (isActive) {
          closeFAQItem(item);
        } else {
          openFAQItem(item);
        }
      });
    });

    // اعادة حساب الطول عند الريسايز
    window.addEventListener('resize', () => {
      faqItems.forEach(item => {
        if (item.classList.contains('active')) {
          const ans = item.querySelector('.faq-answer');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  function openFAQItem(item) {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    item.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    ans.setAttribute('aria-hidden', 'false');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }

  function closeFAQItem(item) {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    ans.style.maxHeight = '0px';
    item.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    ans.setAttribute('aria-hidden', 'true');
  }

  // مثال تحميل faq.html ثم التهيئة
  loadComponent('faq', 'components/faq.html').then(() => {
    initFAQToggle();
  });

  // fallback: event delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    if (item) {
      const isActive = item.classList.contains('active');
      if (isActive) {
        closeFAQItem(item);
      } else {
        openFAQItem(item);
      }
    }
  });
});
