// Top most path might be a twitter handle, or it might be something like 'messages'
// from https://twitter.com/messages
// Add VIM addons as needed
// Auto reload
// Add auto-complete addon
// Function should reload when URL changes
// https://medium.com/heptagon/replace-images-in-a-website-using-your-own-with-chrome-extension-9b157bbd1687


const TWITTER_RSS_BUTTON_ID = "make-twitter-great-again"

const delay = (delayInms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  })
}

const getMoreElement = (document) => {
  return document.querySelector("div[aria-label=\"More\"]")
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
  rssElement.id = TWITTER_RSS_BUTTON_ID
  rssElement.href = url
  rssElement.appendChild(image)
  return rssElement
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}

const main = async () => {
  const userName = document.location.pathname.split("/")?.[1]

  const pagesThatAreNotUserNames = ["home", "explore", "notifications", "messages", "i", "compose"]

  if (pagesThatAreNotUserNames.includes(userName)) {
    return console.log("Page is not a twitter user page")
  }

  // Remove any previously added button
  document.getElementById(TWITTER_RSS_BUTTON_ID)?.remove()

  let buttonsDiv = getButtonsDiv(document)

  while (!buttonsDiv) {
    await delay(500)
    buttonsDiv = getButtonsDiv(document)
  }

  const imageURL = chrome.runtime.getURL("img/rss_icon.svg")
  const rssElement = createRssElement("https://nitter.net/" + userName + "/rss", createTwitterRssImage(document, imageURL))
  buttonsDiv.appendChild(rssElement)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message !== 'twitter') {
      return
    }
    main()
  }
)

main()
