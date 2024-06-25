// Executa o script "content.js" na página atual
/* chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
}); */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectScript') {
    // Send a message to the content script to inject the script
    chrome.tabs.sendMessage(sender.tab.id, { action: 'inject' });
  }
});

