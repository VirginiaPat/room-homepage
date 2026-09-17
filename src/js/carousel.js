import { carouselDom, validateDom } from "./dom";

export const initCarousel = () => {
  if (validateDom(carouselDom)) {
    const autoplayDelay =
      Number(carouselDom.slider.dataset.autoplayDelay) || 3000;
    const prefersReducemotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let currentIndex = carouselDom.slideEls.findIndex((slide) =>
      slide.classList.contains("is-active"),
    );
    if (currentIndex === -1) currentIndex = 0;
    let autoplayId = null;

    const goToSlide = (index) => {
      const nextIndex =
        (index + carouselDom.slideEls.length) % carouselDom.slideEls.length;
      if (nextIndex === currentIndex) return;

      const outgoingSlide = carouselDom.slideEls[currentIndex];
      const outgoingContent = carouselDom.allSlidesContentArray[currentIndex];
      const incomingSlide = carouselDom.slideEls[nextIndex];
      const incomingContent = carouselDom.allSlidesContentArray[nextIndex];

      // Reveal the incoming slide so it's part of the crossfade, then
      // let the opacity transition play before hiding the outgoing one.
      incomingSlide.classList.remove("hidden");
      incomingSlide.setAttribute("tabindex", "0");
      incomingSlide.querySelector("a")?.setAttribute("tabindex", "0");

      incomingContent.classList.remove("hidden");
      incomingContent.classList.add("flex");
      incomingContent.setAttribute("tabindex", "0");
      incomingContent.querySelector("a")?.setAttribute("tabindex", "0");

      requestAnimationFrame(() => {
        outgoingSlide.classList.remove("is-active");
        outgoingContent.classList.remove("is-active");

        incomingSlide.classList.add("is-active");
        incomingContent.classList.add("is-active");
      });

      outgoingSlide.addEventListener(
        "transitionend",
        () => {
          if (!outgoingSlide.classList.contains("is-active")) {
            outgoingSlide.classList.add("hidden");
            outgoingContent.classList.remove("flex");
            outgoingContent.classList.add("hidden");
          }
        },
        { once: true },
      );

      currentIndex = nextIndex;
    };

    const goToNext = () => {
      goToSlide(currentIndex + 1);
    };

    const goToPrev = () => {
      goToSlide(currentIndex - 1);
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(goToNext, autoplayDelay);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    const bindEvents = () => {
      carouselDom.prevButton.addEventListener("click", goToPrev);
      carouselDom.nextButton.addEventListener("click", goToNext);

      carouselDom.slider.addEventListener("mouseenter", stopAutoplay);
      carouselDom.slider.addEventListener("mouseleave", () => {
        if (!prefersReducemotion) startAutoplay();
      });

      carouselDom.slider.addEventListener("focusin", stopAutoplay);
      carouselDom.slider.addEventListener("focusout", () => {
        if (!prefersReducemotion) startAutoplay();
      });

      carouselDom.slider.addEventListener("keydown", handleKeyDown);
    };

    bindEvents();
    if (!prefersReducemotion) startAutoplay();
  } else {
    console.warn(
      "[carousel.js] Carousel disabled — one or more required elements were not found.",
    );
  }
};
