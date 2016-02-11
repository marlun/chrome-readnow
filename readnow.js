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
		const textColor = getTextColor(target);

		// Add styles to the target itself to fix some sites
		// that doesn't use paragraph elements
		styles = parseStyles("font-family:'Roboto',webkitFontSmoothing:antialiased");
		styleElements([target], styles);

		elements = target.querySelectorAll('p');
		styles = parseStyles("font-size:22px,line-height:1.4,font-family:'Roboto',webkitFontSmoothing:antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('li');
		styles = parseStyles("font-size:22px,line-height:1.4,font-family:'Roboto',webkitFontSmoothing:antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('pre,code,.code,.highlight');
		styles = parseStyles("font-size:18px,line-height:1.4,font-family:'InconsolataLGC',webkitFontSmoothing:antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('h1,h2,h3,h4');
		styles = parseStyles("font-weight:700,margin:1em 0 .5em,line-height:1.5,font-family:'Roboto',webkitFontSmoothing:antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('h2');
		styles = parseStyles("font-size:30px");
		styleElements(elements, styles);

		elements = target.querySelectorAll('h3');
		styles = parseStyles("font-size:28px");
		styleElements(elements, styles);

		elements = target.querySelectorAll('h4');
		styles = parseStyles("font-size:22px");
		styleElements(elements, styles);

		elements = target.querySelectorAll('blockquote,blockquote p');
		styles = parseStyles("font-size:18px,font-family:'Roboto',webkitFontSmoothing:antialiased");
		styleElements(elements, styles);

		elements = target.querySelectorAll('p strong');
		styles = parseStyles("font-weight:700");
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

	function getBackgroundColor(elem) {
		// We could create a new element and check what Chrome returns for
		// backgroundColor to make sure what we should compare it to
		while (elem && getComputedStyle(elem).backgroundColor == "rgba(0, 0, 0, 0)")
			elem = elem.parentElement !== null ? elem.parentNode : false;

		// We return white as the default color if we don't find anything other
		// than transparent background color
		return elem ? getComputedStyle(elem).backgroundColor : "white";
	}

	function getTextColor(target) {
		// TODO Remove the use of tinycolor and see if you can make it so that
		// SHIFT-CTRL-E doesn't change the color but if you hit it again swaps
		// between making it white and black?
		const color = tinycolor(getBackgroundColor(target));
		return color.isLight() ? '#111' : '#fff';
	}
}
