/**
 * Cached DOM references for the page's interactive features, grouped
 * by feature so each module can validate only the elements it needs.
 *
 * @module dom
 */

/**
 * DOM elements required by the hamburger menu.
 * @type {Record<string, Element | null>}
 */
export const hamburgerDom = {
  openMenuButton: document.getElementById("open-menu-button"),
  hamMenuDialog: document.getElementById("ham-menu-dialog"),
  closeMenuButton: document.getElementById("close-menu-button"),
};

/**
 * DOM elements required by the hero carousel.
 * @type {Record<string, Element | Element[] | null>}
 */
export const carouselDom = {
  slider: document.getElementById("carousel-slider"),
  track: document.getElementById("carousel-slider-track"),
  slides: [
    ...(document.getElementById("carousel-slider-track")?.children ?? []),
  ].map((slide) => ({
    slideEl: slide,
    contentEl: document.getElementById(slide.getAttribute("aria-describedby")),
  })),

  prevButton: document.getElementById("previous-slide-button"),
  nextButton: document.getElementById("next-slide-button"),
  toggleAutoplayButton: document.getElementById("toggle-autoplay-button"),
  pauseIcon: document.getElementById("pause-icon"),
  playIcon: document.getElementById("play-icon"),
};

/**
 * Validates that all expected DOM elements were found, and warns in the
 * console for any key whose value is missing (null) or an empty array.
 * For array values whose items are `{ slideEl, contentEl }` pairs (as in
 * `carouselDom.slides`), also validates that each pair's own elements
 * were found — this catches a broken `aria-describedby` link that would
 * otherwise silently produce a `null` `contentEl`.
 *
 * @param {Record<string, Element | Element[] | null>} domObj - Object mapping
 *   descriptive keys to DOM elements (or element arrays) that should exist on the page.
 * @returns {boolean} true if every element was found, false otherwise.
 */
export const validateDom = (domObj) => {
  let isValid = true;

  for (const [key, value] of Object.entries(domObj)) {
    const isMissing = !value;
    const isEmptyList = value instanceof Array && value.length === 0;

    if (isMissing || isEmptyList) {
      console.warn(`[dom.js] Missing element for key: "${key}"`);
      isValid = false;
      continue;
    }

    if (value instanceof Array) {
      value.forEach((item, index) => {
        if (
          item &&
          typeof item === "object" &&
          ("slideEl" in item || "contentEl" in item)
        ) {
          if (!item.slideEl || !item.contentEl) {
            console.warn(
              `[dom.js] Missing element for key: "${key}[${index}]" ` +
                `(check that its "aria-describedby" matches an existing id)`,
            );
            isValid = false;
          }
        }
      });
    }
  }

  return isValid;
};
