/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/b-1.6.5/b-flash-1.6.5/fh-3.1.7/r-2.2.6/rg-1.1.2/sb-1.0.0/sp-1.2.1
 *
 * Included libraries:
 *   Buttons 1.6.5, Flash export 1.6.5, FixedHeader 3.1.7, Responsive 2.2.6, RowGroup 1.1.2, SearchBuilder 1.0.0, SearchPanes 1.2.1
 */

/*! Buttons for DataTables 1.6.5
 * ©2016-2020 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeIn( duration, fn );
	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeOut( duration, fn );
	}
	else {
		el.css('display', 'none');
		
		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( Array.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, base !== undefined, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node)
			.addClass( this.c.dom.button.disabled )
			.attr('disabled', true);

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node)
			.removeClass( this.c.dom.button.disabled )
			.removeAttr('disabled');

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var dt = this.s.dt;
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		$(dt.table().node()).triggerHandler( 'buttons-processing.dt', [
			flag, dt.button( node ), dt, $(node), button.conf
		] );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! Array.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( Array.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined && attachPoint !== null ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				built.collection = $('<'+this.c.dom.collection.tag+'/>');

				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var tag = config.tag || buttonDom.tag;
		var clickBlurs = config.clickBlurs === undefined ? true : config.clickBlurs
		var button = $('<'+tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}
				if( clickBlurs ) {
					button.trigger('blur');
				}
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		// Button tags should have `type=button` so they don't have any default behaviour
		if ( tag.toLowerCase() === 'button' ) {
			button.attr( 'type', 'button' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! Array.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return Array.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( Array.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	},

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	_popover: function ( content, hostButton, inOpts ) {
		var dt = hostButton;
		var buttonsSettings = this.c;
		var options = $.extend( {
			align: 'button-left', // button-right, dt-container
			autoClose: false,
			background: true,
			backgroundClassName: 'dt-button-background',
			contentClassName: buttonsSettings.dom.collection.className,
			collectionLayout: '',
			collectionTitle: '',
			dropup: false,
			fade: 400,
			rightAlignClassName: 'dt-button-right',
			tag: buttonsSettings.dom.collection.tag
		}, inOpts );
		var hostNode = hostButton.node();

		var close = function () {
			_fadeOut(
				$('.dt-button-collection'),
				options.fade,
				function () {
					$(this).detach();
				}
			);

			$(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes())
				.attr('aria-expanded', 'false');

			$('div.dt-button-background').off( 'click.dtb-collection' );
			Buttons.background( false, options.backgroundClassName, options.fade, hostNode );

			$('body').off( '.dtb-collection' );
			dt.off( 'buttons-action.b-internal' );
		};

		if (content === false) {
			close();
		}

		var existingExpanded = $(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes());
		if ( existingExpanded.length ) {
			hostNode = existingExpanded.eq(0);

			close();
		}

		var display = $('<div/>')
			.addClass('dt-button-collection')
			.addClass(options.collectionLayout)
			.css('display', 'none');

		content = $(content)
			.addClass(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostNode.attr( 'aria-expanded', 'true' );

		if ( hostNode.parents('body')[0] !== document.body ) {
			hostNode = document.body.lastChild;
		}

		if ( options.collectionTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.collectionTitle+'</div>');
		}

		_fadeIn( display.insertAfter( hostNode ), options.fade );

		var tableContainer = $( hostButton.table().container() );
		var position = display.css( 'position' );

		if ( options.align === 'dt-container' ) {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (
			position === 'absolute' &&
			(
				display.hasClass( options.rightAlignClassName ) ||
				display.hasClass( options.leftAlignClassName ) ||
				options.align === 'dt-container'
			)
		) {

			var hostPosition = hostNode.position();

			display.css( {
				top: hostPosition.top + hostNode.outerHeight(),
				left: hostPosition.left
			} );

			// calculate overflow when positioned beneath
			var collectionHeight = display.outerHeight();
			var tableBottom = tableContainer.offset().top + tableContainer.height();
			var listBottom = hostPosition.top + hostNode.outerHeight() + collectionHeight;
			var bottomOverflow = listBottom - tableBottom;

			// calculate overflow when positioned above
			var listTop = hostPosition.top - collectionHeight;
			var tableTop = tableContainer.offset().top;
			var topOverflow = tableTop - listTop;

			// if bottom overflow is larger, move to the top because it fits better, or if dropup is requested
			var moveTop = hostPosition.top - collectionHeight - 5;
			if ( (bottomOverflow > topOverflow || options.dropup) && -moveTop < tableTop ) {
				display.css( 'top', moveTop);
			}

			// Get the size of the container (left and width - and thus also right)
			var tableLeft = tableContainer.offset().left;
			var tableWidth = tableContainer.width();
			var tableRight = tableLeft + tableWidth;

			// Get the size of the popover (left and width - and ...)
			var popoverLeft = display.offset().left;
			var popoverWidth = display.width();
			var popoverRight = popoverLeft + popoverWidth;

			// Get the size of the host buttons (left and width - and ...)
			var buttonsLeft = hostNode.offset().left;
			var buttonsWidth = hostNode.outerWidth()
			var buttonsRight = buttonsLeft + buttonsWidth;
			
			// You've then got all the numbers you need to do some calculations and if statements,
			//  so we can do some quick JS maths and apply it only once
			// If it has the right align class OR the buttons are right aligned OR the button container is floated right,
			//  then calculate left position for the popover to align the popover to the right hand
			//  side of the button - check to see if the left of the popover is inside the table container.
			// If not, move the popover so it is, but not more than it means that the popover is to the right of the table container
			var popoverShuffle = 0;
			if ( display.hasClass( options.rightAlignClassName )) {
				popoverShuffle = buttonsRight - popoverRight;
				if(tableLeft > (popoverLeft + popoverShuffle)){
					var leftGap = tableLeft - (popoverLeft + popoverShuffle);
					var rightGap = tableRight - (popoverRight + popoverShuffle);
	
					if(leftGap > rightGap){
						popoverShuffle += rightGap; 
					}
					else {
						popoverShuffle += leftGap;
					}
				}
			}
			// else attempt to left align the popover to the button. Similar to above, if the popover's right goes past the table container's right,
			//  then move it back, but not so much that it goes past the left of the table container
			else {
				popoverShuffle = tableLeft - popoverLeft;

				if(tableRight < (popoverRight + popoverShuffle)){
					var leftGap = tableLeft - (popoverLeft + popoverShuffle);
					var rightGap = tableRight - (popoverRight + popoverShuffle);

					if(leftGap > rightGap ){
						popoverShuffle += rightGap;
					}
					else {
						popoverShuffle += leftGap;
					}

				}
			}

			display.css('left', display.position().left + popoverShuffle);
			
		}
		else if (position === 'absolute') {
			// Align relative to the host button
			var hostPosition = hostNode.position();

			display.css( {
				top: hostPosition.top + hostNode.outerHeight(),
				left: hostPosition.left
			} );

			// calculate overflow when positioned beneath
			var collectionHeight = display.outerHeight();
			var top = hostNode.offset().top
			var popoverShuffle = 0;

			// Get the size of the host buttons (left and width - and ...)
			var buttonsLeft = hostNode.offset().left;
			var buttonsWidth = hostNode.outerWidth()
			var buttonsRight = buttonsLeft + buttonsWidth;

			// Get the size of the popover (left and width - and ...)
			var popoverLeft = display.offset().left;
			var popoverWidth = content.width();
			var popoverRight = popoverLeft + popoverWidth;

			var moveTop = hostPosition.top - collectionHeight - 5;
			var tableBottom = tableContainer.offset().top + tableContainer.height();
			var listBottom = hostPosition.top + hostNode.outerHeight() + collectionHeight;
			var bottomOverflow = listBottom - tableBottom;

			// calculate overflow when positioned above
			var listTop = hostPosition.top - collectionHeight;
			var tableTop = tableContainer.offset().top;
			var topOverflow = tableTop - listTop;

			if ( (bottomOverflow > topOverflow || options.dropup) && -moveTop < tableTop ) {
				display.css( 'top', moveTop);
			}

			popoverShuffle = options.align === 'button-right'
				? buttonsRight - popoverRight
				: buttonsLeft - popoverLeft;

			display.css('left', display.position().left + popoverShuffle);
		}
		else {
			// Fix position - centre on screen
			var top = display.height() / 2;
			if ( top > $(window).height() / 2 ) {
				top = $(window).height() / 2;
			}

			display.css( 'marginTop', top*-1 );
		}

		if ( options.background ) {
			Buttons.background( true, options.backgroundClassName, options.fade, hostNode );
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

		$('body')
			.on( 'click.dtb-collection', function (e) {
				// andSelf is deprecated in jQ1.8, but we want 1.7 compat
				var back = $.fn.addBack ? 'addBack' : 'andSelf';
				var parent = $(e.target).parent()[0];

				if (( ! $(e.target).parents()[back]().filter( content ).length  && !$(parent).hasClass('dt-buttons')) || $(e.target).hasClass('dt-button-background')) {
					close();
				}
			} )
			.on( 'keyup.dtb-collection', function (e) {
				if ( e.keyCode === 27 ) {
					close();
				}
			} );

		if ( options.autoClose ) {
			setTimeout( function () {
				dt.on( 'buttons-action.b-internal', function (e, btn, dt, node) {
					if ( node[0] === hostNode[0] ) {
						return;
					}
					close();
				} );
			}, 0);
		}

		$(display).trigger('buttons-popover.dt');
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		_fadeIn(
			$('<div/>')
				.addClass( className )
				.css( 'display', 'none' )
				.insertAfter( insertPoint ),
			fade
		);
	}
	else {
		_fadeOut(
			$('div.'+className),
			fade,
			function () {
				$(this)
					.removeClass( className )
					.remove();
			}
		);
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( group === undefined || group === null ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( Array.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( input.trim(), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( Array.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( a[i].trim(), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: ''
		},
		button: {
			// Flash buttons will not work with `<button>` in IE - it has to be `<a>`
			tag: 'ActiveXObject' in window ?
				'a' :
				'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.6.5';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			e.stopPropagation();

			if ( config._collection.parents('body').length ) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = Array.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = Array.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Button resolver to the popover
DataTable.Api.register( 'button().popover()', function (content, options) {
	return this.map( function ( set ) {
		return set.inst._popover( content, this.button(this[0].node), options );
	} );
} );

// Get the container elements
DataTable.Api.register( 'buttons().containers()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

DataTable.Api.register( 'buttons().container()', function () {
	// API level of nesting is `buttons()` so we can zip into the containers method
	return this.containers().eq(0);
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		this.off('destroy.btn-info');
		_fadeOut(
			$('#datatables_buttons_info'),
			400,
			function () {
				$(this).remove();
			}
		);
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	_fadeIn(
		$('<div id="datatables_buttons_info" class="dt-button-info"/>')
			.html( title )
			.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
			.css( 'display', 'none' )
			.appendTo( 'body' )
	);

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	this.on('destroy.btn-info', function () {
		that.buttons.info(false);
	});

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = filename.replace( '*', $('head > title').text() ).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		},
		customizeData: null
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		// Always remove comments
		str = str.replace( /<!\-\-.*?\-\->/g, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<([^>'"]*('[^']*'|"[^"]*")?)*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings, options ) {
	var api = new DataTable.Api( settings );
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group flex-wrap'
		},
		button: {
			className: 'btn btn-secondary'
		},
		collection: {
			tag: 'div',
			className: 'dropdown-menu',
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'active',
				disabled: 'disabled'
			}
		}
	},
	buttonCreated: function ( config, button ) {
		return config.buttons ?
			$('<div class="btn-group"/>').append(button) :
			button;
	}
} );

DataTable.ext.buttons.collection.className += ' dropdown-toggle';
DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';

return DataTable.Buttons;
}));


/*!
 * Flash export buttons for Buttons and DataTables.
 * 2015-2017 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipbaord - MIT license
 * Copyright (c) 2012 Joseph Huckaby
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ZeroClipboard dependency
 */

/*
 * ZeroClipboard 1.0.4 with modifications
 * Author: Joseph Huckaby
 * License: MIT
 *
 * Copyright (c) 2012 Joseph Huckaby
 */
var ZeroClipboard_TableTools = {
	version: "1.0.4-TableTools2",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '', // URL to movie
	nextId: 1, // ID of next movie

	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') {
			thingy = document.getElementById(thingy);
		}
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				this.className = this.className.replace( new RegExp("\\s*" + name + "\\s*"), " ").replace(/^\s+/, '').replace(/\s+$/, '');
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},

	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},

	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},

	log: function ( str ) {
		console.log( 'Flash: '+str );
	},

	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},

	getDOMObjectPosition: function(obj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0,
			top: 0,
			width: obj.width ? obj.width : obj.offsetWidth,
			height: obj.height ? obj.height : obj.offsetHeight
		};

		if ( obj.style.width !== "" ) {
			info.width = obj.style.width.replace("px","");
		}

		if ( obj.style.height !== "" ) {
			info.height = obj.style.height.replace("px","");
		}

		while (obj) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},

	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};

		// unique ID
		this.id = ZeroClipboard_TableTools.nextId++;
		this.movieId = 'ZeroClipboard_TableToolsMovie_' + this.id;

		// register client with singleton to receive flash events
		ZeroClipboard_TableTools.register(this.id, this);

		// create movie
		if (elem) {
			this.glue(elem);
		}
	}
};

ZeroClipboard_TableTools.Client.prototype = {

	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	fileName: '', // default file save name
	action: 'copy', // action to perform
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	sized: false,
	sheetName: '', // default sheet name for excel export

	glue: function(elem, title) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard_TableTools.$(elem);

		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}

		// find X/Y position of domElement
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);

		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '0px';
		style.top = '0px';
		style.width = (box.width) + 'px';
		style.height = box.height + 'px';
		style.zIndex = zIndex;

		if ( typeof title != "undefined" && title !== "" ) {
			this.div.title = title;
		}
		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		}

		// style.backgroundColor = '#f00'; // debug
		if ( this.domElement ) {
			this.domElement.appendChild(this.div);
			this.div.innerHTML = this.getHTML( box.width, box.height ).replace(/&/g, '&amp;');
		}
	},

	positionElement: function() {
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		var style = this.div.style;

		style.position = 'absolute';
		//style.left = (this.domElement.offsetLeft)+'px';
		//style.top = this.domElement.offsetTop+'px';
		style.width = box.width + 'px';
		style.height = box.height + 'px';

		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		} else {
			return;
		}

		var flash = this.div.childNodes[0];
		flash.width = box.width;
		flash.height = box.height;
	},

	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id +
			'&width=' + width +
			'&height=' + height;

		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},

	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},

	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},

	destroy: function() {
		// destroy control and floater
		var that = this;

		if (this.domElement && this.div) {
			$(this.div).remove();

			this.domElement = null;
			this.div = null;

			$.each( ZeroClipboard_TableTools.clients, function ( id, client ) {
				if ( client === that ) {
					delete ZeroClipboard_TableTools.clients[ id ];
				}
			} );
		}
	},

	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard_TableTools.$(elem);
			if (!this.domElement) {
				this.hide();
			}
		}

		if (this.domElement && this.div) {
			var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},

	clearText: function() {
		// clear the text to be copy / saved
		this.clipText = '';
		if (this.ready) {
			this.movie.clearText();
		}
	},

	appendText: function(newText) {
		// append text to that which is to be copied / saved
		this.clipText += newText;
		if (this.ready) { this.movie.appendText(newText) ;}
	},

	setText: function(newText) {
		// set text to be copied to be copied / saved
		this.clipText = newText;
		if (this.ready) { this.movie.setText(newText) ;}
	},

	setFileName: function(newText) {
		// set the file name
		this.fileName = newText;
		if (this.ready) {
			this.movie.setFileName(newText);
		}
	},

	setSheetData: function(data) {
		// set the xlsx sheet data
		if (this.ready) {
			this.movie.setSheetData( JSON.stringify( data ) );
		}
	},

	setAction: function(newText) {
		// set action (save or copy)
		this.action = newText;
		if (this.ready) {
			this.movie.setAction(newText);
		}
	},

	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		this.handlers[eventName].push(func);
	},

	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) {
			this.movie.setHandCursor(enabled);
		}
	},

	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},

	receiveEvent: function(eventName, args) {
		var self;

		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');

		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}

				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}

				this.ready = true;
				this.movie.clearText();
				this.movie.appendText( this.clipText );
				this.movie.setFileName( this.fileName );
				this.movie.setAction( this.action );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;

			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					//this.domElement.addClass('hover');
					if (this.recoverActive) {
						this.domElement.addClass('active');
					}
				}
				break;

			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					//this.domElement.removeClass('hover');
				}
				break;

			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;

			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName

		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];

				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
};

ZeroClipboard_TableTools.hasFlash = function ()
{
	try {
		var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if (fo) {
			return true;
		}
	}
	catch (e) {
		if (
			navigator.mimeTypes &&
			navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
			navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin
		) {
			return true;
		}
	}

	return false;
};

// For the Flash binding to work, ZeroClipboard_TableTools must be on the global
// object list
window.ZeroClipboard_TableTools = ZeroClipboard_TableTools;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * If a Buttons instance is initlaised before it is placed into the DOM, Flash
 * won't be able to bind to it, so we need to wait until it is available, this
 * method abstracts that out.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {jQuery} node  Button
 */
var _glue = function ( flash, node )
{
	var id = node.attr('id');

	if ( node.parents('html').length ) {
		flash.glue( node[0], '' );
	}
	else {
		setTimeout( function () {
			_glue( flash, node );
		}, 500 );
	}
};

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}  config       Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Set the flash text. This has to be broken up into chunks as the Javascript /
 * Flash bridge has a size limit. There is no indication in the Flash
 * documentation what this is, and it probably depends upon the browser.
 * Experimentation shows that the point is around 50k when data starts to get
 * lost, so an 8K limit used here is safe.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {string}        data  Data to send to Flash
 */
var _setText = function ( flash, data )
{
	var parts = data.match(/[\s\S]{1,8192}/g) || [];

	flash.clearText();
	for ( var i=0, len=parts.length ; i<len ; i++ )
	{
		flash.appendText( parts[i] );
	}
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param  {DataTable.Api} dt     DataTables API instance
 * @param  {object}        config Button configuration
 * @return {object}               The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};


// Basic initialisation for the buttons is common between them
var flashButton = {
	available: function () {
		return ZeroClipboard_TableTools.hasFlash();
	},

	init: function ( dt, button, config ) {
		// Insert the Flash movie
		ZeroClipboard_TableTools.moviePath = DataTable.Buttons.swfPath;
		var flash = new ZeroClipboard_TableTools.Client();

		flash.setHandCursor( true );
		flash.addEventListener('mouseDown', function(client) {
			config._fromFlash = true;
			dt.button( button[0] ).trigger();
			config._fromFlash = false;
		} );

		_glue( flash, button );

		config._flash = flash;
	},

	destroy: function ( dt, button, config ) {
		config._flash.destroy();
	},

	fieldSeparator: ',',

	fieldBoundary: '"',

	exportOptions: {},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	filename: '*',

	extension: '.csv',

	header: true,

	footer: false
};


/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ){
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 52; // 40 * 1.3
		}
	}

	max *= 1.3;

	// And a min width
	return max > 6 ? max : 6;
}

  var _serialiser = "";
    if (typeof window.XMLSerializer === 'undefined') {
        _serialiser = new function () {
            this.serializeToString = function (input) {
                return input.xml
            }
        };
    } else {
        _serialiser =  new XMLSerializer();
    }

    var _ieExcel;


/**
 * Convert XML documents in an object to strings
 * @param  {object} obj XLSX document object
 */
function _xlsxToStrings( obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				$.parseXML( excelStrings['xl/worksheets/sheet1.xml'] )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			_xlsxToStrings( val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			obj[ name ] = str;
		}
	} );
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="61">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,       style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,     style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,  style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,   style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,   style: 59 }, // Euros
	{ match: /^\([\d,]+\)$/,        style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^[\d,]+$/,            style: 63 }, // Numbers with thousand separators
	{ match: /^[\d,]+\.\d{2}$/,     style: 64 }  // Numbers with 2d.p. and thousands separators
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables options and methods
 */

// Set the default SWF path
DataTable.Buttons.swfPath = '//cdn.datatables.net/buttons/'+DataTable.Buttons.version+'/swf/flashExport.swf';

// Method to allow Flash buttons to be resized when made visible - as they are
// of zero height and width if initialised hidden
DataTable.Api.register( 'buttons.resize()', function () {
	$.each( ZeroClipboard_TableTools.clients, function ( i, client ) {
		if ( client.domElement !== undefined && client.domElement.parentNode ) {
			client.positionElement();
		}
	} );
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Button definitions
 */

// Copy to clipboard
DataTable.ext.buttons.copyFlash = $.extend( {}, flashButton, {
	className: 'buttons-copy buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		// Check that the trigger did actually occur due to a Flash activation
		if ( ! config._fromFlash ) {
			return;
		}

		this.processing( true );

		var flash = config._flash;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		flash.setAction( 'copy' );
		_setText( flash, output );

		this.processing( false );

		dt.buttons.info(
			dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
			dt.i18n( 'buttons.copySuccess', {
				_: 'Copied %d rows to clipboard',
				1: 'Copied 1 row to clipboard'
			}, data.rows ),
			3000
		);
	},

	fieldSeparator: '\t',

	fieldBoundary: ''
} );

// CSV save file
DataTable.ext.buttons.csvFlash = $.extend( {}, flashButton, {
	className: 'buttons-csv buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var flash = config._flash;
		var data = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var output = config.customize ?
			config.customize( data.str, config, dt ) :
			data.str;

		flash.setAction( 'csv' );
		flash.setFileName( info.filename );
		_setText( flash, output );
	},

	escapeChar: '"'
} );

// Excel save file - this is really a CSV file using UTF-8 that Excel can read
DataTable.ext.buttons.excelFlash = $.extend( {}, flashButton, {
	className: 'buttons-excel buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var flash = config._flash;
		var rowPos = 0;
		var rels = $.parseXML( excelStrings['xl/worksheets/sheet1.xml'] ) ; //Parses xml
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": $.parseXML( excelStrings['_rels/.rels'] )
			},
			xl: {
				_rels: {
					"workbook.xml.rels": $.parseXML( excelStrings['xl/_rels/workbook.xml.rels'] )
				},
				"workbook.xml": $.parseXML( excelStrings['xl/workbook.xml'] ),
				"styles.xml": $.parseXML( excelStrings['xl/styles.xml'] ),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": $.parseXML( excelStrings['[Content_Types].xml'])
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}

				row[i] = typeof row[i].trim === 'function'
					? row[i].trim()
					: row[i];

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]
						} );

						break;
					}
				}

				if ( ! cell ) {
					if ( typeof row[i] === 'number' || (
						row[i].match &&
						row[i].match(/^-?\d+(\.\d+)?$/) &&
						! row[i].match(/^0\d+/) )
					) {
						// Detect numbers - don't match numbers with leading zeros
						// or a negative anywhere but the start
						cell = _createNode( rels, 'c', {
							attr: {
								t: 'n',
								r: cellId
							},
							children: [
								_createNode( rels, 'v', { text: row[i] } )
							]
						} );
					}
					else {
						// String output - replace non standard characters for text output
						var text = ! row[i].replace ?
							row[i] :
							row[i].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

						cell = _createNode( rels, 'c', {
							attr: {
								t: 'inlineStr',
								r: cellId
							},
							children:{
								row: _createNode( rels, 'is', {
									children: {
										row: _createNode( rels, 't', {
											text: text
										} )
									}
								} )
							}
						} );
					}
				}

				rowNode.appendChild( cell );
			}

			relsGet.appendChild(rowNode);
			rowPos++;
		};

		$( 'sheets sheet', xlsx.xl['workbook.xml'] ).attr( 'name', _sheetname( config ) );

		if ( config.customizeData ) {
			config.customizeData( data );
		}

		var mergeCells = function ( row, colspan ) {
			var mergeCells = $('mergeCells', rels);

			mergeCells[0].appendChild( _createNode( rels, 'mergeCell', {
				attr: {
					ref: 'A'+row+':'+createCellPos(colspan)+row
				}
			} ) );
			mergeCells.attr( 'count', mergeCells.attr( 'count' )+1 );
			$('row:eq('+(row-1)+') c', rels).attr( 's', '51' ); // centre
		};

		// Title and top messages
		var exportInfo = dt.buttons.exportInfo( config );
		if ( exportInfo.title ) {
			addRow( [exportInfo.title], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		if ( exportInfo.messageTop ) {
			addRow( [exportInfo.messageTop], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Table itself
		if ( config.header ) {
			addRow( data.header, rowPos );
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		for ( var n=0, ie=data.body.length ; n<ie ; n++ ) {
			addRow( data.body[n], rowPos );
		}

		if ( config.footer && data.footer ) {
			addRow( data.footer, rowPos);
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		// Below the table
		if ( exportInfo.messageBottom ) {
			addRow( [exportInfo.messageBottom], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Set column widths
		var cols = _createNode( rels, 'cols' );
		$('worksheet', rels).prepend( cols );

		for ( var i=0, ien=data.header.length ; i<ien ; i++ ) {
			cols.appendChild( _createNode( rels, 'col', {
				attr: {
					min: i+1,
					max: i+1,
					width: _excelColWidth( data, i ),
					customWidth: 1
				}
			} ) );
		}

		// Let the developer customise the document if they want to
		if ( config.customize ) {
			config.customize( xlsx, config, dt );
		}

		_xlsxToStrings( xlsx );

		flash.setAction( 'excel' );
		flash.setFileName( exportInfo.filename );
		flash.setSheetData( xlsx );
		_setText( flash, '' );

		this.processing( false );
	},

	extension: '.xlsx',
	
	createEmptyCells: false
} );



// PDF export
DataTable.ext.buttons.pdfFlash = $.extend( {}, flashButton, {
	className: 'buttons-pdf buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var flash = config._flash;
		var data = dt.buttons.exportData( config.exportOptions );
		var info = dt.buttons.exportInfo( config );
		var totalWidth = dt.table().node().offsetWidth;

		// Calculate the column width ratios for layout of the table in the PDF
		var ratios = dt.columns( config.columns ).indexes().map( function ( idx ) {
			return dt.column( idx ).header().offsetWidth / totalWidth;
		} );

		flash.setAction( 'pdf' );
		flash.setFileName( info.filename );

		_setText( flash, JSON.stringify( {
			title:         info.title || '',
			messageTop:    info.messageTop || '',
			messageBottom: info.messageBottom || '',
			colWidth:      ratios.toArray(),
			orientation:   config.orientation,
			size:          config.pageSize,
			header:        config.header ? data.header : null,
			footer:        config.footer ? data.footer : null,
			body:          data.body
		} ) );

		this.processing( false );
	},

	extension: '.pdf',

	orientation: 'portrait',

	pageSize: 'A4',

	newline: '\n'
} );


return DataTable.Buttons;
}));


/*! FixedHeader 3.1.7
 * ©2009-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedHeader
 * @description Fix a table's header or footer, so it is always visible while
 *              scrolling
 * @version     3.1.7
 * @file        dataTables.fixedHeader.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _instCounter = 0;

var FixedHeader = function ( dt, config ) {
	// Sanity check - you just know it will happen
	if ( ! (this instanceof FixedHeader) ) {
		throw "FixedHeader must be initialised with the 'new' keyword.";
	}

	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	dt = new DataTable.Api( dt );

	this.c = $.extend( true, {}, FixedHeader.defaults, config );

	this.s = {
		dt: dt,
		position: {
			theadTop: 0,
			tbodyTop: 0,
			tfootTop: 0,
			tfootBottom: 0,
			width: 0,
			left: 0,
			tfootHeight: 0,
			theadHeight: 0,
			windowHeight: $(window).height(),
			visible: true
		},
		headerMode: null,
		footerMode: null,
		autoWidth: dt.settings()[0].oFeatures.bAutoWidth,
		namespace: '.dtfc'+(_instCounter++),
		scrollLeft: {
			header: -1,
			footer: -1
		},
		enable: true
	};

	this.dom = {
		floatingHeader: null,
		thead: $(dt.table().header()),
		tbody: $(dt.table().body()),
		tfoot: $(dt.table().footer()),
		header: {
			host: null,
			floating: null,
			placeholder: null
		},
		footer: {
			host: null,
			floating: null,
			placeholder: null
		}
	};

	this.dom.header.host = this.dom.thead.parent();
	this.dom.footer.host = this.dom.tfoot.parent();

	var dtSettings = dt.settings()[0];
	if ( dtSettings._fixedHeader ) {
		throw "FixedHeader already initialised on table "+dtSettings.nTable.id;
	}

	dtSettings._fixedHeader = this;

	this._constructor();
};


/*
 * Variable: FixedHeader
 * Purpose:  Prototype for FixedHeader
 * Scope:    global
 */
$.extend( FixedHeader.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods
	 */

	/**
	 * Kill off FH and any events
	 */
	destroy: function () {
		this.s.dt.off( '.dtfc' );
		$(window).off( this.s.namespace );

		if ( this.c.header ) {
			this._modeChange( 'in-place', 'header', true );
		}

		if ( this.c.footer && this.dom.tfoot.length ) {
			this._modeChange( 'in-place', 'footer', true );
		}
	},

	/**
	 * Enable / disable the fixed elements
	 *
	 * @param  {boolean} enable `true` to enable, `false` to disable
	 */
	enable: function ( enable, update )
	{
		this.s.enable = enable;

		if ( update || update === undefined ) {
			this._positions();
			this._scroll( true );
		}
	},

	/**
	 * Get enabled status
	 */
	enabled: function ()
	{
		return this.s.enable;
	},
	
	/**
	 * Set header offset 
	 *
	 * @param  {int} new value for headerOffset
	 */
	headerOffset: function ( offset )
	{
		if ( offset !== undefined ) {
			this.c.headerOffset = offset;
			this.update();
		}

		return this.c.headerOffset;
	},
	
	/**
	 * Set footer offset
	 *
	 * @param  {int} new value for footerOffset
	 */
	footerOffset: function ( offset )
	{
		if ( offset !== undefined ) {
			this.c.footerOffset = offset;
			this.update();
		}

		return this.c.footerOffset;
	},

	
	/**
	 * Recalculate the position of the fixed elements and force them into place
	 */
	update: function ()
	{
		var table = this.s.dt.table().node();

		if ( $(table).is(':visible') ) {
			this.enable( true, false );
		}
		else {
			this.enable( false, false );
		}

		this._positions();
		this._scroll( true );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */
	
	/**
	 * FixedHeader constructor - adding the required event listeners and
	 * simple initialisation
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;

		$(window)
			.on( 'scroll'+this.s.namespace, function () {
				that._scroll();
			} )
			.on( 'resize'+this.s.namespace, DataTable.util.throttle( function () {
				that.s.position.windowHeight = $(window).height();
				that.update();
			}, 50 ) );

		var autoHeader = $('.fh-fixedHeader');
		if ( ! this.c.headerOffset && autoHeader.length ) {
			this.c.headerOffset = autoHeader.outerHeight();
		}

		var autoFooter = $('.fh-fixedFooter');
		if ( ! this.c.footerOffset && autoFooter.length ) {
			this.c.footerOffset = autoFooter.outerHeight();
		}

		dt.on( 'column-reorder.dt.dtfc column-visibility.dt.dtfc draw.dt.dtfc column-sizing.dt.dtfc responsive-display.dt.dtfc', function () {
			that.update();
		} );

		dt.on( 'destroy.dtfc', function () {
			that.destroy();
		} );

		this._positions();
		this._scroll();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Clone a fixed item to act as a place holder for the original element
	 * which is moved into a clone of the table element, and moved around the
	 * document to give the fixed effect.
	 *
	 * @param  {string}  item  'header' or 'footer'
	 * @param  {boolean} force Force the clone to happen, or allow automatic
	 *   decision (reuse existing if available)
	 * @private
	 */
	_clone: function ( item, force )
	{
		var dt = this.s.dt;
		var itemDom = this.dom[ item ];
		var itemElement = item === 'header' ?
			this.dom.thead :
			this.dom.tfoot;

		if ( ! force && itemDom.floating ) {
			// existing floating element - reuse it
			itemDom.floating.removeClass( 'fixedHeader-floating fixedHeader-locked' );
		}
		else {
			if ( itemDom.floating ) {
				itemDom.placeholder.remove();
				this._unsize( item );
				itemDom.floating.children().detach();
				itemDom.floating.remove();
			}

			itemDom.floating = $( dt.table().node().cloneNode( false ) )
				.css( 'table-layout', 'fixed' )
				.attr( 'aria-hidden', 'true' )
				.removeAttr( 'id' )
				.append( itemElement )
				.appendTo( 'body' );

			// Insert a fake thead/tfoot into the DataTable to stop it jumping around
			itemDom.placeholder = itemElement.clone( false );
			itemDom.placeholder
				.find( '*[id]' )
				.removeAttr( 'id' );

			itemDom.host.prepend( itemDom.placeholder );

			// Clone widths
			this._matchWidths( itemDom.placeholder, itemDom.floating );
		}
	},

	/**
	 * Copy widths from the cells in one element to another. This is required
	 * for the footer as the footer in the main table takes its sizes from the
	 * header columns. That isn't present in the footer so to have it still
	 * align correctly, the sizes need to be copied over. It is also required
	 * for the header when auto width is not enabled
	 *
	 * @param  {jQuery} from Copy widths from
	 * @param  {jQuery} to   Copy widths to
	 * @private
	 */
	_matchWidths: function ( from, to ) {
		var get = function ( name ) {
			return $(name, from)
				.map( function () {
					return $(this).width();
				} ).toArray();
		};

		var set = function ( name, toWidths ) {
			$(name, to).each( function ( i ) {
				$(this).css( {
					width: toWidths[i],
					minWidth: toWidths[i]
				} );
			} );
		};

		var thWidths = get( 'th' );
		var tdWidths = get( 'td' );

		set( 'th', thWidths );
		set( 'td', tdWidths );
	},

	/**
	 * Remove assigned widths from the cells in an element. This is required
	 * when inserting the footer back into the main table so the size is defined
	 * by the header columns and also when auto width is disabled in the
	 * DataTable.
	 *
	 * @param  {string} item The `header` or `footer`
	 * @private
	 */
	_unsize: function ( item ) {
		var el = this.dom[ item ].floating;

		if ( el && (item === 'footer' || (item === 'header' && ! this.s.autoWidth)) ) {
			$('th, td', el).css( {
				width: '',
				minWidth: ''
			} );
		}
		else if ( el && item === 'header' ) {
			$('th, td', el).css( 'min-width', '' );
		}
	},

	/**
	 * Reposition the floating elements to take account of horizontal page
	 * scroll
	 *
	 * @param  {string} item       The `header` or `footer`
	 * @param  {int}    scrollLeft Document scrollLeft
	 * @private
	 */
	_horizontal: function ( item, scrollLeft )
	{
		var itemDom = this.dom[ item ];
		var position = this.s.position;
		var lastScrollLeft = this.s.scrollLeft;

		if ( itemDom.floating && lastScrollLeft[ item ] !== scrollLeft ) {
			itemDom.floating.css( 'left', position.left - scrollLeft );

			lastScrollLeft[ item ] = scrollLeft;
		}
	},

	/**
	 * Change from one display mode to another. Each fixed item can be in one
	 * of:
	 *
	 * * `in-place` - In the main DataTable
	 * * `in` - Floating over the DataTable
	 * * `below` - (Header only) Fixed to the bottom of the table body
	 * * `above` - (Footer only) Fixed to the top of the table body
	 * 
	 * @param  {string}  mode        Mode that the item should be shown in
	 * @param  {string}  item        'header' or 'footer'
	 * @param  {boolean} forceChange Force a redraw of the mode, even if already
	 *     in that mode.
	 * @private
	 */
	_modeChange: function ( mode, item, forceChange )
	{
		var dt = this.s.dt;
		var itemDom = this.dom[ item ];
		var position = this.s.position;

		// It isn't trivial to add a !important css attribute...
		var importantWidth = function (w) {
			itemDom.floating.attr('style', function(i,s) {
				return (s || '') + 'width: '+w+'px !important;';
			});
		};

		// Record focus. Browser's will cause input elements to loose focus if
		// they are inserted else where in the doc
		var tablePart = this.dom[ item==='footer' ? 'tfoot' : 'thead' ];
		var focus = $.contains( tablePart[0], document.activeElement ) ?
			document.activeElement :
			null;
		
		if ( focus ) {
			focus.blur();
		}

		if ( mode === 'in-place' ) {
			// Insert the header back into the table's real header
			if ( itemDom.placeholder ) {
				itemDom.placeholder.remove();
				itemDom.placeholder = null;
			}

			this._unsize( item );

			if ( item === 'header' ) {
				itemDom.host.prepend( tablePart );
			}
			else {
				itemDom.host.append( tablePart );
			}

			if ( itemDom.floating ) {
				itemDom.floating.remove();
				itemDom.floating = null;
			}
		}
		else if ( mode === 'in' ) {
			// Remove the header from the read header and insert into a fixed
			// positioned floating table clone
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-floating' )
				.css( item === 'header' ? 'top' : 'bottom', this.c[item+'Offset'] )
				.css( 'left', position.left+'px' );

			importantWidth(position.width);

			if ( item === 'footer' ) {
				itemDom.floating.css( 'top', '' );
			}
		}
		else if ( mode === 'below' ) { // only used for the header
			// Fix the position of the floating header at base of the table body
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-locked' )
				.css( 'top', position.tfootTop - position.theadHeight )
				.css( 'left', position.left+'px' );

			importantWidth(position.width);
		}
		else if ( mode === 'above' ) { // only used for the footer
			// Fix the position of the floating footer at top of the table body
			this._clone( item, forceChange );

			itemDom.floating
				.addClass( 'fixedHeader-locked' )
				.css( 'top', position.tbodyTop )
				.css( 'left', position.left+'px' );

			importantWidth(position.width);
		}

		// Restore focus if it was lost
		if ( focus && focus !== document.activeElement ) {
			setTimeout( function () {
				focus.focus();
			}, 10 );
		}

		this.s.scrollLeft.header = -1;
		this.s.scrollLeft.footer = -1;
		this.s[item+'Mode'] = mode;
	},

	/**
	 * Cache the positional information that is required for the mode
	 * calculations that FixedHeader performs.
	 *
	 * @private
	 */
	_positions: function ()
	{
		var dt = this.s.dt;
		var table = dt.table();
		var position = this.s.position;
		var dom = this.dom;
		var tableNode = $(table.node());

		// Need to use the header and footer that are in the main table,
		// regardless of if they are clones, since they hold the positions we
		// want to measure from
		var thead = tableNode.children('thead');
		var tfoot = tableNode.children('tfoot');
		var tbody = dom.tbody;

		position.visible = tableNode.is(':visible');
		position.width = tableNode.outerWidth();
		position.left = tableNode.offset().left;
		position.theadTop = thead.offset().top;
		position.tbodyTop = tbody.offset().top;
		position.tbodyHeight = tbody.outerHeight();
		position.theadHeight = position.tbodyTop - position.theadTop;

		if ( tfoot.length ) {
			position.tfootTop = tfoot.offset().top;
			position.tfootBottom = position.tfootTop + tfoot.outerHeight();
			position.tfootHeight = position.tfootBottom - position.tfootTop;
		}
		else {
			position.tfootTop = position.tbodyTop + tbody.outerHeight();
			position.tfootBottom = position.tfootTop;
			position.tfootHeight = position.tfootTop;
		}
	},


	/**
	 * Mode calculation - determine what mode the fixed items should be placed
	 * into.
	 *
	 * @param  {boolean} forceChange Force a redraw of the mode, even if already
	 *     in that mode.
	 * @private
	 */
	_scroll: function ( forceChange )
	{
		var windowTop = $(document).scrollTop();
		var windowLeft = $(document).scrollLeft();
		var position = this.s.position;
		var headerMode, footerMode;

		if ( this.c.header ) {
			if ( ! this.s.enable ) {
				headerMode = 'in-place';
			}
			else if ( ! position.visible || windowTop <= position.theadTop - this.c.headerOffset ) {
				headerMode = 'in-place';
			}
			else if ( windowTop <= position.tfootTop - position.theadHeight - this.c.headerOffset ) {
				headerMode = 'in';
			}
			else {
				headerMode = 'below';
			}

			if ( forceChange || headerMode !== this.s.headerMode ) {
				this._modeChange( headerMode, 'header', forceChange );
			}

			this._horizontal( 'header', windowLeft );
		}

		if ( this.c.footer && this.dom.tfoot.length ) {
			if ( ! this.s.enable ) {
				footerMode = 'in-place';
			}
			else if ( ! position.visible || windowTop + position.windowHeight >= position.tfootBottom + this.c.footerOffset ) {
				footerMode = 'in-place';
			}
			else if ( position.windowHeight + windowTop > position.tbodyTop + position.tfootHeight + this.c.footerOffset ) {
				footerMode = 'in';
			}
			else {
				footerMode = 'above';
			}

			if ( forceChange || footerMode !== this.s.footerMode ) {
				this._modeChange( footerMode, 'footer', forceChange );
			}

			this._horizontal( 'footer', windowLeft );
		}
	}
} );


/**
 * Version
 * @type {String}
 * @static
 */
FixedHeader.version = "3.1.7";

/**
 * Defaults
 * @type {Object}
 * @static
 */
FixedHeader.defaults = {
	header: true,
	footer: false,
	headerOffset: 0,
	footerOffset: 0
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interfaces
 */

// Attach for constructor access
$.fn.dataTable.FixedHeader = FixedHeader;
$.fn.DataTable.FixedHeader = FixedHeader;


// DataTables creation - check if the FixedHeader option has been defined on the
// table and if so, initialise
$(document).on( 'init.dt.dtfh', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.fixedHeader;
	var defaults = DataTable.defaults.fixedHeader;

	if ( (init || defaults) && ! settings._fixedHeader ) {
		var opts = $.extend( {}, defaults, init );

		if ( init !== false ) {
			new FixedHeader( settings, opts );
		}
	}
} );

// DataTables API methods
DataTable.Api.register( 'fixedHeader()', function () {} );

DataTable.Api.register( 'fixedHeader.adjust()', function () {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		if ( fh ) {
			fh.update();
		}
	} );
} );

