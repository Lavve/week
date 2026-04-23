importScripts("js/week-utils.js");

const ICON_SIZES = [16, 32, 48, 128];
const FONT_FAMILY = "MuseoModerno, Arial, sans-serif";

async function createWeekIconImageData(weekNumber, iconSize) {
  const weekLabel = String(weekNumber);
  const canvas = new OffscreenCanvas(iconSize, iconSize);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not acquire 2D context for icon rendering.");
  }

  // Base card gradient.
  const backgroundGradient = context.createLinearGradient(0, 0, 0, iconSize);
  backgroundGradient.addColorStop(0, "#688404");
  backgroundGradient.addColorStop(1, "#1d2c0b");
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, iconSize, iconSize);

  // Calendar "rings" at top.
  const ringWidth = iconSize * 0.16;
  const ringHeight = iconSize * 0.18;
  const leftRingX = iconSize * 0.22;
  const rightRingX = iconSize * 0.62;
  const ringGradient = context.createLinearGradient(0, 0, 0, ringHeight);
  ringGradient.addColorStop(0, "#ffffff");
  ringGradient.addColorStop(1, "#939393");
  context.fillStyle = ringGradient;
  context.fillRect(leftRingX, 0, ringWidth, ringHeight);
  context.fillRect(rightRingX, 0, ringWidth, ringHeight);
  context.strokeStyle = "#000000";
  context.lineWidth = Math.max(1, Math.round(iconSize * 0.02));
  context.strokeRect(leftRingX, 0, ringWidth, ringHeight);
  context.strokeRect(rightRingX, 0, ringWidth, ringHeight);

  // Week number text.
  const fontSize = iconSize * 0.7;
  const textY = iconSize * 0.62;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `700 ${Math.round(fontSize)}px ${FONT_FAMILY}`;
  context.strokeStyle = "rgba(255, 255, 255, 0.5)";
  context.lineJoin = "round";
  context.lineWidth = Math.max(1, Math.round(iconSize * 0.06));
  context.fillStyle = "#ffffff";
  context.strokeText(weekLabel, iconSize / 2, textY);
  context.fillText(weekLabel, iconSize / 2, textY);

  return context.getImageData(0, 0, iconSize, iconSize);
}

async function updateWeekNumberInAction() {
  const weekNumber = getIsoWeekNumber();
  chrome.action.setBadgeText({ text: "" });
  chrome.action.setTitle({ title: `Week ${weekNumber}` });

  try {
    const iconImageData = {};
    for (const iconSize of ICON_SIZES) {
      iconImageData[iconSize] = await createWeekIconImageData(weekNumber, iconSize);
    }
    await chrome.action.setIcon({ imageData: iconImageData });
  } catch (error) {
		await chrome.action.setIcon({ path: { 128: `weeks/${weekNumber}.png` } });
    console.error("Failed to render dynamic SVG icon.", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  updateWeekNumberInAction().catch((error) => {
    console.error("Failed to update week icon on install.", error);
  });
});

chrome.runtime.onStartup.addListener(() => {
  updateWeekNumberInAction().catch((error) => {
    console.error("Failed to update week icon on startup.", error);
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    updateWeekNumberInAction().catch((error) => {
      console.error("Failed to update week icon on window focus.", error);
    });
  }
});

updateWeekNumberInAction().catch((error) => {
  console.error("Failed to update week icon when service worker started.", error);
});
