function initBestSwiper() {
  if (typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        480: { slidesPerView: 1, centeredSlides: false },
        768: { slidesPerView: 4 , centeredSlides: false },
      },
    });
  } else {
    console.error("Swiper library not loaded!");
  }
}
