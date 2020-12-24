const YOUTUBE_RSS_BUTTON_ID = "data-make-youtube-great-again"


const getChannelID = (document) => {
  // If you are on a watch page
  if (document.URL.indexOf("https://www.youtube.com/watch?v=" === 0)) {
    return document.querySelector("[itemprop=\"channelId\"]")?.content
  }

  // If you are on a channel page
  else if (document.URL.indexOf("https://www.youtube.com/channel/" === 0)) {
    return document.location.pathname.replace("/channel/","")
  }

  // If you are on a user page
  else if (document.URL.indexOf("https://www.youtube.com/user/" === 0)) {
    // This is weird, but it works
    return document.querySelector("[name=\"twitter:url\"]")?.content
  }
}

const createYoutubeRSSImage = (rssImage, imageURL) => {
  rssImage.src = imageURL
  rssImage.style.height = "30px"
  rssImage.style.marginLeft = "10px"
  rssImage.style.marginBottom = "12px"
  return rssImage
}

const createRssElement = (url, image) => {
  const rssElement = document.createElement("a")
  rssElement.setAttribute(YOUTUBE_RSS_BUTTON_ID, null)
  rssElement.href = url
  rssElement.appendChild(image)
  return rssElement
}

const main = async () => {
  const channelID = getChannelID(document)

  if (!channelID) {
    throw new Error("No channel ID")
  }

  console.log("channel ID: "+ channelID)

  const subscribeElement = document.querySelectorAll("#subscribe-button")[1].parentElement

  if (!subscribeElement) {
    throw new Error("No subscribe button")
  }

  const rssURL = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID
  const imageURL = chrome.runtime.getURL("img/rss_icon.svg")

  subscribeElement.appendChild(createRssElement(rssURL, createYoutubeRSSImage(document, imageURL)))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "make-youtube-great-again") {
    return
  }

  main().then()
})

// Run
main().then()