DataTable.Api.register( 'fixedHeader.enable()', function ( flag ) {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		flag = ( flag !== undefined ? flag : true );
		if ( fh && flag !== fh.enabled() ) {
			fh.enable( flag );
		}
	} );
} );

DataTable.Api.register( 'fixedHeader.enabled()', function () {
	if ( this.context.length ) {
		var fh = this.content[0]._fixedHeader;

		if ( fh ) {
			return fh.enabled();
		}
	}

	return false;
} );

DataTable.Api.register( 'fixedHeader.disable()', function ( ) {
	return this.iterator( 'table', function ( ctx ) {
		var fh = ctx._fixedHeader;

		if ( fh && fh.enabled() ) {
			fh.enable( false );
		}
	} );
} );

$.each( ['header', 'footer'], function ( i, el ) {
	DataTable.Api.register( 'fixedHeader.'+el+'Offset()', function ( offset ) {
		var ctx = this.context;

		if ( offset === undefined ) {
			return ctx.length && ctx[0]._fixedHeader ?
				ctx[0]._fixedHeader[el +'Offset']() :
				undefined;
		}

		return this.iterator( 'table', function ( ctx ) {
			var fh = ctx._fixedHeader;

			if ( fh ) {
				fh[ el +'Offset' ]( offset );
			}
		} );
	} );
} );


return FixedHeader;
}));


/*! Responsive 2.2.6
 * 2014-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.2.6
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.10' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.10 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}
	else if ( opts && opts.details === false ) {
		opts.details = { type: false };
	}
	else if ( opts && opts.details === true ) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];
		var oldWindowWidth = $(window).innerWidth();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			// iOS has a bug whereby resize can fire when only scrolling
			// See: http://stackoverflow.com/questions/8898412
			var width = $(window).innerWidth();

			if ( width !== oldWindowWidth ) {
				that._resize();
				oldWindowWidth = width;
			}
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('>td, >th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );
			dt.cells('.dtr-control').nodes().to$().removeClass('dtr-control');

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;

		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function () {
				// Use a small debounce to allow multiple columns to be set together
				if ( that._timer ) {
					clearTimeout( that._timer );
				}

				that._timer = setTimeout( function () {
					that._timer = null;

					that._classLogic();
					that._resizeAuto();
					that._resize(true);

					that._redrawChildren();
				}, 100 );
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize(true);
		} );

		// Change in column sizes means we need to calc
		dt.on( 'column-sizing.dtr', function () {
			that._resizeAuto();
			that._resize();
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on( 'preXhr.dtr', function () {
			var rowIds = [];
			dt.rows().every( function () {
				if ( this.child.isShown() ) {
					rowIds.push( this.id(true) );
				}
			} );

			dt.one( 'draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows( rowIds ).every( function () {
					that._detailsDisplay( this, false );
				} );
			} );
		});

		dt
			.on( 'draw.dtr', function () {
				that._controlClass();
			})
			.on( 'init.dtr', function (e, settings, details) {
				if ( e.namespace !== 'dt' ) {
					return;
				}

				that._resizeAuto();
				that._resize();

				// If columns were hidden, then DataTables needs to adjust the
				// column sizing
				if ( $.inArray( false, that.s.current ) ) {
					dt.columns.adjust();
				}
			} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col, i ) {
			if ( dt.column(i).visible() === false ) {
				return 'not-visible';
			}
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && display[i] === false ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}

			// Replace not visible string with false from the control column detection above
			if ( display[i] === 'not-visible' ) {
				display[i] = false;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;
			var dataPriority = column.header().getAttribute('data-priority');

			if ( priority === undefined ) {
				priority = dataPriority === undefined || dataPriority === null?
					10000 :
					dataPriority * 1;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = classNames[k].trim();

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' || className === 'dtr-control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},

	/**
	 * Update the cells to show the correct control class / button
	 * @private
	 */
	_controlClass: function ()
	{
		if ( this.c.details.type === 'inline' ) {
			var dt = this.s.dt;
			var columnsVis = this.s.current;
			var firstVisible = $.inArray(true, columnsVis);

			// Remove from any cells which shouldn't have it
			dt.cells(
				null,
				function(idx) {
					return idx !== firstVisible;
				},
				{page: 'current'}
			)
				.nodes()
				.to$()
				.filter('.dtr-control')
				.removeClass('dtr-control');

			dt.cells(null, firstVisible, {page: 'current'})
				.nodes()
				.to$()
				.addClass('dtr-control');
		}
	},

	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		if ( details && details.type !== false ) {
			var res = details.display( row, update, function () {
				return details.renderer(
					dt, row[0], that._detailsObj(row[0])
				);
			} );

			if ( res === true || res === false ) {
				$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
			}
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td.dtr-control, th.dtr-control';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td, th', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		if ( target !== undefined || target !== null ) {
			// Click handler to show / hide the details rows when they are available
			$( dt.table().body() )
				.on( 'click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
					// If the table is not collapsed (i.e. there is no hidden columns)
					// then take no action
					if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
						return;
					}

					// Check that the row is actually a DataTable's controlled node
					if ( $.inArray( $(this).closest('tr').get(0), dt.rows().nodes().toArray() ) === -1 ) {
						return;
					}

					// For column index, we determine if we should act or not in the
					// handler - otherwise it is already okay
					if ( typeof target === 'number' ) {
						var targetIdx = target < 0 ?
							dt.columns().eq(0).length + target :
							target;

						if ( dt.cell( this ).index().column !== targetIdx ) {
							return;
						}
					}

					// $().closest() includes itself in its check
					var row = dt.row( $(this).closest('tr') );

					// Check event type to do an action
					if ( e.type === 'click' ) {
						// The renderer is given as a function so the caller can execute it
						// only when they need (i.e. if hiding there is no point is running
						// the renderer)
						that._detailsDisplay( row, false );
					}
					else if ( e.type === 'mousedown' ) {
						// For mouse users, prevent the focus ring from showing
						$(this).css('outline', 'none');
					}
					else if ( e.type === 'mouseup' ) {
						// And then re-allow at the end of the click
						$(this).trigger('blur').css('outline', '');
					}
				} );
		}
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			// Never and control columns should not be passed to the renderer
			if ( col.never || col.control ) {
				return;
			}

			var dtCol = dt.settings()[0].aoColumns[ i ];

			return {
				className:   dtCol.sClass,
				columnIndex: i,
				data:        dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:      dt.column( i ).visible() && !that.s.current[ i ],
				rowIndex:    rowIdx,
				title:       dtCol.sTitle !== null ?
					dtCol.sTitle :
					$(dt.column(i).header()).text()
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @param  {boolean} forceRedraw Force a redraw
	 * @private
	 */
	_resize: function (forceRedraw)
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).innerWidth();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never && ! columns[i].control && ! dt.column(i).visible() === false ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;
		var visible = 0;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] === true ) {
				visible++;
			}

			if ( forceRedraw || columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger( 'responsive-resize.dt', [dt, this.s.current] );

			// If no records, update the "No records" display element
			if ( dt.page.info().recordsDisplay === 0 ) {
				$('td', dt.table().body()).eq(0).attr('colspan', visible);
			}
		}

		that._controlClass();
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Need to restore all children. They will be reinstated by a re-render
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			$.each( _childNodeStore, function ( key ) {
				var idx = key.split('-');

				_childNodesRestore( dt, idx[0]*1, idx[1]*1 );
			} );
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body() ).clone( false, false ).empty().appendTo( clonedTable ); // use jQuery because of IE8

		clonedTable.style.width = 'auto';

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' )
			.css( 'width', 'auto' )
			.css( 'min-width', 0 );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.footer()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}
		
		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the chcecked state of the original radio.
		$( clonedTable ).find( '[name]' ).removeAttr( 'name' );

		// A position absolute table would take the table out of the flow of
		// our container element, bypassing the height and width (Scroller)
		$( clonedTable ).css( 'position', 'relative' )
		
		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden',
				clear: 'both'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Get the state of the current hidden columns - controlled by Responsive only
	 */
	_responsiveOnlyHidden: function ()
	{
		var dt = this.s.dt;

		return $.map( this.s.current, function (v, i) {
			// If the column is hidden by DataTables then it can't be hidden by
			// Responsive!
			if ( dt.column(i).visible() === false ) {
				return true;
			}
			return v;
		} );
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );

		// If the are child nodes stored, we might need to reinsert them
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			dt.cells( null, col ).indexes().each( function (idx) {
				_childNodesRestore( dt, idx.row, idx.column );
			} );
		}
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		if ( typeof target === 'number' ) {
			dt.cells( null, target, { page: 'current' } ).nodes().to$()
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
		else {
			// This is a bit of a hack - we need to limit the selected nodes to just
			// those of this table
			if ( target === 'td:first-child, th:first-child' ) {
				target = '>td:first-child, >th:first-child';
			}

			$( target, dt.rows( { page: 'current' } ).nodes() )
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}

			if ( options && options.header ) {
				$('div.dtr-modal-content').prepend(
					'<h2>'+options.header( row )+'</h2>'
				);
			}
		};
	}
};


var _childNodeStore = {};

function _childNodes( dt, row, col ) {
	var name = row+'-'+col;

	if ( _childNodeStore[ name ] ) {
		return _childNodeStore[ name ];
	}

	// https://jsperf.com/childnodes-array-slice-vs-loop
	var nodes = [];
	var children = dt.cell( row, col ).node().childNodes;
	for ( var i=0, ien=children.length ; i<ien ; i++ ) {
		nodes.push( children[i] );
	}

	_childNodeStore[ name ] = nodes;

	return nodes;
}

function _childNodesRestore( dt, row, col ) {
	var name = row+'-'+col;

	if ( ! _childNodeStore[ name ] ) {
		return;
	}

	var node = dt.cell( row, col ).node();
	var store = _childNodeStore[ name ];
	var parent = store[0].parentNode;
	var parentChildren = parent.childNodes;
	var a = [];

	for ( var i=0, ien=parentChildren.length ; i<ien ; i++ ) {
		a.push( parentChildren[i] );
	}

	for ( var j=0, jen=a.length ; j<jen ; j++ ) {
		node.appendChild( a[j] );
	}

	_childNodeStore[ name ] = undefined;
}


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHiddenNodes: function () {
		return function ( api, rowIdx, columns ) {
			var ul = $('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>');
			var found = false;

			var data = $.each( columns, function ( i, col ) {
				if ( col.hidden ) {
					var klass = col.className ?
						'class="'+ col.className +'"' :
						'';
	
					$(
						'<li '+klass+' data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
							'<span class="dtr-title">'+
								col.title+
							'</span> '+
						'</li>'
					)
						.append( $('<span class="dtr-data"/>').append( _childNodes( api, col.rowIndex, col.columnIndex ) ) )// api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
						.appendTo( ul );

					found = true;
				}
			} );

			return found ?
				ul :
				false;
		};
	},

	listHidden: function () {
		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				var klass = col.className ?
					'class="'+ col.className +'"' :
					'';

				return col.hidden ?
					'<li '+klass+' data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>').append( data ) :
				false;
		}
	},

	tableAll: function ( options ) {
		options = $.extend( {
			tableClass: ''
		}, options );

		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				var klass = col.className ?
					'class="'+ col.className +'"' :
					'';

				return '<tr '+klass+' data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<td>'+col.title+':'+'</td> '+
						'<td>'+col.data+'</td>'+
					'</tr>';
			} ).join('');

			return $('<table class="'+options.tableClass+' dtr-details" width="100%"/>').append( data );
		}
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive._responsiveOnlyHidden() ) !== -1 :
		false;
} );

Api.registerPlural( 'columns().responsiveHidden()', 'column().responsiveHidden()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings._responsive ?
			settings._responsive._responsiveOnlyHidden()[ column ] :
			false;
	}, 1 );
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.2.6';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


/*! RowGroup 1.1.2
 * ©2017-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     RowGroup
 * @description RowGrouping for DataTables
 * @version     1.1.2
 * @file        dataTables.rowGroup.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net
 * @copyright   Copyright 2017-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var RowGroup = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'RowGroup requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.rowGroup,
		RowGroup.defaults,
		opts
	);

	// Internal settings
	this.s = {
		dt: new DataTable.Api( dt )
	};

	// DOM items
	this.dom = {

	};

	// Check if row grouping has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var existing = settings.rowGroup;
	if ( existing ) {
		return existing;
	}

	settings.rowGroup = this;
	this._constructor();
};


$.extend( RowGroup.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods for DataTables API interface
	 */

	/**
	 * Get/set the grouping data source - need to call draw after this is
	 * executed as a setter
	 * @returns string~RowGroup
	 */
	dataSrc: function ( val )
	{
		if ( val === undefined ) {
			return this.c.dataSrc;
		}

		var dt = this.s.dt;

		this.c.dataSrc = val;

		$(dt.table().node()).triggerHandler( 'rowgroup-datasrc.dt', [ dt, val ] );

		return this;
	},

	/**
	 * Disable - need to call draw after this is executed
	 * @returns RowGroup
	 */
	disable: function ()
	{
		this.c.enable = false;
		return this;
	},

	/**
	 * Enable - need to call draw after this is executed
	 * @returns RowGroup
	 */
	enable: function ( flag )
	{
		if ( flag === false ) {
			return this.disable();
		}

		this.c.enable = true;
		return this;
	},

	/**
	 * Get enabled flag
	 * @returns boolean
	 */
	enabled: function ()
	{
		return this.c.enable;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var hostSettings = dt.settings()[0];

		dt.on( 'draw.dtrg', function (e, s) {
			if ( that.c.enable && hostSettings === s ) {
				that._draw();
			}
		} );

		dt.on( 'column-visibility.dt.dtrg responsive-resize.dt.dtrg', function () {
			that._adjustColspan();
		} );

		dt.on( 'destroy', function () {
			dt.off( '.dtrg' );
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Adjust column span when column visibility changes
	 * @private
	 */
	_adjustColspan: function ()
	{
		$( 'tr.'+this.c.className, this.s.dt.table().body() ).find('td:visible')
			.attr( 'colspan', this._colspan() );
	},

	/**
	 * Get the number of columns that a grouping row should span
	 * @private
	 */
	_colspan: function ()
	{
		return this.s.dt.columns().visible().reduce( function (a, b) {
			return a + b;
		}, 0 );
	},


	/**
	 * Update function that is called whenever we need to draw the grouping rows.
	 * This is basically a bootstrap for the self iterative _group and _groupDisplay
	 * methods
	 * @private
	 */
	_draw: function ()
	{
		var dt = this.s.dt;
		var groupedRows = this._group( 0, dt.rows( { page: 'current' } ).indexes() );

		this._groupDisplay( 0, groupedRows );
	},

	/**
	 * Get the grouping information from a data set (index) of rows
	 * @param {number} level Nesting level
	 * @param {DataTables.Api} rows API of the rows to consider for this group
	 * @returns {object[]} Nested grouping information - it is structured like this:
	 *	{
	 *		dataPoint: 'Edinburgh',
	 *		rows: [ 1,2,3,4,5,6,7 ],
	 *		children: [ {
	 *			dataPoint: 'developer'
	 *			rows: [ 1, 2, 3 ]
	 *		},
	 *		{
	 *			dataPoint: 'support',
	 *			rows: [ 4, 5, 6, 7 ]
	 *		} ]
	 *	}
	 * @private
	 */
	_group: function ( level, rows ) {
		var fns = $.isArray( this.c.dataSrc ) ? this.c.dataSrc : [ this.c.dataSrc ];
		var fn = DataTable.ext.oApi._fnGetObjectDataFn( fns[ level ] );
		var dt = this.s.dt;
		var group, last;
		var data = [];
		var that = this;

		for ( var i=0, ien=rows.length ; i<ien ; i++ ) {
			var rowIndex = rows[i];
			var rowData = dt.row( rowIndex ).data();
			var group = fn( rowData );

			if ( group === null || group === undefined ) {
				group = that.c.emptyDataGroup;
			}
			
			if ( last === undefined || group !== last ) {
				data.push( {
					dataPoint: group,
					rows: []
				} );

				last = group;
			}

			data[ data.length-1 ].rows.push( rowIndex );
		}

		if ( fns[ level+1 ] !== undefined ) {
			for ( var i=0, ien=data.length ; i<ien ; i++ ) {
				data[i].children = this._group( level+1, data[i].rows );
			}
		}

		return data;
	},

	/**
	 * Row group display - insert the rows into the document
	 * @param {number} level Nesting level
	 * @param {object[]} groups Takes the nested array from `_group`
	 * @private
	 */
	_groupDisplay: function ( level, groups )
	{
		var dt = this.s.dt;
		var display;
	
		for ( var i=0, ien=groups.length ; i<ien ; i++ ) {
			var group = groups[i];
			var groupName = group.dataPoint;
			var row;
			var rows = group.rows;

			if ( this.c.startRender ) {
				display = this.c.startRender.call( this, dt.rows(rows), groupName, level );
				row = this._rowWrap( display, this.c.startClassName, level );

				if ( row ) {
					row.insertBefore( dt.row( rows[0] ).node() );
				}
			}

			if ( this.c.endRender ) {
				display = this.c.endRender.call( this, dt.rows(rows), groupName, level );
				row = this._rowWrap( display, this.c.endClassName, level );

				if ( row ) {
					row.insertAfter( dt.row( rows[ rows.length-1 ] ).node() );
				}
			}

			if ( group.children ) {
				this._groupDisplay( level+1, group.children );
			}
		}
	},

	/**
	 * Take a rendered value from an end user and make it suitable for display
	 * as a row, by wrapping it in a row, or detecting that it is a row.
	 * @param {node|jQuery|string} display Display value
	 * @param {string} className Class to add to the row
	 * @param {array} group
	 * @param {number} group level
	 * @private
	 */
	_rowWrap: function ( display, className, level )
	{
		var row;
		
		if ( display === null || display === '' ) {
			display = this.c.emptyDataGroup;
		}

		if ( display === undefined || display === null ) {
			return null;
		}
		
		if ( typeof display === 'object' && display.nodeName && display.nodeName.toLowerCase() === 'tr') {
			row = $(display);
		}
		else if (display instanceof $ && display.length && display[0].nodeName.toLowerCase() === 'tr') {
			row = display;
		}
		else {
			row = $('<tr/>')
				.append(
					$('<td/>')
						.attr( 'colspan', this._colspan() )
						.append( display  )
				);
		}

		return row
			.addClass( this.c.className )
			.addClass( className )
			.addClass( 'dtrg-level-'+level );
	}
} );


/**
 * RowGroup default settings for initialisation
 *
 * @namespace
 * @name RowGroup.defaults
 * @static
 */
RowGroup.defaults = {
	/**
	 * Class to apply to grouping rows - applied to both the start and
	 * end grouping rows.
	 * @type string
	 */
	className: 'dtrg-group',

	/**
	 * Data property from which to read the grouping information
	 * @type string|integer|array
	 */
	dataSrc: 0,

	/**
	 * Text to show if no data is found for a group
	 * @type string
	 */
	emptyDataGroup: 'No group',

	/**
	 * Initial enablement state
	 * @boolean
	 */
	enable: true,

	/**
	 * Class name to give to the end grouping row
	 * @type string
	 */
	endClassName: 'dtrg-end',

	/**
	 * End grouping label function
	 * @function
	 */
	endRender: null,

	/**
	 * Class name to give to the start grouping row
	 * @type string
	 */
	startClassName: 'dtrg-start',

	/**
	 * Start grouping label function
	 * @function
	 */
	startRender: function ( rows, group ) {
		return group;
	}
};


RowGroup.version = "1.1.2";


$.fn.dataTable.RowGroup = RowGroup;
$.fn.DataTable.RowGroup = RowGroup;


DataTable.Api.register( 'rowGroup()', function () {
	return this;
} );

DataTable.Api.register( 'rowGroup().disable()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.enable( false );
		}
	} );
} );

DataTable.Api.register( 'rowGroup().enable()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.enable( opts === undefined ? true : opts );
		}
	} );
} );

DataTable.Api.register( 'rowGroup().enabled()', function () {
	var ctx = this.context;

	return ctx.length && ctx[0].rowGroup ?
		ctx[0].rowGroup.enabled() :
		false;
} );

DataTable.Api.register( 'rowGroup().dataSrc()', function ( val ) {
	if ( val === undefined ) {
		return this.context[0].rowGroup.dataSrc();
	}

	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.dataSrc( val );
		}
	} );
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtrg', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.rowGroup;
	var defaults = DataTable.defaults.rowGroup;

	if ( init || defaults ) {
		var opts = $.extend( {}, defaults, init );

		if ( init !== false ) {
			new RowGroup( settings, opts  );
		}
	}
} );


return RowGroup;

}));


