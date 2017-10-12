EPUBJS.reader.ReaderController = function(book) {
	var $main = $("#main"),
			$_main = $("#_main"),
			$divider = $("#divider"),
			$loader = $("#loader"),
			$next = $("#next"),
			$prev = $("#prev");
	var reader = this;
	var book = this.book;
	var slideIn = function() {
		$main.removeClass("closed");
	};

	var slideOut = function() {
		$main.addClass("closed");
	};

	var showLoader = function() {
		$loader.show();
		hideDivider();
	};

	var hideLoader = function() {
		$loader.hide();
		
		//-- If the book is using spreads, show the divider
		// if(book.settings.spreads) {
		// 	showDivider();
		// }
	};

	var showDivider = function() {
		$divider.addClass("show");
	};

	var hideDivider = function() {
		$divider.removeClass("show");
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

	document.addEventListener('keydown', arrowKeys, false);

	$next.on("click", function(e){
		
		nextPage();

		e.preventDefault();
	});

	$prev.on("click", function(e){
		prevPage();

		e.preventDefault();
	});

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
	
	book.on("renderer:spreads", function(bool){
		if(bool) {
			showDivider();
		} else {
			hideDivider();
		}
	});

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
		"showLoader" : showLoader,
		"hideLoader" : hideLoader,
		"showDivider" : showDivider,
		"hideDivider" : hideDivider,
		"arrowKeys" : arrowKeys
	};
};