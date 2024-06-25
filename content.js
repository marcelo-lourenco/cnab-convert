// Script para interagir com a página da web (opcional)
// Ex: capturar dados da página e enviar para a extensão.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'inject') {
    chrome.scripting.executeScript({
      target: { tabId: chrome.runtime.id }, // Target the current tab
      files: ['your_script.js'] 
    });
  }
});