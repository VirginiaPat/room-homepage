/**
 * Mobile hamburger menu, implemented with the native <dialog> element.
 * Handles opening/closing via buttons, backdrop click, and Escape
 * (native <dialog> behavior), plus focus return and body scroll lock.
 *
 * @module hamburger
 */

import { hamburgerDom, validateDom } from "./dom";

/**
 * Initializes the hamburger menu. No-ops (with a console warning) if
 * any required DOM element is missing.
 *
 * @returns {void}
 */
export const initHamburgerMenu = () => {
  if (validateDom(hamburgerDom)) {
    /**
     * Opens the menu dialog as a modal, locks body scroll, and
     * updates the open button's aria-expanded state.
     *
     * @returns {void}
     */
    const openHamMenu = () => {
      hamburgerDom.hamMenuDialog.showModal();
      document.body.style.overflow = "hidden";
      hamburgerDom.openMenuButton.setAttribute("aria-expanded", "true");
    };

    /**
     * Closes the menu dialog. Cleanup (scroll unlock, aria-expanded,
     * focus return) happens in the dialog's native "close" listener
     * below, so this stays in sync regardless of how the dialog closes
     * (button click, backdrop click, or Escape key).
     *
     * @returns {void}
     */
    const closeHamMenu = () => {
      hamburgerDom.hamMenuDialog.close();
    };

    hamburgerDom.openMenuButton.addEventListener("click", openHamMenu);
    hamburgerDom.closeMenuButton.addEventListener("click", () => {
      closeHamMenu();
    });

    // Close when clicking the backdrop: a click on the dialog's
    // ::backdrop bubbles with e.target === the dialog element itself,
    // never a descendant, so this only fires for backdrop clicks.
    hamburgerDom.hamMenuDialog.addEventListener("click", (e) => {
      if (e.target === hamburgerDom.hamMenuDialog) {
        closeHamMenu();
      }
    });

    // Fires for every close path (button, backdrop, Escape), so this
    // is the single source of truth for "menu just closed" cleanup.
    hamburgerDom.hamMenuDialog.addEventListener("close", () => {
      document.body.style.overflow = "";
      hamburgerDom.openMenuButton.setAttribute("aria-expanded", "false");
      hamburgerDom.openMenuButton.focus();
    });
  } else {
    console.warn(
      "[hamburger.js] Hamburger menu disabled — one or more required elements were not found.",
    );
  }
};
