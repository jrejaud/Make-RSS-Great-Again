// Top most path might be a twitter handle, or it might be something like 'messages'
// from https://twitter.com/messages
// Add VIM addons as needed
// Auto reload
// Add auto-complete addon
// Function should reload when URL changes
// https://medium.com/heptagon/replace-images-in-a-website-using-your-own-with-chrome-extension-9b157bbd1687

console.log("twitter content script loaded")

const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(2), ms)
  })
}

const TWITTER_RSS_BUTTON_ID = "data-make-rss-great-again"

Element.prototype.remove = function () {
  this.parentElement.removeChild(this)
}

const getButtonsDiv = (document) => {
  return document.querySelector("div[class=\"css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs\"")
}

const createTwitterRssImage = (document, imageURL) => {
  const rssImage = document.createElement("img")
  rssImage.src = imageURL
  rssImage.style.height = "30px"
  rssImage.style.marginLeft = "10px"
  rssImage.style.marginBottom = "12px"
  return rssImage
}

const createRssElement = (url, image) => {
  const rssElement = document.createElement("a")
  rssElement.setAttribute(TWITTER_RSS_BUTTON_ID, null)
  rssElement.href = url
  rssElement.appendChild(image)
  return rssElement
}

const main = async () => {
  const pagePath = document.location.pathname.split("/")?.[1]

  const pagesThatAreNotUserNames = ["home", "explore", "notifications", "messages", "i", "compose"]

  if (pagesThatAreNotUserNames.includes(pagePath)) {
    return console.log("Page is not a twitter user page")
  }

  // Twitter is a SPA, so wait until the element loads
  let buttonsDiv = getButtonsDiv(document)

  while (!buttonsDiv) {
    await delay(500)
    buttonsDiv = getButtonsDiv(document)
  }

  // Remove prior buttons
  const previousButtons = [...document.querySelectorAll("[" + TWITTER_RSS_BUTTON_ID + "]")]
  previousButtons.forEach(item => {
    item?.remove()
  })

  // Add new button
  const imageURL = chrome.runtime.getURL("img/rss_icon.svg")
  const rssElement = createRssElement("https://nitter.net/" + pagePath + "/rss", createTwitterRssImage(document, imageURL))
  buttonsDiv.appendChild(rssElement)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("get message")
    if (request.message !== "make-twitter-great-again") {
      return
    }

    main().then()
  }
)

console.log("twitter content script loaded end")
main().then()
