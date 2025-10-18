document.addEventListener('DOMContentLoaded', () => {
  // تحميل أي كومبوننت وإرجاع Promise بعد الإدخال
  function loadComponent(id, file) {
    const mount = document.getElementById(id);
    if (!mount) return Promise.resolve(null); // لو مش موجود الماونت نتجاهل
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

  // تهيئة سلوك الـ navbar (idempotent)
  function initNavbarToggle() {
    const toggleBtn = document.getElementById('menu-toggle') || document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('nav-links') || document.querySelector('.nav-links');

    if (!toggleBtn || !navLinks) return; // لو مش موجودين خلاص

    // لو الشغل اتعمل قبل كده منعا لتكرار listeners
    if (toggleBtn._navbarInit) return;
    toggleBtn._navbarInit = true;

    // اضف الـ aria attribute لو مش موجود
    if (!toggleBtn.hasAttribute('aria-expanded')) toggleBtn.setAttribute('aria-expanded', 'false');

    // زرار الفتح/الغلق
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // مهم: عشان ما توصلش للـ document click اللي يقفل المينيو
      const opened = navLinks.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });

    // لو ضغط المستخدم على لينك داخل المينيو نقفل المينيو (سلوك موبايل)
    navLinks.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // لو ضغط المستخدم بره المينيو نقفلها
    document.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // optional: اغلاق بالـ Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // حمّل الـ components وبعدين نهيئ الـ navbar
  loadComponent('navbar', 'components/navbar.html').then(() => {
    initNavbarToggle();
  });

  loadComponent('footer', 'components/footer.html');

  // كـ fallback: لو حصل click على زرار قبل الinit، التعامل هنا (event delegation)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('#menu-toggle, .menu-toggle');
    if (!t) return;
    const nav = document.getElementById('nav-links') || document.querySelector('.nav-links');
    if (nav) {
      const opened = nav.classList.toggle('active');
      try { t.setAttribute('aria-expanded', opened ? 'true' : 'false'); } catch {}
    }
  });
});
                          