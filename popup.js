document.addEventListener('DOMContentLoaded',async () => {
	// loading isOn from the storage, defualting to a false
	let isOn = chrome.storage.local.get(["extensionEnabled"]) ?? false 
	docment.getElementById("toggle-button").addEventListener("click", toggleApp(isOn))
})

// update UI of the app then start or stop the worker
// NOTE: probably should optimize later due to the heavy weight of the act of looking at EVERY SINGLE TAB, probably can get away with
//like just the last X numbers or only the ones that are alive or smtn like that
async function toggleApp(isOn) {

	chrome.storage.local.set({ extensionEnabled: !isOn }).then( () => {

		if (!isOn) {
			toggleButton.textContent = "Working!"
			chrome.tabs.onUpdate.addEventListener((changeInfo,tab) => {
				if (changeInfo.status === 'loading')
				checkTabForYT(tab)
			})
		}
		
		else {
			toggleButton.textContent = "Sleeping"
			chrome.tabs.addEventListener(() => {})
		}

	})
}

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
	tab.searchParams.url = url
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

