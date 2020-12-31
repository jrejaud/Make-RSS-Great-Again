chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "make-youtube-great-again") {
    return
  }

  console.log("running YT script")
  main()
    .then(done => {
      console.log("DONE")
      console.log(done)
    }).catch(err => {
      console.log("ERROR")
      console.error(err)
    })
})

const YOUTUBE_RSS_BUTTON_ID = "data-make-youtube-great-again"

const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(2), ms)
  })
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this)
}

const getChannelID = async (pageType, document) => {

  const getChannelIDWatchPage = (document) => {
    return document.querySelector("#top-row > ytd-video-owner-renderer > a")?.href.replace("https://www.youtube.com/channel/", "")
  }

  const getChannelIDUserPage = (document) => {
    // This is weird, but it works
    return document.querySelector("[name=\"twitter:url\"]")?.content
  }

  let channelID = null

  switch (pageType) {
    case "watch":
      channelID = getChannelIDWatchPage(document)
      while (!channelID) {
        await delay(500)
        console.log("waiting to get channel ID...")
        channelID = getChannelIDWatchPage(document)
      }
      return channelID
    case "channel":
      return document.querySelector("[name=\"twitter:url\"]")?.content
    case "user":
      channelID = getChannelIDUserPage(document)
      while (!channelID) {
        await delay(500)
        channelID = getChannelIDUserPage(document)
      }
      return channelID
    default:
      return null
  }

}

const createYoutubeRSSImage = (document, imageURL) => {
  const rssImage = document.createElement("img")
  rssImage.src = imageURL
  rssImage.style.height = "30px"
  rssImage.style.marginLeft = "10px"
  rssImage.style.marginBottom = "12px"
  return rssImage
}

const createRssElement = (image) => {
  const rssElement = document.createElement("a")
  rssElement.setAttribute(YOUTUBE_RSS_BUTTON_ID, null)
  rssElement.style.marginTop = "12px"
  //rssElement.href = url
  rssElement.appendChild(image)
  return rssElement
}

const getSubscribeElement = (document) => document.querySelectorAll("#subscribe-button")?.[1]?.parentElement

const getPageType = (document) => {

  if (document.URL === "https://www.youtube.com/") {
    return "main"
  }

  // If you are on a channel page
  else if (document.URL.includes("https://www.youtube.com/channel/")) {
    return "channel"
  }

  // If you are on a user page
  else if (document.URL.includes("https://www.youtube.com/user/")) {
    return "user"
  }
  //
  // If you are on a watch page
  else if (document.URL.includes("https://www.youtube.com/watch?")) {
    return "watch"
  }

  return "other"
}

const main = async () => {
  const pageType = getPageType(document)

  //Remove prior buttons
  const previousButtons = [...document.querySelectorAll("[" + YOUTUBE_RSS_BUTTON_ID + "]")]
  console.log("Prior buttons: " + previousButtons.length)
  previousButtons.forEach(item => {
    item?.remove()
  })

  if (pageType === "main" | pageType === "other") {
    console.log("No channel ID on this page")
    return null
  }

  // Wait until the page loads
  let subscribeElement = getSubscribeElement(document)

  while (!subscribeElement) {
    await delay(500)
    subscribeElement = getSubscribeElement(document)
  }

  const imageURL = chrome.runtime.getURL("img/rss_icon.svg")

  const rssElement = createRssElement(createYoutubeRSSImage(document, imageURL))

  // Calculate the URL on click, doing it before hand causes issues (the URL will still be from the old page)
  rssElement.onclick = async () => {
    const channelID = await getChannelID(pageType, document)
    if (!channelID) {
      return
    }
    const rssURL = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID
    rssElement.href = rssURL
  }
  subscribeElement.appendChild(rssElement)
  console.log("Create button")
}

main()
