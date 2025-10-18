// assets/js/script.js
document.addEventListener("DOMContentLoaded", () => {
  function loadComponent(id, file, callback) {
    const mount = document.getElementById(id);
    if (!mount) return;
    fetch(file)
      .then((res) => (res.ok ? res.text() : Promise.reject(res)))
      .then((html) => {
        mount.innerHTML = html;
        if (typeof callback === "function") callback();
      })
      .catch((err) => {
        console.error(`Error loading ${file}:`, err);
        mount.innerHTML = `<!-- ${file} failed to load -->`;
      });
  }

  // استدعاءات
  loadComponent("navbar", "components/navbar.html");
  loadComponent("offers", "components/offers.html");
  loadComponent("banner", "components/banner.html");
  loadComponent("banner2", "components/banner2.html");
  loadComponent("fqa", "components/fqa.html");
  loadComponent("footer", "components/footer.html");
  loadComponent("main_banner", "components/main_banner.html");
  loadComponent("category", "components/category.html" , () => {
    if (typeof initBestSwiper === "function") {
      initBestSwiper();
    }
  });

  loadComponent("best", "components/best.html", () => {
    if (typeof initBestSwiper === "function") {
      initBestSwiper();
    }
  });
 
});
