import { initHamburgerMenu } from "./hamburger";
import { initCarousel } from "./carousel";

const init = () => {
  initHamburgerMenu();
  initCarousel();
};

document.addEventListener("DOMContentLoaded", init);
