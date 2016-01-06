describe( 'head.js', function() {

	describe( '<html> classname', function() {

		it( 'should contain "js"', function() {

			var html = document.documentElement;
			var hasJsClass = html.classList.contains('js');
			
			expect( hasJsClass ).toBe( true );

		} );

		it( 'should not contain "no-js"', function() {

			var html = document.documentElement;
			var hasNoJsClass = html.classList.contains('no-js');

			expect( hasNoJsClass ).toBe( false );

		} );
	} );

} );