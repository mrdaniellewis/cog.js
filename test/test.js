/**
 *	Test the main framework
 *	This must be run as part of test.htm which contains
 *	some test setup.
 */

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

describe( 'cog.js', function() {

	describe( 'window.cog', function() {

		it( 'is a function', function() {
			expect( cog ).toBeA( Function );
		} );

		describe( 'using a function argument', function() {

			it( 'runs a supplied function on domcontentloaded', function() {
				var foo = {};

				// Mocha runs the tests after the document is loaded
				cog( function() {
					window.bar = foo;
				} );

				expect( window.bar ).toBe( foo );

				delete window.bar;


			} );

			it( 'passes cog as the first argument to the supplied function', function() {

				cog( function($) {
					expect($).toBe(cog);
				} );

			} );

		} );

		describe( 'using a HTMLElement argument', function() {

			it( 'returns the element', function() {

				expect( cog(document.body) )
					.toBe( document.body );

			} );

			it( 'gets an element using a selector', function() {

				expect( cog('body') )
					.toBe( document.body );

			} );

			it( 'gets an element using a selector and context', function() {

				expect( cog( 'div', cog('#test-context') ).innerHTML )
					.toBe( 'test context inner' );


			} );

			it( 'returns null if no element is found', function() {

				expect( cog('#notgoingtobefound') )
					.toBe( null );

			} );

		} );

	} );

	describe( 'cog.version', function() {

		it( 'is the library version number', function() {

			expect( cog.version )
				.toBe( '1.0.0alpha' );

		} );

	} );

	describe( 'cog.all', function() {

		it( 'gets all elements returning an array', function() {

			var query = '#test-elements li';
			var found = document.querySelectorAll(query);
			var expected = [];
			for( var i = 0; i < found.length; ++i ) {
				expected.push(found[i]);
			}

			expect( cog.all(query) )
				.toEqual( expected );

		} );

		it( 'returns an empty array if no elements are found', function() {

			expect( cog.all('#notgoingtobefound') )
				.toEqual( [] );

		} );

		it( 'gets all elements using a selector and a context', function() {

			expect( cog.all( 'div', cog('#test-context') ).length )
					.toBe( 1 );

		} );

		it( 'converts a NodeList to an array', function() {

			var form = document.querySelector('#test-elements form');
			var expected = [];
			for( var i = 0; i < form.elements.length; ++i ) {
				expected.push(form.elements[i]);
			}

			expect( cog.all(form.elements) )
				.toEqual( expected );

		} );


	} );

	describe( 'cog.create', function() {

		it( 'creates an element from a string name', function() {

			var div = cog.create('div');
			// Can't use toBeA as it is not a function in Safari
			expect( div instanceof HTMLElement ).toBe( true );
			expect( div.nodeName.toLowerCase() ).toBe( 'div' );

		} );

		it( 'creates an array of elements from string names', function() {

			var els = cog.create( ['div', 'p', 'span']);
			expect( els ).toBeAn( Array );
			expect( els[0].nodeName.toLowerCase() ).toBe( 'div' );
			expect( els[1].nodeName.toLowerCase() ).toBe( 'p' );
			expect( els[2].nodeName.toLowerCase() ).toBe( 'span' );

		} );

		it( 'returns a cog element', function() {

			expect( cog.create( document.body ) ).toBe( document.body );

		} );

		it( 'creates a cog element from an object', function() {

			var div = cog.create( {nodeName: 'div'});
			expect( div instanceof HTMLElement ).toBe( true );
			expect( div.nodeName.toLowerCase() ).toBe( 'div' );

		} );

		it( 'creates a cog element from html', function() {

			var div = cog.create( '<div class="test" lang="cy">' );
			expect( div instanceof HTMLElement ).toBe( true );
			expect( div.nodeName.toLowerCase() ).toBe( 'div' );
			expect( div.className ).toBe( 'test' );
			expect( div.lang ).toBe( 'cy' );

		} );

		it( 'creates an array of elements from html', function() {

			var ps = cog.create( '<p><p><p>' );
			expect( ps ).toBeAn( Array );
			expect( ps.length ).toEqual(3);
			expect( ps.map( function(node) { return node.nodeName.toLowerCase(); } ) )
				.toEqual( ['p','p','p'] );

		} );


	} );

	describe( 'cog.remove', function() {

		it( 'removes a node and returns it', function() {

			var div = cog.create('div');
			document.body.appendChild(div);

			expect( div.parentNode ).toBe(document.body);
			
			var ret = cog.remove(div);
			expect( div.parentNode ).toBe(null);

		} );

		it( 'returns the element', function() {

			var div = cog.create('div');
			document.body.appendChild(div);

			expect( cog.remove( div ) )
				.toBe( div );

		} );

	} );

	describe( 'cog.empty', function() {

		it( 'removes all children of a node', function() {

			var div = cog.create('ul');
			div.innerHTML = '<li>one><li>two<li>three';

			expect( div.children.length ).toBe(3);
			
			cog.empty(div);
			expect( div.children.length ).toBe(0);

		} );

		it( 'returns the element', function() {

			var el = cog.create('div');

			expect( cog.empty( el ) )
				.toBe( el );

		} );

	} );

	describe( 'cog.attributes', function() {

		var $input;

		beforeEach( function() {
			$input = cog.create('input');
			document.body.appendChild( $input );
		});

		afterEach( function() {
			cog.remove($input);
		});

		it( 'sets attributes on a dom node', function() {

			cog.attributes( $input, {
				'data-foo': 'bar'
			} );

			expect( $input.getAttribute('data-foo') ).toBe( 'bar' );

		} );

		it( 'sets boolean attributes as empty', function() {

			cog.attributes( $input, {
				'required': true
			} );

			expect( $input.getAttribute('required') ).toBe( '' );

		} );

		it( 'does not set non-string falsey attributes', function() {

			cog.attributes( $input, {
				'required': false,
				'readonly': null,
				'disabled': undefined,
				'data-foo': '',
				maxlength: 0
			} );

			expect( $input.hasAttribute('required') ).toBe( false );
			expect( $input.hasAttribute('readonly') ).toBe( false );
			expect( $input.hasAttribute('disabled') ).toBe( false );
			expect( $input.hasAttribute('data-foo') ).toBe( true );
			expect( $input.hasAttribute('maxlength') ).toBe( true );

		} );

		it( 'removes non-string falsey attributes', function() {

			var el = cog.create('<input id="attribute-removal" data-foo="bar" data-keep="" required readonly disabled maxlength="0">');
			document.body.appendChild(el);

			cog.attributes( el, {
				'required': false,
				'readonly': null,
				'disabled': undefined,
				'data-foo': false,
				'data-keep': '',
				maxlength: 0
			} );

			expect( el.hasAttribute('required') ).toBe( false );
			expect( el.hasAttribute('readonly') ).toBe( false );
			expect( el.hasAttribute('disabled') ).toBe( false );
			expect( el.hasAttribute('data-foo') ).toBe( false );
			expect( el.hasAttribute('maxlength') ).toBe( true );

			cog.remove(el);

		} );

		it( 'returns the element', function() {

			expect( cog.attributes( $input, {} ) )
				.toBe( $input );

		} );

	} );

	describe( 'cog.properties', function() {

		it( 'sets properties on a dom node', function() {

			var input = cog.create('input');
			document.body.appendChild( input );

			cog.properties( input, {
				xxx: 'bar',
				required: true,
				disabled: false
			} );

			expect( input.xxx ).toBe( 'bar' );
			expect( input.required ).toBe( true );
			expect( input.disabled ).toBe( false );

			cog.remove(input);

		} );

		it( 'returns the element', function() {

			var el = cog.create('div');

			expect( cog.properties( el, {} ) )
				.toBe( el );

		} );

	} );

	describe( 'inserting elements', function() {

		var container;

		beforeEach( function() { 

			container = cog.create('div');
			container.innerHTML = '<div id="insert-test-1"><p><p></div><div id="insert-test-2"><p><p></div><div id="insert-test-3"></div>';
			document.body.appendChild(container);
		} );

		afterEach( function() {
			cog.remove(container);
		} );

		describe( 'cog.append', function() {


			it( 'appends an element to parent', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-1', container );
				cog.append( parentElement, el );

				expect( parentElement.lastChild ).toBe( el );

			} );

			it( 'creates and appends an element to parent', function() { 

				var parentElement = cog( '#insert-test-1', container );
				cog.append( parentElement, 'wbr' );

				expect( parentElement.lastChild.nodeName.toLowerCase() ).toBe( 'wbr' );

			} );

			it( 'appends an array of elements', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-1', container );
				cog.append( parentElement, els );

				expect( cog.all(parentElement.children).slice(-3) ).toEqual( els );

			} );

			it( 'returns the target element', function() {

				var el = cog.create('div');

				expect( cog.append( el, cog.create('div') ) )
					.toBe( el );

			} );

		} );

		describe( 'cog.prepend', function() {


			it( 'prepend an element to parent', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-1', container );
				cog.prepend( parentElement, el );

				expect( parentElement.firstChild ).toBe( el );

			} );

			it( 'creates and prepend an element to parent', function() { 

				var parentElement = cog( '#insert-test-1', container );
				cog.prepend( parentElement, 'wbr' );

				expect( parentElement.firstChild.nodeName.toLowerCase() ).toBe( 'wbr' );

			} );

			it( 'prepend an array of elements', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-1', container );
				cog.prepend( parentElement, els );

				expect( cog.all(parentElement.children).slice(0,3) ).toEqual( els );

			} );

			it( 'prepends when there are no children', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-3', container );
				cog.prepend( parentElement, els );

				expect( cog.all(parentElement.children) ).toEqual( els );

			} );

			it( 'returns the target element', function() {

				var el = cog.create('div');

				expect( cog.prepend( el, cog.create('div') ) )
					.toBe( el );

			} );

		} );

		describe( 'cog.before', function() {

			it( 'inserts an element before another', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-2', container );
				cog.before( parentElement, el );

				expect( parentElement.previousSibling ).toBe( el );

			} );

			it( 'creates and inserts an element before another', function() { 

				var parentElement = cog( '#insert-test-2', container );
				cog.before( parentElement, 'wbr' );

				expect( parentElement.previousSibling.nodeName.toLowerCase() ).toBe( 'wbr' );

			} );

			it( 'inserts an array of elements before another', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-2', container );
				cog.before( parentElement, els );

				var siblings = cog.all(parentElement.parentNode.children);
				var index = siblings.indexOf( els[0] );

				expect( siblings.slice( index, index + 4 ) ).toEqual( els.concat(parentElement) );

			} );

			it( 'returns the target element', function() {

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-2', container );

				expect( cog.before( parentElement, el ) )
					.toBe( parentElement );

			} );

		} );

		describe( 'cog.after', function() {

			it( 'inserts an element after another', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-2', container );
				cog.after( parentElement, el );

				expect( parentElement.nextSibling ).toBe( el );

			} );

			it( 'creates and inserts an element after another', function() { 

				var parentElement = cog( '#insert-test-2', container );
				cog.after( parentElement, 'wbr' );

				expect( parentElement.nextSibling.nodeName.toLowerCase() ).toBe( 'wbr' );

			} );

			it( 'inserts an array of elements after another', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-2', container );
				cog.after( parentElement, els );

				var siblings = cog.all(parentElement.parentNode.children);
				var index = siblings.indexOf( parentElement );

				expect( siblings.slice( index, index + 4 ) ).toEqual( [parentElement].concat(els) );

			} );

			it( 'inserts when there is no next sibling', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-3', container );
				cog.after( parentElement, els );

				var siblings = cog.all(parentElement.parentNode.children);
				var index = siblings.indexOf( parentElement );

				expect( siblings.slice( index, index + 4 ) ).toEqual( [parentElement].concat(els) );

			} );

			it( 'returns the target element', function() {

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-2', container );

				expect( cog.after( parentElement, el ) )
					.toBe( parentElement );

			} );

		} );

		describe( 'cog.contents', function() {

			it( 'appends an element to parent', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-3', container );
				cog.contents( parentElement, el );

				expect( parentElement.lastChild ).toBe( el );

			} );

			it( 'creates and appends an element to parent', function() { 

				var parentElement = cog( '#insert-test-3', container );
				cog.contents( parentElement, 'wbr' );

				expect( parentElement.lastChild.nodeName.toLowerCase() ).toBe( 'wbr' );

			} );

			it( 'appends an array of elements', function() { 

				var els = cog.create( ['a', 'a', 'a'] );
				var parentElement = cog( '#insert-test-3', container );
				cog.contents( parentElement, els );

				expect( cog.all(parentElement.children).slice(-3) ).toEqual( els );

			} );

			it( 'replaces the contents of a node', function() { 

				var el = cog.create('div');
				var parentElement = cog( '#insert-test-1', container );
				cog.contents( parentElement, el );

				expect( cog.all(parentElement.children) ).toEqual( [el] );

			} );

			it( 'returns the target element', function() {

				var el = cog.create('div');

				expect( cog.contents( el, cog.create('div') ) )
					.toBe( el );

			} );

		} );

	} );


	describe( 'cog.set', function() {

		it( 'calls a function on cog with a matching property name', function() {

			var mockCog = {
				set: cog.set,
				spy: expect.createSpy()
			};

			var el = {};
			mockCog.set( el, {
				spy: 'test'
			} );

			expect( mockCog.spy ).toHaveBeenCalled();
			expect ( mockCog.spy.calls[0].arguments[0] ).toBe( el );
			expect ( mockCog.spy.calls[0].arguments[1] ).toBe( 'test' );

		} );

		it( 'adds properties to the element where no function matches', function() {

			var mockCog = {
				set: cog.set
			};

			var el = {};
			mockCog.set( el, {
				foo: 'bar'
			} );

			expect( el.foo ).toBe( 'bar' );

		} );

		it( 'ignores the nodeName property', function() {

			var mockCog = {
				set: cog.set
			};

			var el = {};
			mockCog.set( el, {
				nodeName: 'bar'
			} );

			expect( el.nodeName ).toBe( undefined );

		} );

		it( 'returns the target element', function() {

			var el = cog.create('div');

			expect( cog.set( el, {} ) )
				.toBe( el );

		} );


	} );

	describe( 'events', function() { 

		var $container;
		var $delegated;
		var $input;

		beforeEach( function() {

			$container = cog.create('<div id="event_container">\
		            <div id="event_delegated">\
		                <input id="event_input">\
		            </div>\
		        <div>'
		    );

		    cog.append( document.body, $container );

		    $delegated = cog( '#event_delegated', $container );
		    $input = cog( '#event_input', $container );

		} );

		afterEach( function() {

			$delegated = null;
			$input = null;
			cog.remove( $container );

		} );


		describe( 'cog.on', function() {

			it( 'attaches an event listener to an element', function() {
				var spy = expect.createSpy();
				cog.on( $input, 'click', spy );
				$input.click();
				expect(spy).toHaveBeenCalled();
				expect(spy.calls[0].arguments[0].type).toBe( 'click' );
			} );

			describe( 'delgated events', function() {
				
				it( 'attaches a delegated event listener to an element', function() {
					var spy = expect.createSpy();
					cog.on( $delegated, 'click', 'input', spy );
					$input.click();
					expect(spy.calls.length).toEqual(1);
					expect(spy.calls[0].arguments[0].type).toBe( 'click' );
				} );

				it( 'can trigger a delegated event called on itself', function() {
					var spy = expect.createSpy();
					cog.on( $delegated, 'click', 'div', spy );
					$delegated.click();
					expect(spy.calls.length).toEqual(1);
					expect(spy.calls[0].arguments[0].type).toBe( 'click' );
				} );

				it( 'does not trigger a delegated event where the match is on a parent', function() {
					var spy = expect.createSpy();
					cog.on( $container, 'click', '#event_container', spy );
					$container.click();
					expect(spy.calls.length).toEqual(1);
					expect(spy.calls[0].arguments[0].type).toBe( 'click' );
				} );

				it( 'does not trigger a delegated event where there is no match', function() {
					var spy = expect.createSpy();
					cog.on( $container, 'click', '#willnotmatch', spy );
					$input.click();
					expect(spy).toNotHaveBeenCalled();
				} );

			} );

			describe( 'ref parameter', function() {
				
				it( 'allows a delegated event to be removed', function() {

					var spy = expect.createSpy();
					var ref = {};
					cog.on( $delegated, 'click', 'input', spy, ref );
					expect(ref.fn).toBeA( Function );
					
					// Check the event is called
					$input.click();
					expect(spy.calls.length).toEqual(1);
					expect(spy.calls[0].arguments[0].type).toBe( 'click' );
					
					// Remove and check it isn't called
					$delegated.removeEventListener( 'click', ref.fn, false );
					$input.click();
					expect(spy.calls.length).toEqual(1);

				} );

				

			} );

			it( 'returns the element', function() {

				expect( cog.on( $input, 'click', function() {} ) )
					.toBe( $input );

			} );

		} );

		describe( 'cog.once', function() {

			it( 'Attaches an event and removes it after one call', function() {

				var spy = expect.createSpy();
				cog.once( $input, 'click', spy );
				
				// Check the event is called
				$input.click();
				expect(spy.calls.length).toEqual(1);
				expect(spy.calls[0].arguments[0].type).toBe( 'click' );
				
				// Check it isn't called a second time
				$input.click();
				expect(spy.calls.length).toEqual(1);


			} );

			it( 'Attaches a delegated event and removes it after one call', function() {

				var spy = expect.createSpy();
				cog.once( $delegated, 'click', 'input', spy );
				
				// Check the event is called
				$input.click();
				expect(spy.calls.length).toEqual(1);
				expect(spy.calls[0].arguments[0].type).toBe( 'click' );
				
				// Check it isn't called a second time
				$input.click();
				expect(spy.calls.length).toEqual(1);


			} );

			it( 'returns the element', function() {

				expect( cog.once( $input, 'click', function() {} ) )
					.toBe( $input );

			} );

		} );

		describe( 'cog.emit', function() {

			it( 'triggers an event', function() {

				var spy = expect.createSpy();
				cog.on( $input, 'custom', spy );
				cog.emit( $input, 'custom' );

				expect(spy.calls.length).toEqual(1);
				expect(spy.calls[0].arguments[0].type).toBe( 'custom' );

			} );

			it( 'can create a bubbling event', function() {

				var spy = expect.createSpy();
				
				cog.on( $delegated, 'custom', spy );
				cog.emit( $input, 'custom', { bubbles: true } );

				expect(spy.calls.length).toEqual(1);
				expect(spy.calls[0].arguments[0].type).toBe( 'custom' );

			} );
			
			it( 'can create a cancelable event by default', function() {

				cog.on( $input, 'custom', function(e) {
					expect( e.cancelable ).toBe( true );
					e.preventDefault();
				} );

				cog.on( $delegated, 'custom', function(e) {
					expect( e.defaultPrevented ).toBe( true );
				} );

				cog.emit( $input, 'custom', {cancelable: true, bubbles: true} );

			} );

			it( 'attaches supplied data to the event', function() {
				
				cog.on( $input, 'custom', function(e) {
					expect( e.detail.foo ).toBe( 'bar' );
				} );

				cog.emit( $input, 'custom', { detail: {foo: 'bar'} } );

			} );


			it( 'triggers using a supplied event object', function() {

				var customEvent = new CustomEvent('custom');
				
				cog.on( $input, 'custom', function(e) {
					expect( e ).toBe( customEvent );
				} );

				cog.emit( $input, customEvent );


			} );

			it( 'returns the element', function() {

				expect( cog.emit( $input, 'test') )
					.toBe( $input );

			} );

		} );

		describe( 'cog.events', function() {

			it( 'attaches an event listener to an element', function() {
				var spy = expect.createSpy();
				cog.events( $input, { click: spy } );
				$input.click();
				expect(spy).toHaveBeenCalled();
				expect(spy.calls[0].arguments[0].type).toBe( 'click' );
			} );

			it( 'attaches a delegated event listener to an element', function() {
				var spy = expect.createSpy();
				cog.events( $delegated, { click: { 'input': spy } } );
				$input.click();
				expect(spy.calls.length).toEqual(1);
				expect(spy.calls[0].arguments[0].type).toBe( 'click' );
			} );

			it( 'returns the element', function() {

				expect( cog.events( $input, {} ) )
					.toBe( $input );

			} );

		} );

	} );

	describe( '$', function() {

		it( 'is cog', function() {

			expect( $ ).toBe( cog );

		} );

	} );

	describe( 'cog._$', function() {

		it( 'is set to the original value of $', function() {

			expect( cog._$ ).toBe( window.original$ );

		} );

	} );

	describe( 'queued functions', function() {

		it( 'runs functions queued on $ before cog was created', function() {

			expect( window.queuedTestRun).toBe( window.queuedTestValue );

		} );

	} );


	describe( '$$', function() {

		it( 'is cog.all', function() {

			expect( $$ ).toBe( cog.all );

		} );

	} );

	describe( 'cog._$$', function() {

		it( 'is set to the original value of $$', function() {

			expect( cog._$$ ).toBe( window.original$$ );

		} );

	} );



} );