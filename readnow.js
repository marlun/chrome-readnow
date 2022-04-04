'use strict';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'make-readable') {
    makeReadable();
  }
});

let variation = 0;

function makeReadable() {
  const variations = [
    {
      font: 'Open Sans SemiCondensed',
      monoFont: 'Ubuntu Mono',
      fontSize: '20px',
      monoFontSize: '20px',
    },
    {
      font: 'Merriweather Light',
      monoFont: 'Ubuntu Mono',
      fontSize: '20px',
      monoFontSize: '20px',
    },
    {
      font: 'Open Sans SemiCondensed',
      monoFont: 'Ubuntu Mono',
      fontSize: null,
      monoFontSize: null,
    },
    {
      font: 'Merriweather Light',
      monoFont: 'Ubuntu Mono',
      fontSize: null,
      monoFontSize: null,
    },
  ];

  // Get current variation and increment to prepare the next
  const { font, monoFont, fontSize, monoFontSize } =
    variations[variation++ % variations.length];

  styleTarget(findWrapper());

  function findWrapper() {
    const targetClasses =
      'article,body,content,entry,hentry,main,page,post,text,blog,story,wrapper';

    let mostParagraphs = 0;
    let target = null;

    // Get the classes to search for
    let selectors = targetClasses.split(',');

    // Create the selector strings
    selectors = selectors.map(function (item) {
      return (
        'div[class*="' +
        item +
        '"],div[id*="' +
        item +
        '"],section[class*="' +
        item +
        '"]'
      );
    });

    // Add other tags which is normally used for content
    selectors.push('article');
    selectors.push('main');

    const elements = document.querySelectorAll(selectors.join(','));

    target = elements[0];

    for (var i = 0; i < elements.length; i++) {
      const el = elements[i];
      const count = el.querySelectorAll('p').length;
      if (count > mostParagraphs) {
        mostParagraphs = count;
        target = el;
      }
    }

    if (target == null) {
      console.log('Could not find target, using body.');
      target = document.body;
    }

    return target;
  }

  function styleTarget(target, prefs) {
    let styles, elements;

    const fontSizeRule = fontSize
      ? `,font-size:${fontSize}`
      : ',font-size:null';
    const monoFontSizeRule = monoFontSize
      ? `,font-size:${monoFontSize}`
      : ',font-size:null';
    // Add styles to the target itself to fix some sites
    // that doesn't use paragraph elements
    styles = parseStyles(
      `font-family:'${font}',line-height:1.6em,${fontSizeRule}`
    );
    styleElements([target], styles);

    //"font-family:'Merriweather Light',line-height:1.6em,letter-spacing:-0.02em,"
    elements = target.querySelectorAll('p,p strong,p em');
    styles = parseStyles(
      `font-family:'${font}',line-height:1.6em,${fontSizeRule}`
    );
    styleElements(elements, styles);

    elements = target.querySelectorAll('li');
    styles = parseStyles(
      `font-family:'${font}',line-height:1.6em,${fontSizeRule}`
    );
    styleElements(elements, styles);

    elements = target.querySelectorAll('pre,code,.code');
    styles = parseStyles(
      `font-family:'${monoFont}',fontVariantLigatures:none${monoFontSizeRule}`
    );
    styleElements(elements, styles);

    elements = target.querySelectorAll('h1,h2,h3,h4');
    styles = parseStyles(`font-weight:700,font-family:'${font}',`);
    styleElements(elements, styles);

    elements = target.querySelectorAll('blockquote,blockquote p');
    styles = parseStyles(
      `font-family:'${font}',line-height:1.6em,${fontSizeRule}`
    );
    styleElements(elements, styles);

    // elements = target.querySelectorAll('p strong')
    // styles = parseStyles('font-weight:700')
    // styleElements(elements, styles)
  }

  function parseStyles(prefString) {
    const prefs = [];
    const pairs = prefString.split(',');
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const style = pair.split(':');
      prefs.push({ name: style[0], value: style[1] });
    }
    return prefs;
  }

  function styleElements(elements, styles) {
    for (var i = 0; i < elements.length; i++) {
      const el = elements[i];
      for (var n = 0; n < styles.length; n++) {
        const style = styles[n];
        if (style.value === 'null') {
          el.style.removeProperty(style.name);
        } else {
          el.style[style.name] = style.value;
        }
      }
    }
  }
}
