/**
 * Shared date utility for ISO week number.
 * Week 1 is the week containing the first Thursday of the year.
 */
// biome-ignore lint/correctness/noUnusedVariables: false positive
function getIsoWeekNumber(date = new Date()) {
	const workingDate = new Date(date);
	const mondayIndex = (workingDate.getDay() + 6) % 7;
	workingDate.setDate(workingDate.getDate() - mondayIndex + 3);

	const currentThursday = workingDate.valueOf();
	workingDate.setMonth(0, 1);
	if (workingDate.getDay() !== 4) {
		workingDate.setMonth(0, 1 + ((4 - workingDate.getDay() + 7) % 7));
	}

	const firstThursday = workingDate.valueOf();
	return 1 + Math.ceil((currentThursday - firstThursday) / 604800000);
}

// biome-ignore lint/correctness/noUnusedVariables: false positive
function getDateString(format = "DD/MM/YYYY", date = new Date()) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = String(date.getFullYear());

	const tokenValues = {
		DD: day,
		MM: month,
		YYYY: year,
	};

	return format.replace(/DD|MM|YYYY/g, (token) => tokenValues[token] || token);
}
