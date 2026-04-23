/**
 * Popup-logik: visar aktuellt ISO-veckonummer i popup-vyn.
 */
(() => {
  const weekParagraph = document.querySelector("#week");
  const extNameEl = document.querySelector("#ext-name");

  /**
   * Räknar ut ISO 8601-veckonummer för "idag" (vecka 1 = veckan med årets första torsdag).
   */
  function getIsoWeekNumber() {
    const now = new Date();
    const mondayIndex = (now.getDay() + 6) % 7;
    now.setDate(now.getDate() - mondayIndex + 3);
    const thursdayThisWeek = now.valueOf();
    now.setMonth(0, 1);
    if (now.getDay() !== 4) {
      now.setMonth(0, 1 + (4 - now.getDay() + 7) % 7);
    }
    const firstThursday = now.valueOf();
    return 1 + Math.ceil((thursdayThisWeek - firstThursday) / 604800000);
  }

  const currentWeek = getIsoWeekNumber();
  if (!weekParagraph) {
    return;
  }

  weekParagraph.textContent = String(currentWeek);

  if (extNameEl) {
    extNameEl.textContent = "Week";
  }
})();
