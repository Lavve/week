(() => {
  const DATE_FORMAT_STORAGE_KEY = 'dateFormat';
  const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

  const doc = document;
  const weekParagraph = doc.querySelector('#week');
  const extNameEl = doc.querySelector('#ext-name');
  const versionEl = doc.querySelector('.version');
  const weekContainer = doc.querySelector('#week-container');
  const settingsContainer = doc.querySelector('#settings-container');
  const popupFooterButton = doc.querySelector('.popup-footer-button');
  const popupSelect = doc.querySelector('.popup-select');
  const dateEl = doc.querySelector('#date');
  const dateRangeEl = doc.querySelector('#date-range');
  const settingsIcon = doc.querySelector('#settings-icon');
  const backIcon = doc.querySelector('#back-icon');

  if (!weekParagraph) {
    return;
  }

  const currentWeek = getIsoWeekNumber();
  weekParagraph.textContent = String(currentWeek);

  if (extNameEl) {
    extNameEl.textContent = 'Week';
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

  const updateDateRange = () => {
    if (!dateRangeEl || !popupSelect) {
      return;
    }
    dateRangeEl.textContent = getDateRangeString(popupSelect.value);
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
      console.error('Failed to load date format from storage.', error);
    }

    updateDate();
    updateDateRange();
  };

  const setView = (showSettings) => {
    weekContainer.style.display = showSettings ? 'none' : 'flex';
    settingsContainer.style.display = showSettings ? 'flex' : 'none';
    settingsIcon.style.display = showSettings ? 'none' : 'block';
    backIcon.style.display = showSettings ? 'block' : 'none';
  };

  if (popupFooterButton) {
    popupFooterButton.addEventListener('click', () => {
      const isSettingsVisible = settingsContainer.style.display === 'flex';
      setView(!isSettingsVisible);
    });
  }

  if (popupSelect) {
    popupSelect.addEventListener('change', async () => {
      try {
        await chrome.storage.sync.set({
          [DATE_FORMAT_STORAGE_KEY]: popupSelect.value,
        });
      } catch (error) {
        console.error('Failed to save date format to storage.', error);
      }

      updateDate();
      updateDateRange();
      setView(false);
    });
  }

  loadSavedDateFormat();
})();