(function () {
	'use strict';

	/*! DateTime picker for DataTables.net v0.0.8
	 *
	 * ©2020 SpryMedia Ltd, all rights reserved.
	 * License: MIT datatables.net/license/mit
	 */

	/**
	 * @summary     DateTime picker for DataTables.net
	 * @version     0.0.8
	 * @file        dataTables.dateTime.js
	 * @author      SpryMedia Ltd
	 * @contact     www.datatables.net/contact
	 */
	(function( factory ){
		if ( typeof define === 'function' && define.amd ) {
			// AMD
			define( ['jquery'], function ( $ ) {
				return factory( $, window, document );
			} );
		}
		else if ( typeof exports === 'object' ) {
			// CommonJS
			module.exports = function (root, $) {
				if ( ! root ) {
					root = window;
				}

				return factory( $, root, root.document );
			};
		}
		else {
			// Browser
			factory( jQuery, window, document );
		}
	}(function( $, window, document, undefined$1 ) {

	// Support libraries which support a Moment like API
	var dateLib = window.moment
		? window.moment
		: window.dayjs
			? window.dayjs
			: null;

	/*
	 * This file provides a DateTime GUI picker (calendar and time input). Only the
	 * format YYYY-MM-DD is supported without additional software, but the end user
	 * experience can be greatly enhanced by including the momentjs or dayjs library
	 * which provide date / time parsing and formatting options.
	 *
	 * This functionality is required because the HTML5 date and datetime input
	 * types are not widely supported in desktop browsers.
	 *
	 * Constructed by using:
	 *
	 *     new DateTime( input, opts )
	 *
	 * where `input` is the HTML input element to use and `opts` is an object of
	 * options based on the `DateTime.defaults` object.
	 */
	var DateTime = function ( input, opts ) {
		this.c = $.extend( true, {}, DateTime.defaults, opts );
		var classPrefix = this.c.classPrefix;
		var i18n = this.c.i18n;

		// Only IS8601 dates are supported without moment pr dayjs
		if ( ! dateLib && this.c.format !== 'YYYY-MM-DD' ) {
			throw "DateTime: Without momentjs or dayjs only the format 'YYYY-MM-DD' can be used";
		}

		// Min and max need to be `Date` objects in the config
		if (typeof this.c.minDate === 'string') {
			this.c.minDate = new Date(this.c.minDate);
		}
		if (typeof this.c.maxDate === 'string') {
			this.c.maxDate = new Date(this.c.maxDate);
		}

		// DOM structure
		var structure = $(
			'<div class="'+classPrefix+'">'+
				'<div class="'+classPrefix+'-date">'+
					'<div class="'+classPrefix+'-title">'+
						'<div class="'+classPrefix+'-iconLeft">'+
							'<button>'+i18n.previous+'</button>'+
						'</div>'+
						'<div class="'+classPrefix+'-iconRight">'+
							'<button>'+i18n.next+'</button>'+
						'</div>'+
						'<div class="'+classPrefix+'-label">'+
							'<span></span>'+
							'<select class="'+classPrefix+'-month"></select>'+
						'</div>'+
						'<div class="'+classPrefix+'-label">'+
							'<span></span>'+
							'<select class="'+classPrefix+'-year"></select>'+
						'</div>'+
					'</div>'+
					'<div class="'+classPrefix+'-calendar"></div>'+
				'</div>'+
				'<div class="'+classPrefix+'-time">'+
					'<div class="'+classPrefix+'-hours"></div>'+
					'<div class="'+classPrefix+'-minutes"></div>'+
					'<div class="'+classPrefix+'-seconds"></div>'+
				'</div>'+
				'<div class="'+classPrefix+'-error"></div>'+
			'</div>'
		);

		this.dom = {
			container: structure,
			date:      structure.find( '.'+classPrefix+'-date' ),
			title:     structure.find( '.'+classPrefix+'-title' ),
			calendar:  structure.find( '.'+classPrefix+'-calendar' ),
			time:      structure.find( '.'+classPrefix+'-time' ),
			error:     structure.find( '.'+classPrefix+'-error' ),
			input:     $(input)
		};

		this.s = {
			/** @type {Date} Date value that the picker has currently selected */
			d: null,

			/** @type {Date} Date of the calendar - might not match the value */
			display: null,

			/** @type {number} Used to select minutes in a range where the range base is itself unavailable */
			minutesRange: null,

			/** @type {number} Used to select minutes in a range where the range base is itself unavailable */
			secondsRange: null,

			/** @type {String} Unique namespace string for this instance */
			namespace: 'dateime-'+(DateTime._instance++),

			/** @type {Object} Parts of the picker that should be shown */
			parts: {
				date:    this.c.format.match( /[YMD]|L(?!T)|l/ ) !== null,
				time:    this.c.format.match( /[Hhm]|LT|LTS/ ) !== null,
				seconds: this.c.format.indexOf( 's' )   !== -1,
				hours12: this.c.format.match( /[haA]/ ) !== null
			}
		};

		this.dom.container
			.append( this.dom.date )
			.append( this.dom.time )
			.append( this.dom.error );

		this.dom.date
			.append( this.dom.title )
			.append( this.dom.calendar );

		this._constructor();
	};

	$.extend( DateTime.prototype, {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Public
		 */
		
		/**
		 * Destroy the control
		 */
		destroy: function () {
			this._hide();
			this.dom.container.off().empty();
			this.dom.input.off('.datetime');
		},

		errorMsg: function ( msg ) {
			var error = this.dom.error;

			if ( msg ) {
				error.html( msg );
			}
			else {
				error.empty();
			}

			return this;
		},

		hide: function () {
			this._hide();

			return this;
		},

		max: function ( date ) {
			this.c.maxDate = typeof date === 'string'
				? new Date(date)
				: date;

			this._optionsTitle();
			this._setCalander();

			return this;
		},

		min: function ( date ) {
			this.c.minDate = typeof date === 'string'
				? new Date(date)
				: date;

			this._optionsTitle();
			this._setCalander();

			return this;
		},

		/**
		 * Check if an element belongs to this control
		 *
		 * @param  {node} node Element to check
		 * @return {boolean}   true if owned by this control, false otherwise
		 */
		owns: function ( node ) {
			return $(node).parents().filter( this.dom.container ).length > 0;
		},

		/**
		 * Get / set the value
		 *
		 * @param  {string|Date} set   Value to set
		 * @param  {boolean} [write=true] Flag to indicate if the formatted value
		 *   should be written into the input element
		 */
		val: function ( set, write ) {
			if ( set === undefined$1 ) {
				return this.s.d;
			}

			if ( set instanceof Date ) {
				this.s.d = this._dateToUtc( set );
			}
			else if ( set === null || set === '' ) {
				this.s.d = null;
			}
			else if ( set === '--now' ) {
				this.s.d = new Date();
			}
			else if ( typeof set === 'string' ) {
				if ( dateLib ) {
					// Use moment or dayjs if possible (even for ISO8601 strings, since it
					// will correctly handle 0000-00-00 and the like)
					var m = dateLib.utc( set, this.c.format, this.c.locale, this.c.strict );
					this.s.d = m.isValid() ? m.toDate() : null;
				}
				else {
					// Else must be using ISO8601 without a date library (constructor would
					// have thrown an error otherwise)
					var match = set.match(/(\d{4})\-(\d{2})\-(\d{2})/ );
					this.s.d = match ?
						new Date( Date.UTC(match[1], match[2]-1, match[3]) ) :
						null;
				}
			}

			if ( write || write === undefined$1 ) {
				if ( this.s.d ) {
					this._writeOutput();
				}
				else {
					// The input value was not valid...
					this.dom.input.val( set );
				}
			}

			// We need a date to be able to display the calendar at all
			if ( ! this.s.d ) {
				this.s.d = this._dateToUtc( new Date() );
			}

			this.s.display = new Date( this.s.d.toString() );

			// Set the day of the month to be 1 so changing between months doesn't
	        // run into issues when going from day 31 to 28 (for example)
			this.s.display.setUTCDate( 1 );

			// Update the display elements for the new value
			this._setTitle();
			this._setCalander();
			this._setTime();

			return this;
		},


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Constructor
		 */
		
		/**
		 * Build the control and assign initial event handlers
		 *
		 * @private
		 */
		_constructor: function () {
			var that = this;
			var classPrefix = this.c.classPrefix;
			var onChange = function () {
				that.c.onChange.call( that, that.dom.input.val(), that.s.d, that.dom.input );
			};

			if ( ! this.s.parts.date ) {
				this.dom.date.css( 'display', 'none' );
			}

			if ( ! this.s.parts.time ) {
				this.dom.time.css( 'display', 'none' );
			}

			if ( ! this.s.parts.seconds ) {
				this.dom.time.children('div.'+classPrefix+'-seconds').remove();
				this.dom.time.children('span').eq(1).remove();
			}

			// Render the options
			this._optionsTitle();

			// Trigger the display of the widget when clicking or focusing on the
			// input element
			this.dom.input
				.attr('autocomplete', 'off')
				.on('focus.datetime click.datetime', function () {
					// If already visible - don't do anything
					if ( that.dom.container.is(':visible') || that.dom.input.is(':disabled') ) {
						return;
					}

					// In case the value has changed by text
					that.val( that.dom.input.val(), false );

					that._show();
				} )
				.on('keyup.datetime', function () {
					// Update the calendar's displayed value as the user types
					if ( that.dom.container.is(':visible') ) {
						that.val( that.dom.input.val(), false );
					}
				} );

			// Main event handlers for input in the widget
			this.dom.container
				.on( 'change', 'select', function () {
					var select = $(this);
					var val = select.val();

					if ( select.hasClass(classPrefix+'-month') ) {
						// Month select
						that._correctMonth( that.s.display, val );
						that._setTitle();
						that._setCalander();
					}
					else if ( select.hasClass(classPrefix+'-year') ) {
						// Year select
						that.s.display.setUTCFullYear( val );
						that._setTitle();
						that._setCalander();
					}
					else if ( select.hasClass(classPrefix+'-hours') || select.hasClass(classPrefix+'-ampm') ) {
						// Hours - need to take account of AM/PM input if present
						if ( that.s.parts.hours12 ) {
							var hours = $(that.dom.container).find('.'+classPrefix+'-hours').val() * 1;
							var pm = $(that.dom.container).find('.'+classPrefix+'-ampm').val() === 'pm';

							that.s.d.setUTCHours( hours === 12 && !pm ?
								0 :
								pm && hours !== 12 ?
									hours + 12 :
									hours
							);
						}
						else {
							that.s.d.setUTCHours( val );
						}

						that._setTime();
						that._writeOutput( true );

						onChange();
					}
					else if ( select.hasClass(classPrefix+'-minutes') ) {
						// Minutes select
						that.s.d.setUTCMinutes( val );
						that._setTime();
						that._writeOutput( true );

						onChange();
					}
					else if ( select.hasClass(classPrefix+'-seconds') ) {
						// Seconds select
						that.s.d.setSeconds( val );
						that._setTime();
						that._writeOutput( true );

						onChange();
					}

					that.dom.input.focus();
					that._position();
				} )
				.on( 'click', function (e) {
					var d = that.s.d;
					var nodeName = e.target.nodeName.toLowerCase();
					var target = nodeName === 'span' ?
						e.target.parentNode :
						e.target;

					nodeName = target.nodeName.toLowerCase();

					if ( nodeName === 'select' ) {
						return;
					}

					e.stopPropagation();

					if ( nodeName === 'button' ) {
						var button = $(target);
						var parent = button.parent();

						if ( parent.hasClass('disabled') && ! parent.hasClass('range') ) {
							button.blur();
							return;
						}

						if ( parent.hasClass(classPrefix+'-iconLeft') ) {
							// Previous month
							that.s.display.setUTCMonth( that.s.display.getUTCMonth()-1 );
							that._setTitle();
							that._setCalander();

							that.dom.input.focus();
						}
						else if ( parent.hasClass(classPrefix+'-iconRight') ) {
							// Next month
							that._correctMonth( that.s.display, that.s.display.getUTCMonth()+1 );
							that._setTitle();
							that._setCalander();

							that.dom.input.focus();
						}
						else if ( button.parents('.'+classPrefix+'-time').length ) {
							var val = button.data('value');
							var unit = button.data('unit');

							if ( unit === 'minutes' ) {
								if ( parent.hasClass('disabled') && parent.hasClass('range') ) {
									that.s.minutesRange = val;
									that._setTime();
									return;
								}
								else {
									that.s.minutesRange = null;
								}
							}

							if ( unit === 'seconds' ) {
								if ( parent.hasClass('disabled') && parent.hasClass('range') ) {
									that.s.secondsRange = val;
									that._setTime();
									return;
								}
								else {
									that.s.secondsRange = null;
								}
							}

							// Specific to hours for 12h clock
							if ( val === 'am' ) {
								if ( d.getUTCHours() >= 12 ) {
									val = d.getUTCHours() - 12;
								}
								else {
									return;
								}
							}
							else if ( val === 'pm' ) {
								if ( d.getUTCHours() < 12 ) {
									val = d.getUTCHours() + 12;
								}
								else {
									return;
								}
							}

							var set = unit === 'hours' ?
								'setUTCHours' :
								unit === 'minutes' ?
									'setUTCMinutes' :
									'setSeconds';

							d[set]( val );
							that._setTime();
							that._writeOutput( true );
							onChange();
						}
						else {
							// Calendar click
							if ( ! d ) {
								d = that._dateToUtc( new Date() );
							}

							// Can't be certain that the current day will exist in
							// the new month, and likewise don't know that the
							// new day will exist in the old month, But 1 always
							// does, so we can change the month without worry of a
							// recalculation being done automatically by `Date`
							d.setUTCDate( 1 );
							d.setUTCFullYear( button.data('year') );
							d.setUTCMonth( button.data('month') );
							d.setUTCDate( button.data('day') );

							that._writeOutput( true );

							// Don't hide if there is a time picker, since we want to
							// be able to select a time as well.
							if ( ! that.s.parts.time ) {
								// This is annoying but IE has some kind of async
								// behaviour with focus and the focus from the above
								// write would occur after this hide - resulting in the
								// calendar opening immediately
								setTimeout( function () {
									that._hide();
								}, 10 );
							}
							else {
								that._setCalander();
							}

							onChange();
						}
					}
					else {
						// Click anywhere else in the widget - return focus to the
						// input element
						that.dom.input.focus();
					}
				} );
		},


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Private
		 */

		/**
		 * Compare the date part only of two dates - this is made super easy by the
		 * toDateString method!
		 *
		 * @param  {Date} a Date 1
		 * @param  {Date} b Date 2
		 * @private
		 */
		_compareDates: function( a, b ) {
			// Can't use toDateString as that converts to local time
			return this._dateToUtcString(a) === this._dateToUtcString(b);
		},

		/**
		 * When changing month, take account of the fact that some months don't have
		 * the same number of days. For example going from January to February you
		 * can have the 31st of Jan selected and just add a month since the date
		 * would still be 31, and thus drop you into March.
		 *
		 * @param  {Date} date  Date - will be modified
		 * @param  {integer} month Month to set
		 * @private
		 */
		_correctMonth: function ( date, month ) {
			var days = this._daysInMonth( date.getUTCFullYear(), month );
			var correctDays = date.getUTCDate() > days;

			date.setUTCMonth( month );

			if ( correctDays ) {
				date.setUTCDate( days );
				date.setUTCMonth( month );
			}
		},

		/**
		 * Get the number of days in a method. Based on
		 * http://stackoverflow.com/a/4881951 by Matti Virkkunen
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @private
		 */
		_daysInMonth: function ( year, month ) {
			// 
			var isLeap = ((year % 4) === 0 && ((year % 100) !== 0 || (year % 400) === 0));
			var months = [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			return months[month];
		},

		/**
		 * Create a new date object which has the UTC values set to the local time.
		 * This allows the local time to be used directly for the library which
		 * always bases its calculations and display on UTC.
		 *
		 * @param  {Date} s Date to "convert"
		 * @return {Date}   Shifted date
		 */
		_dateToUtc: function ( s ) {
			return new Date( Date.UTC(
				s.getFullYear(), s.getMonth(), s.getDate(),
				s.getHours(), s.getMinutes(), s.getSeconds()
			) );
		},

		/**
		 * Create a UTC ISO8601 date part from a date object
		 *
		 * @param  {Date} d Date to "convert"
		 * @return {string} ISO formatted date
		 */
		_dateToUtcString: function ( d ) {
			return d.getUTCFullYear()+'-'+
				this._pad(d.getUTCMonth()+1)+'-'+
				this._pad(d.getUTCDate());
		},

		/**
		 * Hide the control and remove events related to its display
		 *
		 * @private
		 */
		_hide: function () {
			var namespace = this.s.namespace;

			this.dom.container.detach();

			$(window).off( '.'+namespace );
			$(document).off( 'keydown.'+namespace );
			$('div.dataTables_scrollBody').off( 'scroll.'+namespace );
			$('div.DTE_Body_Content').off( 'scroll.'+namespace );
			$('body').off( 'click.'+namespace );
		},

		/**
		 * Convert a 24 hour value to a 12 hour value
		 *
		 * @param  {integer} val 24 hour value
		 * @return {integer}     12 hour value
		 * @private
		 */
		_hours24To12: function ( val ) {
			return val === 0 ?
				12 :
				val > 12 ?
					val - 12 :
					val;
		},

		/**
		 * Generate the HTML for a single day in the calendar - this is basically
		 * and HTML cell with a button that has data attributes so we know what was
		 * clicked on (if it is clicked on) and a bunch of classes for styling.
		 *
		 * @param  {object} day Day object from the `_htmlMonth` method
		 * @return {string}     HTML cell
		 */
		_htmlDay: function( day )
		{
			if ( day.empty ) {
				return '<td class="empty"></td>';
			}

			var classes = [ 'selectable' ];
			var classPrefix = this.c.classPrefix;

			if ( day.disabled ) {
				classes.push( 'disabled' );
			}

			if ( day.today ) {
				classes.push( 'now' );
			}

			if ( day.selected ) {
				classes.push( 'selected' );
			}

			return '<td data-day="' + day.day + '" class="' + classes.join(' ') + '">' +
					'<button class="'+classPrefix+'-button '+classPrefix+'-day" type="button" ' +'data-year="' + day.year + '" data-month="' + day.month + '" data-day="' + day.day + '">' +
						'<span>'+day.day+'</span>'+
					'</button>' +
				'</td>';
		},


		/**
		 * Create the HTML for a month to be displayed in the calendar table.
		 * 
		 * Based upon the logic used in Pikaday - MIT licensed
		 * Copyright (c) 2014 David Bushell
		 * https://github.com/dbushell/Pikaday
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @return {string} Calendar month HTML
		 * @private
		 */
		_htmlMonth: function ( year, month ) {
			var now    = this._dateToUtc( new Date() ),
				days   = this._daysInMonth( year, month ),
				before = new Date( Date.UTC(year, month, 1) ).getUTCDay(),
				data   = [],
				row    = [];

			if ( this.c.firstDay > 0 ) {
				before -= this.c.firstDay;

				if (before < 0) {
					before += 7;
				}
			}

			var cells = days + before,
				after = cells;

			while ( after > 7 ) {
				after -= 7;
			}

			cells += 7 - after;

			var minDate = this.c.minDate;
			var maxDate = this.c.maxDate;

			if ( minDate ) {
				minDate.setUTCHours(0);
				minDate.setUTCMinutes(0);
				minDate.setSeconds(0);
			}

			if ( maxDate ) {
				maxDate.setUTCHours(23);
				maxDate.setUTCMinutes(59);
				maxDate.setSeconds(59);
			}

			for ( var i=0, r=0 ; i<cells ; i++ ) {
				var day      = new Date( Date.UTC(year, month, 1 + (i - before)) ),
					selected = this.s.d ? this._compareDates(day, this.s.d) : false,
					today    = this._compareDates(day, now),
					empty    = i < before || i >= (days + before),
					disabled = (minDate && day < minDate) ||
					           (maxDate && day > maxDate);

				var disableDays = this.c.disableDays;
				if ( $.isArray( disableDays ) && $.inArray( day.getUTCDay(), disableDays ) !== -1 ) {
					disabled = true;
				}
				else if ( typeof disableDays === 'function' && disableDays( day ) === true ) {
					disabled = true;
				}

				var dayConfig = {
					day:      1 + (i - before),
					month:    month,
					year:     year,
					selected: selected,
					today:    today,
					disabled: disabled,
					empty:    empty
				};

				row.push( this._htmlDay(dayConfig) );

				if ( ++r === 7 ) {
					if ( this.c.showWeekNumber ) {
						row.unshift( this._htmlWeekOfYear(i - before, month, year) );
					}

					data.push( '<tr>'+row.join('')+'</tr>' );
					row = [];
					r = 0;
				}
			}

			var classPrefix = this.c.classPrefix;
			var className = classPrefix+'-table';
			if ( this.c.showWeekNumber ) {
				className += ' weekNumber';
			}

			// Show / hide month icons based on min/max
			if ( minDate ) {
				var underMin = minDate >= new Date( Date.UTC(year, month, 1, 0, 0, 0 ) );

				this.dom.title.find('div.'+classPrefix+'-iconLeft')
					.css( 'display', underMin ? 'none' : 'block' );
			}

			if ( maxDate ) {
				var overMax = maxDate < new Date( Date.UTC(year, month+1, 1, 0, 0, 0 ) );

				this.dom.title.find('div.'+classPrefix+'-iconRight')
					.css( 'display', overMax ? 'none' : 'block' );
			}

			return '<table class="'+className+'">' +
					'<thead>'+
						this._htmlMonthHead() +
					'</thead>'+
					'<tbody>'+
						data.join('') +
					'</tbody>'+
				'</table>';
		},

		/**
		 * Create the calendar table's header (week days)
		 *
		 * @return {string} HTML cells for the row
		 * @private
		 */
		_htmlMonthHead: function () {
			var a = [];
			var firstDay = this.c.firstDay;
			var i18n = this.c.i18n;

			// Take account of the first day shift
			var dayName = function ( day ) {
				day += firstDay;

				while (day >= 7) {
					day -= 7;
				}

				return i18n.weekdays[day];
			};
			
			// Empty cell in the header
			if ( this.c.showWeekNumber ) {
				a.push( '<th></th>' );
			}

			for ( var i=0 ; i<7 ; i++ ) {
				a.push( '<th>'+dayName( i )+'</th>' );
			}

			return a.join('');
		},

		/**
		 * Create a cell that contains week of the year - ISO8601
		 *
		 * Based on https://stackoverflow.com/questions/6117814/ and
		 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/
		 *
		 * @param  {integer} d Day of month
		 * @param  {integer} m Month of year (zero index)
		 * @param  {integer} y Year
		 * @return {string}   
		 * @private
		 */
		_htmlWeekOfYear: function ( d, m, y ) {
			var date = new Date( y, m, d, 0, 0, 0, 0 );

			// First week of the year always has 4th January in it
			date.setDate( date.getDate() + 4 - (date.getDay() || 7) );

			var oneJan = new Date( y, 0, 1 );
			var weekNum = Math.ceil( ( ( (date - oneJan) / 86400000) + 1)/7 );

			return '<td class="'+this.c.classPrefix+'-week">' + weekNum + '</td>';
		},

		/**
		 * Create option elements from a range in an array
		 *
		 * @param  {string} selector Class name unique to the select element to use
		 * @param  {array} values   Array of values
		 * @param  {array} [labels] Array of labels. If given must be the same
		 *   length as the values parameter.
		 * @private
		 */
		_options: function ( selector, values, labels ) {
			if ( ! labels ) {
				labels = values;
			}

			var select = this.dom.container.find('select.'+this.c.classPrefix+'-'+selector);
			select.empty();

			for ( var i=0, ien=values.length ; i<ien ; i++ ) {
				select.append( '<option value="'+values[i]+'">'+labels[i]+'</option>' );
			}
		},

		/**
		 * Set an option and update the option's span pair (since the select element
		 * has opacity 0 for styling)
		 *
		 * @param  {string} selector Class name unique to the select element to use
		 * @param  {*}      val      Value to set
		 * @private
		 */
		_optionSet: function ( selector, val ) {
			var select = this.dom.container.find('select.'+this.c.classPrefix+'-'+selector);
			var span = select.parent().children('span');

			select.val( val );

			var selected = select.find('option:selected');
			span.html( selected.length !== 0 ?
				selected.text() :
				this.c.i18n.unknown
			);
		},

		/**
		 * Create time options list.
		 *
		 * @param  {string} unit Time unit - hours, minutes or seconds
		 * @param  {integer} count Count range - 12, 24 or 60
		 * @param  {integer} val Existing value for this unit
		 * @param  {integer[]} allowed Values allow for selection
		 * @param  {integer} range Override range
		 * @private
		 */
		_optionsTime: function ( unit, count, val, allowed, range ) {
			var classPrefix = this.c.classPrefix;
			var container = this.dom.container.find('div.'+classPrefix+'-'+unit);
			var i, j;
			var render = count === 12 ?
				function (i) { return i; } :
				this._pad;
			var classPrefix = this.c.classPrefix;
			var className = classPrefix+'-table';
			var i18n = this.c.i18n;

			if ( ! container.length ) {
				return;
			}

			var a = '';
			var span = 10;
			var button = function (value, label, className) {
				// Shift the value for PM
				if ( count === 12 && val >= 12 && typeof value === 'number' ) {
					value += 12;
				}

				var selected = val === value || (value === 'am' && val < 12) || (value === 'pm' && val >= 12) ?
					'selected' :
					'';
				
				if (allowed && $.inArray(value, allowed) === -1) {
					selected += ' disabled';
				}

				if ( className ) {
					selected += ' '+className;
				}

				return '<td class="selectable '+selected+'">' +
					'<button class="'+classPrefix+'-button '+classPrefix+'-day" type="button" data-unit="'+unit+'" data-value="'+value+ '">' +
						'<span>'+label+'</span>'+
					'</button>' +
				'</td>';
			};

			if ( count === 12 ) {
				// Hours with AM/PM
				a += '<tr>';
				
				for ( i=1 ; i<=6 ; i++ ) {
					a += button(i, render(i));
				}
				a += button('am', i18n.amPm[0]);

				a += '</tr>';
				a += '<tr>';

				for ( i=7 ; i<=12 ; i++ ) {
					a += button(i, render(i));
				}
				a += button('pm', i18n.amPm[1]);
				a += '</tr>';

				span = 7;
			}
			else if ( count === 24 ) {
				// Hours - 24
				var c = 0;
				for (j=0 ; j<4 ; j++ ) {
					a += '<tr>';
					for ( i=0 ; i<6 ; i++ ) {
						a += button(c, render(c));
						c++;
					}
					a += '</tr>';
				}

				span = 6;
			}
			else {
				// Minutes and seconds
				a += '<tr>';
				for (j=0 ; j<60 ; j+=10 ) {
					a += button(j, render(j), 'range');
				}
				a += '</tr>';
				
				// Slight hack to allow for the different number of columns
				a += '</tbody></thead><table class="'+className+' '+className+'-nospace"><tbody>';

				var start = range !== null ?
					range :
					Math.floor( val / 10 )*10;

				a += '<tr>';
				for (j=start+1 ; j<start+10 ; j++ ) {
					a += button(j, render(j));
				}
				a += '</tr>';

				span = 6;
			}

			container
				.empty()
				.append(
					'<table class="'+className+'">'+
						'<thead><tr><th colspan="'+span+'">'+
							i18n[unit] +
						'</th></tr></thead>'+
						'<tbody>'+
							a+
						'</tbody>'+
					'</table>'
				);
		},

		/**
		 * Create the options for the month and year
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @private
		 */
		_optionsTitle: function () {
			var i18n = this.c.i18n;
			var min = this.c.minDate;
			var max = this.c.maxDate;
			var minYear = min ? min.getFullYear() : null;
			var maxYear = max ? max.getFullYear() : null;

			var i = minYear !== null ? minYear : new Date().getFullYear() - this.c.yearRange;
			var j = maxYear !== null ? maxYear : new Date().getFullYear() + this.c.yearRange;

			this._options( 'month', this._range( 0, 11 ), i18n.months );
			this._options( 'year', this._range( i, j ) );
		},

		/**
		 * Simple two digit pad
		 *
		 * @param  {integer} i      Value that might need padding
		 * @return {string|integer} Padded value
		 * @private
		 */
		_pad: function ( i ) {
			return i<10 ? '0'+i : i;
		},

		/**
		 * Position the calendar to look attached to the input element
		 * @private
		 */
		_position: function () {
			var offset = this.c.attachTo === 'input' ? this.dom.input.position() : this.dom.input.offset();
			var container = this.dom.container;
			var inputHeight = this.dom.input.outerHeight();

			if ( this.s.parts.date && this.s.parts.time && $(window).width() > 550 ) {
				container.addClass('horizontal');
			}
			else {
				container.removeClass('horizontal');
			}

			if(this.c.attachTo === 'input') {
				container
					.css( {
						top: offset.top + inputHeight,
						left: offset.left
					} )
					.insertAfter( this.dom.input );
			}
			else {
				container
					.css( {
						top: offset.top + inputHeight,
						left: offset.left
					} )
					.appendTo( 'body' );
			}

			var calHeight = container.outerHeight();
			var calWidth = container.outerWidth();
			var scrollTop = $(window).scrollTop();

			// Correct to the bottom
			if ( offset.top + inputHeight + calHeight - scrollTop > $(window).height() ) {
				var newTop = offset.top - calHeight;

				container.css( 'top', newTop < 0 ? 0 : newTop );
			}

			// Correct to the right
			if ( calWidth + offset.left > $(window).width() ) {
				var newLeft = $(window).width() - calWidth;

				container.css( 'left', newLeft < 0 ? 0 : newLeft );
			}
		},

		/**
		 * Create a simple array with a range of values
		 *
		 * @param  {integer} start   Start value (inclusive)
		 * @param  {integer} end     End value (inclusive)
		 * @param  {integer} [inc=1] Increment value
		 * @return {array}           Created array
		 * @private
		 */
		_range: function ( start, end, inc ) {
			var a = [];

			if ( ! inc ) {
				inc = 1;
			}

			for ( var i=start ; i<=end ; i+=inc ) {
				a.push( i );
			}

			return a;
		},

		/**
		 * Redraw the calendar based on the display date - this is a destructive
		 * operation
		 *
		 * @private
		 */
		_setCalander: function () {
			if ( this.s.display ) {
				this.dom.calendar
					.empty()
					.append( this._htmlMonth(
						this.s.display.getUTCFullYear(),
						this.s.display.getUTCMonth()
					) );
			}
		},

		/**
		 * Set the month and year for the calendar based on the current display date
		 *
		 * @private
		 */
		_setTitle: function () {
			this._optionSet( 'month', this.s.display.getUTCMonth() );
			this._optionSet( 'year', this.s.display.getUTCFullYear() );
		},

		/**
		 * Set the time based on the current value of the widget
		 *
		 * @private
		 */
		_setTime: function () {
			var that = this;
			var d = this.s.d;
			var hours = d ? d.getUTCHours() : 0;
			var allowed = function ( prop ) { // Backwards compt with `Increment` option
				return that.c[prop+'Available'] ?
					that.c[prop+'Available'] :
					that._range( 0, 59, that.c[prop+'Increment'] );
			};

			this._optionsTime( 'hours', this.s.parts.hours12 ? 12 : 24, hours, this.c.hoursAvailable );
			this._optionsTime( 'minutes', 60, d ? d.getUTCMinutes() : 0, allowed('minutes'), this.s.minutesRange );
			this._optionsTime( 'seconds', 60, d ? d.getSeconds() : 0, allowed('seconds'), this.s.secondsRange );
		},

		/**
		 * Show the widget and add events to the document required only while it
		 * is displayed
		 * 
		 * @private
		 */
		_show: function () {
			var that = this;
			var namespace = this.s.namespace;

			this._position();

			// Need to reposition on scroll
			$(window).on( 'scroll.'+namespace+' resize.'+namespace, function () {
				that._hide();
			} );

			$('div.DTE_Body_Content').on( 'scroll.'+namespace, function () {
				that._hide();
			} );

			$('div.dataTables_scrollBody').on( 'scroll.'+namespace, function () {
				that._hide();
			} );

			var offsetParent = this.dom.input[0].offsetParent;

			if ( offsetParent !== document.body ) {
				$(offsetParent).on( 'scroll.'+namespace, function () {
					that._hide();
				} );
			}

			// On tab focus will move to a different field (no keyboard navigation
			// in the date picker - this might need to be changed).
			$(document).on( 'keydown.'+namespace, function (e) {
				if (
					e.keyCode === 9  || // tab
					e.keyCode === 27 || // esc
					e.keyCode === 13    // return
				) {
					that._hide();
				}
			} );

			// Hide if clicking outside of the widget - but in a different click
			// event from the one that was used to trigger the show (bubble and
			// inline)
			setTimeout( function () {
				$('body').on( 'click.'+namespace, function (e) {
					var parents = $(e.target).parents();

					if ( ! parents.filter( that.dom.container ).length && e.target !== that.dom.input[0] ) {
						that._hide();
					}
				} );
			}, 10 );
		},

		/**
		 * Write the formatted string to the input element this control is attached
		 * to
		 *
		 * @private
		 */
		_writeOutput: function ( focus ) {
			var date = this.s.d;

			// Use moment or dayjs if possible - otherwise it must be ISO8601 (or the
			// constructor would have thrown an error)
			var out = dateLib ?
				dateLib.utc( date, undefined$1, this.c.locale, this.c.strict ).format( this.c.format ) :
				date.getUTCFullYear() +'-'+
					this._pad(date.getUTCMonth() + 1) +'-'+
					this._pad(date.getUTCDate());

				this.dom.input
					.val( out )
					.trigger('change', {write: date});

			if ( focus ) {
				this.dom.input.focus();
			}
		}
	} );

	/**
	 * Use a specificmoment compatible date library
	 */
	DateTime.use = function (lib) {
		dateLib = lib;
	};

	/**
	 * For generating unique namespaces
	 *
	 * @type {Number}
	 * @private
	 */
	DateTime._instance = 0;

	/**
	 * Defaults for the date time picker
	 *
	 * @type {Object}
	 */
	DateTime.defaults = {
		attachTo: 'body',

		// Not documented - could be an internal property
		classPrefix: 'dt-datetime',

		// function or array of ints
		disableDays: null,

		// first day of the week (0: Sunday, 1: Monday, etc)
		firstDay: 1,

		format: 'YYYY-MM-DD',

		hoursAvailable: null,

		i18n: {
			previous: 'Previous',
			next:     'Next',
			months:   [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			weekdays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
			amPm:     [ 'am', 'pm' ],
			hours:    'Hour',
			minutes:  'Minute',
			seconds:  'Second',
			unknown:  '-'
		},

		maxDate: null,

		minDate: null,

		minutesAvailable: null,

		minutesIncrement: 1, // deprecated

		strict: true,

		locale: 'en',

		onChange: function () {},

		secondsAvailable: null,

		secondsIncrement: 1, // deprecated

		// show the ISO week number at the head of the row
		showWeekNumber: false,

		// overruled by max / min date
		yearRange: 25
	};

	// Global export - if no conflicts
	if (! window.DateTime) {
		window.DateTime = DateTime;
	}

	// Make available via jQuery
	$.fn.dtDateTime = function (options) {
		return this.each(function() {
			new DateTime(this, options);
		});
	};

	// Attach to DataTables if present
	if ($.dataTable) {
		$.dataTable.DateTime = DateTime;
		$.DataTable.DateTime = DateTime;
	}

	return DateTime;

	}));

	var $;
	var DataTable;
	var moment = window.moment;
	/**
	 * Sets the value of jQuery for use in the file
	 * @param jq the instance of jQuery to be set
	 */
	function setJQuery(jq) {
	    $ = jq;
	    DataTable = jq.fn.dataTable;
	}
	/**
	 * The Criteria class is used within SearchBuilder to represent a search criteria
	 */
	var Criteria = /** @class */ (function () {
	    function Criteria(table, opts, topGroup, index, depth) {
	        var _this = this;
	        if (index === void 0) { index = 0; }
	        if (depth === void 0) { depth = 1; }
	        // Check that the required version of DataTables is included
	        if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('1.10.0')) {
	            throw new Error('SearchPane requires DataTables 1.10 or newer');
	        }
	        this.classes = $.extend(true, {}, Criteria.classes);
	        // Get options from user and any extra conditions/column types defined by plug-ins
	        this.c = $.extend(true, {}, Criteria.defaults, $.fn.dataTable.ext.searchBuilder, opts);
	        this.s = {
	            condition: undefined,
	            conditions: new Map(),
	            data: undefined,
	            dataIdx: -1,
	            dataPoints: [],
	            depth: depth,
	            dt: table,
	            filled: false,
	            index: index,
	            momentFormat: false,
	            topGroup: topGroup,
	            type: '',
	            value: []
	        };
	        this.dom = {
	            buttons: $('<div/>')
	                .addClass(this.classes.buttonContainer),
	            condition: $('<select disabled/>')
	                .addClass(this.classes.condition)
	                .addClass(this.classes.dropDown)
	                .addClass(this.classes.italic),
	            conditionTitle: $('<option value="" disabled selected hidden/>')
	                .text(this.s.dt.i18n('searchBuilder.condition', 'Condition')),
	            container: $('<div/>')
	                .addClass(this.classes.container),
	            data: $('<select/>')
	                .addClass(this.classes.data)
	                .addClass(this.classes.dropDown)
	                .addClass(this.classes.italic),
	            dataTitle: $('<option value="" disabled selected hidden/>')
	                .text(this.s.dt.i18n('searchBuilder.data', 'Data')),
	            defaultValue: $('<select disabled/>')
	                .addClass(this.classes.value)
	                .addClass(this.classes.dropDown),
	            "delete": $('<button>&times</button>')
	                .addClass(this.classes["delete"])
	                .addClass(this.classes.button)
	                .attr('title', this.s.dt.i18n('searchBuilder.deleteTitle', 'Delete filtering rule')),
	            left: $('<button>\<</button>')
	                .addClass(this.classes.left)
	                .addClass(this.classes.button)
	                .attr('title', this.s.dt.i18n('searchBuilder.leftTitle', 'Outdent criteria')),
	            right: $('<button>\></button>')
	                .addClass(this.classes.right)
	                .addClass(this.classes.button)
	                .attr('title', this.s.dt.i18n('searchBuilder.rightTitle', 'Indent criteria')),
	            value: [
	                $('<select disabled/>').addClass(this.classes.value).addClass(this.classes.dropDown).addClass(this.classes.italic)
	            ],
	            valueTitle: $('<option value="" disabled selected hidden/>').text(this.s.dt.i18n('searchBuilder.value', 'Value'))
	        };
	        // If the greyscale option is selected then add the class to add the grey colour to SearchBuilder
	        if (this.c.greyscale) {
	            $(this.dom.data).addClass(this.classes.greyscale);
	            $(this.dom.condition).addClass(this.classes.greyscale);
	            for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
	                var val = _a[_i];
	                $(val).addClass(this.classes.greyscale);
	            }
	        }
	        // For responsive design, adjust the criterias properties on the following events
	        this.s.dt.on('draw.dtsp', function () {
	            _this._adjustCriteria();
	        });
	        this.s.dt.on('buttons-action', function () {
	            _this._adjustCriteria();
	        });
	        $(window).on('resize.dtsp', DataTable.util.throttle(function () {
	            _this._adjustCriteria();
	        }));
	        this._buildCriteria();
	        return this;
	    }
	    /**
	     * Adds the left button to the criteria
	     */
	    Criteria.prototype.updateArrows = function (hasSiblings, redraw) {
	        if (hasSiblings === void 0) { hasSiblings = false; }
	        if (redraw === void 0) { redraw = true; }
	        // Empty the container and append all of the elements in the correct order
	        $(this.dom.container)
	            .empty()
	            .append(this.dom.data)
	            .append(this.dom.condition)
	            .append(this.dom.value[0]);
	        // Trigger the inserted events for the value elements as they are inserted
	        $(this.dom.value[0]).trigger('dtsb-inserted');
	        for (var i = 1; i < this.dom.value.length; i++) {
	            $(this.dom.container).append(this.dom.value[i]);
	            $(this.dom.value[i]).trigger('dtsb-inserted');
	        }
	        // If this is a top level criteria then don't let it move left
	        if (this.s.depth > 1) {
	            $(this.dom.buttons).append(this.dom.left);
	        }
	        // If the depthLimit of the query has been hit then don't add the right button
	        if ((this.c.depthLimit === false || this.s.depth < this.c.depthLimit) && hasSiblings) {
	            $(this.dom.buttons).append(this.dom.right);
	        }
	        $(this.dom.buttons).append(this.dom["delete"]);
	        $(this.dom.container).append(this.dom.buttons);
	        if (redraw) {
	            // A different combination of arrows and selectors may lead to a need for responsive to be triggered
	            this._adjustCriteria();
	        }
	    };
	    /**
	     * Destroys the criteria, removing listeners and container from the dom
	     */
	    Criteria.prototype.destroy = function () {
	        // Turn off listeners
	        $(this.dom.data).off('.dtsb');
	        $(this.dom.condition).off('.dtsb');
	        $(this.dom["delete"]).off('.dtsb');
	        for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
	            var val = _a[_i];
	            $(val).off('.dtsb');
	        }
	        // Remove container from the dom
	        $(this.dom.container).remove();
	    };
	    /**
	     * Passes in the data for the row and compares it against this single criteria
	     * @param rowData The data for the row to be compared
	     * @returns boolean Whether the criteria has passed
	     */
	    Criteria.prototype.search = function (rowData) {
	        var condition = this.s.conditions.get(this.s.condition);
	        if (this.s.condition !== undefined && condition !== undefined) {
	            return condition.search(rowData[this.s.dataIdx], this.s.value, this);
	        }
	    };
	    /**
	     * Gets the details required to rebuild the criteria
	     */
	    Criteria.prototype.getDetails = function () {
	        return {
	            condition: this.s.condition,
	            data: this.s.data,
	            value: this.s.value
	        };
	    };
	    /**
	     * Getter for the node for the container of the criteria
	     * @returns JQuery<HTMLElement> the node for the container
	     */
	    Criteria.prototype.getNode = function () {
	        return this.dom.container;
	    };
	    /**
	     * Populates the criteria data, condition and value(s) as far as has been selected
	     */
	    Criteria.prototype.populate = function () {
	        this._populateData();
	        // If the column index has been found attempt to select a condition
	        if (this.s.dataIdx !== -1) {
	            this._populateCondition();
	            // If the condittion has been found attempt to select the values
	            if (this.s.condition !== undefined) {
	                this._populateValue();
	            }
	        }
	    };
	    /**
	     * Rebuilds the criteria based upon the details passed in
	     * @param loadedCriteria the details required to rebuild the criteria
	     */
	    Criteria.prototype.rebuild = function (loadedCriteria) {
	        // Check to see if the previously selected data exists, if so select it
	        var foundData = false;
	        var dataIdx;
	        this._populateData();
	        // If a data selection has previously been made attempt to find and select it
	        if (loadedCriteria.data !== undefined) {
	            var italic_1 = this.classes.italic;
	            var data_1 = this.dom.data;
	            $(this.dom.data).children('option').each(function () {
	                if ($(this).text() === loadedCriteria.data) {
	                    $(this).attr('selected', true);
	                    $(data_1).removeClass(italic_1);
	                    foundData = true;
	                    dataIdx = $(this).val();
	                }
	            });
	        }
	        // If the data has been found and selected then the condition can be populated and searched
	        if (foundData) {
	            this.s.data = loadedCriteria.data;
	            this.s.dataIdx = dataIdx;
	            $(this.dom.dataTitle).remove();
	            this._populateCondition();
	            $(this.dom.conditionTitle).remove();
	            var condition_1;
	            var conditions = this.s.conditions;
	            // Check to see if the previously selected condition exists, if so select it
	            $(this.dom.condition).children('option').each(function () {
	                if ((loadedCriteria.condition !== undefined &&
	                    $(this).val() === loadedCriteria.condition &&
	                    typeof loadedCriteria.condition === 'string')) {
	                    $(this).attr('selected', true);
	                    condition_1 = $(this).val();
	                }
	            });
	            this.s.condition = condition_1;
	            // If the condition has been found and selected then the value can be populated and searched
	            if (this.s.condition !== undefined) {
	                $(this.dom.conditionTitle).remove();
	                $(this.dom.condition).removeClass(this.classes.italic);
	                this._populateValue(loadedCriteria);
	            }
	            else {
	                $(this.dom.conditionTitle).prependTo(this.dom.condition).attr('selected', true);
	            }
	        }
	    };
	    /**
	     * Sets the listeners for the criteria
	     */
	    Criteria.prototype.setListeners = function () {
	        var _this = this;
	        $(this.dom.data)
	            .unbind('input')
	            .on('input', function () {
	            $(_this.dom.dataTitle).attr('selected', false);
	            $(_this.dom.data).removeClass(_this.classes.italic);
	            _this.s.dataIdx = $(_this.dom.data).children('option:selected').val();
	            _this.s.data = $(_this.dom.data).children('option:selected').text();
	            // When the data is changed, the values in condition and value may also change so need to renew them
	            _this._clearCondition();
	            _this._clearValue();
	            _this._populateCondition();
	            // If this criteria was previously active in the search then remove it from the search and trigger a new search
	            if (_this.s.filled) {
	                _this.s.filled = false;
	                _this.s.dt.draw();
	                _this.setListeners();
	            }
	            _this.s.dt.state.save();
	        });
	        $(this.dom.condition)
	            .unbind('input')
	            .on('input', function () {
	            $(_this.dom.conditionTitle).attr('selected', false);
	            $(_this.dom.condition).removeClass(_this.classes.italic);
	            var condDisp = $(_this.dom.condition).children('option:selected').val();
	            // Find the condition that has been selected and store it internally
	            for (var _i = 0, _a = Array.from(_this.s.conditions.keys()); _i < _a.length; _i++) {
	                var cond = _a[_i];
	                if (cond === condDisp) {
	                    _this.s.condition = condDisp;
	                    break;
	                }
	            }
	            // When the condition is changed, the value selector may switch between a select element and an input element
	            _this._clearValue();
	            _this._populateValue();
	            for (var _b = 0, _c = _this.dom.value; _b < _c.length; _b++) {
	                var val = _c[_b];
	                // If this criteria was previously active in the search then remove it from the search and trigger a new search
	                if (_this.s.filled && $(_this.dom.container).has(val).length !== 0) {
	                    _this.s.filled = false;
	                    _this.s.dt.draw();
	                    _this.setListeners();
	                }
	            }
	            _this.s.dt.draw();
	        });
	    };
	    /**
	     * Adjusts the criteria to make SearchBuilder responsive
	     */
	    Criteria.prototype._adjustCriteria = function () {
	        // If this criteria is not present then don't bother adjusting it
	        if ($(document).has(this.dom.container).length === 0) {
	            return;
	        }
	        var valRight;
	        var valWidth;
	        var outmostval = this.dom.value[this.dom.value.length - 1];
	        // Calculate the width and right value of the outmost value element
	        if ($(this.dom.container).has(outmostval).length !== 0) {
	            valWidth = $(outmostval).outerWidth(true);
	            valRight = $(outmostval).offset().left + valWidth;
	        }
	        else {
	            return;
	        }
	        var leftOffset = $(this.dom.left).offset();
	        var rightOffset = $(this.dom.right).offset();
	        var clearOffset = $(this.dom["delete"]).offset();
	        var hasLeft = $(this.dom.container).has(this.dom.left).length !== 0;
	        var hasRight = $(this.dom.container).has(this.dom.right).length !== 0;
	        var buttonsLeft = hasLeft ?
	            leftOffset.left :
	            hasRight ?
	                rightOffset.left :
	                clearOffset.left;
	        // Perform the responsive calculations and redraw where necessary
	        if (buttonsLeft - valRight < 15 ||
	            (hasLeft && leftOffset.top !== clearOffset.top) ||
	            (hasRight && rightOffset.top !== clearOffset.top)) {
	            $(this.dom.container).parent().addClass(this.classes.vertical);
	            $(this.s.topGroup).trigger('dtsb-redrawContents');
	        }
	        else if (buttonsLeft -
	            ($(this.dom.data).offset().left +
	                $(this.dom.data).outerWidth(true) +
	                $(this.dom.condition).outerWidth(true) +
	                valWidth) > 15) {
	            $(this.dom.container).parent().removeClass(this.classes.vertical);
	            $(this.s.topGroup).trigger('dtsb-redrawContents');
	        }
	    };
	    /**
	     * Builds the elements of the dom together
	     */
	    Criteria.prototype._buildCriteria = function () {
	        // Append Titles for select elements
	        $(this.dom.data).append(this.dom.dataTitle);
	        $(this.dom.condition).append(this.dom.conditionTitle);
	        // Add elements to container
	        $(this.dom.container)
	            .append(this.dom.data)
	            .append(this.dom.condition);
	        for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
	            var val = _a[_i];
	            $(val).append(this.dom.valueTitle);
	            $(this.dom.container).append(val);
	        }
	        // Add buttons to container
	        $(this.dom.container)
	            .append(this.dom["delete"])
	            .append(this.dom.right);
	        this.setListeners();
	    };
	    /**
	     * Clears the condition select element
	     */
	    Criteria.prototype._clearCondition = function () {
	        $(this.dom.condition).empty();
	        $(this.dom.conditionTitle).attr('selected', true).attr('disabled', true);
	        $(this.dom.condition).append(this.dom.conditionTitle);
	        this.s.conditions = new Map();
	        this.s.condition = undefined;
	    };
	    /**
	     * Clears the value elements
	     */
	    Criteria.prototype._clearValue = function () {
	        if (this.s.condition !== undefined) {
	            // Remove all of the value elements
	            for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
	                var val = _a[_i];
	                $(val).remove();
	            }
	            // Call the init function to get the value elements for this condition
	            var value = this.s.conditions.get(this.s.condition).init(this, Criteria.updateListener);
	            this.dom.value = Array.isArray(value) ?
	                value :
	                [value];
	            $(this.dom.value[0]).insertAfter(this.dom.condition).trigger('dtsb-inserted');
	            // Insert all of the value elements
	            for (var i = 1; i < this.dom.value.length; i++) {
	                $(this.dom.value[i]).insertAfter(this.dom.value[i - 1]).trigger('dtsb-inserted');
	            }
	        }
	        else {
	            // Remove all of the value elements
	            for (var _b = 0, _c = this.dom.value; _b < _c.length; _b++) {
	                var val = _c[_b];
	                $(val).remove();
	            }
	            // Append the default valueTitle to the default select element
	            $(this.dom.valueTitle)
	                .attr('selected', true)
	                .attr('disabled', false);
	            $(this.dom.defaultValue)
	                .append(this.dom.valueTitle)
	                .insertAfter(this.dom.condition);
	        }
	        this.s.value = [];
	    };
	    /**
	     * Populates the condition dropdown
	     */
	    Criteria.prototype._populateCondition = function () {
	        var conditionOpts = [];
	        // If there are no conditions stored then we need to get them from the appropriate type
	        if (this.s.conditions.size === 0) {
	            var column = $(this.dom.data).children('option:selected').val();
	            this.s.type = this.s.dt.columns().type().toArray()[column];
	            // If the column type is unknown, call a draw to try reading it again
	            if (this.s.type === null) {
	                this.s.dt.draw();
	                this.setListeners();
	                this.s.type = this.s.dt.columns().type().toArray()[column];
	            }
	            // Enable the condition element
	            $(this.dom.condition)
	                .attr('disabled', false)
	                .empty()
	                .append(this.dom.conditionTitle)
	                .addClass(this.classes.italic);
	            $(this.dom.conditionTitle)
	                .attr('selected', true);
	            // Select which conditions are going to be used based on the column type
	            var conditionObj = this.c.conditions[this.s.type] !== undefined ?
	                this.c.conditions[this.s.type] :
	                this.s.type.indexOf('moment') !== -1 && $.fn.dataTable.moment !== undefined ?
	                    this.c.conditions.moment :
	                    this.c.conditions.string;
	            // If it is a moment format then extract the date format
	            if (this.s.type.indexOf('moment') !== -1) {
	                this.s.momentFormat = this.s.type.replace(/moment\-/g, '');
	            }
	            // Add all of the conditions to the select element
	            for (var _i = 0, _a = Object.keys(conditionObj); _i < _a.length; _i++) {
	                var condition = _a[_i];
	                if (conditionObj[condition] !== null) {
	                    this.s.conditions.set(condition, conditionObj[condition]);
	                    conditionOpts.push($('<option>', {
	                        text: conditionObj[condition].conditionName,
	                        value: condition
	                    })
	                        .addClass(this.classes.option)
	                        .addClass(this.classes.notItalic));
	                }
	            }
	        }
	        // Otherwise we can just load them in
	        else if (this.s.conditions.size > 0) {
	            $(this.dom.condition).empty().attr('disabled', false).addClass(this.classes.italic);
	            for (var _b = 0, _c = Array.from(this.s.conditions.keys()); _b < _c.length; _b++) {
	                var condition = _c[_b];
	                var condName = this.s.conditions.get(condition).conditionName;
	                var newOpt = $('<option>', {
	                    text: condName,
	                    value: condition
	                })
	                    .addClass(this.classes.option)
	                    .addClass(this.classes.notItalic);
	                if (this.s.condition !== undefined && this.s.condition === condName) {
	                    $(newOpt).attr('selected', true);
	                    $(this.dom.condition).removeClass(this.classes.italic);
	                }
	                conditionOpts.push(newOpt);
	            }
	        }
	        else {
	            $(this.dom.condition)
	                .attr('disabled', true)
	                .addClass(this.classes.italic);
	            return;
	        }
	        // Sort the conditions so that they are displayed alphabetically
	        conditionOpts.sort(function (a, b) {
	            if ($(a).val() < $(b).val()) {
	                return -1;
	            }
	            else if ($(a).val() < $(b).val()) {
	                return 1;
	            }
	            else {
	                return 0;
	            }
	        });
	        for (var _d = 0, conditionOpts_1 = conditionOpts; _d < conditionOpts_1.length; _d++) {
	            var opt = conditionOpts_1[_d];
	            $(this.dom.condition).append(opt);
	        }
	    };
	    /**
	     * Populates the data select element
	     */
	    Criteria.prototype._populateData = function () {
	        var _this = this;
	        $(this.dom.data).empty().append(this.dom.dataTitle);
	        // If there are no datas stored then we need to get them from the table
	        if (this.s.dataPoints.length === 0) {
	            this.s.dt.columns().every(function (index) {
	                // Need to check that the column can be filtered on before adding it
	                if (_this.c.columns === true ||
	                    (_this.s.dt.columns(_this.c.columns).indexes().toArray().indexOf(index) !== -1)) {
	                    var found = false;
	                    for (var _i = 0, _a = _this.s.dataPoints; _i < _a.length; _i++) {
	                        var val = _a[_i];
	                        if (val.index === index) {
	                            found = true;
	                            break;
	                        }
	                    }
	                    if (!found) {
	                        var opt = { text: _this.s.dt.settings()[0].aoColumns[index].sTitle, index: index };
	                        _this.s.dataPoints.push(opt);
	                        $(_this.dom.data).append($('<option>', {
	                            text: opt.text,
	                            value: opt.index
	                        })
	                            .addClass(_this.classes.option)
	                            .addClass(_this.classes.notItalic));
	                    }
	                }
	            });
	        }
	        // Otherwise we can just load them in
	        else {
	            var _loop_1 = function (data) {
	                this_1.s.dt.columns().every(function (index) {
	                    if (_this.s.dt.settings()[0].aoColumns[index].sTitle === data.text) {
	                        data.index = index;
	                    }
	                });
	                var newOpt = $('<option>', {
	                    text: data.text,
	                    value: data.index
	                })
	                    .addClass(this_1.classes.option)
	                    .addClass(this_1.classes.notItalic);
	                if (this_1.s.data === data.text) {
	                    this_1.s.dataIdx = data.index;
	                    $(newOpt).attr('selected', true);
	                    $(this_1.dom.data).removeClass(this_1.classes.italic);
	                }
	                $(this_1.dom.data).append(newOpt);
	            };
	            var this_1 = this;
	            for (var _i = 0, _a = this.s.dataPoints; _i < _a.length; _i++) {
	                var data = _a[_i];
	                _loop_1(data);
	            }
	        }
	    };
	    /**
	     * Populates the Value select element
	     * @param loadedCriteria optional, used to reload criteria from predefined filters
	     */
	    Criteria.prototype._populateValue = function (loadedCriteria) {
	        var _this = this;
	        var prevFilled = this.s.filled;
	        this.s.filled = false;
	        // Remove any previous value elements
	        $(this.dom.defaultValue).remove();
	        for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
	            var val = _a[_i];
	            $(val).remove();
	        }
	        var children = $(this.dom.container).children();
	        if (children.length > 3) {
	            for (var i = 2; i < children.length - 1; i++) {
	                $(children[i]).remove();
	            }
	        }
	        // Find the column with the title matching the data for the criteria and take note of the index
	        if (loadedCriteria !== undefined) {
	            this.s.dt.columns().every(function (index) {
	                if (_this.s.dt.settings()[0].aoColumns[index].sTitle === loadedCriteria.data) {
	                    _this.s.dataIdx = index;
	                }
	            });
	        }
	        // Initialise the value elements based on the condition
	        var value = this.s.conditions.get(this.s.condition).init(this, Criteria.updateListener, loadedCriteria !== undefined ? loadedCriteria.value : undefined);
	        if (loadedCriteria !== undefined && loadedCriteria.value !== undefined) {
	            this.s.value = loadedCriteria.value;
	        }
	        this.dom.value = Array.isArray(value) ?
	            value :
	            [value];
	        // Insert value elements and trigger the inserted event
	        $(this.dom.value[0])
	            .insertAfter(this.dom.condition)
	            .trigger('dtsb-inserted');
	        for (var i = 1; i < this.dom.value.length; i++) {
	            $(this.dom.value[i])
	                .insertAfter(this.dom.value[i - 1])
	                .trigger('dtsb-inserted');
	        }
	        // Check if the criteria can be used in a search
	        this.s.filled = this.s.conditions.get(this.s.condition).isInputValid(this.dom.value, this);
	        this.setListeners();
	        // If it can and this is different to before then trigger a draw
	        if (prevFilled !== this.s.filled) {
	            this.s.dt.draw();
	            this.setListeners();
	        }
	    };
	    Criteria.version = '0.0.1';
	    Criteria.classes = {
	        button: 'dtsb-button',
	        buttonContainer: 'dtsb-buttonContainer',
	        condition: 'dtsb-condition',
	        container: 'dtsb-criteria',
	        data: 'dtsb-data',
	        "delete": 'dtsb-delete',
	        dropDown: 'dtsb-dropDown',
	        greyscale: 'dtsb-greyscale',
	        input: 'dtsb-input',
	        italic: 'dtsb-italic',
	        joiner: 'dtsp-joiner',
	        left: 'dtsb-left',
	        notItalic: 'dtsb-notItalic',
	        option: 'dtsb-option',
	        right: 'dtsb-right',
	        value: 'dtsb-value',
	        vertical: 'dtsb-vertical'
	    };
	    /**
	     * Default initialisation function for select conditions
	     */
	    Criteria.initSelect = function (that, fn, preDefined) {
	        if (preDefined === void 0) { preDefined = null; }
	        var column = $(that.dom.data).children('option:selected').val();
	        var indexArray = that.s.dt.rows().indexes().toArray();
	        var settings = that.s.dt.settings()[0];
	        // Declare select element to be used with all of the default classes and listeners.
	        var el = $('<select/>')
	            .addClass(Criteria.classes.value)
	            .addClass(Criteria.classes.dropDown)
	            .addClass(Criteria.classes.italic)
	            .append(that.dom.valueTitle)
	            .on('input', function () {
	            $(this).removeClass(Criteria.classes.italic);
	            fn(that, this);
	        });
	        var added = [];
	        var options = [];
	        // Add all of the options from the table to the select element.
	        // Only add one option for each possible value
	        for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
	            var index = indexArray_1[_i];
	            var value = {
	                filter: settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.search),
	                index: index,
	                text: settings.oApi._fnGetCellData(settings, index, column, 'display')
	            };
	            // Add text and value, stripping out any html if that is the column type
	            var opt = $('<option>', {
	                text: that.s.type.includes('html') ? value.text.replace(/(<([^>]+)>)/ig, '') : value.text,
	                value: that.s.type.includes('html') ? value.filter.replace(/(<([^>]+)>)/ig, '') : value.filter
	            })
	                .addClass(that.classes.option)
	                .addClass(that.classes.notItalic);
	            var val = $(opt).val();
	            // Check that this value has not already been added
	            if (added.indexOf(val) === -1) {
	                // $(el).append(opt);
	                added.push(val);
	                options.push(opt);
	                // If this value was previously selected as indicated by preDefined, then select it again
	                if (preDefined !== null && opt.val() === preDefined[0]) {
	                    opt.attr('selected', true);
	                    that.dom.valueTitle.remove();
	                    $(el).removeClass(Criteria.classes.italic);
	                }
	            }
	        }
	        options.sort(function (a, b) {
	            if (that.s.type === 'string' || that.s.type === 'num' || that.s.type === 'html' || that.s.type === 'html-num') {
	                if ($(a).val() < $(b).val()) {
	                    return -1;
	                }
	                else if ($(a).val() < $(b).val()) {
	                    return 1;
	                }
	                else {
	                    return 0;
	                }
	            }
	            else if (that.s.type === 'num-fmt' || that.s.type === 'html-num-fmt') {
	                if (+$(a).val().replace(/[^0-9.]/g, '') < +$(b).val().replace(/[^0-9.]/g, '')) {
	                    return -1;
	                }
	                else if (+$(a).val().replace(/[^0-9.]/g, '') < +$(b).val().replace(/[^0-9.]/g, '')) {
	                    return 1;
	                }
	                else {
	                    return 0;
	                }
	            }
	        });
	        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
	            var opt = options_1[_a];
	            $(el).append(opt);
	        }
	        return el;
	    };
	    /**
	     * Default initialisation function for input conditions
	     */
	    Criteria.initInput = function (that, fn, preDefined) {
	        if (preDefined === void 0) { preDefined = null; }
	        // Declare the input element
	        var el = $('<input/>')
	            .addClass(Criteria.classes.value)
	            .addClass(Criteria.classes.input)
	            .on('input', function () { fn(that, this); });
	        // If there is a preDefined value then add it
	        if (preDefined !== null) {
	            $(el).val(preDefined[0]);
	        }
	        return el;
	    };
	    /**
	     * Default initialisation function for conditions requiring 2 inputs
	     */
	    Criteria.init2Input = function (that, fn, preDefined) {
	        if (preDefined === void 0) { preDefined = null; }
	        // Declare all of the necessary jQuery elements
	        var els = [
	            $('<input/>')
	                .addClass(Criteria.classes.value)
	                .addClass(Criteria.classes.input)
	                .on('input', function () { fn(that, this); }),
	            $('<span>')
	                .addClass(that.classes.joiner).text('and'),
	            $('<input/>')
	                .addClass(Criteria.classes.value)
	                .addClass(Criteria.classes.input)
	                .on('input', function () { fn(that, this); })
	        ];
	        // If there is a preDefined value then add it
	        if (preDefined !== null) {
	            $(els[0]).val(preDefined[0]);
	            $(els[2]).val(preDefined[1]);
	        }
	        return els;
	    };
	    /**
	     * Default initialisation function for date conditions
	     */
	    Criteria.initDate = function (that, fn, preDefined) {
	        if (preDefined === void 0) { preDefined = null; }
	        // Declare date element using DataTables dateTime plugin
	        var el = $('<input/>')
	            .addClass(Criteria.classes.value)
	            .addClass(Criteria.classes.input)
	            .dtDateTime({
	            attachTo: 'input',
	            format: that.s.momentFormat ? that.s.momentFormat : undefined
	        })
	            .on('input change', function () { fn(that, this); });
	        // If there is a preDefined value then add it
	        if (preDefined !== null) {
	            $(el).val(preDefined[0]);
	        }
	        return el;
	    };
	    Criteria.init2Date = function (that, fn, preDefined) {
	        if (preDefined === void 0) { preDefined = null; }
	        // Declare all of the date elements that are required using DataTables dateTime plugin
	        var els = [
	            $('<input/>')
	                .addClass(Criteria.classes.value)
	                .addClass(Criteria.classes.input)
	                .dtDateTime({
	                attachTo: 'input',
	                format: that.s.momentFormat ? that.s.momentFormat : undefined
	            })
	                .on('input change', function () { fn(that, this); }),
	            $('<span>')
	                .addClass(that.classes.joiner)
	                .text('and'),
	            $('<input/>')
	                .addClass(Criteria.classes.value)
	                .addClass(Criteria.classes.input)
	                .dtDateTime({
	                attachTo: 'input',
	                format: that.s.momentFormat ? that.s.momentFormat : undefined
	            })
	                .on('input change', function () { fn(that, this); })
	        ];
	        // If there are and preDefined values then add them
	        if (preDefined !== null && preDefined.length > 0) {
	            $(els[0]).val(preDefined[0]);
	            $(els[2]).val(preDefined[1]);
	        }
	        return els;
	    };
	    /**
	     * Default function for select elements to validate condition
	     */
	    Criteria.isInputValidSelect = function (el) {
	        var allFilled = true;
	        // Check each element to make sure that the selections are valid
	        for (var _i = 0, el_1 = el; _i < el_1.length; _i++) {
	            var element = el_1[_i];
	            if ($(element).children('option:selected').length === $(element).children('option').length - $(element).children('option.' + Criteria.classes.notItalic).length &&
	                $(element).children('option:selected').length === 1 &&
	                $(element).children('option:selected')[0] === $(element).children('option:hidden')[0]) {
	                allFilled = false;
	            }
	        }
	        return allFilled;
	    };
	    /**
	     * Default function for input and date elements to validate condition
	     */
	    Criteria.isInputValidInput = function (el) {
	        var allFilled = true;
	        // Check each element to make sure that the inputs are valid
	        for (var _i = 0, el_2 = el; _i < el_2.length; _i++) {
	            var element = el_2[_i];
	            if ($(element).is('input') && $(element).val().length === 0) {
	                allFilled = false;
	            }
	        }
	        return allFilled;
	    };
	    /**
	     * Default function for getting select conditions
	     */
	    Criteria.inputValueSelect = function (el) {
	        var values = [];
	        // Go through the select elements and push each selected option to the return array
	        for (var _i = 0, el_3 = el; _i < el_3.length; _i++) {
	            var element = el_3[_i];
	            if ($(element).is('select')) {
	                values.push($(element).children('option:selected').val());
	            }
	        }
	        return values;
	    };
	    /**
	     * Default function for getting input conditions
	     */
	    Criteria.inputValueInput = function (el) {
	        var values = [];
	        // Go through the input elements and push each value to the return array
	        for (var _i = 0, el_4 = el; _i < el_4.length; _i++) {
	            var element = el_4[_i];
	            if ($(element).is('input')) {
	                values.push($(element).val());
	            }
	        }
	        return values;
	    };
	    /**
	     * Function that is run on each element as a call back when a search should be triggered
	     */
	    Criteria.updateListener = function (that, el) {
	        // When the value is changed the criteria is now complete so can be included in searches
	        // Get the condition from the map based on the key that has been selected for the condition
	        var condition = that.s.conditions.get(that.s.condition);
	        that.s.filled = condition.isInputValid(that.dom.value, that);
	        that.s.value = condition.inputValue(that.dom.value, that);
	        if (!Array.isArray(that.s.value)) {
	            that.s.value = [that.s.value];
	        }
	        // Take note of the cursor position so that we can refocus there later
	        var idx = null;
	        var cursorPos = null;
	        for (var i = 0; i < that.dom.value.length; i++) {
	            if (el === that.dom.value[i][0]) {
	                idx = i;
	                if (el.selectionStart !== undefined) {
	                    cursorPos = el.selectionStart;
	                }
	            }
	        }
	        // Trigger a search
	        that.s.dt.draw();
	        // Refocus the element and set the correct cursor position
	        if (idx !== null) {
	            $(that.dom.value[idx]).removeClass(that.classes.italic);
	            $(that.dom.value[idx]).focus();
	            if (cursorPos !== null) {
	                $(that.dom.value[idx])[0].setSelectionRange(cursorPos, cursorPos);
	            }
	        }
	    };
	    Criteria.dateConditions = {
	        '!=': {
	            conditionName: 'Not',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                return value !== comparison[0];
	            }
	        },
	        '!between': {
	            conditionName: 'Not Between',
	            init: Criteria.init2Date,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                if (comparison[0] < comparison[1]) {
	                    return !(comparison[0] <= value && value <= comparison[1]);
	                }
	                else {
	                    return !(comparison[1] <= value && value <= comparison[0]);
	                }
	            }
	        },
	        '!null': {
	            conditionName: 'Not Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return !(value === null || value === undefined || value.length === 0);
	            }
	        },
	        '<': {
	            conditionName: 'Before',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                return value < comparison[0];
	            }
	        },
	        '=': {
	            conditionName: 'Equals',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                return value === comparison[0];
	            }
	        },
	        '>': {
	            conditionName: 'After',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                return value > comparison[0];
	            }
	        },
	        'between': {
	            conditionName: 'Between',
	            init: Criteria.init2Date,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                value = value.replace(/(\/|\-|\,)/g, '-');
	                if (comparison[0] < comparison[1]) {
	                    return comparison[0] <= value && value <= comparison[1];
	                }
	                else {
	                    return comparison[1] <= value && value <= comparison[0];
	                }
	            }
	        },
	        'null': {
	            conditionName: 'Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return (value === null || value === undefined || value.length === 0);
	            }
	        }
	    };
	    Criteria.momentDateConditions = {
	        '!=': {
	            conditionName: 'Not',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                return moment(value, that.s.momentFormat).valueOf() !== moment(comparison[0], that.s.momentFormat).valueOf();
	            }
	        },
	        '!between': {
	            conditionName: 'Not Between',
	            init: Criteria.init2Date,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                var val = moment(value, that.s.momentFormat).valueOf();
	                var comp0 = moment(comparison[0], that.s.momentFormat).valueOf();
	                var comp1 = moment(comparison[1], that.s.momentFormat).valueOf();
	                if (comp0 < comp1) {
	                    return !(+comp0 <= +val && +val <= +comp1);
	                }
	                else {
	                    return !(+comp1 <= +val && +val <= +comp0);
	                }
	            }
	        },
	        '!null': {
	            conditionName: 'Not Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return !(value === null || value === undefined || value.length === 0);
	            }
	        },
	        '<': {
	            conditionName: 'Before',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                return moment(value, that.s.momentFormat).valueOf() < moment(comparison[0], that.s.momentFormat).valueOf();
	            }
	        },
	        '=': {
	            conditionName: 'Equals',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                return moment(value, that.s.momentFormat).valueOf() === moment(comparison[0], that.s.momentFormat).valueOf();
	            }
	        },
	        '>': {
	            conditionName: 'After',
	            init: Criteria.initDate,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                return moment(value, that.s.momentFormat).valueOf() > moment(comparison[0], that.s.momentFormat).valueOf();
	            }
	        },
	        'between': {
	            conditionName: 'Between',
	            init: Criteria.init2Date,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison, that) {
	                var val = moment(value, that.s.momentFormat).valueOf();
	                var comp0 = moment(comparison[0], that.s.momentFormat).valueOf();
	                var comp1 = moment(comparison[1], that.s.momentFormat).valueOf();
	                if (comp0 < comp1) {
	                    return comp0 <= val && val <= comp1;
	                }
	                else {
	                    return comp1 <= val && val <= comp0;
	                }
	            }
	        },
	        'null': {
	            conditionName: 'Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return (value === null || value === undefined || value.length === 0);
	            }
	        }
	    };
	    Criteria.numConditions = {
	        '!=': {
	            conditionName: 'Not',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidSelect,
	            search: function (value, comparison) {
	                return +value !== +comparison[0];
	            }
	        },
	        '!between': {
	            conditionName: 'Not Between',
	            init: Criteria.init2Input,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                if (+comparison[0] < +comparison[1]) {
	                    return !(+comparison[0] <= +value && +value <= +comparison[1]);
	                }
	                else {
	                    return !(+comparison[1] <= +value && +value <= +comparison[0]);
	                }
	            }
	        },
	        '!null': {
	            conditionName: 'Not Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return !(value === null || value === undefined || value.length === 0);
	            }
	        },
	        '<': {
	            conditionName: 'Less Than',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return +value < +comparison[0];
	            }
	        },
	        '<=': {
	            conditionName: 'Less Than Equal To',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return +value <= +comparison[0];
	            }
	        },
	        '=': {
	            conditionName: 'Equals',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidSelect,
	            search: function (value, comparison) {
	                return +value === +comparison[0];
	            }
	        },
	        '>': {
	            conditionName: 'Greater Than',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return +value > +comparison[0];
	            }
	        },
	        '>=': {
	            conditionName: 'Greater Than Equal To',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return +value >= +comparison[0];
	            }
	        },
	        'between': {
	            conditionName: 'Between',
	            init: Criteria.init2Input,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                if (+comparison[0] < +comparison[1]) {
	                    return +comparison[0] <= +value && +value <= +comparison[1];
	                }
	                else {
	                    return +comparison[1] <= +value && +value <= +comparison[0];
	                }
	            }
	        },
	        'null': {
	            conditionName: 'Empty',
	            init: function () { return; },
	            inputValue: function () { return; },
	            isInputValid: function () { return true; },
	            search: function (value, comparison) {
	                return (value === null || value === undefined || value.length === 0);
	            }
	        }
	    };
	    Criteria.numFmtConditions = {
	        '!=': {
	            conditionName: 'Not',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidSelect,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp = comparison[0].replace(/[^0-9.]/g, '');
	                return +val !== +comp;
	            }
	        },
	        '!between': {
	            conditionName: 'Not Between',
	            init: Criteria.init2Input,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                var comp1 = comparison[1].replace(/[^0-9.]/g, '');
	                if (comp0 < comp1) {
	                    return !(+comp0 <= +val && +val <= +comp1);
	                }
	                else {
	                    return !(+comp1 <= +val && +val <= +comp0);
	                }
	            }
	        },
	        '!null': {
	            conditionName: 'Not Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return !(value === null || value === undefined || value.length === 0);
	            }
	        },
	        '<': {
	            conditionName: 'Less Than',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp = comparison[0].replace(/[^0-9.]/g, '');
	                return +val < +comp;
	            }
	        },
	        '<=': {
	            conditionName: 'Less Than Equal To',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                return +val <= +comp0;
	            }
	        },
	        '=': {
	            conditionName: 'Equals',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidSelect,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                return +val === +comp0;
	            }
	        },
	        '>': {
	            conditionName: 'Greater Than',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                return +val > +comp0;
	            }
	        },
	        '>=': {
	            conditionName: 'Greater Than Equal To',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                return +val >= +comp0;
	            }
	        },
	        'between': {
	            conditionName: 'Between',
	            init: Criteria.init2Input,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                var val = value.replace(/[^0-9.]/g, '');
	                var comp0 = comparison[0].replace(/[^0-9.]/g, '');
	                var comp1 = comparison[1].replace(/[^0-9.]/g, '');
	                if (comp0 < comp1) {
	                    return +comp0 <= +val && +val <= +comp1;
	                }
	                else {
	                    return +comp1 <= +val && +val <= +comp0;
	                }
	            }
	        },
	        'null': {
	            conditionName: 'Empty',
	            init: function () { return; },
	            inputValue: function () { return; },
	            isInputValid: function () { return true; },
	            search: function (value, comparison) {
	                return (value === null || value === undefined || value.length === 0);
	            }
	        }
	    };
	    Criteria.stringConditions = {
	        '!=': {
	            conditionName: 'Not',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return value !== comparison[0];
	            }
	        },
	        '!null': {
	            conditionName: 'Not Empty',
	            isInputValid: function () { return true; },
	            init: function () { return; },
	            inputValue: function () {
	                return;
	            },
	            search: function (value, comparison) {
	                return !(value === null || value === undefined || value.length === 0);
	            }
	        },
	        '=': {
	            conditionName: 'Equals',
	            init: Criteria.initSelect,
	            inputValue: Criteria.inputValueSelect,
	            isInputValid: Criteria.isInputValidSelect,
	            search: function (value, comparison) {
	                return value === comparison[0];
	            }
	        },
	        'contains': {
	            conditionName: 'Contains',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return value.toLowerCase().includes(comparison[0].toLowerCase());
	            }
	        },
	        'ends': {
	            conditionName: 'Ends With',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === value.length - comparison[0].length;
	            }
	        },
	        'null': {
	            conditionName: 'Empty',
	            init: function () { return; },
	            inputValue: function () { return; },
	            isInputValid: function () { return true; },
	            search: function (value, comparison) {
	                return (value === null || value === undefined || value.length === 0);
	            }
	        },
	        'starts': {
	            conditionName: 'Starts With',
	            init: Criteria.initInput,
	            inputValue: Criteria.inputValueInput,
	            isInputValid: Criteria.isInputValidInput,
	            search: function (value, comparison) {
	                return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === 0;
	            }
	        }
	    };
	    Criteria.defaults = {
	        columns: true,
	        conditions: {
	            'date': Criteria.dateConditions,
	            'html': Criteria.stringConditions,
	            'html-num': Criteria.numConditions,
	            'html-num-fmt': Criteria.numFmtConditions,
	            'moment': Criteria.momentDateConditions,
	            'num': Criteria.numConditions,
	            'num-fmt': Criteria.numFmtConditions,
	            'string': Criteria.stringConditions
	        },
	        depthLimit: false,
	        greyscale: false,
	        orthogonal: {
	            conditionName: 'Condition Name',
	            search: 'filter'
	        }
	    };
	    return Criteria;
	}());

	var $$1;
	var DataTable$1;
	/**
	 * Sets the value of jQuery for use in the file
	 * @param jq the instance of jQuery to be set
	 */
	function setJQuery$1(jq) {
	    $$1 = jq;
	    DataTable$1 = jq.fn.dataTable;
	}
	/**
	 * The Group class is used within SearchBuilder to represent a group of criteria
	 */
	var Group = /** @class */ (function () {
	    function Group(table, opts, topGroup, index, isChild, depth) {
	        if (index === void 0) { index = 0; }
	        if (isChild === void 0) { isChild = false; }
	        if (depth === void 0) { depth = 1; }
	        // Check that the required version of DataTables is included
	        if (!DataTable$1 || !DataTable$1.versionCheck || !DataTable$1.versionCheck('1.10.0')) {
	            throw new Error('SearchBuilder requires DataTables 1.10 or newer');
	        }
	        this.classes = $$1.extend(true, {}, Group.classes);
	        // Get options from user
	        this.c = $$1.extend(true, {}, Group.defaults, opts);
	        this.s = {
	            criteria: [],
	            depth: depth,
	            dt: table,
	            index: index,
	            isChild: isChild,
	            logic: undefined,
	            opts: opts,
	            toDrop: undefined,
	            topGroup: topGroup
	        };
	        this.dom = {
	            add: $$1('<button/>')
	                .addClass(this.classes.add)
	                .addClass(this.classes.button),
	            clear: $$1('<button>&times</button>')
	                .addClass(this.classes.button)
	                .addClass(this.classes.clearGroup),
	            container: $$1('<div/>')
	                .addClass(this.classes.group),
	            logic: $$1('<button/>')
	                .addClass(this.classes.logic)
	                .addClass(this.classes.button),
	            logicContainer: $$1('<div/>')
	                .addClass(this.classes.logicContainer)
	        };
	        // A reference to the top level group is maintained throughout any subgroups and criteria that may be created
	        if (this.s.topGroup === undefined) {
	            this.s.topGroup = this.dom.container;
	        }
	        this._setup();
	        return this;
	    }
	    /**
	     * Destroys the groups buttons, clears the internal criteria and removes it from the dom
	     */
	    Group.prototype.destroy = function () {
	        // Turn off listeners
	        $$1(this.dom.add).off('.dtsb');
	        $$1(this.dom.logic).off('.dtsb');
	        // Trigger event for groups at a higher level to pick up on
	        $$1(this.dom.container)
	            .trigger('dtsb-destroy')
	            .remove();
	        this.s.criteria = [];
	    };
	    /**
	     * Gets the details required to rebuild the group
	     */
	    Group.prototype.getDetails = function () {
	        if (this.s.criteria.length === 0) {
	            return {};
	        }
	        var details = {
	            criteria: [],
	            logic: this.s.logic
	        };
	        // NOTE here crit could be either a subgroup or a criteria
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            details.criteria.push(crit.criteria.getDetails());
	        }
	        return details;
	    };
	    /**
	     * Getter for the node for the container of the group
	     * @returns Node for the container of the group
	     */
	    Group.prototype.getNode = function () {
	        return this.dom.container;
	    };
	    /**
	     * Rebuilds the group based upon the details passed in
	     * @param loadedDetails the details required to rebuild the group
	     */
	    Group.prototype.rebuild = function (loadedDetails) {
	        // If no criteria are stored then just return
	        if (loadedDetails.criteria === undefined || loadedDetails.criteria === null || loadedDetails.criteria.length === 0) {
	            return;
	        }
	        this.s.logic = loadedDetails.logic;
	        $$1(this.dom.logic).text(this.s.logic === 'OR' ? this.s.dt.i18n('searchBuilder.logicOr', 'Or') : this.s.dt.i18n('searchBuilder.logicAnd', 'And'));
	        // Add all of the criteria, be it a sub group or a criteria
	        for (var _i = 0, _a = loadedDetails.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            if (crit.logic !== undefined) {
	                this._addPrevGroup(crit);
	            }
	            else if (crit.logic === undefined) {
	                this._addPrevCriteria(crit);
	            }
	        }
	        // For all of the criteria children, update the arrows incase they require changing and set the listeners
	        for (var _b = 0, _c = this.s.criteria; _b < _c.length; _b++) {
	            var crit = _c[_b];
	            if (crit.logic === undefined) {
	                crit.criteria.updateArrows(this.s.criteria.length > 1, false);
	                this._setCriteriaListeners(crit.criteria);
	            }
	        }
	    };
	    /**
	     * Redraws the Contents of the searchBuilder Groups and Criteria
	     */
	    Group.prototype.redrawContents = function () {
	        // Clear the container out and add the basic elements
	        $$1(this.dom.container)
	            .empty()
	            .append(this.dom.logicContainer)
	            .append(this.dom.add);
	        // Sort the criteria by index so that they appear in the correct order
	        this.s.criteria.sort(function (a, b) {
	            if (a.criteria.s.index < b.criteria.s.index) {
	                return -1;
	            }
	            else if (a.criteria.s.index > b.criteria.s.index) {
	                return 1;
	            }
	            return 0;
	        });
	        this.setListeners();
	        for (var i = 0; i < this.s.criteria.length; i++) {
	            if (this.s.criteria[i].logic === undefined) {
	                // Reset the index to the new value
	                this.s.criteria[i].index = i;
	                this.s.criteria[i].criteria.s.index = i;
	                // Add to the group
	                $$1(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
	                // Set listeners for various points
	                this._setCriteriaListeners(this.s.criteria[i].criteria);
	                this.s.criteria[i].criteria.rebuild(this.s.criteria[i].criteria.getDetails());
	            }
	            else if (this.s.criteria[i].criteria.s.criteria.length > 0) {
	                // Reset the index to the new value
	                this.s.criteria[i].index = i;
	                this.s.criteria[i].criteria.s.index = i;
	                // Add the sub group to the group
	                $$1(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
	                // Redraw the contents of the group
	                this.s.criteria[i].criteria.redrawContents();
	                this._setGroupListeners(this.s.criteria[i].criteria);
	            }
	            else {
	                // The group is empty so remove it
	                this.s.criteria.splice(i, 1);
	                i--;
	            }
	        }
	        this.setupLogic();
	    };
	    /**
	     * Search method, checking the row data against the criteria in the group
	     * @param rowData The row data to be compared
	     * @returns boolean The result of the search
	     */
	    Group.prototype.search = function (rowData) {
	        if (this.s.logic === 'AND') {
	            return this._andSearch(rowData);
	        }
	        else if (this.s.logic === 'OR') {
	            return this._orSearch(rowData);
	        }
	        return true;
	    };
	    /**
	     * Locates the groups logic button to the correct location on the page
	     */
	    Group.prototype.setupLogic = function () {
	        // Remove logic button
	        $$1(this.dom.logicContainer).remove();
	        $$1(this.dom.clear).remove();
	        // If there are no criteria in the group then keep the logic removed and return
	        if (this.s.criteria.length < 1) {
	            if (!this.s.isChild) {
	                $$1(this.dom.container).trigger('dtsb-destroy');
	                // Set criteria left margin
	                $$1(this.dom.container).css('margin-left', 0);
	            }
	            return;
	        }
	        // Set width, take 2 for the border
	        var height = $$1(this.dom.container).height() - 2;
	        $$1(this.dom.clear).height('0px');
	        $$1(this.dom.logicContainer).append(this.dom.clear).width(height);
	        // Prepend logic button
	        $$1(this.dom.container).prepend(this.dom.logicContainer);
	        this._setLogicListener();
	        // Set criteria left margin
	        $$1(this.dom.container).css('margin-left', $$1(this.dom.logicContainer).outerHeight(true));
	        var logicOffset = $$1(this.dom.logicContainer).offset();
	        // Set horizontal alignment
	        var currentLeft = logicOffset.left;
	        var groupLeft = $$1(this.dom.container).offset().left;
	        var shuffleLeft = currentLeft - groupLeft;
	        var newPos = currentLeft - shuffleLeft - $$1(this.dom.logicContainer).outerHeight(true);
	        $$1(this.dom.logicContainer).offset({ left: newPos });
	        // Set vertical alignment
	        var firstCrit = $$1(this.dom.logicContainer).next();
	        var currentTop = logicOffset.top;
	        var firstTop = $$1(firstCrit).offset().top;
	        var shuffleTop = currentTop - firstTop;
	        var newTop = currentTop - shuffleTop;
	        $$1(this.dom.logicContainer).offset({ top: newTop });
	        $$1(this.dom.clear).outerHeight($$1(this.dom.logicContainer).height());
	        this._setClearListener();
	    };
	    /**
	     * Sets listeners on the groups elements
	     */
	    Group.prototype.setListeners = function () {
	        var _this = this;
	        $$1(this.dom.add).unbind('click');
	        $$1(this.dom.add).on('click', function () {
	            // If this is the parent group then the logic button has not been added yet
	            if (!_this.s.isChild) {
	                $$1(_this.dom.container).prepend(_this.dom.logicContainer);
	            }
	            _this.addCriteria();
	            $$1(_this.dom.container).trigger('dtsb-add');
	            _this.s.dt.state.save();
	            return false;
	        });
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            crit.criteria.setListeners();
	        }
	        this._setClearListener();
	        this._setLogicListener();
	    };
	    /**
	     * Adds a criteria to the group
	     * @param crit Instance of Criteria to be added to the group
	     */
	    Group.prototype.addCriteria = function (crit, redraw) {
	        if (crit === void 0) { crit = null; }
	        if (redraw === void 0) { redraw = true; }
	        var index = crit === null ? this.s.criteria.length : crit.s.index;
	        var criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, index, this.s.depth);
	        // If a Criteria has been passed in then set the values to continue that
	        if (crit !== null) {
	            criteria.c = crit.c;
	            criteria.s = crit.s;
	            criteria.s.depth = this.s.depth;
	            criteria.classes = crit.classes;
	        }
	        criteria.populate();
	        var inserted = false;
	        for (var i = 0; i < this.s.criteria.length; i++) {
	            if (i === 0 && this.s.criteria[i].criteria.s.index > criteria.s.index) {
	                // Add the node for the criteria at the start of the group
	                $$1(criteria.getNode()).insertBefore(this.s.criteria[i].criteria.dom.container);
	                inserted = true;
	            }
	            else if (i < this.s.criteria.length - 1 &&
	                this.s.criteria[i].criteria.s.index < criteria.s.index &&
	                this.s.criteria[i + 1].criteria.s.index > criteria.s.index) {
	                // Add the node for the criteria in the correct location
	                $$1(criteria.getNode()).insertAfter(this.s.criteria[i].criteria.dom.container);
	                inserted = true;
	            }
	        }
	        if (!inserted) {
	            $$1(criteria.getNode()).insertBefore(this.dom.add);
	        }
	        // Add the details for this criteria to the array
	        this.s.criteria.push({
	            criteria: criteria,
	            index: index
	        });
	        this.s.criteria = this.s.criteria.sort(function (a, b) {
	            return a.criteria.s.index - b.criteria.s.index;
	        });
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var opt = _a[_i];
	            if (opt.logic === undefined) {
	                opt.criteria.updateArrows(this.s.criteria.length > 1, redraw);
	            }
	        }
	        this._setCriteriaListeners(criteria);
	        criteria.setListeners();
	        this.setupLogic();
	    };
	    /**
	     * Checks the group to see if it has any filled criteria
	     */
	    Group.prototype.checkFilled = function () {
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            if ((crit.logic === undefined && crit.criteria.s.filled) ||
	                (crit.logic !== undefined && crit.criteria.checkFilled())) {
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
	     * Gets the count for the number of criteria in this group and any sub groups
	     */
	    Group.prototype.count = function () {
	        var count = 0;
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            if (crit.logic !== undefined) {
	                count += crit.criteria.count();
	            }
	            else {
	                count++;
	            }
	        }
	        return count;
	    };
	    /**
	     * Rebuilds a sub group that previously existed
	     * @param loadedGroup The details of a group within this group
	     */
	    Group.prototype._addPrevGroup = function (loadedGroup) {
	        var idx = this.s.criteria.length;
	        var group = new Group(this.s.dt, this.c, this.s.topGroup, idx, true, this.s.depth + 1);
	        // Add the new group to the criteria array
	        this.s.criteria.push({
	            criteria: group,
	            index: idx,
	            logic: group.s.logic
	        });
	        // Rebuild it with the previous conditions for that group
	        group.rebuild(loadedGroup);
	        this.s.criteria[idx].criteria = group;
	        $$1(this.s.topGroup).trigger('dtsb-redrawContents');
	        this._setGroupListeners(group);
	    };
	    /**
	     * Rebuilds a criteria of this group that previously existed
	     * @param loadedCriteria The details of a criteria within the group
	     */
	    Group.prototype._addPrevCriteria = function (loadedCriteria) {
	        var idx = this.s.criteria.length;
	        var criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, idx, this.s.depth);
	        criteria.populate();
	        // Add the new criteria to the criteria array
	        this.s.criteria.push({
	            criteria: criteria,
	            index: idx
	        });
	        // Rebuild it with the previous conditions for that criteria
	        criteria.rebuild(loadedCriteria);
	        this.s.criteria[idx].criteria = criteria;
	        $$1(this.s.topGroup).trigger('dtsb-redrawContents');
	    };
	    /**
	     * Checks And the criteria using AND logic
	     * @param rowData The row data to be checked against the search criteria
	     * @returns boolean The result of the AND search
	     */
	    Group.prototype._andSearch = function (rowData) {
	        // If there are no criteria then return true for this group
	        if (this.s.criteria.length === 0) {
	            return true;
	        }
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            // If the criteria is not complete then skip it
	            if (crit.logic === undefined && !crit.criteria.s.filled) {
	                continue;
	            }
	            // Otherwise if a single one fails return false
	            else if (!crit.criteria.search(rowData)) {
	                return false;
	            }
	        }
	        // If we get to here then everything has passed, so return true for the group
	        return true;
	    };
	    /**
	     * Checks And the criteria using OR logic
	     * @param rowData The row data to be checked against the search criteria
	     * @returns boolean The result of the OR search
	     */
	    Group.prototype._orSearch = function (rowData) {
	        // If there are no criteria in the group then return true
	        if (this.s.criteria.length === 0) {
	            return true;
	        }
	        // This will check to make sure that at least one criteria in the group is complete
	        var filledfound = false;
	        for (var _i = 0, _a = this.s.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            if (crit.criteria.s.filled) {
	                // A completed criteria has been found so set the flag
	                filledfound = true;
	                // If the search passes then return true
	                if (crit.criteria.search(rowData)) {
	                    return true;
	                }
	            }
	            else if (crit.logic !== undefined && crit.criteria.checkFilled()) {
	                filledfound = true;
	                if (crit.criteria.search(rowData)) {
	                    return true;
	                }
	            }
	        }
	        // If we get here we need to return the inverse of filledfound,
	        //  as if any have been found and we are here then none have passed
	        return !filledfound;
	    };
	    /**
	     * Removes a criteria from the group
	     * @param criteria The criteria instance to be removed
	     */
	    Group.prototype._removeCriteria = function (criteria, group) {
	        if (group === void 0) { group = false; }
	        // If removing a criteria and there is only then then just destroy the group
	        if (this.s.criteria.length <= 1 && this.s.isChild) {
	            this.destroy();
	        }
	        else {
	            // Otherwise splice the given criteria out and redo the indexes
	            var last = void 0;
	            for (var i = 0; i < this.s.criteria.length; i++) {
	                if (this.s.criteria[i].index === criteria.s.index && (!group || this.s.criteria[i].criteria instanceof Group)) {
	                    last = i;
	                }
	            }
	            // We want to remove the last element with the desired index, as its replacement will be inserted before it
	            if (last !== undefined) {
	                this.s.criteria.splice(last, 1);
	            }
	            for (var i = 0; i < this.s.criteria.length; i++) {
	                this.s.criteria[i].index = i;
	                this.s.criteria[i].criteria.s.index = i;
	            }
	        }
	    };
	    /**
	     * Sets the listeners in group for a criteria
	     * @param criteria The criteria for the listeners to be set on
	     */
	    Group.prototype._setCriteriaListeners = function (criteria) {
	        var _this = this;
	        $$1(criteria.dom["delete"])
	            .unbind('click')
	            .on('click', function () {
	            _this._removeCriteria(criteria);
	            $$1(criteria.dom.container).remove();
	            _this.setupLogic();
	            for (var _i = 0, _a = _this.s.criteria; _i < _a.length; _i++) {
	                var crit = _a[_i];
	                if (crit.logic === undefined) {
	                    crit.criteria.updateArrows(_this.s.criteria.length > 1);
	                }
	            }
	            criteria.destroy();
	            _this.s.dt.draw();
	            $$1(_this.s.topGroup).trigger('dtsb-updateTitle');
	            return false;
	        });
	        $$1(criteria.dom.right)
	            .unbind('click')
	            .on('click', function () {
	            var idx = criteria.s.index;
	            var group = new Group(_this.s.dt, _this.s.opts, _this.s.topGroup, criteria.s.index, true, _this.s.depth + 1);
	            // Add the criteria that is to be moved to the new group
	            group.addCriteria(criteria);
	            // Update the details in the current groups criteria array
	            _this.s.criteria[idx].criteria = group;
	            _this.s.criteria[idx].logic = 'AND';
	            $$1(_this.s.topGroup).trigger('dtsb-redrawContents');
	            _this._setGroupListeners(group);
	            return false;
	        });
	        $$1(criteria.dom.left)
	            .unbind('click')
	            .on('click', function () {
	            _this.s.toDrop = new Criteria(_this.s.dt, _this.s.opts, _this.s.topGroup, criteria.s.index);
	            _this.s.toDrop.s = criteria.s;
	            _this.s.toDrop.c = criteria.c;
	            _this.s.toDrop.classes = criteria.classes;
	            _this.s.toDrop.populate();
	            // The dropCriteria event mutates the reference to the index so need to store it
	            var index = _this.s.toDrop.s.index;
	            $$1(_this.dom.container).trigger('dtsb-dropCriteria');
	            criteria.s.index = index;
	            _this._removeCriteria(criteria);
	            // By tracking the top level group we can directly trigger a redraw on it,
	            //  bubbling is also possible, but that is slow with deep levelled groups
	            $$1(_this.s.topGroup).trigger('dtsb-redrawContents');
	            _this.s.dt.draw();
	            return false;
	        });
	    };
	    /**
	     * Set's the listeners for the group clear button
	     */
	    Group.prototype._setClearListener = function () {
	        var _this = this;
	        $$1(this.dom.clear)
	            .unbind('click')
	            .on('click', function () {
	            if (!_this.s.isChild) {
	                $$1(_this.dom.container).trigger('dtsb-clearContents');
	                return false;
	            }
	            _this.destroy();
	            $$1(_this.s.topGroup).trigger('dtsb-updateTitle');
	            $$1(_this.s.topGroup).trigger('dtsb-redrawContents');
	            return false;
	        });
	    };
	    /**
	     * Sets listeners for sub groups of this group
	     * @param group The sub group that the listeners are to be set on
	     */
	    Group.prototype._setGroupListeners = function (group) {
	        var _this = this;
	        // Set listeners for the new group
	        $$1(group.dom.add)
	            .unbind('click')
	            .on('click', function () {
	            _this.setupLogic();
	            $$1(_this.dom.container).trigger('dtsb-add');
	            return false;
	        });
	        $$1(group.dom.container)
	            .unbind('dtsb-add')
	            .on('dtsb-add', function () {
	            _this.setupLogic();
	            $$1(_this.dom.container).trigger('dtsb-add');
	            return false;
	        });
	        $$1(group.dom.container)
	            .unbind('dtsb-destroy')
	            .on('dtsb-destroy', function () {
	            _this._removeCriteria(group, true);
	            $$1(group.dom.container).remove();
	            _this.setupLogic();
	            return false;
	        });
	        $$1(group.dom.container)
	            .unbind('dtsb-dropCriteria')
	            .on('dtsb-dropCriteria', function () {
	            var toDrop = group.s.toDrop;
	            toDrop.s.index = group.s.index;
	            toDrop.updateArrows(_this.s.criteria.length > 1, false);
	            _this.addCriteria(toDrop, false);
	            return false;
	        });
	        group.setListeners();
	    };
	    /**
	     * Sets up the Group instance, setting listeners and appending elements
	     */
	    Group.prototype._setup = function () {
	        this.setListeners();
	        $$1(this.dom.add).text(this.s.dt.i18n('searchBuilder.add', 'Add Condition'));
	        $$1(this.dom.logic).text(this.c.logic === 'OR' ? this.s.dt.i18n('searchBuilder.logicOr', 'Or') : this.s.dt.i18n('searchBuilder.logicAnd', 'And'));
	        this.s.logic = this.c.logic === 'OR' ? 'OR' : 'AND';
	        if (this.c.greyscale) {
	            $$1(this.dom.logic).addClass(this.classes.greyscale);
	        }
	        $$1(this.dom.logicContainer).append(this.dom.logic).append(this.dom.clear);
	        // Only append the logic button immediately if this is a sub group,
	        //  otherwise it will be prepended later when adding a criteria
	        if (this.s.isChild) {
	            $$1(this.dom.container).append(this.dom.logicContainer);
	        }
	        $$1(this.dom.container).append(this.dom.add);
	    };
	    /**
	     * Sets the listener for the logic button
	     */
	    Group.prototype._setLogicListener = function () {
	        var _this = this;
	        $$1(this.dom.logic)
	            .unbind('click')
	            .on('click', function () {
	            _this._toggleLogic();
	            _this.s.dt.draw();
	            for (var _i = 0, _a = _this.s.criteria; _i < _a.length; _i++) {
	                var crit = _a[_i];
	                crit.criteria.setListeners();
	            }
	        });
	    };
	    /**
	     * Toggles the logic for the group
	     */
	    Group.prototype._toggleLogic = function () {
	        if (this.s.logic === 'OR') {
	            this.s.logic = 'AND';
	            $$1(this.dom.logic).text(this.s.dt.i18n('searchBuilder.logicAnd', 'And'));
	        }
	        else if (this.s.logic === 'AND') {
	            this.s.logic = 'OR';
	            $$1(this.dom.logic).text(this.s.dt.i18n('searchBuilder.logicOr', 'Or'));
	        }
	    };
	    Group.version = '0.0.1';
	    Group.classes = {
	        add: 'dtsb-add',
	        button: 'dtsb-button',
	        clearGroup: 'dtsb-clearGroup',
	        greyscale: 'dtsb-greyscale',
	        group: 'dtsb-group',
	        inputButton: 'dtsb-iptbtn',
	        logic: 'dtsb-logic',
	        logicContainer: 'dtsb-logicContainer'
	    };
	    Group.defaults = {
	        depthLimit: false,
	        greyscale: false,
	        logic: 'AND'
	    };
	    return Group;
	}());

	var $$2;
	var DataTable$2;
	/**
	 * Sets the value of jQuery for use in the file
	 * @param jq the instance of jQuery to be set
	 */
	function setJQuery$2(jq) {
	    $$2 = jq;
	    DataTable$2 = jq.fn.DataTable;
	}
	/**
	 * SearchBuilder class for DataTables.
	 * Allows for complex search queries to be constructed and implemented on a DataTable
	 */
	var SearchBuilder = /** @class */ (function () {
	    function SearchBuilder(builderSettings, opts) {
	        var _this = this;
	        // Check that the required version of DataTables is included
	        if (!DataTable$2 || !DataTable$2.versionCheck || !DataTable$2.versionCheck('1.10.0')) {
	            throw new Error('SearchBuilder requires DataTables 1.10 or newer');
	        }
	        var table = new DataTable$2.Api(builderSettings);
	        this.classes = $$2.extend(true, {}, SearchBuilder.classes);
	        // Get options from user
	        this.c = $$2.extend(true, {}, SearchBuilder.defaults, opts);
	        this.dom = {
	            clearAll: $$2('<button type="button">' + table.i18n('searchBuilder.clearAll', 'Clear All') + '</button>')
	                .addClass(this.classes.clearAll)
	                .addClass(this.classes.button),
	            container: $$2('<div/>')
	                .addClass(this.classes.container),
	            title: $$2('<div/>')
	                .addClass(this.classes.title),
	            titleRow: $$2('<div/>')
	                .addClass(this.classes.titleRow),
	            topGroup: undefined
	        };
	        this.s = {
	            dt: table,
	            opts: opts,
	            search: undefined,
	            topGroup: undefined
	        };
	        // If searchbuilder is already defined for this table then return
	        if (table.settings()[0]._searchBuilder !== undefined) {
	            return;
	        }
	        table.settings()[0]._searchBuilder = this;
	        // Run the remaining setup when the table is initialised
	        if (this.s.dt.settings()[0]._bInitComplete) {
	            this._setUp();
	        }
	        else {
	            table.one('init.dt', function () {
	                _this._setUp();
	            });
	        }
	        return this;
	    }
	    /**
	     * Gets the details required to rebuild the SearchBuilder as it currently is
	     */
	    SearchBuilder.prototype.getDetails = function () {
	        return this.s.topGroup.getDetails();
	    };
	    /**
	     * Getter for the node of the container for the searchBuilder
	     * @returns JQuery<HTMLElement> the node of the container
	     */
	    SearchBuilder.prototype.getNode = function () {
	        return this.dom.container;
	    };
	    /**
	     * Rebuilds the SearchBuilder to a state that is provided
	     * @param details The details required to perform a rebuild
	     */
	    SearchBuilder.prototype.rebuild = function (details) {
	        $$2(this.dom.clearAll).click();
	        // If there are no details to rebuild then return
	        if (details === undefined || details === null) {
	            return this;
	        }
	        this.s.topGroup.rebuild(details);
	        this.s.dt.draw();
	        this.s.topGroup.setListeners();
	        return this;
	    };
	    /**
	     * Applies the defaults to preDefined criteria
	     * @param preDef the array of criteria to be processed.
	     */
	    SearchBuilder.prototype._applyPreDefDefaults = function (preDef) {
	        var _this = this;
	        if (preDef.criteria !== undefined && preDef.logic === undefined) {
	            preDef.logic = 'AND';
	        }
	        var _loop_1 = function (crit) {
	            // Apply the defaults to any further criteria
	            if (crit.criteria !== undefined) {
	                crit = this_1._applyPreDefDefaults(crit);
	            }
	            else {
	                this_1.s.dt.columns().every(function (index) {
	                    if (_this.s.dt.settings()[0].aoColumns[index].sTitle === crit.data) {
	                        crit.dataIdx = index;
	                    }
	                });
	            }
	        };
	        var this_1 = this;
	        for (var _i = 0, _a = preDef.criteria; _i < _a.length; _i++) {
	            var crit = _a[_i];
	            _loop_1(crit);
	        }
	        return preDef;
	    };
	    /**
	     * Set's up the SearchBuilder
	     */
	    SearchBuilder.prototype._setUp = function (loadState) {
	        var _this = this;
	        if (loadState === void 0) { loadState = true; }
	        this.s.topGroup = new Group(this.s.dt, this.c, undefined);
	        this._setClearListener();
	        this.s.dt.on('stateSaveParams', function (e, settings, data) {
	            data.searchBuilder = _this.getDetails();
	            data.page = _this.s.dt.page();
	        });
	        this._build();
	        if (loadState) {
	            var loadedState = this.s.dt.state.loaded();
	            // If the loaded State is not null rebuild based on it for statesave
	            if (loadedState !== null && loadedState.searchBuilder !== undefined) {
	                this.s.topGroup.rebuild(loadedState.searchBuilder);
	                $$2(this.s.topGroup.dom.container).trigger('dtsb-redrawContents');
	                this.s.dt.page(loadedState.page).draw('page');
	                this.s.topGroup.setListeners();
	            }
	            // Otherwise load any predefined options
	            else if (this.c.preDefined !== false) {
	                this.c.preDefined = this._applyPreDefDefaults(this.c.preDefined);
	                this.rebuild(this.c.preDefined);
	            }
	        }
	        this._setEmptyListener();
	        this.s.dt.state.save();
	    };
	    /**
	     * Updates the title of the SearchBuilder
	     * @param count the number of filters in the SearchBuilder
	     */
	    SearchBuilder.prototype._updateTitle = function (count) {
	        $$2(this.dom.title).text(this.s.dt.i18n('searchBuilder.title', { 0: 'Custom Search Builder', _: 'Custom Search Builder (%d)' }, count));
	    };
	    /**
	     * Builds all of the dom elements together
	     */
	    SearchBuilder.prototype._build = function () {
	        var _this = this;
	        // Empty and setup the container
	        $$2(this.dom.clearAll).remove();
	        $$2(this.dom.container).empty();
	        var count = this.s.topGroup.count();
	        this._updateTitle(count);
	        $$2(this.dom.titleRow).append(this.dom.title);
	        $$2(this.dom.container).append(this.dom.titleRow);
	        this.dom.topGroup = this.s.topGroup.getNode();
	        $$2(this.dom.container).append(this.dom.topGroup);
	        this._setRedrawListener();
	        var tableNode = this.s.dt.table(0).node();
	        if ($$2.fn.dataTable.ext.search.indexOf(this.s.search) === -1) {
	            // Custom search function for SearchBuilder
	            this.s.search = function (settings, searchData, dataIndex, origData) {
	                if (settings.nTable !== tableNode) {
	                    return true;
	                }
	                return _this.s.topGroup.search(searchData);
	            };
	            // Add SearchBuilder search function to the dataTables search array
	            $$2.fn.dataTable.ext.search.push(this.s.search);
	        }
	        // Register an Api method for getting the column type
	        $$2.fn.DataTable.Api.registerPlural('columns().type()', 'column().type()', function (selector, opts) {
	            return this.iterator('column', function (settings, column) {
	                return settings.aoColumns[column].sType;
	            }, 1);
	        });
	        this.s.dt.on('destroy.dt', function () {
	            $$2(_this.dom.container).remove();
	            $$2(_this.dom.clearAll).remove();
	            var searchIdx = $$2.fn.dataTable.ext.search.indexOf(_this.s.search);
	            while (searchIdx !== -1) {
	                $$2.fn.dataTable.ext.search.splice(searchIdx, 1);
	                searchIdx = $$2.fn.dataTable.ext.search.indexOf(_this.s.search);
	            }
	        });
	    };
	    /**
	     * Checks if the clearAll button should be added or not
	     */
	    SearchBuilder.prototype._checkClear = function () {
	        if (this.s.topGroup.s.criteria.length > 0) {
	            $$2(this.dom.clearAll).insertAfter(this.dom.title);
	            this._setClearListener();
	        }
	        else {
	            $$2(this.dom.clearAll).remove();
	        }
	    };
	    /**
	     * Set the listener for the clear button
	     */
	    SearchBuilder.prototype._setClearListener = function () {
	        var _this = this;
	        $$2(this.dom.clearAll).unbind('click');
	        $$2(this.dom.clearAll).on('click', function () {
	            _this.s.topGroup = new Group(_this.s.dt, _this.s.opts, undefined);
	            _this._build();
	            _this.s.dt.draw();
	            _this.s.topGroup.setListeners();
	            $$2(_this.dom.clearAll).remove();
	            _this._setEmptyListener();
	            // Update the count in the title/button
	            if (_this.c.filterChanged !== undefined && typeof _this.c.filterChanged === 'function') {
	                _this.c.filterChanged(0);
	            }
	            return false;
	        });
	    };
	    /**
	     * Set the listener for the Redraw event
	     */
	    SearchBuilder.prototype._setRedrawListener = function () {
	        var _this = this;
	        $$2(this.s.topGroup.dom.container).unbind('dtsb-redrawContents');
	        $$2(this.s.topGroup.dom.container).on('dtsb-redrawContents', function () {
	            _this._checkClear();
	            _this.s.topGroup.redrawContents();
	            _this.s.topGroup.setupLogic();
	            _this._setEmptyListener();
	            var count = _this.s.topGroup.count();
	            _this._updateTitle(count);
	            // Update the count in the title/button
	            if (_this.c.filterChanged !== undefined && typeof _this.c.filterChanged === 'function') {
	                _this.c.filterChanged(count);
	            }
	            _this.s.dt.state.save();
	        });
	        $$2(this.s.topGroup.dom.container).unbind('dtsb-clearContents');
	        $$2(this.s.topGroup.dom.container).on('dtsb-clearContents', function () {
	            _this._setUp(false);
	            // Update the count in the title/button
	            if (_this.c.filterChanged !== undefined && typeof _this.c.filterChanged === 'function') {
	                _this.c.filterChanged(0);
	            }
	            _this.s.dt.draw();
	        });
	        $$2(this.s.topGroup.dom.container).on('dtsb-updateTitle', function () {
	            var count = _this.s.topGroup.count();
	            _this._updateTitle(count);
	            // Update the count in the title/button
	            if (_this.c.filterChanged !== undefined && typeof _this.c.filterChanged === 'function') {
	                _this.c.filterChanged(count);
	            }
	        });
	    };
	    /**
	     * Sets listeners to check whether clearAll should be added or removed
	     */
	    SearchBuilder.prototype._setEmptyListener = function () {
	        var _this = this;
	        $$2(this.s.topGroup.dom.add).on('click', function () {
	            _this._checkClear();
	        });
	        $$2(this.s.topGroup.dom.container).on('dtsb-destroy', function () {
	            $$2(_this.dom.clearAll).remove();
	        });
	    };
	    SearchBuilder.version = '0.0.1';
	    SearchBuilder.classes = {
	        button: 'dtsb-button',
	        clearAll: 'dtsb-clearAll',
	        container: 'dtsb-searchBuilder',
	        inputButton: 'dtsb-iptbtn',
	        title: 'dtsb-title',
	        titleRow: 'dtsb-titleRow'
	    };
	    SearchBuilder.defaults = {
	        filterChanged: undefined,
	        preDefined: false
	    };
	    return SearchBuilder;
	}());

	/*! SearchBuilder 1.0.0
	 * ©2020 SpryMedia Ltd - datatables.net/license/mit
	 */
	// DataTables extensions common UMD. Note that this allows for AMD, CommonJS
	// (with window and jQuery being allowed as parameters to the returned
	// function) or just default browser loading.
	(function (factory) {
	    if (typeof define === 'function' && define.amd) {
	        // AMD
	        define(['jquery', 'datatables.net'], function ($) {
	            return factory($, window, document);
	        });
	    }
	    else if (typeof exports === 'object') {
	        // CommonJS
	        module.exports = function (root, $) {
	            if (!root) {
	                root = window;
	            }
	            if (!$ || !$.fn.dataTable) {
	                $ = require('datatables.net')(root, $).$;
	            }
	            return factory($, root, root.document);
	        };
	    }
	    else {
	        // Browser - assume jQuery has already been loaded
	        factory(window.jQuery, window, document);
	    }
	}(function ($, window, document) {
	    setJQuery$2($);
	    setJQuery$1($);
	    setJQuery($);
	    var DataTable = $.fn.dataTable;
	    $.fn.dataTable.SearchBuilder = SearchBuilder;
	    $.fn.DataTable.SearchBuilder = SearchBuilder;
	    $.fn.dataTable.Group = Group;
	    $.fn.DataTable.Group = Group;
	    $.fn.dataTable.Criteria = Criteria;
	    $.fn.DataTable.Criteria = Criteria;
	    var apiRegister = $.fn.dataTable.Api.register;
	    // Set up object for plugins
	    $.fn.dataTable.ext.searchBuilder = {
	        conditions: {}
	    };
	    $.fn.dataTable.ext.buttons.searchBuilder = {
	        action: function (e, dt, node, config) {
	            e.stopPropagation();
	            this.popover(config._searchBuilder.getNode(), {
	                align: 'dt-container'
	            });
	        },
	        config: {},
	        init: function (dt, node, config) {
	            var sb = new $.fn.dataTable.SearchBuilder(dt, $.extend({
	                filterChanged: function (count) {
	                    dt.button(node).text(dt.i18n('searchBuilder.button', { 0: 'Search Builder', _: 'Search Builder (%d)' }, count));
	                }
	            }, config.config));
	            var message = dt.i18n('searchBuilder.button', 'Search Builder', 0);
	            dt.button(node).text(message);
	            config._searchBuilder = sb;
	        },
	        text: 'Search Builder'
	    };
	    apiRegister('searchBuilder.getDetails()', function () {
	        var ctx = this.context[0];
	        return ctx._searchBuilder.getDetails();
	    });
	    apiRegister('searchBuilder.rebuild()', function (details) {
	        var ctx = this.context[0];
	        ctx._searchBuilder.rebuild(details);
	        return this;
	    });
	    apiRegister('searchBuilder.container()', function () {
	        var ctx = this.context[0];
	        return ctx._searchBuilder.getNode();
	    });
	    /**
	     * Init function for SearchBuilder
	     * @param settings the settings to be applied
	     * @returns JQUERY<HTMLElement> Returns the node of the SearchBuilder
	     */
	    function _init(settings) {
	        var api = new DataTable.Api(settings);
	        var opts = api.init().searchBuilder || DataTable.defaults.searchBuilder;
	        var searchBuilder = new SearchBuilder(api, opts);
	        var node = searchBuilder.getNode();
	        return node;
	    }
	    // Attach a listener to the document which listens for DataTables initialisation
	    // events so we can automatically initialise
	    $(document).on('preInit.dt.dtsp', function (e, settings, json) {
	        if (e.namespace !== 'dt') {
	            return;
	        }
	        if (settings.oInit.searchBuilder ||
	            DataTable.defaults.searchBuilder) {
	            if (!settings._searchBuilder) {
	                _init(settings);
	            }
	        }
	    });
	    // DataTables `dom` feature option
	    DataTable.ext.feature.push({
	        cFeature: 'Q',
	        fnInit: _init
	    });
	    // DataTables 2 layout feature
	    if (DataTable.ext.features) {
	        DataTable.ext.features.register('searchBuilder', _init);
	    }
	}));

}());


