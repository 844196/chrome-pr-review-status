chrome.webNavigation.onHistoryStateUpdated.addListener((history) => {
  // HTML5 HistoryAPI workaround
  if (!history.url.match(/\/pulls/)) {
    return
  }
  if (history.url.match(/\/issues/)) {
    return
  }

  chrome.tabs.executeScript(history.tabId, {file: 'content.js'})
})
