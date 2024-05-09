chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ extensionEnabled: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleExtension") {
    chrome.storage.local.set({ extensionEnabled: request.enabled });
    sendResponse({ status: 'Toggle state updated' });
    return false; // No need to keep the message port open
  } else if (request.action === "getImagesInfo" && sender.tab) {
    chrome.tabs.sendMessage(sender.tab.id, { type: 'getImagesData' }, response => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving images:', chrome.runtime.lastError.message);
        sendResponse({ imagesInfo: [] });  // send empty array in case of error
        return;
      }
      sendResponse({ imagesInfo: response || [] });
    });
    return true; // keep the messaging channel open to the response
  }
  return false; // For good measure, explicitly return false where not returning true
});