(function () {
    'use strict';

    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery', 'datatables.net-bs4', 'datatables.net-searchbuilder'], function ($) {
                return factory($, window, document);
            });
        }
        else if (typeof exports === 'object') {
            // CommonJS
            module.exports = function (root, $) {
                if (!root) {
                    root = window;
                }
                if (!$ || !$.fn.dataTable) {
                    $ = require('datatables.net-bs4')(root, $).$;
                }
                if (!$.fn.dataTable.searchBuilder) {
                    require('datatables.net-searchbuilder')(root, $);
                }
                return factory($, root, root.document);
            };
        }
        else {
            // Browser
            factory(jQuery, window, document);
        }
    }(function ($, window, document) {
        var DataTable = $.fn.dataTable;
        $.extend(true, DataTable.SearchBuilder.classes, {
            clearAll: 'btn btn-light dtsb-clearAll'
        });
        $.extend(true, DataTable.Group.classes, {
            add: 'btn btn-light dtsb-add',
            clearGroup: 'btn btn-light dtsb-clearGroup',
            logic: 'btn btn-light dtsb-logic'
        });
        $.extend(true, DataTable.Criteria.classes, {
            condition: 'form-control dtsb-condition',
            data: 'form-control dtsb-data',
            "delete": 'btn btn-light dtsb-delete',
            left: 'btn btn-light dtsb-left',
            right: 'btn btn-light dtsb-right',
            value: 'form-control dtsb-value'
        });
        return DataTable.searchPanes;
    }));

}());


