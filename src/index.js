/**
 * Cached references to DOM elements
 */
const dom = {
  openMenuButton: document.getElementById("open-menu-button"),
  hamMenuDialog: document.getElementById("ham-menu-dialog"),
  closeMenuButton: document.getElementById("close-menu-button"),
};

/**
 * Validates that all expected DOM elements were found, and warns in the
 * console for any key whose value is missing (null) or an empty NodeList.
 *
 * @param {Record<string, Element | NodeList | null>} domObj - Object mapping
 *   descriptive keys to DOM elements (or NodeLists) that should exist on the page.
 * @returns {boolean} true if every element was found, false otherwise.
 */
const validateDom = (domObj) => {
  let isValid = true;

  for (const [key, value] of Object.entries(domObj)) {
    const isMissing = !value;
    const isEmptyList = value instanceof NodeList && value.length === 0;

    if (isMissing || isEmptyList) {
      console.warn(`[dom.js] Missing element for key: "${key}"`);
      isValid = false;
    }
  }

  return isValid;
};

if (validateDom(dom)) {
  const openHamMenu = () => {
    dom.hamMenuDialog.showModal();
    document.body.style.overflow = "hidden";
    dom.openMenuButton.setAttribute("aria-expanded", "true");
  };

  const closeHamMenu = () => {
    dom.hamMenuDialog.close();
  };

  dom.openMenuButton.addEventListener("click", openHamMenu);
  dom.closeMenuButton.addEventListener("click", closeHamMenu);

  dom.hamMenuDialog.addEventListener("click", (e) => {
    if (e.target === dom.hamMenuDialog) {
      closeHamMenu();
    }
  });

  dom.hamMenuDialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    dom.openMenuButton.setAttribute("aria-expanded", "false");
    dom.openMenuButton.focus();
  });
} else {
  console.warn(
    "[index.js] Hamburger menu disabled — one or more required elements were not found.",
  );
}
