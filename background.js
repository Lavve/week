const getWeek = () => {
		const e = new Date(),
			t = (e.getDay() + 6) % 7;
		e.setDate(e.getDate() - t + 3);
		const n = e.valueOf();
		return (
			e.setMonth(0, 1),
			4 !== e.getDay() && e.setMonth(0, 1 + ((4 - e.getDay() + 7) % 7)),
			1 + Math.ceil((n - e) / 6048e5)
		);
	},
	updateWeekNo = function () {
		const e = getWeek();
		chrome.action.setIcon({ path: { 128: 'weeks/' + e + '.png' } }),
			chrome.action.setTitle({ title: 'Week ' + e });
	},
	openWeekPage = () => {
		updateWeekNo();
		const e = chrome.runtime.getURL('week.htm');
		chrome.tabs.create({ url: e });
	};
chrome.action.onClicked.addListener((e) => {
	chrome.scripting.executeScript({
		target: { tabId: e.id },
		function: openWeekPage(),
	});
}),
	chrome.runtime.onInstalled.addListener(async () => {
		openWeekPage();
	}),
	chrome.windows.onFocusChanged.addListener(function (e) {
		-1 !== e && updateWeekNo();
	});
