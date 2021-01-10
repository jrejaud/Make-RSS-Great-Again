const createHackerNewsRSSElement = (document) => {
  const element = document.createElement("a")
  element.href = "https://news.ycombinator.com/rss"
  element.innerHTML = "rss"
  return element
}


const main => {
  const topBar = document.querySelector("#hnmain > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > span")

  //const bottomBar = document.querySelector("#hnmain > tbody > tr:nth-child(4) > td > center > span")

  const seperatorElement = document.createTextNode(" |  ")

  const rssElement = createHackerNewsRSSElement(document)

  topBar.appendChild(seperatorElement)

  topBar.appendChild(rssElement)

}

main()
