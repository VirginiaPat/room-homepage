/**
 * Hero carousel with crossfading image + text slides, keyboard
 * navigation, and autoplay that pauses on hover/focus and respects
 * prefers-reduced-motion.
 *
 * @module carousel
 */

import { carouselDom, validateDom } from "./dom";

/**
 * Initializes the hero carousel. No-ops (with a console warning) if
 * any required DOM element is missing.
 *
 * @returns {void}
 */
export const initCarousel = () => {
  if (validateDom(carouselDom)) {
    const autoplayDelay =
      Number(carouselDom.slider.dataset.autoplayDelay) || 3000;
    const prefersReducemotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /** @type {number} Index of the currently active slide. */
    let currentIndex = carouselDom.slideEls.findIndex((slide) =>
      slide.classList.contains("is-active"),
    );
    if (currentIndex === -1) currentIndex = 0;

    /** @type {number | null} Interval ID for autoplay, or null when stopped. */
    let autoplayId = null;

    /**
     * Transitions the carousel to the slide at the given index,
     * wrapping around at either end. Crossfades both the image slide
     * and its matching text content together, and no-ops if the
     * target index is already active.
     *
     * @param {number} index - Target slide index (may be out of
     *   [0, length) range; wraps via modulo).
     * @returns {void}
     */
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

      // Deferred one frame so the browser paints the "revealed but
      // still faded out" state first, guaranteeing the opacity
      // transition actually animates instead of jumping instantly.
      requestAnimationFrame(() => {
        outgoingSlide.classList.remove("is-active");
        outgoingContent.classList.remove("is-active");

        incomingSlide.classList.add("is-active");
        incomingContent.classList.add("is-active");
      });

      // Hide the outgoing slide only after its fade-out transition
      // finishes, so it doesn't disappear abruptly mid-animation.
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

    /**
     * Advances to the next slide (wraps to the first after the last).
     * @returns {void}
     */
    const goToNext = () => {
      goToSlide(currentIndex + 1);
    };

    /**
     * Goes back to the previous slide (wraps to the last from the first).
     * @returns {void}
     */
    const goToPrev = () => {
      goToSlide(currentIndex - 1);
    };

    /**
     * Stops autoplay, if currently running.
     * @returns {void}
     */
    const stopAutoplay = () => {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    /**
     * Starts autoplay, clearing any existing interval first so
     * repeated calls don't stack multiple timers.
     * @returns {void}
     */
    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(goToNext, autoplayDelay);
    };

    /**
     * Keyboard navigation: Left/Right arrow keys move between slides.
     * @param {KeyboardEvent} e
     * @returns {void}
     */
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    /**
     * Wires up all carousel event listeners: button clicks, keyboard
     * navigation, and autoplay pause/resume on hover and keyboard focus
     * (covering both mouse-only and keyboard-only users).
     * @returns {void}
     */
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
