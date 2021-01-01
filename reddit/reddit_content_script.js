const isOnSubredditPage = (url) => {
  const splits = url.split("/")
  if (splits.length !== 4) {
    return false
  }
  if (splits[1] !== "r") {

  }
}

const SUBREDDIT_PAGE_REGEX = /\/r\/\w*[\/|\w]$/m
const REDDIT_RSS_BUTTON_ID = "data-make-rss-great-again"

const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(2), ms)
  })
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this)
}

const getJoinButton = (document) => {
  return document.querySelector("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div.q4a8asWOWdfdniAbgNhMh > div > div.QscnL9OySMkHhGudEvEya > div > div._1Q_zPN5YtTLQVG72WhRuf3")
}

const createRedditRssElement = (document, imageURL) => {
  const rssImage = document.createElement("img")
  rssImage.src = imageURL
  rssImage.style.height = "30px"
  rssImage.style.marginLeft = "10px"
  rssImage.style.marginBottom = "12px"
  return rssImage
}

const createRssElement = (url, image) => {
  const rssElement = document.createElement("a")
  rssElement.setAttribute(REDDIT_RSS_BUTTON_ID, null)
  rssElement.href = url
  rssElement.appendChild(image)
  return rssElement
}

const main = async () => {

  console.log("Remove prior buttons")
  // Remove previous buttons
  const previousButtons = [...document.querySelectorAll("[" + REDDIT_RSS_BUTTON_ID + "]")]
  previousButtons.forEach(item => {
    item?.remove()
  })

  // If you are on a subreddit's page
  const isOnSubredditPage = SUBREDDIT_PAGE_REGEX.test(document.location.pathname)

  console.log("on subreddit page: ", isOnSubredditPage)

  if (isOnSubredditPage) {
    let joinButton = getJoinButton(document)

    while (!joinButton) {
      await delay(500)
      console.log("Waiting to find join button")
      joinButton = getJoinButton(document)
    }

    console.log("Adding RSS button")

    // Add new button
    const imageURL = chrome.runtime.getURL("img/rss_icon.svg")
    const rssURL = document.URL + ".rss"
    const rssElement = createRssElement(rssURL, createRedditRssElement(document, imageURL))
    joinButton.parentElement.appendChild(rssElement)
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "make-reddit-great-again") {
    return
  }

  main().then()
}
)

main().then()
