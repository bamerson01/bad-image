chrome.runtime.onInstalled.addListener(() => {
  // Initialize the extensionEnabled state when installed
  chrome.storage.local.set({ extensionEnabled: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleExtension") {
    // Toggle the extension's enabled state
    chrome.storage.local.set({ extensionEnabled: request.enabled });
  } else if (request.action === "getImagesInfo" && sender.tab) {
    // Request image data from the content script
    chrome.tabs.sendMessage(sender.tab.id, { type: 'getImagesData' }, response => {
      sendResponse({ imagesInfo: response || [] });
    });
    return true; // keep the messaging channel open to the response
  }
});
