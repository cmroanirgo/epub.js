EPUBJS.reader.ReaderController = function(book) {
	var $main = $("#main"),
			$_main = $("#_main"),
			$divider = $("#divider"),
			$loader = $("#loader"),
			$next = $("#next"),
			$prev = $("#prev");
	var reader = this;
	var book = this.book;
	var _hasTwoPageSpreads = false;
	var slideIn = function() {
		$main.removeClass("closed");
	};

	var slideOut = function() {
		$main.addClass("closed");
	};

	var showLoader = function() {
		$loader.show();
		$divider.hide();
	};

	var hideLoader = function() {
		$loader.hide();
		$divider.toggle(_hasTwoPageSpreads);
	};

	var nextPage = function() {
		if(book.metadata.direction === "rtl") {
			book.prevPage();
		} else {
			book.nextPage();
		}
	}
	var prevPage = function() {
		if(book.metadata.direction === "rtl") {
			book.nextPage();
		} else {
			book.prevPage();
		}
	}
	var flashArrow = function($el) {
		$el.addClass("active");
		setTimeout(function(){
			$el.removeClass("active");
		}, 100);

	}

	var arrowKeys = function(e) {		
		if(e.keyCode == 37) { 

			prevPage();
			flashArrow($prev);
			e.preventDefault();
		}
		if(e.keyCode == 39) {

			nextPage();
			flashArrow($next);

			e.preventDefault();
		}
	}


	var _loaderTimeout = -1;
	var fnChapterDisplayed_Before = function() {
		//console.debug('ChapterDisplayed_Before')
		if (_loaderTimeout>0)
			clearTimeout(_loaderTimeout);
		_loaderTimeout = setTimeout(function() { // timer stops any fast 'flickering' if page is loading from disk, or is quick
    		showLoader();
    		_loaderTimeout = -1;
		}, 300);

	}
	var fnChapterDisplayed_After = function() {
		//console.debug('ChapterDisplayed_After')
		if (_loaderTimeout>0) clearTimeout(_loaderTimeout);
		_loaderTimeout = -1;
		hideLoader();
	}

	document.addEventListener('keydown', arrowKeys, false);

	$next.on("click", function(e){
		
		nextPage();

		e.preventDefault();
	});

	$prev.on("click", function(e){
		prevPage();

		e.preventDefault();
	});

	
	book.on("renderer:spreads", function(bool){
		var bChanged = _hasTwoPageSpreads !== bool;
		_hasTwoPageSpreads = bool;
		if (bChanged && $loader.is(':hidden')) // two page spread changed, but we're not loading
			$divider.toggle(bool);

	});
	book.on('book:displayingChapter', fnChapterDisplayed_Before);
	book.on('renderer:chapterDisplayed', fnChapterDisplayed_After);


	// touch handling
	if ($.fn.swipe) { // jquery.touchswipe.min.js
		console.log('swipe enabled')
		$_main.swipe( {
			swipe:function(e, direction) {
				switch((direction+'').toLowerCase()) {
					case 'down':
					case 'right':
						prevPage();
						flashArrow($prev);
						break;
					case 'up':
					case 'left':
						nextPage();
						flashArrow($next);
						break;
				}
			},
			threshold:75,
			triggerOnTouchEnd:false, // 
			maxTimeThreshold:1000
		});	
	}
	else
		console.log('swipe not enabled')

	// book.on("book:atStart", function(){
	// 	$prev.addClass("disabled");
	// });
	// 
	// book.on("book:atEnd", function(){
	// 	$next.addClass("disabled");	
	// });

	return {
		"slideOut" : slideOut,
		"slideIn"  : slideIn,
//		"showLoader" : showLoader,
		"hideLoader" : hideLoader,
//		"showDivider" : showDivider,
//		"hideDivider" : hideDivider,
		"arrowKeys" : arrowKeys
	};
};