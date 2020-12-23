// If you start navigation on a page, it is called directly (via the manifest)
// Listen for URL changes on all pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // If you are on twitter
    if (changeInfo.url.indexOf("https://twitter.com/") === 0) {
      chrome.tabs.sendMessage(tabId, {
        message: "twitter",
      })
    }
  }
})
