/**
 * Entry point for the Room homepage.
 * Wires up all page features once the DOM is ready.
 *
 * @module index
 */

import { initHamburgerMenu } from "./hamburger";
import { initCarousel } from "./carousel";

/**
 * Initializes all interactive features of the page.
 * Each feature module is responsible for validating its own
 * required DOM elements before attaching behavior.
 *
 * @returns {void}
 */
const init = () => {
  initHamburgerMenu();
  initCarousel();
};

document.addEventListener("DOMContentLoaded", init);
