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

const getRSSURL = async (pageType, document) => {

  const getRSSUrlFromWatchPage = (document) => {
    // Get the URL to 
    const channelPageURL = document.querySelector("#top-row > ytd-video-owner-renderer > a")?.href

    // Channel and user pages are the same thing, except their URLs are structured 
    // differently

    // If this is a channel page
    if (channelPageURL.includes("https://www.youtube.com/channel/")) {
      const channelID = channelPageURL.replace("https://www.youtube.com/channel/", "")
      return "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID
    }

    // If this is a user page
    else if (channelPageURL.includes("https://www.youtube.com/user/")) {
      const channelUsername = channelPageURL.replace("https://www.youtube.com/user/", "")
      return "https://www.youtube.com/feeds/videos.xml?user=" + channelUsername
    }

    // If it is neither
    return null
  }

  const getRSSURLFromUserPage = (document) => {
    // This is weird, but it works
    const pageURL = document.querySelector("[name=\"twitter:url\"]")?.content
    if (!pageURL) {
      return null
    }
    const channelUsername = pageURL.replace("https://www.youtube.com/user/", "")
    return "https://www.youtube.com/feeds/videos.xml?user=" + channelUsername
  }

  const getRSSURLFromChannelPage = (document) => {
    const pageURL = document.querySelector("[name=\"twitter:url\"]")?.content
    if (!pageURL) {
      return null
    }
    const channelID = pageURL.replace("https://www.youtube.com/channel/", "")
    return "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID
  }

  let rssURL = null

  switch (pageType) {
    case "watch":
      rssURL = getRSSUrlFromWatchPage(document)
      while (!rssURL) {
        await delay(500)
        console.log("waiting to get channel ID...")
        rssURL = getRSSUrlFromWatchPage(document)
      }
      return rssURL
    case "channel":
      return getRSSURLFromChannelPage(document)
    case "user":
      rssURL = getRSSURLFromUserPage(document)
      while (!rssURL) {
        await delay(500)
        rssURL = getRSSURLFromUserPage(document)
      }
      return rssURL
    default:
      return null
  }

}

const createYoutubeRSSImage = (pageType, document, imageURL) => {
  const rssImage = document.createElement("img")
  rssImage.src = imageURL
  rssImage.style.height = "30px"
  if (pageType !== "channel" && pageType !== "user") {
    rssImage.style.marginLeft = "10px"
    rssImage.style.marginBottom = "12px"
  } else {
    rssImage.style.marginLeft = "6px"
    rssImage.style.marginBottom = "10px"
  }
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

const getSubscribeElement = (pageType, document) => {

  console.log("Get sub element: ", pageType)

  if (pageType === "user" || pageType == "channel") {
    return document.querySelectorAll("#subscribe-button")?.[0]?.parentElement?.parentElement
  }

  else if (pageType === "watch") {
    return document.querySelectorAll("#subscribe-button")?.[1]?.parentElement
  }

  return null

}

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
  //Remove prior buttons
  const previousButtons = [...document.querySelectorAll("[" + YOUTUBE_RSS_BUTTON_ID + "]")]
  console.log("Prior buttons: " + previousButtons.length)
  previousButtons.forEach(item => {
    item?.remove()
  })

  const pageType = getPageType(document)

  if (pageType === "main" | pageType === "other") {
    console.log("No RSS URL on this page")
    return null
  }

  // Wait until the page loads
  let subscribeElement = getSubscribeElement(pageType, document)

  while (!subscribeElement) {
    console.log("Waiting for sub element")
    await delay(500)
    subscribeElement = getSubscribeElement(pageType, document)
  }

  const imageURL = chrome.runtime.getURL("img/rss_icon.svg")

  const rssElement = createRssElement(createYoutubeRSSImage(pageType, document, imageURL))

  // Calculate the URL on hover, doing it before hand causes issues (the URL will still be from the old page)
  rssElement.onmouseover = async () => {
    const rssURL = await getRSSURL(pageType, document)
    if (!rssURL) {
      return
    }
    rssElement.href = rssURL
  }

  subscribeElement.appendChild(rssElement)
  console.log("Create button")
}

main()
