(() => {
	const MARKER = "+++++++";
	if (!location.href.includes(MARKER)) return;

	if (sessionStorage.getItem("autoOpenFirstResultDone") === "1") return;
	sessionStorage.setItem("autoOpenFirstResultDone", "1");

	const clickFirstRow = () => {
		const rows = document.querySelectorAll('tr[role="row"]');
		const first = Array.from(rows).find(r => r.querySelector('td[role="gridcell"]'));
		if (!first) return false;

		first.click();
		return true;
	};

	if (clickFirstRow()) return;

	const obs = new MutationObserver(() => {
		if (clickFirstRow()) obs.disconnect();
	});

	obs.observe(document.documentElement, { childList: true, subtree: true });
})();
