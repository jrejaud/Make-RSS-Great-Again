// Listen for URL changes
let injected = false

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // If you are on twitter
    if (changeInfo.url.indexOf("https://twitter.com/") === 0) {
      chrome.tabs.sendMessage(tabId, {
        message: "make-twitter-great-again",
      })
    }

    // If you are on youtube
    else if (changeInfo.url.indexOf("https://www.youtube.com/") === 0) {
      chrome.tabs.sendMessage(tabId, {
        message: "make-youtube-great-again",
      })
    }

    // If you are on reddit
    else if (changeInfo.url.indexOf("https://www.reddit.com/") === 0) {
      console.log("On Reddit")
      chrome.tabs.sendMessage(tabId, {
        message: "make-reddit-great-again",
      })
    }
  }
})
