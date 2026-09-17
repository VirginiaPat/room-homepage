export const hamburgerDom = {
  openMenuButton: document.getElementById("open-menu-button"),
  hamMenuDialog: document.getElementById("ham-menu-dialog"),
  closeMenuButton: document.getElementById("close-menu-button"),
};
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
