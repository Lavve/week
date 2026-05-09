/**
 * Popup-logik: visar aktuellt ISO-veckonummer i popup-vyn.
 */
(() => {
	const DATE_FORMAT_STORAGE_KEY = "dateFormat";
	const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";

	const weekParagraph = document.querySelector("#week");
	const extNameEl = document.querySelector("#ext-name");
	const versionEl = document.querySelector(".version");
	const weekContainer = document.querySelector("#week-container");
	const settingsContainer = document.querySelector("#settings-container");
	const popupFooterButton = document.querySelector(".popup-footer-button");
	const popupSelect = document.querySelector(".popup-select");
	const dateEl = document.querySelector("#date");
	const settingsIcon = document.querySelector("#settings-icon");
	const backIcon = document.querySelector("#back-icon");

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

	const updateDate = () => {
		if (!dateEl || !popupSelect) {
			return;
		}
		dateEl.textContent = getDateString(popupSelect.value);
	};

	const loadSavedDateFormat = async () => {
		if (!popupSelect) {
			return;
		}

		try {
			const savedSettings = await chrome.storage.sync.get({
				[DATE_FORMAT_STORAGE_KEY]: DEFAULT_DATE_FORMAT,
			});
			popupSelect.value = savedSettings[DATE_FORMAT_STORAGE_KEY];
		} catch (error) {
			popupSelect.value = DEFAULT_DATE_FORMAT;
			console.error("Failed to load date format from storage.", error);
		}

		updateDate();
	};

	const setView = (showSettings) => {
		weekContainer.style.display = showSettings ? "none" : "flex";
		settingsContainer.style.display = showSettings ? "flex" : "none";
		settingsIcon.style.display = showSettings ? "none" : "block";
		backIcon.style.display = showSettings ? "block" : "none";
	};

	if (popupFooterButton) {
		popupFooterButton.addEventListener("click", () => {
			const isSettingsVisible = settingsContainer.style.display === "flex";
			setView(!isSettingsVisible);
		});
	}

	if (popupSelect) {
		popupSelect.addEventListener("change", async () => {
			try {
				await chrome.storage.sync.set({
					[DATE_FORMAT_STORAGE_KEY]: popupSelect.value,
				});
			} catch (error) {
				console.error("Failed to save date format to storage.", error);
			}

			updateDate();
			setView(false);
		});
	}

	loadSavedDateFormat();
})();
