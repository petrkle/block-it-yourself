blockImagePayload = {redirectUrl: chrome.extension.getURL("empty.gif")};
blockPagePayload = {redirectUrl: "about:blank"};
cancelPayload = {cancel: true};

function blockImage(details) {
	return blockImagePayload;
}

function blockPage(details) {
	return blockPagePayload;
}

function blockObject(details) {
	return cancelPayload;
}

listenerCallbacks = [
	[["image"], blockImage],
	[["sub_frame"], blockPage],
	[["main_frame", "object", "script", "xmlhttprequest", "stylesheet", "other"], blockObject]
]

blockingEnabled = false;

function enable() {
	if (blockingEnabled) {
		return;
	}

	for (var foo in listenerCallbacks) {
		var types = listenerCallbacks[foo][0];
		var callback = listenerCallbacks[foo][1];
		chrome.webRequest.onBeforeRequest.addListener(
			callback,
			{urls: filters, types: types},
			["blocking"]
		);
	}

	blockingEnabled = true;
	chrome.browserAction.setIcon({path: "on.png"});
}

function disable() {
	for (var foo in listenerCallbacks) {
		var callback = listenerCallbacks[foo][1];
		chrome.webRequest.onBeforeRequest.removeListener(callback);
	}

	blockingEnabled = false;
	chrome.browserAction.setIcon({path: "off.png"});
}


function toggleEnabled() {
	if (blockingEnabled) {
		disable();
	} else {
		enable();
	}
}

chrome.browserAction.onClicked.addListener(toggleEnabled);

enable();
