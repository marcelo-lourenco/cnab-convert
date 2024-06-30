chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectScript') {
    // Send a message to the content script to inject the script
    chrome.tabs.sendMessage(sender.tab.id, { action: 'inject' });
  }
});