import { hamburgerDom, validateDom } from "./dom";

export const initHamburgerMenu = () => {
  if (validateDom(hamburgerDom)) {
    const openHamMenu = () => {
      hamburgerDom.hamMenuDialog.showModal();
      document.body.style.overflow = "hidden";
      hamburgerDom.openMenuButton.setAttribute("aria-expanded", "true");
    };

    const closeHamMenu = () => {
      hamburgerDom.hamMenuDialog.close();
    };

    hamburgerDom.openMenuButton.addEventListener("click", openHamMenu);
    hamburgerDom.closeMenuButton.addEventListener("click", () => {
      closeHamMenu();
    });

    hamburgerDom.hamMenuDialog.addEventListener("click", (e) => {
      if (e.target === hamburgerDom.hamMenuDialog) {
        closeHamMenu();
      }
    });

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
