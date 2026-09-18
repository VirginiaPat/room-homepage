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
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /** @type {number} Index of the currently active slide. */
    let currentIndex = carouselDom.slides.findIndex((s) =>
      s.slideEl.classList.contains("is-active"),
    );
    if (currentIndex === -1) currentIndex = 0;

    /** @type {number | null} Interval ID for autoplay, or null when stopped. */
    let autoplayId = null;

    /** @type {boolean} True once the user has explicitly paused via the toggle button. */
    let isPausedByUser = false;

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
        (index + carouselDom.slides.length) % carouselDom.slides.length;
      if (nextIndex === currentIndex) return;

      const outgoing = carouselDom.slides[currentIndex];
      const incoming = carouselDom.slides[nextIndex];

      const outgoingSlide = outgoing.slideEl;
      const outgoingContent = outgoing.contentEl;
      const incomingSlide = incoming.slideEl;
      const incomingContent = incoming.contentEl;

      // Reveal the incoming slide so it's part of the crossfade, then
      // let the opacity transition play before hiding the outgoing one.
      incomingSlide.classList.remove("hidden");
      incomingContent.classList.remove("hidden");
      incomingContent.classList.add("flex");

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
     * repeated calls don't stack multiple timers. No-ops if the user
     * has explicitly paused the carousel via the toggle button.
     * @returns {void}
     */
    const startAutoplay = () => {
      if (isPausedByUser) return;
      stopAutoplay();
      autoplayId = setInterval(goToNext, autoplayDelay);
    };

    /**
     * Toggles the user-facing pause state, syncing the button's
     * aria-pressed/aria-label and icon, and stopping or resuming
     * autoplay accordingly. This is independent from the transient
     * hover/focus pausing below: once the user pauses here, hover/focus
     * leaving the carousel must not silently resume it.
     * @returns {void}
     */
    const toggleAutoplay = () => {
      isPausedByUser = !isPausedByUser;

      if (isPausedByUser) {
        stopAutoplay();
        carouselDom.toggleAutoplayButton.setAttribute(
          "aria-label",
          "Play slideshow",
        );
        carouselDom.toggleAutoplayButton.setAttribute("aria-pressed", "true");
      } else {
        startAutoplay();
        carouselDom.toggleAutoplayButton.setAttribute(
          "aria-label",
          "Pause slideshow",
        );
        carouselDom.toggleAutoplayButton.setAttribute("aria-pressed", "false");
      }

      carouselDom.pauseIcon.classList.toggle("hidden", isPausedByUser);
      carouselDom.playIcon.classList.toggle("hidden", !isPausedByUser);
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
      carouselDom.toggleAutoplayButton.addEventListener(
        "click",
        toggleAutoplay,
      );

      carouselDom.slider.addEventListener("mouseenter", stopAutoplay);
      carouselDom.slider.addEventListener("mouseleave", () => {
        if (!prefersReducedMotion) startAutoplay();
      });

      carouselDom.slider.addEventListener("focusin", stopAutoplay);
      carouselDom.slider.addEventListener("focusout", () => {
        if (!prefersReducedMotion) startAutoplay();
      });

      carouselDom.slider.addEventListener("keydown", handleKeyDown);
    };

    bindEvents();
    if (!prefersReducedMotion) startAutoplay();
  } else {
    console.warn(
      "[carousel.js] Carousel disabled — one or more required elements were not found.",
    );
  }
};
