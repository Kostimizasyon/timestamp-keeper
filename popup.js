const TOGGLE_BUTTON_ELEMENT_ID = "toggle-button"
const RUN_DESC_ELEMENT_ID = "run-desc"

document.addEventListener('DOMContentLoaded',async () => {})

async function toggleApp(isOn) {

	const toggleButton = document.getElementById(TOGGLE_BUTTON_ELEMENT_ID)
	const runDesc = document.getElementById(RUN_DESC_ELEMENT_ID)

	chrome.storage.local.set({ extensionEnabled: !isOn }).then( () => {})

	if (!isOn) {
		toggleButton.textContent = "Working!"
		runDesc.textContent = "Saving timestamps!"
		// start worker
	}
	
	else {
		toggleButton.textContent = "Sleeping"
		runDesc.textContent = "Mimimimimimi"
		// stop worker
	}

}

// get every tab from the browser, and check if they are youtube, then do the procedure accordingly
async function getAndProcessActiveTabs() {

	const activeTabs = await chrome.tabs.query({ active: true });

	activeTabs.forEach((tab) => {
		checkTabForYT(tab)
	})

}
// NOTE: probably should optimize later due to the heavy weight of the act of looking at EVERY SINGLE TAB, probably can get away with
//like just the last X numbers or only the ones that are alive or smtn like that

// check if the passed tab is a youtube video, if it is get its timestamped link and replace it.
function checkTabForYT(tab) {
	const isValid = tab?.url?.includes("youtube.com/watch");
	if (isValid) {
    		url = getStampedUrlFromTab(tab)
		replaceUrlWithTimestamp(tab, url)
	}
}

// replace the given tabs url with the given url
async function replaceUrlWithTimestamp(tab, url) {

}

// get the passed in tabs youtube url with its current timestamp
async function getStampedUrlFromTab(tab) {
	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const video = document.querySelector('video');
			if (!video) return null;
			const currentTime = Math.floor(video.currentTime);
			const url = new URL(window.location.href);
			url.searchParams.set('t', `${currentTime}`);
			return url.toString();
		}	
	});
		
	return result;
}

