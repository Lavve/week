importScripts("js/week-utils.js");

function updateWeekNumberInAction() {
  const weekNumber = getIsoWeekNumber();
  chrome.action.setIcon({ path: { 128: `weeks/${weekNumber}.png` } });
  chrome.action.setTitle({ title: `Week ${weekNumber}` });
}

chrome.runtime.onInstalled.addListener(() => {
  updateWeekNumberInAction();
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    updateWeekNumberInAction();
  }
});
