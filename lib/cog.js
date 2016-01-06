/* eslint no-shadow: [2, { "builtinGlobals": true, "hoist": "all", allow: [ "document", "undefined", "name" ] }]*/

( function( global, document, undefined ){

	/**
	 *	Is the input an html element.  Somewhat unnecessary support for IE < 8
	 *	@param {Object} el The object to test
	 *	@returns {Boolean}
	 */
	function isNode(el) {
		return ( typeof HTMLElement !== 'undefined' && el instanceof HTMLElement )
			|| ( el && el.nodeType === 1 );
	}

	var old$ = global.$;
	var old$$ = global.$$;

	/**
	 *	Overloaded
	 *	Runs select an element or run a function when the dom is loaded
	 *	@param {Function} arg The function to run when the dom is loaded
	 *	@param {String} arg Query to select the element
	 *	@param {HTMLElement} arg An element that will be returned as is
	 *	@param {HTMLElement} [context] Context for an element query 
	 */
	var $ = global.$ = global.cog = function( arg, context ) {
		
		if ( typeof arg === 'function' ) {
			if ( /interactive|complete/.test(document.readyState) ) {
				arg($);
			} else {
				this.on( document, 'DOMContentLoaded', arg.bind($) );
			}
		} else if ( isNode(arg) ) {
			return arg;

		} else {

			context = context || document;
			return context.querySelector(arg);
		}
	
	};

	/**
	 *	Store the previous value of window.$
	 *	@type {Object}
	 */ 
	$._$ = old$;

	/**
	 *	Store the previous value of window.$$
	 *	@type {Object}
	 */ 
	$._$$ = old$$;

	/**
	 *	Version of the library
	 *	@type {String}
	 */
	$.version = '1.0.0alpha';

	/**
	 *	Find multiple elements and return as an array
	 *	@param {String} query CSS selector
	 *	@param {Object[]} query Array of objects that will be returned as is
	 *	@param {HTMLElement} [context] Context for the query
	 *	@returns {HTMLElement[]}
	 */
	$.all = global.$$ = function( query, context ) {
		
		var result;

		if ( typeof query === 'string' ) {
			context = context || document;	
			result = context.querySelectorAll(query);
		} else {
			result = query;
		}

		return [].slice.call(result);
	};

	/**
	 *	Set an event on an element
	 *	@param {HTMLElement} el The element to set the event on
	 *	@param {String} name The event name
	 *	@param {String} [query] A delegated query
	 *	@param {Function} fn The function
	 *	@param {Object} [ref] If this is a delegated query, 
	 *		the function attached to the event will be added as 
	 *		'fn' property of this object.  This will allow
	 *		an event to be removed.
	 *
	 *	@returns {HTMLElement} The element the event was attached to
	 */
	$.on = function( el, name, query, fn, ref ) {
		
		var attached;

		if ( typeof fn === 'function' ) {
			
			attached = function(e) {
				
				var cursor = e.target;

				do {

					if ( cursor.matches(query) ) {
						fn(e);
						return;
					}
					cursor = cursor.parentNode;

				} while( cursor && cursor !== e.currentTarget && cursor.matches );
			};

			if ( ref ) {
				ref.fn = attached;
			}

		} else { 
			attached = query;
		}

		el.addEventListener( name, attached, false );

		return el;
	};

	/**
	 *	Run an event once only
	 *	@param {HTMLElement} el The element to set the event on
	 *	@param {String} name The event name
	 *	@param {String} [query] A delegated query
	 *	@param {Function} fn The function
	 *
	 *	@returns {HTMLElement} The element the event was attached to
	 */
	$.once = function( el, name, query, fn ) {

		var delegated = true;
		var ref = {};

		if ( typeof fn !== 'function' ) {
			fn = query;
			delegated = false;
		}
		
		var attached = function(e) {
			el.removeEventListener( name, ref.fn || attached, false );
			fn(e);
		};

		if ( delegated ) {
			this.on( el, name, query, attached, ref );
		} else {
			this.on( el, name, attached );
		}

		return el;
	};

	/**
	 *	Emit an event
	 *	@param {HTMLElement} el The element to set the event on
	 *	@param {String} name The event name
	 *	@param {Event} name An event object
	 *	@param {Object} [data] Data to attach when using a string event
	 *
	 *	@returns {HTMLElement} The element the event was dispatched from
	 */
	$.emit = function( el, name, data ) {

		if ( !(name instanceof Event) ) {
			name = new CustomEvent( name, data );
		}

		el.dispatchEvent( name );
	
		return el;
	};

	/**
	 *	Create html element
	 *	@param {String} name The name of the element
	 *	@param {String} name An HTML string starting with < and ending with >
	 *	@param {Object} name An Object with at least the property nodeName
	 *	@param {Object[]} name An array of strings or objects
	 *	@param {Object} things Properties, events and attributes to add to the element
	 *
	 *	@returns {HTMLElement} The element
	 *	@returns {HTMLElement[]} An array of elements if the input was an array, or the html
	 *		string produced siblings
	 */
	$.create = function( name, things ) {

		var el;
		if ( Array.isArray(name) ) {
			return name
				.filter(Boolean)
				.map( $.create, this );
		}

		if ( typeof name === 'string' ) {

			if ( name.slice(0,1) === '<' && name.slice(-1) === '>' ) {

				var temp = $.create('div');
				temp.innerHTML = name;
				var children = temp.children;
				if ( children.length > 1 ) {
					return $.create( $.all(children) );
				}

				el = temp.children[0];

			}

		} else {

			if ( isNode(name) ) {
				el = name;
			} else {
				things = name;
				name = name.nodeName;
			}

		}

		if ( !el ) {
			el = document.createElement(name);	
		}

		this.set( el, things || {} );

		return el;
	};

	/**
	 *	Empty and set the children of an element
	 *	@param {HTMLElement} el The element to set the innerHTML
	 *	@param {HTMLElement[]|String[]|Object[]} elements to add (passed to create) 
	 *
	 *	@returns {HTMLElement} The element the contents were set on
	 */
	$.contents = function( el, elements ) {

		this.empty(el);
		this.append( el, elements );
		return el;

	};

	/**
	 *	Remove children from an element
	 *	@param {HTMLElement} el The element to set the innerHTML
	 *
	 *	@returns {HTMLElement} The element that was emptied
	 */
	$.empty = function( el ) {	
		this.all(el.children).map( $.remove );
		return el;
	};

	/**
	 *	Remove an element from the DOM
	 *	@param {HTMLElement} el The element to remove
	 *
	 *	@returns {HTMLElement} The element that was removed
	 */
	$.remove = function( el ) {
		el.parentNode.removeChild(el);
		return el;
	};

	/**
	 *	Set things on an element
	 *	@param {DOMElement} el The element to add things to
	 *	@param {Object} things The things to add
	 *
	 *	@returns {HTMLElement} The element
	 */
	$.set = function( el, things ) {

		for ( var i in things ) {
			if ( i === 'nodeName' ) {
				// Do nothing
			} else if ( typeof this[i] === 'function' ) {
				this[i]( el, things[i] );
			} else {
				el[i] = things[i];
			}
		}

		return el;
	};

	/**
	 *	Set events on an element
	 *	@param {DOMElement} el The element to set events on
	 *	@param {Object} events Keys are events, and properties functions.
	 *		Properties can also be Objects were the keys are delegated queries
	 *
	 *	@returns {HTMLElement} The element the events were set on
	 */
	$.events = function( el, events ) {

		for( var i in events ) {
			
			var value = events[i];

			if ( typeof value === 'function' ) {
				this.on( el, i, value );
			} else if ( value ) {
				for ( var j in value ) {
					this.on( el, i, j, value[j] );
				}
			}
		}

		return el;
	};

	/**
	 *	Set attributes on an element
	 *	@param {DOMElement} el The element to add attributes to
	 *	@param {Object} things The attributes to set.
	 *		False, undefined or null properties will remove attributes
	 *
	 *	@returns {HTMLElement} The element
	 */
	$.attributes = function( el, attributes ) {

		for ( var i in attributes ) {
			if ( attributes[i] == null || attributes[i] === false ) {
				el.removeAttribute( i );
			} else {
				el.setAttribute( i, attributes[i] === true ? '' : attributes[i] );
			}
		}

		return el;
	};

	/**
	 *	Add properties to an element
	 *	@param {DOMElement} el The element to add properties to
	 *	@param {Object} properties Properties to add
	 */
	$.properties = function( el, properties ) {
		
		for ( var i in properties ) {
			el[i] = properties[i];
		}

		return el;
	};

	/**
	 *	Add a element as the last child
	 *	@param {DOMElement} target The reference element
	 *	@param {DOMElement} el The element to add
	 */
	$.append = function( target, el ) {
		
		[].concat( this.create(el) )
			.map( target.appendChild, target );

		return target;
	};

	/**
	 *	Add a element as the first child
	 *	@param {DOMElement} target The reference element
	 *	@param {DOMElement} el The element to add
	 */
	$.prepend = function( target, el ) {
		
		[].concat( this.create(el) )
			.map( function(node) {
				target.insertBefore( node, target.firstChild );
			} );

		return target;
	};

	/**
	 *	Add a element as a sibling before another
	 *	@param {DOMElement} target The reference element
	 *	@param {DOMElement} el The element to add
	 */
	$.before = function( target, el ) {
		
		[].concat( this.create(el) )
			.map( function(node) {
				target.parentNode.insertBefore( node, target );
			} );

		return target;
	};

	/**
	 *	Add a element as a sibling after another
	 *	@param {DOMElement} target The reference element
	 *	@param {DOMElement} el The element to add
	 */
	$.after = function( target, el ) {
		
		[].concat( this.create(el) )
			.map( function(node) {
				target.parentNode.insertBefore( node, target.nextSibling );
			} );

		return target;
	};

	// If the old $ has a q property then run the functions in the q
	if ( old$ && old$.q ) {
		[].concat(old$.q)
			.map($,$);
	}

}( this, document ) );