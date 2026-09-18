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
 * `slideEls` and `allSlidesContentArray` are read once at module load,
 * so they only reflect slides present in the HTML at page load —
 * slides added to the DOM later would not appear here.
 *
 * @type {Record<string, Element | Element[] | null>}
 */
export const carouselDom = {
  slider: document.getElementById("carousel-slider"),
  track: document.getElementById("carousel-slider-track"),
  slideEls: [
    ...(document.getElementById("carousel-slider-track")?.children ?? []),
  ],
  prevButton: document.getElementById("previous-slide-button"),
  nextButton: document.getElementById("next-slide-button"),

  slidesContentBox: document.getElementById("slides-content-container"),
  allSlidesContentArray: [
    ...(document.getElementById("slides-content-container")?.children ?? []),
  ],
};

/**
 * Validates that all expected DOM elements were found, and warns in the
 * console for any key whose value is missing (null) or an empty array.
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
    }
  }

  return isValid;
};
