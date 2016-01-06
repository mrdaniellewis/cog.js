// Place this above any CSS to prevent 
// execution being blocked until the CSS loads
// (Find reference)

( function( global, document ) {

	var $ = global.$ = function(fn) {
		( $.q = $.q || [] ).push(fn);
	};

	// Add no-js
	var html = document.documentElement;
	html.className = html.className.replace( /\bno-js\b/, 'js' );

}( this, document ) ); 