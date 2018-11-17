"use strict";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message === 'make-readable' ) {
		makeReadable();
	}
});

function makeReadable() {

	styleTarget(findWrapper());

	function findWrapper() {
		const targetClasses = 'article,body,content,entry,hentry,main,page,post,text,blog,story,wrapper';

		let mostParagraphs = 0;
		let target = null;

		// Get the classes to search for
		let selectors = targetClasses.split(',');

		// Create the selector strings
		selectors = selectors.map(function(item) {
			return 'div[class*="' + item + '"],div[id*="' + item + '"]';
		});

		// Add the article element
		selectors.push('article');

		let elements = document.querySelectorAll(selectors.join(','));

		target = elements[0];

		// for (let el of elements) {
		for (var i = 0; i < elements.length; i++) {
			let el = elements[i];
			let count = el.querySelectorAll('p').length;
			if (count > mostParagraphs) {
				mostParagraphs = count;
				target = el;
			}
		}

		if (target == null)
			target = document.body;

		return target;
	}

	function styleTarget(target, prefs) {
		let styles, elements;

		// Get the text color based on the target background color
		const textColor = '#111';

		// Add styles to the target itself to fix some sites
		// that doesn't use paragraph elements
		styles = parseStyles("font-family:'NYTImperial',webkitFontSmoothing:subpixel-antialiased");
		styleElements([target], styles);

		elements = target.querySelectorAll('p');
		styles = parseStyles("font-size:18px,line-height:1.4,font-family:'NYTImperial',webkitFontSmoothing:subpixel-antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('li');
		styles = parseStyles("font-size:18px,line-height:1.4,font-family:'NYTImperial',webkitFontSmoothing:subpixel-antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('pre,code,.code,.highlight');
		styles = parseStyles("font-size:16px,line-height:1.4,font-family:'Iosevka Term',webkitFontSmoothing:subpixel-antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('blockquote,blockquote p');
		styles = parseStyles("font-size:18px,font-family:'NYTImperial',webkitFontSmoothing:subpixel-antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('p strong');
		styles = parseStyles("font-weight:700");
		styleElements(elements, styles);

		elements = target.querySelectorAll('h1,h2,h3,h4');
		styles = parseStyles("font-weight:700,margin:1em 0 .5em,line-height:1.5,font-family:'NYTImperial',webkitFontSmoothing:subpixel-antialiased");
		styleElements(elements, styles);
	}

	function parseStyles(prefString) {
		let prefs = [];
		let pairs = prefString.split(',');
		// for (let pair of pairs) {
		for (var i = 0; i < pairs.length; i++) {
			let pair = pairs[i];
			let style = pair.split(':');
			prefs.push({name: style[0], value: style[1]});
		}
		return prefs;
	}

	function styleElements(elements, styles) {
		// for (let el of elements) {
		for (var i = 0; i < elements.length; i++) {
			let el = elements[i];
			//for (let {name, value} of styles) {
			// for (let style of styles) {
			for (var n = 0; n < styles.length; n++) {
				let style = styles[n];
				el.style[style.name] = style.value;
			}
		}
	}
}
