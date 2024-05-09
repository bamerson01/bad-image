document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleExtension');
  const imageListDiv = document.getElementById('imageList');

  // Set initial toggle state
  chrome.storage.local.get('extensionEnabled', data => {
    toggleButton.textContent = data.extensionEnabled ? 'Disable' : 'Enable';
  });

  // Toggle functionality
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get('extensionEnabled', data => {
      const newStatus = !data.extensionEnabled;
      chrome.storage.local.set({ extensionEnabled: newStatus });
      toggleButton.textContent = newStatus ? 'Disable' : 'Enable';
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle', status: newStatus });
      });
    });
  });

  // Request and display image data
  chrome.runtime.sendMessage({ action: "getImagesInfo" }, response => {
    (response.imagesInfo || []).forEach(info => {
      const item = document.createElement('div');
      item.textContent = `Image: ${info.src}, Natural: ${info.naturalWidth}x${info.naturalHeight}, Display: ${info.displayedWidth}x${info.displayedHeight}`;
      imageListDiv.appendChild(item);
    });
  });
});