/*! SearchPanes 1.2.1
 * 2019-2020 SpryMedia Ltd - datatables.net/license
 */
(function () {
    'use strict';

    var $;
    var DataTable;
    function setJQuery(jq) {
        $ = jq;
        DataTable = jq.fn.dataTable;
    }
    var SearchPane = /** @class */ (function () {
        /**
         * Creates the panes, sets up the search function
         * @param paneSettings The settings for the searchPanes
         * @param opts The options for the default features
         * @param idx the index of the column for this pane
         * @returns {object} the pane that has been created, including the table and the index of the pane
         */
        function SearchPane(paneSettings, opts, idx, layout, panesContainer, panes) {
            var _this = this;
            if (panes === void 0) { panes = null; }
            // Check that the required version of DataTables is included
            if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            // Check that Select is included
            if (!DataTable.select) {
                throw new Error('SearchPane requires Select');
            }
            var table = new DataTable.Api(paneSettings);
            this.classes = $.extend(true, {}, SearchPane.classes);
            // Get options from user
            this.c = $.extend(true, {}, SearchPane.defaults, opts);
            this.customPaneSettings = panes;
            this.s = {
                cascadeRegen: false,
                clearing: false,
                colOpts: [],
                deselect: false,
                displayed: false,
                dt: table,
                dtPane: undefined,
                filteringActive: false,
                index: idx,
                indexes: [],
                lastCascade: false,
                lastSelect: false,
                listSet: false,
                name: undefined,
                redraw: false,
                rowData: {
                    arrayFilter: [],
                    arrayOriginal: [],
                    arrayTotals: [],
                    bins: {},
                    binsOriginal: {},
                    binsTotal: {},
                    filterMap: new Map(),
                    totalOptions: 0
                },
                scrollTop: 0,
                searchFunction: undefined,
                selectPresent: false,
                serverSelect: [],
                serverSelecting: false,
                showFiltered: false,
                tableLength: null,
                updating: false
            };
            var rowLength = table.columns().eq(0).toArray().length;
            this.colExists = this.s.index < rowLength;
            // Add extra elements to DOM object including clear and hide buttons
            this.c.layout = layout;
            var layVal = parseInt(layout.split('-')[1], 10);
            this.dom = {
                buttonGroup: $('<div/>').addClass(this.classes.buttonGroup),
                clear: $('<button type="button">&#215;</button>')
                    .addClass(this.classes.dull)
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.clearButton),
                container: $('<div/>').addClass(this.classes.container).addClass(this.classes.layout +
                    (layVal < 10 ? layout : layout.split('-')[0] + '-9')),
                countButton: $('<button type="button"></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.countButton),
                dtP: $('<table><thead><tr><th>' +
                    (this.colExists
                        ? $(table.column(this.colExists ? this.s.index : 0).header()).text()
                        : this.customPaneSettings.header || 'Custom Pane') + '</th><th/></tr></thead></table>'),
                lower: $('<div/>').addClass(this.classes.subRow2).addClass(this.classes.narrowButton),
                nameButton: $('<button type="button"></button>').addClass(this.classes.paneButton).addClass(this.classes.nameButton),
                panesContainer: panesContainer,
                searchBox: $('<input/>').addClass(this.classes.paneInputButton).addClass(this.classes.search),
                searchButton: $('<button type = "button" class="' + this.classes.searchIcon + '"></button>')
                    .addClass(this.classes.paneButton),
                searchCont: $('<div/>').addClass(this.classes.searchCont),
                searchLabelCont: $('<div/>').addClass(this.classes.searchLabelCont),
                topRow: $('<div/>').addClass(this.classes.topRow),
                upper: $('<div/>').addClass(this.classes.subRow1).addClass(this.classes.narrowSearch)
            };
            this.s.displayed = false;
            table = this.s.dt;
            this.selections = [];
            this.s.colOpts = this.colExists ? this._getOptions() : this._getBonusOptions();
            var colOpts = this.s.colOpts;
            var clear = $('<button type="button">X</button>').addClass(this.classes.paneButton);
            $(clear).text(table.i18n('searchPanes.clearPane', 'X'));
            this.dom.container.addClass(colOpts.className);
            this.dom.container.addClass((this.customPaneSettings !== null && this.customPaneSettings.className !== undefined)
                ? this.customPaneSettings.className
                : '');
            // Set the value of name incase ordering is desired
            if (this.s.colOpts.name !== undefined) {
                this.s.name = this.s.colOpts.name;
            }
            else if (this.customPaneSettings !== null && this.customPaneSettings.name !== undefined) {
                this.s.name = this.customPaneSettings.name;
            }
            else {
                this.s.name = this.colExists ?
                    $(table.column(this.s.index).header()).text() :
                    this.customPaneSettings.header || 'Custom Pane';
            }
            $(panesContainer).append(this.dom.container);
            var tableNode = table.table(0).node();
            // Custom search function for table
            this.s.searchFunction = function (settings, searchData, dataIndex, origData) {
                // If no data has been selected then show all
                if (_this.selections.length === 0) {
                    return true;
                }
                if (settings.nTable !== tableNode) {
                    return true;
                }
                var filter = null;
                if (_this.colExists) {
                    // Get the current filtered data
                    filter = searchData[_this.s.index];
                    if (colOpts.orthogonal.filter !== 'filter') {
                        // get the filter value from the map
                        filter = _this.s.rowData.filterMap.get(dataIndex);
                        if (filter instanceof $.fn.dataTable.Api) {
                            filter = filter.toArray();
                        }
                    }
                }
                return _this._search(filter, dataIndex);
            };
            $.fn.dataTable.ext.search.push(this.s.searchFunction);
            // If the clear button for this pane is clicked clear the selections
            if (this.c.clear) {
                $(clear).on('click', function () {
                    var searches = _this.dom.container.find(_this.classes.search);
                    searches.each(function () {
                        $(this).val('');
                        $(this).trigger('input');
                    });
                    _this.clearPane();
                });
            }
            // Sometimes the top row of the panes containing the search box and ordering buttons appears
            //  weird if the width of the panes is lower than expected, this fixes the design.
            // Equally this may occur when the table is resized.
            table.on('draw.dtsp', function () {
                _this._adjustTopRow();
            });
            table.on('buttons-action', function () {
                _this._adjustTopRow();
            });
            $(window).on('resize.dtsp', DataTable.util.throttle(function () {
                _this._adjustTopRow();
            }));
            // When column-reorder is present and the columns are moved, it is necessary to
            //  reassign all of the panes indexes to the new index of the column.
            table.on('column-reorder.dtsp', function (e, settings, details) {
                _this.s.index = details.mapping[_this.s.index];
            });
            return this;
        }
        /**
         * In the case of a rebuild there is potential for new data to have been included or removed
         * so all of the rowData must be reset as a precaution.
         */
        SearchPane.prototype.clearData = function () {
            this.s.rowData = {
                arrayFilter: [],
                arrayOriginal: [],
                arrayTotals: [],
                bins: {},
                binsOriginal: {},
                binsTotal: {},
                filterMap: new Map(),
                totalOptions: 0
            };
        };
        /**
         * Clear the selections in the pane
         */
        SearchPane.prototype.clearPane = function () {
            // Deselect all rows which are selected and update the table and filter count.
            this.s.dtPane.rows({ selected: true }).deselect();
            this.updateTable();
            return this;
        };
        /**
         * Strips all of the SearchPanes elements from the document and turns all of the listeners for the buttons off
         */
        SearchPane.prototype.destroy = function () {
            $(this.s.dtPane).off('.dtsp');
            $(this.s.dt).off('.dtsp');
            $(this.dom.nameButton).off('.dtsp');
            $(this.dom.countButton).off('.dtsp');
            $(this.dom.clear).off('.dtsp');
            $(this.dom.searchButton).off('.dtsp');
            $(this.dom.container).remove();
            var searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            while (searchIdx !== -1) {
                $.fn.dataTable.ext.search.splice(searchIdx, 1);
                searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            }
            // If the datatables have been defined for the panes then also destroy these
            if (this.s.dtPane !== undefined) {
                this.s.dtPane.destroy();
            }
            this.s.listSet = false;
        };
        /**
         * Updates the number of filters that have been applied in the title
         */
        SearchPane.prototype.getPaneCount = function () {
            return this.s.dtPane !== undefined ?
                this.s.dtPane.rows({ selected: true }).data().toArray().length :
                0;
        };
        /**
         * Rebuilds the panes from the start having deleted the old ones
         * @param? last boolean to indicate if this is the last pane a selection was made in
         * @param? dataIn data to be used in buildPane
         * @param? init Whether this is the initial draw or not
         * @param? maintainSelection Whether the current selections are to be maintained over rebuild
         */
        SearchPane.prototype.rebuildPane = function (last, dataIn, init, maintainSelection) {
            if (last === void 0) { last = false; }
            if (dataIn === void 0) { dataIn = null; }
            if (init === void 0) { init = null; }
            if (maintainSelection === void 0) { maintainSelection = false; }
            this.clearData();
            var selectedRows = [];
            this.s.serverSelect = [];
            var prevEl = null;
            // When rebuilding strip all of the HTML Elements out of the container and start from scratch
            if (this.s.dtPane !== undefined) {
                if (maintainSelection) {
                    if (!this.s.dt.page.info().serverSide) {
                        selectedRows = this.s.dtPane.rows({ selected: true }).data().toArray();
                    }
                    else {
                        this.s.serverSelect = this.s.dtPane.rows({ selected: true }).data().toArray();
                    }
                }
                this.s.dtPane.clear().destroy();
                prevEl = $(this.dom.container).prev();
                this.destroy();
                this.s.dtPane = undefined;
                $.fn.dataTable.ext.search.push(this.s.searchFunction);
            }
            this.dom.container.removeClass(this.classes.hidden);
            this.s.displayed = false;
            this._buildPane(!this.s.dt.page.info().serverSide ?
                selectedRows :
                this.s.serverSelect, last, dataIn, init, prevEl);
            return this;
        };
        /**
         * removes the pane from the page and sets the displayed property to false.
         */
        SearchPane.prototype.removePane = function () {
            this.s.displayed = false;
            $(this.dom.container).hide();
        };
        /**
         * Sets the cascadeRegen property of the pane. Accessible from above because as SearchPanes.ts deals with the rebuilds.
         * @param val the boolean value that the cascadeRegen property is to be set to
         */
        SearchPane.prototype.setCascadeRegen = function (val) {
            this.s.cascadeRegen = val;
        };
        /**
         * This function allows the clearing property to be assigned. This is used when implementing cascadePane.
         * In setting this to true for the clearing of the panes selection on the deselects it forces the pane to
         * repopulate from the entire dataset not just the displayed values.
         * @param val the boolean value which the clearing property is to be assigned
         */
        SearchPane.prototype.setClear = function (val) {
            this.s.clearing = val;
        };
        /**
         * Updates the values of all of the panes
         * @param draw whether this has been triggered by a draw event or not
         */
        SearchPane.prototype.updatePane = function (draw) {
            if (draw === void 0) { draw = false; }
            this.s.updating = true;
            this._updateCommon(draw);
            this.s.updating = false;
        };
        /**
         * Updates the panes if one of the options to do so has been set to true
         *   rather than the filtered message when using viewTotal.
         */
        SearchPane.prototype.updateTable = function () {
            var selectedRows = this.s.dtPane.rows({ selected: true }).data().toArray();
            this.selections = selectedRows;
            this._searchExtras();
            // If either of the options that effect how the panes are displayed are selected then update the Panes
            if (this.c.cascadePanes || this.c.viewTotal) {
                this.updatePane();
            }
        };
        /**
         * Sets the listeners for the pane.
         *
         * Having it in it's own function makes it easier to only set them once
         */
        SearchPane.prototype._setListeners = function () {
            var _this = this;
            var rowData = this.s.rowData;
            var t0;
            // When an item is selected on the pane, add these to the array which holds selected items.
            // Custom search will perform.
            this.s.dtPane.on('select.dtsp', function () {
                clearTimeout(t0);
                if (_this.s.dt.page.info().serverSide && !_this.s.updating) {
                    if (!_this.s.serverSelecting) {
                        _this.s.serverSelect = _this.s.dtPane.rows({ selected: true }).data().toArray();
                        _this.s.scrollTop = $(_this.s.dtPane.table().node()).parent()[0].scrollTop;
                        _this.s.selectPresent = true;
                        _this.s.dt.draw(false);
                    }
                }
                else {
                    $(_this.dom.clear).removeClass(_this.classes.dull);
                    _this.s.selectPresent = true;
                    if (!_this.s.updating) {
                        _this._makeSelection();
                    }
                    _this.s.selectPresent = false;
                }
            });
            // When an item is deselected on the pane, re add the currently selected items to the array
            // which holds selected items. Custom search will be performed.
            this.s.dtPane.on('deselect.dtsp', function () {
                t0 = setTimeout(function () {
                    if (_this.s.dt.page.info().serverSide && !_this.s.updating) {
                        if (!_this.s.serverSelecting) {
                            _this.s.serverSelect = _this.s.dtPane.rows({ selected: true }).data().toArray();
                            _this.s.deselect = true;
                            _this.s.dt.draw(false);
                        }
                    }
                    else {
                        _this.s.deselect = true;
                        if (_this.s.dtPane.rows({ selected: true }).data().toArray().length === 0) {
                            $(_this.dom.clear).addClass(_this.classes.dull);
                        }
                        _this._makeSelection();
                        _this.s.deselect = false;
                        _this.s.dt.state.save();
                    }
                }, 50);
            });
            // When saving the state store all of the selected rows for preselection next time around
            this.s.dt.on('stateSaveParams.dtsp', function (e, settings, data) {
                // If the data being passed in is empty then a state clear must have occured so clear the panes state as well
                if ($.isEmptyObject(data)) {
                    _this.s.dtPane.state.clear();
                    return;
                }
                var selected = [];
                var searchTerm;
                var order;
                var bins;
                var arrayFilter;
                // Get all of the data needed for the state save from the pane
                if (_this.s.dtPane !== undefined) {
                    selected = _this.s.dtPane.rows({ selected: true }).data().map(function (item) { return item.filter.toString(); }).toArray();
                    searchTerm = $(_this.dom.searchBox).val();
                    order = _this.s.dtPane.order();
                    bins = rowData.binsOriginal;
                    arrayFilter = rowData.arrayOriginal;
                }
                if (data.searchPanes === undefined) {
                    data.searchPanes = {};
                }
                if (data.searchPanes.panes === undefined) {
                    data.searchPanes.panes = [];
                }
                // Add the panes data to the state object
                data.searchPanes.panes.push({
                    arrayFilter: arrayFilter,
                    bins: bins,
                    id: _this.s.index,
                    order: order,
                    searchTerm: searchTerm,
                    selected: selected
                });
            });
            this.s.dtPane.on('user-select.dtsp', function (e, _dt, type, cell, originalEvent) {
                originalEvent.stopPropagation();
            });
            this.s.dtPane.on('draw.dtsp', function () {
                _this._adjustTopRow();
            });
            // When the button to order by the name of the options is clicked then
            //  change the ordering to whatever it isn't currently
            $(this.dom.nameButton).on('click.dtsp', function () {
                var currentOrder = _this.s.dtPane.order()[0][1];
                _this.s.dtPane.order([0, currentOrder === 'asc' ? 'desc' : 'asc']).draw();
                _this.s.dt.state.save();
            });
            // When the button to order by the number of entries in the column is clicked then
            //  change the ordering to whatever it isn't currently
            $(this.dom.countButton).on('click.dtsp', function () {
                var currentOrder = _this.s.dtPane.order()[0][1];
                _this.s.dtPane.order([1, currentOrder === 'asc' ? 'desc' : 'asc']).draw();
                _this.s.dt.state.save();
            });
            // When the clear button is clicked reset the pane
            $(this.dom.clear).on('click.dtsp', function () {
                var searches = _this.dom.container.find('.' + _this.classes.search);
                searches.each(function () {
                    // set the value of the search box to be an empty string and then search on that, effectively reseting
                    $(this).val('');
                    $(this).trigger('input');
                });
                _this.clearPane();
            });
            // When the search button is clicked then draw focus to the search box
            $(this.dom.searchButton).on('click.dtsp', function () {
                $(_this.dom.searchBox).focus();
            });
            // When a character is inputted into the searchbox search the pane for matching values.
            // Doing it this way means that no button has to be clicked to trigger a search, it is done asynchronously
            $(this.dom.searchBox).on('input.dtsp', function () {
                _this.s.dtPane.search($(_this.dom.searchBox).val()).draw();
                _this.s.dt.state.save();
            });
            // Make sure to save the state once the pane has been built
            this.s.dt.state.save();
            return true;
        };
        /**
         * Takes in potentially undetected rows and adds them to the array if they are not yet featured
         * @param filter the filter value of the potential row
         * @param display the display value of the potential row
         * @param sort the sort value of the potential row
         * @param type the type value of the potential row
         * @param arrayFilter the array to be populated
         * @param bins the bins to be populated
         */
        SearchPane.prototype._addOption = function (filter, display, sort, type, arrayFilter, bins) {
            // If the filter is an array then take a note of this, and add the elements to the arrayFilter array
            if (Array.isArray(filter) || filter instanceof DataTable.Api) {
                // Convert to an array so that we can work with it
                if (filter instanceof DataTable.Api) {
                    filter = filter.toArray();
                    display = display.toArray();
                }
                if (filter.length === display.length) {
                    for (var i = 0; i < filter.length; i++) {
                        // If we haven't seen this row before add it
                        if (!bins[filter[i]]) {
                            bins[filter[i]] = 1;
                            arrayFilter.push({
                                display: display[i],
                                filter: filter[i],
                                sort: sort[i],
                                type: type[i]
                            });
                        }
                        // Otherwise just increment the count
                        else {
                            bins[filter[i]]++;
                        }
                        this.s.rowData.totalOptions++;
                    }
                    return;
                }
                else {
                    throw new Error('display and filter not the same length');
                }
            }
            // If the values were affected by othogonal data and are not an array then check if it is already present
            else if (typeof this.s.colOpts.orthogonal === 'string') {
                if (!bins[filter]) {
                    bins[filter] = 1;
                    arrayFilter.push({
                        display: display,
                        filter: filter,
                        sort: sort,
                        type: type
                    });
                    this.s.rowData.totalOptions++;
                }
                else {
                    bins[filter]++;
                    this.s.rowData.totalOptions++;
                    return;
                }
            }
            // Otherwise we must just be adding an option
            else {
                arrayFilter.push({
                    display: display,
                    filter: filter,
                    sort: sort,
                    type: type
                });
            }
        };
        /**
         * Adds a row to the panes table
         * @param display the value to be displayed to the user
         * @param filter the value to be filtered on when searchpanes is implemented
         * @param shown the number of rows in the table that are currently visible matching this criteria
         * @param total the total number of rows in the table that match this criteria
         * @param sort the value to be sorted in the pane table
         * @param type the value of which the type is to be derived from
         */
        SearchPane.prototype._addRow = function (display, filter, shown, total, sort, type, className) {
            var index;
            for (var _i = 0, _a = this.s.indexes; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.filter === filter) {
                    index = entry.index;
                }
            }
            if (index === undefined) {
                index = this.s.indexes.length;
                this.s.indexes.push({ filter: filter, index: index });
            }
            return this.s.dtPane.row.add({
                className: className,
                display: display !== '' ?
                    display :
                    this.s.colOpts.emptyMessage !== false ?
                        this.s.colOpts.emptyMessage :
                        this.c.emptyMessage,
                filter: filter,
                index: index,
                shown: shown,
                sort: sort !== '' ?
                    sort :
                    this.s.colOpts.emptyMessage !== false ?
                        this.s.colOpts.emptyMessage :
                        this.c.emptyMessage,
                total: total,
                type: type
            });
        };
        /**
         * Adjusts the layout of the top row when the screen is resized
         */
        SearchPane.prototype._adjustTopRow = function () {
            var subContainers = this.dom.container.find('.' + this.classes.subRowsContainer);
            var subRow1 = this.dom.container.find('.dtsp-subRow1');
            var subRow2 = this.dom.container.find('.dtsp-subRow2');
            var topRow = this.dom.container.find('.' + this.classes.topRow);
            // If the width is 0 then it is safe to assume that the pane has not yet been displayed.
            //  Even if it has, if the width is 0 it won't make a difference if it has the narrow class or not
            if (($(subContainers[0]).width() < 252 || $(topRow[0]).width() < 252) && $(subContainers[0]).width() !== 0) {
                $(subContainers[0]).addClass(this.classes.narrow);
                $(subRow1[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowSearch);
                $(subRow2[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowButton);
            }
            else {
                $(subContainers[0]).removeClass(this.classes.narrow);
                $(subRow1[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowSearch);
                $(subRow2[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowButton);
            }
        };
        /**
         * Method to construct the actual pane.
         * @param selectedRows previously selected Rows to be reselected
         * @last boolean to indicate whether this pane was the last one to have a selection made
         */
        SearchPane.prototype._buildPane = function (selectedRows, last, dataIn, init, prevEl) {
            var _this = this;
            if (selectedRows === void 0) { selectedRows = []; }
            if (last === void 0) { last = false; }
            if (dataIn === void 0) { dataIn = null; }
            if (init === void 0) { init = null; }
            if (prevEl === void 0) { prevEl = null; }
            // Aliases
            this.selections = [];
            var table = this.s.dt;
            var column = table.column(this.colExists ? this.s.index : 0);
            var colOpts = this.s.colOpts;
            var rowData = this.s.rowData;
            // Other Variables
            var countMessage = table.i18n('searchPanes.count', '{total}');
            var filteredMessage = table.i18n('searchPanes.countFiltered', '{shown} ({total})');
            var loadedFilter = table.state.loaded();
            // If the listeners have not been set yet then using the latest state may result in funny errors
            if (this.s.listSet) {
                loadedFilter = table.state();
            }
            // If it is not a custom pane in place
            if (this.colExists) {
                var idx = -1;
                if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.panes) {
                    for (var i = 0; i < loadedFilter.searchPanes.panes.length; i++) {
                        if (loadedFilter.searchPanes.panes[i].id === this.s.index) {
                            idx = i;
                            break;
                        }
                    }
                }
                // Perform checks that do not require populate pane to run
                if ((colOpts.show === false
                    || (colOpts.show !== undefined && colOpts.show !== true)) &&
                    idx === -1) {
                    this.dom.container.addClass(this.classes.hidden);
                    this.s.displayed = false;
                    return false;
                }
                else if (colOpts.show === true || idx !== -1) {
                    this.s.displayed = true;
                }
                if (!this.s.dt.page.info().serverSide && dataIn === null) {
                    // Only run populatePane if the data has not been collected yet
                    if (rowData.arrayFilter.length === 0) {
                        this._populatePane(last);
                        this.s.rowData.totalOptions = 0;
                        this._detailsPane();
                        if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.panes) {
                            // If the index is not found then no data has been added to the state for this pane,
                            //  which will only occur if it has previously failed to meet the criteria to be
                            //  displayed, therefore we can just hide it again here
                            if (idx !== -1) {
                                rowData.binsOriginal = loadedFilter.searchPanes.panes[idx].bins;
                                rowData.arrayOriginal = loadedFilter.searchPanes.panes[idx].arrayFilter;
                            }
                            else {
                                this.dom.container.addClass(this.classes.hidden);
                                this.s.displayed = false;
                                return;
                            }
                        }
                        else {
                            rowData.arrayOriginal = rowData.arrayTotals;
                            rowData.binsOriginal = rowData.binsTotal;
                        }
                    }
                    var binLength = Object.keys(rowData.binsOriginal).length;
                    var uniqueRatio = this._uniqueRatio(binLength, table.rows()[0].length);
                    // Don't show the pane if there isn't enough variance in the data, or there is only 1 entry for that pane
                    if (this.s.displayed === false && ((colOpts.show === undefined && colOpts.threshold === null ?
                        uniqueRatio > this.c.threshold :
                        uniqueRatio > colOpts.threshold)
                        || (colOpts.show !== true && binLength <= 1))) {
                        this.dom.container.addClass(this.classes.hidden);
                        this.s.displayed = false;
                        return;
                    }
                    // If the option viewTotal is true then find
                    // the total count for the whole table to display alongside the displayed count
                    if (this.c.viewTotal && rowData.arrayTotals.length === 0) {
                        this.s.rowData.totalOptions = 0;
                        this._detailsPane();
                    }
                    else {
                        rowData.binsTotal = rowData.bins;
                    }
                    this.dom.container.addClass(this.classes.show);
                    this.s.displayed = true;
                }
                else if (dataIn !== null) {
                    if (dataIn.tableLength !== undefined) {
                        this.s.tableLength = dataIn.tableLength;
                        this.s.rowData.totalOptions = this.s.tableLength;
                    }
                    else if (this.s.tableLength === null || table.rows()[0].length > this.s.tableLength) {
                        this.s.tableLength = table.rows()[0].length;
                        this.s.rowData.totalOptions = this.s.tableLength;
                    }
                    var colTitle = table.column(this.s.index).dataSrc();
                    if (dataIn[colTitle] !== undefined) {
                        for (var _i = 0, _a = dataIn[colTitle]; _i < _a.length; _i++) {
                            var dataPoint = _a[_i];
                            this.s.rowData.arrayFilter.push({
                                display: dataPoint.label,
                                filter: dataPoint.value,
                                sort: dataPoint.label,
                                type: dataPoint.label
                            });
                            this.s.rowData.bins[dataPoint.value] = this.c.viewTotal || this.c.cascadePanes ?
                                dataPoint.count :
                                dataPoint.total;
                            this.s.rowData.binsTotal[dataPoint.value] = dataPoint.total;
                        }
                    }
                    var binLength = Object.keys(rowData.binsTotal).length;
                    var uniqueRatio = this._uniqueRatio(binLength, this.s.tableLength);
                    // Don't show the pane if there isn't enough variance in the data, or there is only 1 entry for that pane
                    if (this.s.displayed === false && ((colOpts.show === undefined && colOpts.threshold === null ?
                        uniqueRatio > this.c.threshold :
                        uniqueRatio > colOpts.threshold)
                        || (colOpts.show !== true && binLength <= 1))) {
                        this.dom.container.addClass(this.classes.hidden);
                        this.s.displayed = false;
                        return;
                    }
                    this.s.rowData.arrayOriginal = this.s.rowData.arrayFilter;
                    this.s.rowData.binsOriginal = this.s.rowData.bins;
                    this.s.displayed = true;
                }
            }
            else {
                this.s.displayed = true;
            }
            // If the variance is accceptable then display the search pane
            this._displayPane();
            if (!this.s.listSet) {
                // Here, when the state is loaded if the data object on the original table is empty,
                //  then a state.clear() must have occurred, so delete all of the panes tables state objects too.
                this.dom.dtP.on('stateLoadParams.dt', function (e, settings, data) {
                    if ($.isEmptyObject(table.state.loaded())) {
                        $.each(data, function (index, value) {
                            delete data[index];
                        });
                    }
                });
            }
            // Add the container to the document in its original location
            if (prevEl !== null && $(this.dom.panesContainer).has(prevEl).length > 0) {
                $(this.dom.container).insertAfter(prevEl);
            }
            else {
                $(this.dom.panesContainer).prepend(this.dom.container);
            }
            // Declare the datatable for the pane
            var errMode = $.fn.dataTable.ext.errMode;
            $.fn.dataTable.ext.errMode = 'none';
            var haveScroller = DataTable.Scroller;
            this.s.dtPane = $(this.dom.dtP).DataTable($.extend(true, {
                columnDefs: [
                    {
                        className: 'dtsp-nameColumn',
                        data: 'display',
                        render: function (data, type, row) {
                            if (type === 'sort') {
                                return row.sort;
                            }
                            else if (type === 'type') {
                                return row.type;
                            }
                            var message;
                            (_this.s.filteringActive || _this.s.showFiltered) && _this.c.viewTotal
                                ? message = filteredMessage.replace(/{total}/, row.total)
                                : message = countMessage.replace(/{total}/, row.total);
                            message = message.replace(/{shown}/, row.shown);
                            while (message.indexOf('{total}') !== -1) {
                                message = message.replace(/{total}/, row.total);
                            }
                            while (message.indexOf('{shown}') !== -1) {
                                message = message.replace(/{shown}/, row.shown);
                            }
                            // We are displaying the count in the same columne as the name of the search option.
                            // This is so that there is not need to call columns.adjust(), which in turn speeds up the code
                            var pill = '<span class="' + _this.classes.pill + '">' + message + '</span>';
                            if (_this.c.hideCount || colOpts.hideCount) {
                                pill = '';
                            }
                            return '<div class="' + _this.classes.nameCont + '"><span title="' +
                                (typeof data === 'string' && data.match(/<[^>]*>/) !== null ? data.replace(/<[^>]*>/g, '') : data) +
                                '" class="' + _this.classes.name + '">' +
                                data + '</span>' +
                                pill + '</div>';
                        },
                        targets: 0,
                        // Accessing the private datatables property to set type based on the original table.
                        // This is null if not defined by the user, meaning that automatic type detection would take place
                        type: table.settings()[0].aoColumns[this.s.index] !== undefined ?
                            table.settings()[0].aoColumns[this.s.index]._sManualType :
                            null
                    },
                    {
                        className: 'dtsp-countColumn ' + this.classes.badgePill,
                        data: 'shown',
                        orderData: [1, 2],
                        targets: 1,
                        visible: false
                    },
                    {
                        data: 'total',
                        targets: 2,
                        visible: false
                    }
                ],
                deferRender: true,
                dom: 't',
                info: false,
                language: this.s.dt.settings()[0].oLanguage,
                paging: haveScroller ? true : false,
                scrollX: false,
                scrollY: '200px',
                scroller: haveScroller ? true : false,
                select: true,
                stateSave: table.settings()[0].oFeatures.bStateSave ? true : false
            }, this.c.dtOpts, colOpts !== undefined ? colOpts.dtOpts : {}, (this.s.colOpts.options !== undefined || !this.colExists)
                ? {
                    createdRow: function (row, data, dataIndex) {
                        $(row).addClass(data.className);
                    }
                }
                : undefined, (this.customPaneSettings !== null && this.customPaneSettings.dtOpts !== undefined)
                ? this.customPaneSettings.dtOpts
                : {}));
            $(this.dom.dtP).addClass(this.classes.table);
            // This is hacky but necessary for when datatables is generating the column titles automatically
            $(this.dom.searchBox).attr('placeholder', colOpts.header !== undefined
                ? colOpts.header
                : this.colExists
                    ? table.settings()[0].aoColumns[this.s.index].sTitle
                    : this.customPaneSettings.header || 'Custom Pane');
            // As the pane table is not in the document yet we must initialise select ourselves
            $.fn.dataTable.select.init(this.s.dtPane);
            $.fn.dataTable.ext.errMode = errMode;
            // If it is not a custom pane
            if (this.colExists) {
                // On initialisation, do we need to set a filtering value from a
                // saved state or init option?
                var search = column.search();
                search = search ? search.substr(1, search.length - 2).split('|') : [];
                // Count the number of empty cells
                var count_1 = 0;
                rowData.arrayFilter.forEach(function (element) {
                    if (element.filter === '') {
                        count_1++;
                    }
                });
                // Add all of the search options to the pane
                for (var i = 0, ien = rowData.arrayFilter.length; i < ien; i++) {
                    var selected = false;
                    for (var _b = 0, _c = this.s.serverSelect; _b < _c.length; _b++) {
                        var option = _c[_b];
                        if (option.filter === rowData.arrayFilter[i].filter) {
                            selected = true;
                        }
                    }
                    if (this.s.dt.page.info().serverSide &&
                        (!this.c.cascadePanes ||
                            (this.c.cascadePanes && rowData.bins[rowData.arrayFilter[i].filter] !== 0) ||
                            (this.c.cascadePanes && init !== null) ||
                            selected)) {
                        var row = this._addRow(rowData.arrayFilter[i].display, rowData.arrayFilter[i].filter, init ?
                            rowData.binsTotal[rowData.arrayFilter[i].filter] :
                            rowData.bins[rowData.arrayFilter[i].filter], this.c.viewTotal || init
                            ? String(rowData.binsTotal[rowData.arrayFilter[i].filter])
                            : rowData.bins[rowData.arrayFilter[i].filter], rowData.arrayFilter[i].sort, rowData.arrayFilter[i].type);
                        for (var _d = 0, _e = this.s.serverSelect; _d < _e.length; _d++) {
                            var option = _e[_d];
                            if (option.filter === rowData.arrayFilter[i].filter) {
                                this.s.serverSelecting = true;
                                row.select();
                                this.s.serverSelecting = false;
                            }
                        }
                    }
                    else if (!this.s.dt.page.info().serverSide &&
                        rowData.arrayFilter[i] &&
                        (rowData.bins[rowData.arrayFilter[i].filter] !== undefined || !this.c.cascadePanes)) {
                        this._addRow(rowData.arrayFilter[i].display, rowData.arrayFilter[i].filter, rowData.bins[rowData.arrayFilter[i].filter], rowData.binsTotal[rowData.arrayFilter[i].filter], rowData.arrayFilter[i].sort, rowData.arrayFilter[i].type);
                    }
                    else if (!this.s.dt.page.info().serverSide) {
                        // Just pass an empty string as the message will be calculated based on that in _addRow()
                        this._addRow('', count_1, count_1, '', '', '');
                    }
                }
            }
            DataTable.select.init(this.s.dtPane);
            // If there are custom options set or it is a custom pane then get them
            if (colOpts.options !== undefined ||
                (this.customPaneSettings !== null && this.customPaneSettings.options !== undefined)) {
                this._getComparisonRows();
            }
            // Display the pane
            this.s.dtPane.draw();
            this._adjustTopRow();
            if (!this.s.listSet) {
                this._setListeners();
                this.s.listSet = true;
            }
            for (var _f = 0, selectedRows_1 = selectedRows; _f < selectedRows_1.length; _f++) {
                var selection = selectedRows_1[_f];
                if (selection !== undefined) {
                    for (var _g = 0, _h = this.s.dtPane.rows().indexes().toArray(); _g < _h.length; _g++) {
                        var row = _h[_g];
                        if (this.s.dtPane.row(row).data() !== undefined && selection.filter === this.s.dtPane.row(row).data().filter) {
                            // If this is happening when serverSide processing is happening then different behaviour is needed
                            if (this.s.dt.page.info().serverSide) {
                                this.s.serverSelecting = true;
                                this.s.dtPane.row(row).select();
                                this.s.serverSelecting = false;
                            }
                            else {
                                this.s.dtPane.row(row).select();
                            }
                        }
                    }
                }
            }
            //  If SSP and the table is ready, apply the search for the pane
            if (this.s.dt.page.info().serverSide) {
                this.s.dtPane.search($(this.dom.searchBox).val()).draw();
            }
            // Reload the selection, searchbox entry and ordering from the previous state
            if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.panes) {
                if (!this.c.cascadePanes) {
                    this._reloadSelect(loadedFilter);
                }
                for (var _j = 0, _k = loadedFilter.searchPanes.panes; _j < _k.length; _j++) {
                    var pane = _k[_j];
                    if (pane.id === this.s.index) {
                        $(this.dom.searchBox).val(pane.searchTerm);
                        $(this.dom.searchBox).trigger('input');
                        this.s.dtPane.order(pane.order).draw();
                    }
                }
            }
            // Make sure to save the state once the pane has been built
            this.s.dt.state.save();
            return true;
        };
        /**
         * Update the array which holds the display and filter values for the table
         */
        SearchPane.prototype._detailsPane = function () {
            var table = this.s.dt;
            this.s.rowData.arrayTotals = [];
            this.s.rowData.binsTotal = {};
            var settings = this.s.dt.settings()[0];
            var indexArray = table.rows().indexes();
            if (!this.s.dt.page.info().serverSide) {
                for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                    var rowIdx = indexArray_1[_i];
                    this._populatePaneArray(rowIdx, this.s.rowData.arrayTotals, settings, this.s.rowData.binsTotal);
                }
            }
        };
        /**
         * Appends all of the HTML elements to their relevant parent Elements
         */
        SearchPane.prototype._displayPane = function () {
            var container = this.dom.container;
            var colOpts = this.s.colOpts;
            var layVal = parseInt(this.c.layout.split('-')[1], 10);
            //  Empty everything to start again
            $(this.dom.topRow).empty();
            $(this.dom.dtP).empty();
            $(this.dom.topRow).addClass(this.classes.topRow);
            // If there are more than 3 columns defined then make there be a smaller gap between the panes
            if (layVal > 3) {
                $(this.dom.container).addClass(this.classes.smallGap);
            }
            $(this.dom.topRow).addClass(this.classes.subRowsContainer);
            $(this.dom.upper).appendTo(this.dom.topRow);
            $(this.dom.lower).appendTo(this.dom.topRow);
            $(this.dom.searchCont).appendTo(this.dom.upper);
            $(this.dom.buttonGroup).appendTo(this.dom.lower);
            // If no selections have been made in the pane then disable the clear button
            if (this.c.dtOpts.searching === false ||
                (colOpts.dtOpts !== undefined &&
                    colOpts.dtOpts.searching === false) ||
                (!this.c.controls || !colOpts.controls) ||
                (this.customPaneSettings !== null &&
                    this.customPaneSettings.dtOpts !== undefined &&
                    this.customPaneSettings.dtOpts.searching !== undefined &&
                    !this.customPaneSettings.dtOpts.searching)) {
                $(this.dom.searchBox).attr('disabled', 'disabled')
                    .removeClass(this.classes.paneInputButton)
                    .addClass(this.classes.disabledButton);
            }
            $(this.dom.searchBox).appendTo(this.dom.searchCont);
            // Create the contents of the searchCont div. Worth noting that this function will change when using semantic ui
            this._searchContSetup();
            // If the clear button is allowed to show then display it
            if (this.c.clear && this.c.controls && colOpts.controls) {
                $(this.dom.clear).appendTo(this.dom.buttonGroup);
            }
            if (this.c.orderable && colOpts.orderable && this.c.controls && colOpts.controls) {
                $(this.dom.nameButton).appendTo(this.dom.buttonGroup);
            }
            // If the count column is hidden then don't display the ordering button for it
            if (!this.c.hideCount &&
                !colOpts.hideCount &&
                this.c.orderable &&
                colOpts.orderable &&
                this.c.controls &&
                colOpts.controls) {
                $(this.dom.countButton).appendTo(this.dom.buttonGroup);
            }
            $(this.dom.topRow).prependTo(this.dom.container);
            $(container).append(this.dom.dtP);
            $(container).show();
        };
        /**
         * Gets the options for the row for the customPanes
         * @returns {object} The options for the row extended to include the options from the user.
         */
        SearchPane.prototype._getBonusOptions = function () {
            // We need to reset the thresholds as if they have a value in colOpts then that value will be used
            var defaultMutator = {
                orthogonal: {
                    threshold: null
                },
                threshold: null
            };
            return $.extend(true, {}, SearchPane.defaults, defaultMutator, this.c !== undefined ? this.c : {});
        };
        /**
         * Adds the custom options to the pane
         * @returns {Array} Returns the array of rows which have been added to the pane
         */
        SearchPane.prototype._getComparisonRows = function () {
            var colOpts = this.s.colOpts;
            // Find the appropriate options depending on whether this is a pane for a specific column or a custom pane
            var options = colOpts.options !== undefined
                ? colOpts.options
                : this.customPaneSettings !== null && this.customPaneSettings.options !== undefined
                    ? this.customPaneSettings.options
                    : undefined;
            if (options === undefined) {
                return;
            }
            var tableVals = this.s.dt.rows({ search: 'applied' }).data().toArray();
            var appRows = this.s.dt.rows({ search: 'applied' });
            var tableValsTotal = this.s.dt.rows().data().toArray();
            var allRows = this.s.dt.rows();
            var rows = [];
            // Clear all of the other rows from the pane, only custom options are to be displayed when they are defined
            this.s.dtPane.clear();
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var comp = options_1[_i];
                // Initialise the object which is to be placed in the row
                var insert = comp.label !== '' ? comp.label : this.c.emptyMessage;
                var comparisonObj = {
                    className: comp.className,
                    display: insert,
                    filter: typeof comp.value === 'function' ? comp.value : [],
                    shown: 0,
                    sort: insert,
                    total: 0,
                    type: insert
                };
                // If a custom function is in place
                if (typeof comp.value === 'function') {
                    // Count the number of times the function evaluates to true for the data currently being displayed
                    for (var tVal = 0; tVal < tableVals.length; tVal++) {
                        if (comp.value.call(this.s.dt, tableVals[tVal], appRows[0][tVal])) {
                            comparisonObj.shown++;
                        }
                    }
                    // Count the number of times the function evaluates to true for the original data in the Table
                    for (var i = 0; i < tableValsTotal.length; i++) {
                        if (comp.value.call(this.s.dt, tableValsTotal[i], allRows[0][i])) {
                            comparisonObj.total++;
                        }
                    }
                    // Update the comparisonObj
                    if (typeof comparisonObj.filter !== 'function') {
                        comparisonObj.filter.push(comp.filter);
                    }
                }
                // If cascadePanes is not active or if it is and the comparisonObj should be shown then add it to the pane
                if (!this.c.cascadePanes || (this.c.cascadePanes && comparisonObj.shown !== 0)) {
                    rows.push(this._addRow(comparisonObj.display, comparisonObj.filter, comparisonObj.shown, comparisonObj.total, comparisonObj.sort, comparisonObj.type, comparisonObj.className));
                }
            }
            return rows;
        };
        /**
         * Gets the options for the row for the customPanes
         * @returns {object} The options for the row extended to include the options from the user.
         */
        SearchPane.prototype._getOptions = function () {
            var table = this.s.dt;
            // We need to reset the thresholds as if they have a value in colOpts then that value will be used
            var defaultMutator = {
                emptyMessage: false,
                orthogonal: {
                    threshold: null
                },
                threshold: null
            };
            return $.extend(true, {}, SearchPane.defaults, defaultMutator, table.settings()[0].aoColumns[this.s.index].searchPanes);
        };
        /**
         * This method allows for changes to the panes and table to be made when a selection or a deselection occurs
         * @param select Denotes whether a selection has been made or not
         */
        SearchPane.prototype._makeSelection = function () {
            this.updateTable();
            this.s.updating = true;
            this.s.dt.draw();
            this.s.updating = false;
        };
        /**
         * Fill the array with the values that are currently being displayed in the table
         * @param last boolean to indicate whether this was the last pane a selection was made in
         */
        SearchPane.prototype._populatePane = function (last) {
            if (last === void 0) { last = false; }
            var table = this.s.dt;
            this.s.rowData.arrayFilter = [];
            this.s.rowData.bins = {};
            var settings = this.s.dt.settings()[0];
            // If cascadePanes or viewTotal are active it is necessary to get the data which is currently
            //  being displayed for their functionality. Also make sure that this was not the last pane to have a selection made
            if (!this.s.dt.page.info().serverSide) {
                var indexArray = (this.c.cascadePanes || this.c.viewTotal) && (!this.s.clearing && !last) ?
                    table.rows({ search: 'applied' }).indexes() :
                    table.rows().indexes();
                for (var _i = 0, _a = indexArray.toArray(); _i < _a.length; _i++) {
                    var index = _a[_i];
                    this._populatePaneArray(index, this.s.rowData.arrayFilter, settings);
                }
            }
        };
        /**
         * Populates an array with all of the data for the table
         * @param rowIdx The current row index to be compared
         * @param arrayFilter The array that is to be populated with row Details
         * @param bins The bins object that is to be populated with the row counts
         */
        SearchPane.prototype._populatePaneArray = function (rowIdx, arrayFilter, settings, bins) {
            if (bins === void 0) { bins = this.s.rowData.bins; }
            var colOpts = this.s.colOpts;
            // Retrieve the rendered data from the cell using the fnGetCellData function
            //  rather than the cell().render API method for optimisation
            if (typeof colOpts.orthogonal === 'string') {
                var rendered = settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal);
                this.s.rowData.filterMap.set(rowIdx, rendered);
                this._addOption(rendered, rendered, rendered, rendered, arrayFilter, bins);
            }
            else {
                var filter = settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.search);
                if (typeof filter === 'string') {
                    filter = filter.replace(/<[^>]*>/g, '');
                }
                this.s.rowData.filterMap.set(rowIdx, filter);
                if (!bins[filter]) {
                    bins[filter] = 1;
                    this._addOption(filter, settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.display), settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.sort), settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.type), arrayFilter, bins);
                    this.s.rowData.totalOptions++;
                }
                else {
                    bins[filter]++;
                    this.s.rowData.totalOptions++;
                    return;
                }
            }
        };
        /**
         * Reloads all of the previous selects into the panes
         * @param loadedFilter The loaded filters from a previous state
         */
        SearchPane.prototype._reloadSelect = function (loadedFilter) {
            // If the state was not saved don't selected any
            if (loadedFilter === undefined) {
                return;
            }
            var idx;
            // For each pane, check that the loadedFilter list exists and is not null,
            // find the id of each search item and set it to be selected.
            for (var i = 0; i < loadedFilter.searchPanes.panes.length; i++) {
                if (loadedFilter.searchPanes.panes[i].id === this.s.index) {
                    idx = i;
                    break;
                }
            }
            if (idx !== undefined) {
                var table = this.s.dtPane;
                var rows = table.rows({ order: 'index' }).data().map(function (item) { return item.filter !== null ?
                    item.filter.toString() :
                    null; }).toArray();
                for (var _i = 0, _a = loadedFilter.searchPanes.panes[idx].selected; _i < _a.length; _i++) {
                    var filter = _a[_i];
                    var id = -1;
                    if (filter !== null) {
                        id = rows.indexOf(filter.toString());
                    }
                    if (id > -1) {
                        table.row(id).select();
                        this.s.dt.state.save();
                    }
                }
            }
        };
        /**
         * This method decides whether a row should contribute to the pane or not
         * @param filter the value that the row is to be filtered on
         * @param dataIndex the row index
         */
        SearchPane.prototype._search = function (filter, dataIndex) {
            var colOpts = this.s.colOpts;
            var table = this.s.dt;
            // For each item selected in the pane, check if it is available in the cell
            for (var _i = 0, _a = this.selections; _i < _a.length; _i++) {
                var colSelect = _a[_i];
                // if the filter is an array then is the column present in it
                if (Array.isArray(filter)) {
                    if (filter.indexOf(colSelect.filter) !== -1) {
                        return true;
                    }
                }
                // if the filter is a function then does it meet the criteria of that function or not
                else if (typeof colSelect.filter === 'function') {
                    if (colSelect.filter.call(table, table.row(dataIndex).data(), dataIndex)) {
                        if (colOpts.combiner === 'or') {
                            return true;
                        }
                    }
                    // If the combiner is an "and" then we need to check against all possible selections
                    //  so if it fails here then the and is not met and return false
                    else if (colOpts.combiner === 'and') {
                        return false;
                    }
                }
                // otherwise if the two filter values are equal then return true
                // Loose type checking incase number type in column comparing to a string
                else if ((filter === colSelect.filter) ||
                    (!(typeof filter === 'string' && filter.length === 0) && filter == colSelect.filter) ||
                    (colSelect.filter === null && typeof filter === 'string' && filter === '')) {
                    return true;
                }
            }
            // If the combiner is an and then we need to check against all possible selections
            //  so return true here if so because it would have returned false earlier if it had failed
            if (colOpts.combiner === 'and') {
                return true;
            }
            // Otherwise it hasn't matched with anything by this point so it must be false
            else {
                return false;
            }
        };
        /**
         * Creates the contents of the searchCont div
         *
         * NOTE This is overridden when semantic ui styling in order to integrate the search button into the text box.
         */
        SearchPane.prototype._searchContSetup = function () {
            if (this.c.controls && this.s.colOpts.controls) {
                $(this.dom.searchButton).appendTo(this.dom.searchLabelCont);
            }
            if (!(this.c.dtOpts.searching === false ||
                this.s.colOpts.dtOpts.searching === false ||
                (this.customPaneSettings !== null &&
                    this.customPaneSettings.dtOpts !== undefined &&
                    this.customPaneSettings.dtOpts.searching !== undefined &&
                    !this.customPaneSettings.dtOpts.searching))) {
                $(this.dom.searchLabelCont).appendTo(this.dom.searchCont);
            }
        };
        /**
         * Adds outline to the pane when a selection has been made
         */
        SearchPane.prototype._searchExtras = function () {
            var updating = this.s.updating;
            this.s.updating = true;
            var filters = this.s.dtPane.rows({ selected: true }).data().pluck('filter').toArray();
            var nullIndex = filters.indexOf(this.s.colOpts.emptyMessage !== false ?
                this.s.colOpts.emptyMessage :
                this.c.emptyMessage);
            var container = $(this.s.dtPane.table().container());
            // If null index is found then search for empty cells as a filter.
            if (nullIndex > -1) {
                filters[nullIndex] = '';
            }
            // If a filter has been applied then outline the respective pane, remove it when it no longer is.
            if (filters.length > 0) {
                container.addClass(this.classes.selected);
            }
            else if (filters.length === 0) {
                container.removeClass(this.classes.selected);
            }
            this.s.updating = updating;
        };
        /**
         * Finds the ratio of the number of different options in the table to the number of rows
         * @param bins the number of different options in the table
         * @param rowCount the total number of rows in the table
         * @returns {number} returns the ratio
         */
        SearchPane.prototype._uniqueRatio = function (bins, rowCount) {
            if (rowCount > 0 &&
                ((this.s.rowData.totalOptions > 0 && !this.s.dt.page.info().serverSide) ||
                    (this.s.dt.page.info().serverSide && this.s.tableLength > 0))) {
                return bins / this.s.rowData.totalOptions;
            }
            else {
                return 1;
            }
        };
        /**
         * updates the options within the pane
         * @param draw a flag to define whether this has been called due to a draw event or not
         */
        SearchPane.prototype._updateCommon = function (draw) {
            if (draw === void 0) { draw = false; }
            // Update the panes if doing a deselect. if doing a select then
            // update all of the panes except for the one causing the change
            if (!this.s.dt.page.info().serverSide &&
                this.s.dtPane !== undefined &&
                (!this.s.filteringActive || this.c.cascadePanes || draw === true) &&
                (this.c.cascadePanes !== true || this.s.selectPresent !== true) && (!this.s.lastSelect || !this.s.lastCascade)) {
                var colOpts = this.s.colOpts;
                var selected = this.s.dtPane.rows({ selected: true }).data().toArray();
                var scrollTop = $(this.s.dtPane.table().node()).parent()[0].scrollTop;
                var rowData = this.s.rowData;
                // Clear the pane in preparation for adding the updated search options
                this.s.dtPane.clear();
                // If it is not a custom pane
                if (this.colExists) {
                    // Only run populatePane if the data has not been collected yet
                    if (rowData.arrayFilter.length === 0) {
                        this._populatePane();
                    }
                    // If cascadePanes is active and the table has returned to its default state then
                    //  there is a need to update certain parts ofthe rowData.
                    else if (this.c.cascadePanes
                        && this.s.dt.rows().data().toArray().length === this.s.dt.rows({ search: 'applied' }).data().toArray().length) {
                        rowData.arrayFilter = rowData.arrayOriginal;
                        rowData.bins = rowData.binsOriginal;
                    }
                    // Otherwise if viewTotal or cascadePanes is active then the data from the table must be read.
                    else if (this.c.viewTotal || this.c.cascadePanes) {
                        this._populatePane();
                    }
                    // If the viewTotal option is selected then find the totals for the table
                    if (this.c.viewTotal) {
                        this._detailsPane();
                    }
                    else {
                        rowData.binsTotal = rowData.bins;
                    }
                    if (this.c.viewTotal && !this.c.cascadePanes) {
                        rowData.arrayFilter = rowData.arrayTotals;
                    }
                    var _loop_1 = function (dataP) {
                        // If both view Total and cascadePanes have been selected and the count of the row is not 0 then add it to pane
                        // Do this also if the viewTotal option has been selected and cascadePanes has not
                        if (dataP && ((rowData.bins[dataP.filter] !== undefined && rowData.bins[dataP.filter] !== 0 && this_1.c.cascadePanes)
                            || !this_1.c.cascadePanes
                            || this_1.s.clearing)) {
                            var row = this_1._addRow(dataP.display, dataP.filter, !this_1.c.viewTotal
                                ? rowData.bins[dataP.filter]
                                : rowData.bins[dataP.filter] !== undefined
                                    ? rowData.bins[dataP.filter]
                                    : 0, this_1.c.viewTotal
                                ? String(rowData.binsTotal[dataP.filter])
                                : rowData.bins[dataP.filter], dataP.sort, dataP.type);
                            // Find out if the filter was selected in the previous search, if so select it and remove from array.
                            var selectIndex = selected.findIndex(function (element) {
                                return element.filter === dataP.filter;
                            });
                            if (selectIndex !== -1) {
                                row.select();
                                selected.splice(selectIndex, 1);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = rowData.arrayFilter; _i < _a.length; _i++) {
                        var dataP = _a[_i];
                        _loop_1(dataP);
                    }
                }
                if ((colOpts.searchPanes !== undefined && colOpts.searchPanes.options !== undefined) ||
                    colOpts.options !== undefined ||
                    (this.customPaneSettings !== null && this.customPaneSettings.options !== undefined)) {
                    var rows = this._getComparisonRows();
                    var _loop_2 = function (row) {
                        var selectIndex = selected.findIndex(function (element) {
                            if (element.display === row.data().display) {
                                return true;
                            }
                        });
                        if (selectIndex !== -1) {
                            row.select();
                            selected.splice(selectIndex, 1);
                        }
                    };
                    for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
                        var row = rows_1[_b];
                        _loop_2(row);
                    }
                }
                // Add search options which were previously selected but whos results are no
                // longer present in the resulting data set.
                for (var _c = 0, selected_1 = selected; _c < selected_1.length; _c++) {
                    var selectedEl = selected_1[_c];
                    var row = this._addRow(selectedEl.display, selectedEl.filter, 0, this.c.viewTotal
                        ? selectedEl.total
                        : 0, selectedEl.display, selectedEl.display);
                    this.s.updating = true;
                    row.select();
                    this.s.updating = false;
                }
                this.s.dtPane.draw();
                this.s.dtPane.table().node().parentNode.scrollTop = scrollTop;
            }
        };
        SearchPane.version = '1.1.0';
        SearchPane.classes = {
            buttonGroup: 'dtsp-buttonGroup',
            buttonSub: 'dtsp-buttonSub',
            clear: 'dtsp-clear',
            clearAll: 'dtsp-clearAll',
            clearButton: 'clearButton',
            container: 'dtsp-searchPane',
            countButton: 'dtsp-countButton',
            disabledButton: 'dtsp-disabledButton',
            dull: 'dtsp-dull',
            hidden: 'dtsp-hidden',
            hide: 'dtsp-hide',
            layout: 'dtsp-',
            name: 'dtsp-name',
            nameButton: 'dtsp-nameButton',
            nameCont: 'dtsp-nameCont',
            narrow: 'dtsp-narrow',
            paneButton: 'dtsp-paneButton',
            paneInputButton: 'dtsp-paneInputButton',
            pill: 'dtsp-pill',
            search: 'dtsp-search',
            searchCont: 'dtsp-searchCont',
            searchIcon: 'dtsp-searchIcon',
            searchLabelCont: 'dtsp-searchButtonCont',
            selected: 'dtsp-selected',
            smallGap: 'dtsp-smallGap',
            subRow1: 'dtsp-subRow1',
            subRow2: 'dtsp-subRow2',
            subRowsContainer: 'dtsp-subRowsContainer',
            title: 'dtsp-title',
            topRow: 'dtsp-topRow'
        };
        // Define SearchPanes default options
        SearchPane.defaults = {
            cascadePanes: false,
            clear: true,
            combiner: 'or',
            controls: true,
            container: function (dt) {
                return dt.table().container();
            },
            dtOpts: {},
            emptyMessage: '<i>No Data</i>',
            hideCount: false,
            layout: 'columns-3',
            name: undefined,
            orderable: true,
            orthogonal: {
                display: 'display',
                filter: 'filter',
                hideCount: false,
                search: 'filter',
                show: undefined,
                sort: 'sort',
                threshold: 0.6,
                type: 'type'
            },
            preSelect: [],
            threshold: 0.6,
            viewTotal: false
        };
        return SearchPane;
    }());

    var $$1;
    var DataTable$1;
    function setJQuery$1(jq) {
        $$1 = jq;
        DataTable$1 = jq.fn.dataTable;
    }
    var SearchPanes = /** @class */ (function () {
        function SearchPanes(paneSettings, opts, fromInit) {
            var _this = this;
            if (fromInit === void 0) { fromInit = false; }
            this.regenerating = false;
            // Check that the required version of DataTables is included
            if (!DataTable$1 || !DataTable$1.versionCheck || !DataTable$1.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            // Check that Select is included
            if (!DataTable$1.select) {
                throw new Error('SearchPane requires Select');
            }
            var table = new DataTable$1.Api(paneSettings);
            this.classes = $$1.extend(true, {}, SearchPanes.classes);
            // Get options from user
            this.c = $$1.extend(true, {}, SearchPanes.defaults, opts);
            // Add extra elements to DOM object including clear
            this.dom = {
                clearAll: $$1('<button type="button">Clear All</button>').addClass(this.classes.clearAll),
                container: $$1('<div/>').addClass(this.classes.panes).text(table.i18n('searchPanes.loadMessage', 'Loading Search Panes...')),
                emptyMessage: $$1('<div/>').addClass(this.classes.emptyMessage),
                options: $$1('<div/>').addClass(this.classes.container),
                panes: $$1('<div/>').addClass(this.classes.container),
                title: $$1('<div/>').addClass(this.classes.title),
                titleRow: $$1('<div/>').addClass(this.classes.titleRow),
                wrapper: $$1('<div/>')
            };
            this.s = {
                colOpts: [],
                dt: table,
                filterPane: -1,
                panes: [],
                selectionList: [],
                serverData: {},
                stateRead: false,
                updating: false
            };
            if (table.settings()[0]._searchPanes !== undefined) {
                return;
            }
            // We are using the xhr event to rebuild the panes if required due to viewTotal being enabled
            // If viewTotal is not enabled then we simply update the data from the server
            table.on('xhr', function (e, settings, json, xhr) {
                if (json.searchPanes && json.searchPanes.options) {
                    _this.s.serverData = json.searchPanes.options;
                    _this.s.serverData.tableLength = json.recordsTotal;
                    _this._serverTotals();
                }
            });
            table.settings()[0]._searchPanes = this;
            this.dom.clearAll.text(table.i18n('searchPanes.clearMessage', 'Clear All'));
            this._getState();
            if (this.s.dt.settings()[0]._bInitComplete || fromInit) {
                this._paneDeclare(table, paneSettings, opts);
            }
            else {
                table.one('preInit.dt', function (settings) {
                    _this._paneDeclare(table, paneSettings, opts);
                });
            }
            return this;
        }
        /**
         * Clear the selections of all of the panes
         */
        SearchPanes.prototype.clearSelections = function () {
            // Load in all of the searchBoxes in the documents
            var searches = this.dom.container.find(this.classes.search);
            // For each searchBox set the input text to be empty and then trigger
            //  an input on them so that they no longer filter the panes
            searches.each(function () {
                $$1(this).val('');
                $$1(this).trigger('input');
            });
            var returnArray = [];
            // For every pane, clear the selections in the pane
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    returnArray.push(pane.clearPane());
                }
            }
            this.s.dt.draw();
            return returnArray;
        };
        /**
         * returns the container node for the searchPanes
         */
        SearchPanes.prototype.getNode = function () {
            return this.dom.container;
        };
        /**
         * rebuilds all of the panes
         */
        SearchPanes.prototype.rebuild = function (targetIdx, maintainSelection) {
            if (targetIdx === void 0) { targetIdx = false; }
            if (maintainSelection === void 0) { maintainSelection = false; }
            $$1(this.dom.emptyMessage).remove();
            // As a rebuild from scratch is required, empty the searchpanes container.
            var returnArray = [];
            // Rebuild each pane individually, if a specific pane has been selected then only rebuild that one
            if (targetIdx === false) {
                $$1(this.dom.panes).empty();
            }
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (targetIdx !== false && pane.s.index !== targetIdx) {
                    continue;
                }
                pane.clearData();
                returnArray.push(
                // Pass a boolean to say whether this is the last choice made for maintaining selections when rebuilding
                pane.rebuildPane(this.s.selectionList[this.s.selectionList.length - 1] !== undefined ?
                    pane.s.index === this.s.selectionList[this.s.selectionList.length - 1].index :
                    false, this.s.dt.page.info().serverSide ?
                    this.s.serverData :
                    undefined, null, maintainSelection));
                $$1(this.dom.panes).append(pane.dom.container);
            }
            // Only need to trigger a search if it is not server side processing
            if (!this.s.dt.page.info().serverSide) {
                this.s.dt.draw();
            }
            if (this.c.cascadePanes || this.c.viewTotal) {
                this.redrawPanes(true);
            }
            else {
                this._updateSelection();
            }
            // Attach panes, clear buttons, and title bar to the document
            this._updateFilterCount();
            this._attachPaneContainer();
            this.s.dt.draw();
            // If a single pane has been rebuilt then return only that pane
            if (returnArray.length === 1) {
                return returnArray[0];
            }
            // Otherwise return all of the panes that have been rebuilt
            else {
                return returnArray;
            }
        };
        /**
         * Redraws all of the panes
         */
        SearchPanes.prototype.redrawPanes = function (rebuild) {
            if (rebuild === void 0) { rebuild = false; }
            var table = this.s.dt;
            // Only do this if the redraw isn't being triggered by the panes updating themselves
            if (!this.s.updating && !this.s.dt.page.info().serverSide) {
                var filterActive = true;
                var filterPane = this.s.filterPane;
                // If the number of rows currently visible is equal to the number of rows in the table
                //  then there can't be any filtering taking place
                if (table.rows({ search: 'applied' }).data().toArray().length === table.rows().data().toArray().length) {
                    filterActive = false;
                }
                // Otherwise if viewTotal is active then it is necessary to determine which panes a select is present in.
                //  If there is only one pane with a selection present then it should not show the filtered message as
                //  more selections may be made in that pane.
                else if (this.c.viewTotal) {
                    for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        if (pane.s.dtPane !== undefined) {
                            var selectLength = pane.s.dtPane.rows({ selected: true }).data().toArray().length;
                            if (selectLength === 0) {
                                for (var _b = 0, _c = this.s.selectionList; _b < _c.length; _b++) {
                                    var selection = _c[_b];
                                    if (selection.index === pane.s.index && selection.rows.length !== 0) {
                                        selectLength = selection.rows.length;
                                    }
                                }
                            }
                            // If filterPane === -1 then a pane with a selection has not been found yet, so set filterPane to that panes index
                            if (selectLength > 0 && filterPane === -1) {
                                filterPane = pane.s.index;
                            }
                            // Then if another pane is found with a selection then set filterPane to null to
                            //  show that multiple panes have selections present
                            else if (selectLength > 0) {
                                filterPane = null;
                            }
                        }
                    }
                }
                var deselectIdx = void 0;
                var newSelectionList = [];
                // Don't run this if it is due to the panes regenerating
                if (!this.regenerating) {
                    for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                        var pane = _e[_d];
                        // Identify the pane where a selection or deselection has been made and add it to the list.
                        if (pane.s.selectPresent) {
                            this.s.selectionList.push({ index: pane.s.index, rows: pane.s.dtPane.rows({ selected: true }).data().toArray(), protect: false });
                            table.state.save();
                            break;
                        }
                        else if (pane.s.deselect) {
                            deselectIdx = pane.s.index;
                            var selectedData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                            if (selectedData.length > 0) {
                                this.s.selectionList.push({ index: pane.s.index, rows: selectedData, protect: true });
                            }
                        }
                    }
                    if (this.s.selectionList.length > 0) {
                        var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                        for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                            var pane = _g[_f];
                            pane.s.lastSelect = (pane.s.index === last);
                        }
                    }
                    // Remove selections from the list from the pane where a deselect has taken place
                    for (var i = 0; i < this.s.selectionList.length; i++) {
                        if (this.s.selectionList[i].index !== deselectIdx || this.s.selectionList[i].protect === true) {
                            var further = false;
                            // Find out if this selection is the last one in the list for that pane
                            for (var j = i + 1; j < this.s.selectionList.length; j++) {
                                if (this.s.selectionList[j].index === this.s.selectionList[i].index) {
                                    further = true;
                                }
                            }
                            // If there are no selections for this pane in the list then just push this one
                            if (!further) {
                                newSelectionList.push(this.s.selectionList[i]);
                                this.s.selectionList[i].protect = false;
                            }
                        }
                    }
                    var solePane = -1;
                    if (newSelectionList.length === 1) {
                        solePane = newSelectionList[0].index;
                    }
                    // Update all of the panes to reflect the current state of the filters
                    for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                        var pane = _j[_h];
                        if (pane.s.dtPane !== undefined) {
                            var tempFilter = true;
                            pane.s.filteringActive = true;
                            if ((filterPane !== -1 && filterPane !== null && filterPane === pane.s.index) ||
                                filterActive === false ||
                                pane.s.index === solePane) {
                                tempFilter = false;
                                pane.s.filteringActive = false;
                            }
                            pane.updatePane(!tempFilter ? false : filterActive);
                        }
                    }
                    // Update the label that shows how many filters are in place
                    this._updateFilterCount();
                    // If the length of the selections are different then some of them have been removed and a deselect has occured
                    if (newSelectionList.length > 0 && (newSelectionList.length < this.s.selectionList.length || rebuild)) {
                        this._cascadeRegen(newSelectionList);
                        var last = newSelectionList[newSelectionList.length - 1].index;
                        for (var _k = 0, _l = this.s.panes; _k < _l.length; _k++) {
                            var pane = _l[_k];
                            pane.s.lastSelect = (pane.s.index === last);
                        }
                    }
                    else if (newSelectionList.length > 0) {
                        // Update all of the other panes as you would just making a normal selection
                        for (var _m = 0, _o = this.s.panes; _m < _o.length; _m++) {
                            var paneUpdate = _o[_m];
                            if (paneUpdate.s.dtPane !== undefined) {
                                var tempFilter = true;
                                paneUpdate.s.filteringActive = true;
                                if ((filterPane !== -1 && filterPane !== null && filterPane === paneUpdate.s.index) || filterActive === false) {
                                    tempFilter = false;
                                    paneUpdate.s.filteringActive = false;
                                }
                                paneUpdate.updatePane(!tempFilter ? tempFilter : filterActive);
                            }
                        }
                    }
                }
                else {
                    var solePane = -1;
                    if (newSelectionList.length === 1) {
                        solePane = newSelectionList[0].index;
                    }
                    for (var _p = 0, _q = this.s.panes; _p < _q.length; _p++) {
                        var pane = _q[_p];
                        if (pane.s.dtPane !== undefined) {
                            var tempFilter = true;
                            pane.s.filteringActive = true;
                            if ((filterPane !== -1 && filterPane !== null && filterPane === pane.s.index) ||
                                filterActive === false ||
                                pane.s.index === solePane) {
                                tempFilter = false;
                                pane.s.filteringActive = false;
                            }
                            pane.updatePane(!tempFilter ? tempFilter : filterActive);
                        }
                    }
                    // Update the label that shows how many filters are in place
                    this._updateFilterCount();
                }
                if (!filterActive) {
                    this.s.selectionList = [];
                }
            }
        };
        /**
         * Attach the panes, buttons and title to the document
         */
        SearchPanes.prototype._attach = function () {
            var _this = this;
            $$1(this.dom.container).removeClass(this.classes.hide);
            $$1(this.dom.titleRow).removeClass(this.classes.hide);
            $$1(this.dom.titleRow).remove();
            $$1(this.dom.title).appendTo(this.dom.titleRow);
            // If the clear button is permitted attach it
            if (this.c.clear) {
                $$1(this.dom.clearAll).appendTo(this.dom.titleRow);
                $$1(this.dom.clearAll).on('click.dtsps', function () {
                    _this.clearSelections();
                });
            }
            $$1(this.dom.titleRow).appendTo(this.dom.container);
            // Attach the container for each individual pane to the overall container
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                $$1(pane.dom.container).appendTo(this.dom.panes);
            }
            // Attach everything to the document
            $$1(this.dom.panes).appendTo(this.dom.container);
            if ($$1('div.' + this.classes.container).length === 0) {
                $$1(this.dom.container).prependTo(this.s.dt);
            }
            return this.dom.container;
        };
        /**
         * Attach the top row containing the filter count and clear all button
         */
        SearchPanes.prototype._attachExtras = function () {
            $$1(this.dom.container).removeClass(this.classes.hide);
            $$1(this.dom.titleRow).removeClass(this.classes.hide);
            $$1(this.dom.titleRow).remove();
            $$1(this.dom.title).appendTo(this.dom.titleRow);
            // If the clear button is permitted attach it
            if (this.c.clear) {
                $$1(this.dom.clearAll).appendTo(this.dom.titleRow);
            }
            $$1(this.dom.titleRow).appendTo(this.dom.container);
            return this.dom.container;
        };
        /**
         * If there are no panes to display then this method is called to either
         *   display a message in their place or hide them completely.
         */
        SearchPanes.prototype._attachMessage = function () {
            // Create a message to display on the screen
            var message;
            try {
                message = this.s.dt.i18n('searchPanes.emptyPanes', 'No SearchPanes');
            }
            catch (error) {
                message = null;
            }
            // If the message is an empty string then searchPanes.emptyPanes is undefined,
            //  therefore the pane container should be removed from the display
            if (message === null) {
                $$1(this.dom.container).addClass(this.classes.hide);
                $$1(this.dom.titleRow).removeClass(this.classes.hide);
                return;
            }
            else {
                $$1(this.dom.container).removeClass(this.classes.hide);
                $$1(this.dom.titleRow).addClass(this.classes.hide);
            }
            // Otherwise display the message
            $$1(this.dom.emptyMessage).text(message);
            this.dom.emptyMessage.appendTo(this.dom.container);
            return this.dom.container;
        };
        /**
         * Attaches the panes to the document and displays a message or hides if there are none
         */
        SearchPanes.prototype._attachPaneContainer = function () {
            // If a pane is to be displayed then attach the normal pane output
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.displayed === true) {
                    return this._attach();
                }
            }
            // Otherwise attach the custom message or remove the container from the display
            return this._attachMessage();
        };
        /**
         * Prepares the panes for selections to be made when cascade is active and a deselect has occured
         * @param newSelectionList the list of selections which are to be made
         */
        SearchPanes.prototype._cascadeRegen = function (newSelectionList) {
            // Set this to true so that the actions taken do not cause this to run until it is finished
            this.regenerating = true;
            // If only one pane has been selected then take note of its index
            var solePane = -1;
            if (newSelectionList.length === 1) {
                solePane = newSelectionList[0].index;
            }
            // Let the pane know that a cascadeRegen is taking place to avoid unexpected behaviour
            //  and clear all of the previous selections in the pane
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                pane.setCascadeRegen(true);
                pane.setClear(true);
                // If this is the same as the pane with the only selection then pass it as a parameter into clearPane
                if ((pane.s.dtPane !== undefined && pane.s.index === solePane) || pane.s.dtPane !== undefined) {
                    pane.clearPane();
                }
                pane.setClear(false);
            }
            // Remake Selections
            this._makeCascadeSelections(newSelectionList);
            // Set the selection list property to be the list without the selections from the deselect pane
            this.s.selectionList = newSelectionList;
            // The regeneration of selections is over so set it back to false
            for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                var pane = _c[_b];
                pane.setCascadeRegen(false);
            }
            this.regenerating = false;
        };
        /**
         * Attaches the message to the document but does not add any panes
         */
        SearchPanes.prototype._checkMessage = function () {
            // If a pane is to be displayed then attach the normal pane output
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.displayed === true) {
                    return;
                }
            }
            // Otherwise attach the custom message or remove the container from the display
            return this._attachMessage();
        };
        /**
         * Gets the selection list from the previous state and stores it in the selectionList Property
         */
        SearchPanes.prototype._getState = function () {
            var loadedFilter = this.s.dt.state.loaded();
            if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.selectionList !== undefined) {
                this.s.selectionList = loadedFilter.searchPanes.selectionList;
            }
        };
        /**
         * Makes all of the selections when cascade is active
         * @param newSelectionList the list of selections to be made, in the order they were originally selected
         */
        SearchPanes.prototype._makeCascadeSelections = function (newSelectionList) {
            // make selections in the order they were made previously, excluding those from the pane where a deselect was made
            for (var i = 0; i < newSelectionList.length; i++) {
                var _loop_1 = function (pane) {
                    if (pane.s.index === newSelectionList[i].index && pane.s.dtPane !== undefined) {
                        // When regenerating the cascade selections we need this flag so that the panes are only ignored if it
                        //  is the last selection and the pane for that selection
                        if (i === newSelectionList.length - 1) {
                            pane.s.lastCascade = true;
                        }
                        // if there are any selections currently in the pane then deselect them as we are about to make our new selections
                        if (pane.s.dtPane.rows({ selected: true }).data().toArray().length > 0 && pane.s.dtPane !== undefined) {
                            pane.setClear(true);
                            pane.clearPane();
                            pane.setClear(false);
                        }
                        var _loop_2 = function (row) {
                            pane.s.dtPane.rows().every(function (rowIdx) {
                                if (pane.s.dtPane.row(rowIdx).data() !== undefined &&
                                    row !== undefined &&
                                    pane.s.dtPane.row(rowIdx).data().filter === row.filter) {
                                    pane.s.dtPane.row(rowIdx).select();
                                }
                            });
                        };
                        // select every row in the pane that was selected previously
                        for (var _i = 0, _a = newSelectionList[i].rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            _loop_2(row);
                        }
                        // Update the label that shows how many filters are in place
                        this_1._updateFilterCount();
                        pane.s.lastCascade = false;
                    }
                };
                var this_1 = this;
                // As the selections may have been made across the panes in a different order to the pane index we must identify
                //  which pane has the index of the selection. This is also important for colreorder etc
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    _loop_1(pane);
                }
            }
            // Make sure that the state is saved after all of these selections
            this.s.dt.state.save();
        };
        /**
         * Declares the instances of individual searchpanes dependant on the number of columns.
         * It is necessary to run this once preInit has completed otherwise no panes will be
         *  created as the column count will be 0.
         * @param table the DataTable api for the parent table
         * @param paneSettings the settings passed into the constructor
         * @param opts the options passed into the constructor
         */
        SearchPanes.prototype._paneDeclare = function (table, paneSettings, opts) {
            var _this = this;
            // Create Panes
            table
                .columns(this.c.columns.length > 0 ? this.c.columns : undefined)
                .eq(0)
                .each(function (idx) {
                _this.s.panes.push(new SearchPane(paneSettings, opts, idx, _this.c.layout, _this.dom.panes));
            });
            // If there is any extra custom panes defined then create panes for them too
            var rowLength = table.columns().eq(0).toArray().length;
            var paneLength = this.c.panes.length;
            for (var i = 0; i < paneLength; i++) {
                var id = rowLength + i;
                this.s.panes.push(new SearchPane(paneSettings, opts, id, this.c.layout, this.dom.panes, this.c.panes[i]));
            }
            // If a custom ordering is being used
            if (this.c.order.length > 0) {
                // Make a new Array of panes based upon the order
                var newPanes = this.c.order.map(function (name, index, values) {
                    return _this._findPane(name);
                });
                // Remove the old panes from the dom
                this.dom.panes.empty();
                this.s.panes = newPanes;
                // Append the panes in the correct order
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    this.dom.panes.append(pane.dom.container);
                }
            }
            // If this internal property is true then the DataTable has been initialised already
            if (this.s.dt.settings()[0]._bInitComplete) {
                this._startup(table);
            }
            else {
                // Otherwise add the paneStartup function to the list of functions that are to be run when the table is initialised
                // This will garauntee that the panes are initialised before the init event and init Complete callback is fired
                this.s.dt.settings()[0].aoInitComplete.push({ fn: function () {
                        _this._startup(table);
                    } });
            }
        };
        /**
         * Finds a pane based upon the name of that pane
         * @param name string representing the name of the pane
         * @returns SearchPane The pane which has that name
         */
        SearchPanes.prototype._findPane = function (name) {
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (name === pane.s.name) {
                    return pane;
                }
            }
        };
        /**
         * Works out which panes to update when data is recieved from the server and viewTotal is active
         */
        SearchPanes.prototype._serverTotals = function () {
            var selectPresent = false;
            var deselectPresent = false;
            var table = this.s.dt;
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                // Identify the pane where a selection or deselection has been made and add it to the list.
                if (pane.s.selectPresent) {
                    this.s.selectionList.push({ index: pane.s.index, rows: pane.s.dtPane.rows({ selected: true }).data().toArray(), protect: false });
                    table.state.save();
                    pane.s.selectPresent = false;
                    selectPresent = true;
                    break;
                }
                else if (pane.s.deselect) {
                    var selectedData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                    if (selectedData.length > 0) {
                        this.s.selectionList.push({ index: pane.s.index, rows: selectedData, protect: true });
                    }
                    selectPresent = true;
                    deselectPresent = true;
                }
            }
            // Build an updated list based on any selections or deselections added
            if (!selectPresent) {
                this.s.selectionList = [];
            }
            else {
                var newSelectionList = [];
                for (var i = 0; i < this.s.selectionList.length; i++) {
                    var further = false;
                    // Find out if this selection is the last one in the list for that pane
                    for (var j = i + 1; j < this.s.selectionList.length; j++) {
                        if (this.s.selectionList[j].index === this.s.selectionList[i].index) {
                            further = true;
                        }
                    }
                    // If there are no selections for this pane in the list then just push this one
                    if (!further &&
                        this.s.panes[this.s.selectionList[i].index].s.dtPane.rows({ selected: true }).data().toArray().length > 0) {
                        newSelectionList.push(this.s.selectionList[i]);
                    }
                }
                this.s.selectionList = newSelectionList;
            }
            var initIdx = -1;
            // If there has been a deselect and only one pane has a selection then update everything
            if (deselectPresent && this.s.selectionList.length === 1) {
                for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                    var pane = _c[_b];
                    pane.s.lastSelect = false;
                    pane.s.deselect = false;
                    if (pane.s.dtPane !== undefined && pane.s.dtPane.rows({ selected: true }).data().toArray().length > 0) {
                        initIdx = pane.s.index;
                    }
                }
            }
            // Otherwise if there are more 1 selections then find the last one and set it to not update that pane
            else if (this.s.selectionList.length > 0) {
                var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                    var pane = _e[_d];
                    pane.s.lastSelect = (pane.s.index === last);
                    pane.s.deselect = false;
                }
            }
            // Otherwise if there are no selections then find where that took place and do not update to maintain scrolling
            else if (this.s.selectionList.length === 0) {
                for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                    var pane = _g[_f];
                    // pane.s.lastSelect = (pane.s.deselect === true);
                    pane.s.lastSelect = false;
                    pane.s.deselect = false;
                }
            }
            $$1(this.dom.panes).empty();
            // Rebuild the desired panes
            for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                var pane = _j[_h];
                if (!pane.s.lastSelect) {
                    pane.rebuildPane(undefined, this.s.dt.page.info().serverSide ? this.s.serverData : undefined, pane.s.index === initIdx ? true : null, true);
                }
                else {
                    pane._setListeners();
                }
                // append all of the panes and enable select
                $$1(this.dom.panes).append(pane.dom.container);
                if (pane.s.dtPane !== undefined) {
                    $$1(pane.s.dtPane.table().node()).parent()[0].scrollTop = pane.s.scrollTop;
                    $$1.fn.dataTable.select.init(pane.s.dtPane);
                }
            }
            // Only need to trigger a search if it is not server side processing
            if (!this.s.dt.page.info().serverSide) {
                this.s.dt.draw();
            }
        };
        /**
         * Initialises the tables previous/preset selections and initialises callbacks for events
         * @param table the parent table for which the searchPanes are being created
         */
        SearchPanes.prototype._startup = function (table) {
            var _this = this;
            $$1(this.dom.container).text('');
            // Attach clear button and title bar to the document
            this._attachExtras();
            $$1(this.dom.container).append(this.dom.panes);
            $$1(this.dom.panes).empty();
            var loadedFilter = this.s.dt.state.loaded();
            if (this.c.viewTotal && !this.c.cascadePanes) {
                if (loadedFilter !== null &&
                    loadedFilter !== undefined &&
                    loadedFilter.searchPanes !== undefined &&
                    loadedFilter.searchPanes.panes !== undefined) {
                    var filterActive = false;
                    for (var _i = 0, _a = loadedFilter.searchPanes.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        if (pane.selected.length > 0) {
                            filterActive = true;
                            break;
                        }
                    }
                    if (filterActive) {
                        for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                            var pane = _c[_b];
                            pane.s.showFiltered = true;
                        }
                    }
                }
            }
            for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                var pane = _e[_d];
                pane.rebuildPane(undefined, Object.keys(this.s.serverData).length > 0 ? this.s.serverData : undefined);
                $$1(this.dom.panes).append(pane.dom.container);
            }
            // Only need to trigger a search if it is not server side processing
            if (!this.s.dt.page.info().serverSide) {
                this.s.dt.draw();
            }
            // Reset the paging if that has been saved in the state
            if (!this.s.stateRead && loadedFilter !== null && loadedFilter !== undefined) {
                this.s.dt.page((loadedFilter.start / this.s.dt.page.len()));
                this.s.dt.draw('page');
            }
            this.s.stateRead = true;
            if (this.c.viewTotal && !this.c.cascadePanes) {
                for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                    var pane = _g[_f];
                    pane.updatePane();
                }
            }
            this._updateFilterCount();
            this._checkMessage();
            // When a draw is called on the DataTable, update all of the panes incase the data in the DataTable has changed
            table.on('preDraw.dtsps', function () {
                _this._updateFilterCount();
                if ((_this.c.cascadePanes || _this.c.viewTotal) && !_this.s.dt.page.info().serverSide) {
                    _this.redrawPanes();
                }
                else {
                    _this._updateSelection();
                }
                _this.s.filterPane = -1;
            });
            // Whenever a state save occurs store the selection list in the state object
            this.s.dt.on('stateSaveParams.dtsp', function (e, settings, data) {
                if (data.searchPanes === undefined) {
                    data.searchPanes = {};
                }
                data.searchPanes.selectionList = _this.s.selectionList;
            });
            // If the data is reloaded from the server then it is possible that it has changed completely,
            // so we need to rebuild the panes
            this.s.dt.on('xhr', function () {
                var processing = false;
                if (!_this.s.dt.page.info().serverSide) {
                    _this.s.dt.one('preDraw', function () {
                        if (processing) {
                            return;
                        }
                        processing = true;
                        $$1(_this.dom.panes).empty();
                        for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                            var pane = _a[_i];
                            pane.clearData(); // Clears all of the bins and will mean that the data has to be re-read
                            // Pass a boolean to say whether this is the last choice made for maintaining selections when rebuilding
                            pane.rebuildPane(_this.s.selectionList[_this.s.selectionList.length - 1] !== undefined ?
                                pane.s.index === _this.s.selectionList[_this.s.selectionList.length - 1].index :
                                false, undefined, undefined, true);
                            $$1(_this.dom.panes).append(pane.dom.container);
                        }
                        if (!_this.s.dt.page.info().serverSide) {
                            _this.s.dt.draw();
                        }
                        if (_this.c.cascadePanes || _this.c.viewTotal) {
                            _this.redrawPanes(_this.c.cascadePanes);
                        }
                        else {
                            _this._updateSelection();
                        }
                        _this._checkMessage();
                    });
                }
            });
            // PreSelect any selections which have been defined using the preSelect option
            for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                var pane = _j[_h];
                if (pane !== undefined &&
                    pane.s.dtPane !== undefined &&
                    (pane.s.colOpts.preSelect !== undefined || pane.customPaneSettings.preSelect !== undefined)) {
                    var tableLength = pane.s.dtPane.rows().data().toArray().length;
                    for (var i = 0; i < tableLength; i++) {
                        if (pane.s.colOpts.preSelect.indexOf(pane.s.dtPane.cell(i, 0).data()) !== -1 ||
                            (pane.customPaneSettings !== null &&
                                pane.customPaneSettings.preSelect !== undefined &&
                                pane.customPaneSettings.preSelect.indexOf(pane.s.dtPane.cell(i, 0).data()) !== -1)) {
                            pane.s.dtPane.row(i).select();
                        }
                    }
                    pane.updateTable();
                }
            }
            if (this.s.selectionList !== undefined && this.s.selectionList.length > 0) {
                var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                for (var _k = 0, _l = this.s.panes; _k < _l.length; _k++) {
                    var pane = _l[_k];
                    pane.s.lastSelect = (pane.s.index === last);
                }
            }
            // If cascadePanes is active then make the previous selections in the order they were previously
            if (this.s.selectionList.length > 0 && this.c.cascadePanes) {
                this._cascadeRegen(this.s.selectionList);
            }
            // Update the title bar to show how many filters have been selected
            this._updateFilterCount();
            // If the table is destroyed and restarted then clear the selections so that they do not persist.
            table.on('destroy.dtsps', function () {
                for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    pane.destroy();
                }
                table.off('.dtsps');
                $$1(_this.dom.clearAll).off('.dtsps');
                $$1(_this.dom.container).remove();
                _this.clearSelections();
            });
            // When the clear All button has been pressed clear all of the selections in the panes
            if (this.c.clear) {
                $$1(this.dom.clearAll).on('click.dtsps', function () {
                    _this.clearSelections();
                });
            }
            if (this.s.dt.page.info().serverSide) {
                table.on('preXhr.dt', function (e, settings, data) {
                    if (data.searchPanes === undefined) {
                        data.searchPanes = {};
                    }
                    for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        var src = _this.s.dt.column(pane.s.index).dataSrc();
                        if (data.searchPanes[src] === undefined) {
                            data.searchPanes[src] = {};
                        }
                        if (pane.s.dtPane !== undefined) {
                            var rowData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                            for (var i = 0; i < rowData.length; i++) {
                                data.searchPanes[src][i] = rowData[i].filter;
                            }
                        }
                    }
                    if (_this.c.viewTotal) {
                        _this._prepViewTotal();
                    }
                });
            }
            else {
                table.on('preXhr.dt', function (e, settings, data) {
                    for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        pane.clearData();
                    }
                });
            }
            table.settings()[0]._searchPanes = this;
        };
        SearchPanes.prototype._prepViewTotal = function () {
            var filterPane = this.s.filterPane;
            var filterActive = false;
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    var selectLength = pane.s.dtPane.rows({ selected: true }).data().toArray().length;
                    // If filterPane === -1 then a pane with a selection has not been found yet, so set filterPane to that panes index
                    if (selectLength > 0 && filterPane === -1) {
                        filterPane = pane.s.index;
                        filterActive = true;
                    }
                    // Then if another pane is found with a selection then set filterPane to null to
                    //  show that multiple panes have selections present
                    else if (selectLength > 0) {
                        filterPane = null;
                    }
                }
            }
            // Update all of the panes to reflect the current state of the filters
            for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                var pane = _c[_b];
                if (pane.s.dtPane !== undefined) {
                    pane.s.filteringActive = true;
                    if ((filterPane !== -1 && filterPane !== null && filterPane === pane.s.index) || filterActive === false) {
                        pane.s.filteringActive = false;
                    }
                }
            }
        };
        /**
         * Updates the number of filters that have been applied in the title
         */
        SearchPanes.prototype._updateFilterCount = function () {
            var filterCount = 0;
            // Add the number of all of the filters throughout the panes
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    filterCount += pane.getPaneCount();
                }
            }
            // Run the message through the internationalisation method to improve readability
            var message = this.s.dt.i18n('searchPanes.title', 'Filters Active - %d', filterCount);
            $$1(this.dom.title).text(message);
            if (this.c.filterChanged !== undefined && typeof this.c.filterChanged === 'function') {
                this.c.filterChanged.call(this.s.dt, filterCount);
            }
        };
        /**
         * Updates the selectionList when cascade is not in place
         */
        SearchPanes.prototype._updateSelection = function () {
            this.s.selectionList = [];
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    this.s.selectionList.push({ index: pane.s.index, rows: pane.s.dtPane.rows({ selected: true }).data().toArray(), protect: false });
                }
            }
            this.s.dt.state.save();
        };
        SearchPanes.version = '1.2.1';
        SearchPanes.classes = {
            clear: 'dtsp-clear',
            clearAll: 'dtsp-clearAll',
            container: 'dtsp-searchPanes',
            emptyMessage: 'dtsp-emptyMessage',
            hide: 'dtsp-hidden',
            panes: 'dtsp-panesContainer',
            search: 'dtsp-search',
            title: 'dtsp-title',
            titleRow: 'dtsp-titleRow'
        };
        // Define SearchPanes default options
        SearchPanes.defaults = {
            cascadePanes: false,
            clear: true,
            container: function (dt) {
                return dt.table().container();
            },
            columns: [],
            filterChanged: undefined,
            layout: 'columns-3',
            order: [],
            panes: [],
            viewTotal: false
        };
        return SearchPanes;
    }());

    /*! SearchPanes 1.2.1
     * 2019-2020 SpryMedia Ltd - datatables.net/license
     */
    // DataTables extensions common UMD. Note that this allows for AMD, CommonJS
    // (with window and jQuery being allowed as parameters to the returned
    // function) or just default browser loading.
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery', 'datatables.net'], function ($) {
                return factory($, window, document);
            });
        }
        else if (typeof exports === 'object') {
            // CommonJS
            module.exports = function (root, $) {
                if (!root) {
                    root = window;
                }
                if (!$ || !$.fn.dataTable) {
                    $ = require('datatables.net')(root, $).$;
                }
                return factory($, root, root.document);
            };
        }
        else {
            // Browser - assume jQuery has already been loaded
            factory(window.jQuery, window, document);
        }
    }(function ($, window, document) {
        setJQuery($);
        setJQuery$1($);
        var DataTable = $.fn.dataTable;
        $.fn.dataTable.SearchPanes = SearchPanes;
        $.fn.DataTable.SearchPanes = SearchPanes;
        $.fn.dataTable.SearchPane = SearchPane;
        $.fn.DataTable.SearchPane = SearchPane;
        var apiRegister = $.fn.dataTable.Api.register;
        apiRegister('searchPanes()', function () {
            return this;
        });
        apiRegister('searchPanes.clearSelections()', function () {
            return this.iterator('table', function (ctx) {
                if (ctx._searchPanes) {
                    ctx._searchPanes.clearSelections();
                }
            });
        });
        apiRegister('searchPanes.rebuildPane()', function (targetIdx, maintainSelections) {
            return this.iterator('table', function (ctx) {
                if (ctx._searchPanes) {
                    ctx._searchPanes.rebuild(targetIdx, maintainSelections);
                }
            });
        });
        apiRegister('searchPanes.container()', function () {
            var ctx = this.context[0];
            return ctx._searchPanes
                ? ctx._searchPanes.getNode()
                : null;
        });
        $.fn.dataTable.ext.buttons.searchPanesClear = {
            text: 'Clear Panes',
            action: function (e, dt, node, config) {
                dt.searchPanes.clearSelections();
            }
        };
        $.fn.dataTable.ext.buttons.searchPanes = {
            action: function (e, dt, node, config) {
                e.stopPropagation();
                this.popover(config._panes.getNode(), {
                    align: 'dt-container'
                });
                config._panes.rebuild(undefined, true);
            },
            config: {},
            init: function (dt, node, config) {
                var panes = new $.fn.dataTable.SearchPanes(dt, $.extend({
                    filterChanged: function (count) {
                        dt.button(node).text(dt.i18n('searchPanes.collapse', { 0: 'SearchPanes', _: 'SearchPanes (%d)' }, count));
                    }
                }, config.config));
                var message = dt.i18n('searchPanes.collapse', 'SearchPanes', 0);
                dt.button(node).text(message);
                config._panes = panes;
            },
            text: 'Search Panes'
        };
        function _init(settings, fromPre) {
            if (fromPre === void 0) { fromPre = false; }
            var api = new DataTable.Api(settings);
            var opts = api.init().searchPanes || DataTable.defaults.searchPanes;
            var searchPanes = new SearchPanes(api, opts, fromPre);
            var node = searchPanes.getNode();
            return node;
        }
        // Attach a listener to the document which listens for DataTables initialisation
        // events so we can automatically initialise
        $(document).on('preInit.dt.dtsp', function (e, settings, json) {
            if (e.namespace !== 'dt') {
                return;
            }
            if (settings.oInit.searchPanes ||
                DataTable.defaults.searchPanes) {
                if (!settings._searchPanes) {
                    _init(settings, true);
                }
            }
        });
        // DataTables `dom` feature option
        DataTable.ext.feature.push({
            cFeature: 'P',
            fnInit: _init
        });
        // DataTables 2 layout feature
        if (DataTable.ext.features) {
            DataTable.ext.features.register('searchPanes', _init);
        }
    }));

}());


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net-bs4', 'datatables.net-searchpanes'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net-bs4')(root, $).$;
            }
            console.log($.fn.dataTable);
            if (!$.fn.dataTable.SearchPanes) {
                console.log("not present");
                require('datatables.net-searchpanes')(root, $);
            }
            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document) {
    'use strict';
    var DataTable = $.fn.dataTable;
    $.extend(true, DataTable.SearchPane.classes, {
        buttonGroup: 'btn-group col justify-content-end',
        disabledButton: 'disabled',
        dull: '',
        narrow: 'col',
        pane: {
            container: 'table'
        },
        paneButton: 'btn btn-light',
        pill: 'pill badge badge-pill badge-secondary',
        search: 'col-sm form-control search',
        searchCont: 'input-group col-sm',
        searchLabelCont: 'input-group-append',
        subRow1: 'dtsp-subRow1',
        subRow2: 'dtsp-subRow2',
        table: 'table table-sm table-borderless',
        topRow: 'dtsp-topRow row'
    });
    $.extend(true, DataTable.SearchPanes.classes, {
        clearAll: 'dtsp-clearAll col-auto btn btn-light',
        container: 'dtsp-searchPanes',
        panes: 'dtsp-panes dtsp-container',
        title: 'dtsp-title col',
        titleRow: 'dtsp-titleRow row'
    });
    return DataTable.searchPanes;
}));


