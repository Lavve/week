/**
 * Popup-logik: visar aktuellt ISO-veckonummer i popup-vyn.
 */
(() => {
  const weekParagraph = document.querySelector("#week");
  const extNameEl = document.querySelector("#ext-name");
  const versionEl = document.querySelector(".version");

  if (!weekParagraph) {
    return;
  }

  const currentWeek = getIsoWeekNumber();
  weekParagraph.textContent = String(currentWeek);

  if (extNameEl) {
    extNameEl.textContent = "Week";
  }

  if (versionEl) {
    versionEl.textContent = `v${chrome.runtime.getManifest().version}`;
  }
})();
