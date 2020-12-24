// Listen for URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log(changeInfo)
    // If you are on twitter
    if (changeInfo.url.indexOf("https://twitter.com/") === 0) {
      console.log("twitter background script")
      chrome.tabs.sendMessage(tabId, {
        message: "make-twitter-great-again",
      })
    }
    // // If you are on youtube
    // else if (changeInfo.url.indexOf("https://www.youtube.com/") === 0) {
    //   console.log("YT background script")
    //   chrome.tabs.sendMessage(tabId, {
    //     message: "make-youtube-great-again",
    //   })
    // }
  }
})
