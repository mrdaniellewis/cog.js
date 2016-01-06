# `cog`

Helper functions for web development.

## Usage

```html
<html class="no-js">

<head>

	<!-- Add the polyfill service.  
		 This is needed.
		 If you want to support IE <=8 this must go in the <head>
	-->
	<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

	<!-- Optionally add the minified contents of head.js -->
	<script>!function(e,n){var s=e.$=function(e){(s.q=s.q||[]).push(e)},c=n.documentElement
c.className=c.className.replace(/\bno-js\b/,"js")}(this,document)</script>

	<!-- Any <link rel="stylesheet"> should go under the 
	 	 scripts otherwise they will wait for the CSS before executing 
	-->

<body>

	<!-- Document content -->

	<!-- Functions added to $ will be executed after cog has loaded -->
	<script>
		$( function() {
			// do stuff
		} );
	</script>

	<!-- Add cog bundled with your other scripts -->
	<script src="bundle.js"></script>

```
