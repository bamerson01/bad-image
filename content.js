let extensionEnabled = false;

chrome.storage.local.get('extensionEnabled', data => {
  extensionEnabled = data.extensionEnabled;
  updateImageHighlighting(extensionEnabled);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggle') {
    extensionEnabled = message.status;
    updateImageHighlighting(extensionEnabled);
    sendResponse({ status: 'Updated highlighting based on toggle' });
  } else if (message.type === 'getImagesData') {
    sendResponse(collectImageData());
    return true;
  }
  return false;
});

function updateImageHighlighting(enable) {
  if (!enable) {
    clearImageHighlighting();
  } else {
    document.querySelectorAll('img').forEach(img => {
      if (img.naturalWidth > img.width || img.naturalHeight > img.height) {
        img.style.border = '4px solid magenta';
      }
    });
  }
}

function clearImageHighlighting() {
  document.querySelectorAll('img').forEach(img => img.style.border = '');
}

function collectImageData() {
  return Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    displayedWidth: img.width,
    displayedHeight: img.height
  }));
}