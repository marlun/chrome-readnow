'use strict'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'make-readable') {
    makeReadable()
  }
})

function makeReadable () {
  styleTarget(findWrapper())

  function findWrapper () {
    const targetClasses = 'article,body,content,entry,hentry,main,page,post,text,blog,story,wrapper'

    let mostParagraphs = 0
    let target = null

    // Get the classes to search for
    let selectors = targetClasses.split(',')

    // Create the selector strings
    selectors = selectors.map(function (item) {
      return 'div[class*="' + item + '"],div[id*="' + item + '"],section[class*="' + item + '"]'
    })

    // Add the article element
    selectors.push('article')

    const elements = document.querySelectorAll(selectors.join(','))

    target = elements[0]

    // for (let el of elements) {
    for (var i = 0; i < elements.length; i++) {
      const el = elements[i]
      const count = el.querySelectorAll('p').length
      if (count > mostParagraphs) {
        mostParagraphs = count
        target = el
      }
    }

    if (target == null) { target = document.body }

    return target
  }

  function styleTarget (target, prefs) {
    let styles, elements

    // Add styles to the target itself to fix some sites
    // that doesn't use paragraph elements
    styles = parseStyles("font-family:'Fern Micro Testing',webkitFontSmoothing:subpixel-antialiased")
    styleElements([target], styles)

    elements = target.querySelectorAll('p,p strong,p em')
    styles = parseStyles("font-size:20px,font-family:'Fern Micro Testing',line-height:1.6em,letter-spacing:-0.02em,webkitFontSmoothing:subpixel-antialiased")
    styleElements(elements, styles)

    elements = target.querySelectorAll('li')
    styles = parseStyles("font-size:20px,font-family:'Fern Micro Testing',line-height:1.6em,letter-spacing:-0.02em,webkitFontSmoothing:subpixel-antialiased")
    styleElements(elements, styles)

    elements = target.querySelectorAll('pre,code,.code')
    styles = parseStyles("font-size:18px,font-family:'Fantasque Sans Mono',webkitFontSmoothing:subpixel-antialiased")
    styleElements(elements, styles)

    elements = target.querySelectorAll('h1,h2,h3,h4')
    styles = parseStyles("font-weight:700,font-family:'Fern Micro Testing',webkitFontSmoothing:subpixel-antialiased")
    styleElements(elements, styles)

    elements = target.querySelectorAll('blockquote,blockquote p')
    styles = parseStyles("font-size:20px,font-family:'Fern Micro Testing',line-height:1.6em,letter-spacing:-0.02em,webkitFontSmoothing:subpixel-antialiased")
    styleElements(elements, styles)

    // elements = target.querySelectorAll('p strong')
    // styles = parseStyles('font-weight:700')
    // styleElements(elements, styles)
  }

  function parseStyles (prefString) {
    const prefs = []
    const pairs = prefString.split(',')
    // for (let pair of pairs) {
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      const style = pair.split(':')
      prefs.push({ name: style[0], value: style[1] })
    }
    return prefs
  }

  function styleElements (elements, styles) {
    // for (let el of elements) {
    for (var i = 0; i < elements.length; i++) {
      const el = elements[i]
      // for (let {name, value} of styles) {
      // for (let style of styles) {
      for (var n = 0; n < styles.length; n++) {
        const style = styles[n]
        el.style[style.name] = style.value
      }
    }
  }
}
