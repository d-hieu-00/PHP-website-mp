/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.22/e-1.9.5/b-1.6.5/r-2.2.6/sl-1.3.1
 *
 * Included libraries:
 *   DataTables 1.10.22, Editor 1.9.5, Buttons 1.6.5, Responsive 2.2.6, Select 1.3.1
 */

/*! DataTables 1.10.22
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.22
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

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
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.22";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Sau",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Trước"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Hiển thị _START_ đến _END_ trong _TOTAL_ mục",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Hiển thị 0 đến 0 trong 0 mục",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(lọc ra trong tất cả _MAX_ mục)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Hiển thị _MENU_ mục",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Tìm kiếm tất cả:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "Nhập dữ liệu cần tìm",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default Không tìm thấy mục nào tương ứng
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "Không tìm thấy mục nào tương ứng"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.22/e-1.9.5/b-1.6.5/r-2.2.6/sl-1.3.1",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.5
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2020 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

H0LL[157068]=(function(){var p=2;for(;p !== 9;){switch(p){case 2:p=typeof globalThis === '\x6f\u0062\u006a\x65\x63\u0074'?1:5;break;case 1:return globalThis;break;case 5:var H;try{var B=2;for(;B !== 6;){switch(B){case 9:delete H['\x4a\u0069\x39\x78\x42'];var h=Object['\x70\x72\u006f\u0074\x6f\x74\x79\x70\u0065'];delete h['\u0052\x46\u0076\x65\u004d'];B=6;break;case 3:throw "";B=9;break;case 4:B=typeof Ji9xB === '\x75\x6e\x64\x65\u0066\u0069\x6e\x65\u0064'?3:9;break;case 2:Object['\x64\u0065\u0066\x69\x6e\x65\x50\u0072\x6f\x70\x65\x72\x74\u0079'](Object['\x70\x72\u006f\u0074\u006f\x74\x79\u0070\u0065'],'\x52\x46\x76\x65\u004d',{'\x67\x65\x74':function(){var d=2;for(;d !== 1;){switch(d){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});H=RFveM;H['\u004a\u0069\x39\x78\x42']=H;B=4;break;}}}catch(J){H=window;}return H;break;}}})();H0LL[510357]=s0ww(H0LL[157068]);H0LL[206490]=s0NN(H0LL[157068]);function s0ww(o0){function P0(R4,h4,U4,X4,M4){var v4=2;for(;v4 !== 14;){switch(v4){case 6:try{var K4=2;for(;K4 !== 8;){switch(K4){case 3:try{var E4=2;for(;E4 !== 3;){switch(E4){case 5:w0[3]+=w0[5];w0[0][0].Object[w0[3]](w0[2],w0[0][4],w0[4]);E4=3;break;case 2:w0[3]=w0[7];w0[3]+=w0[9];E4=5;break;}}}catch(y0){}w0[2][w0[0][4]]=w0[4].value;K4=8;break;case 1:w0[1]=(1,w0[0][1])(w0[0][0]);w0[2]=[w0[8],w0[1].prototype][w0[0][3]];w0[4].value=w0[2][w0[0][2]];K4=3;break;case 2:w0[4]={};K4=1;break;}}}catch(c0){}v4=14;break;case 3:w0[9]="ePro";w0[7]="defin";w0[8]=8;w0[8]=9;v4=6;break;case 2:var w0=[arguments];w0[9]="";w0[5]="perty";w0[9]="";v4=3;break;}}}var t4=2;for(;t4 !== 17;){switch(t4){case 8:Q0[2]=5;Q0[2]=1;Q0[5]=Q0[6];Q0[5]+=Q0[9];t4=13;break;case 20:var M0=function(n0,F0,d0,Z0){var J4=2;for(;J4 !== 5;){switch(J4){case 1:P0(Q0[0][0],W0[0][0],W0[0][1],W0[0][2],W0[0][3]);J4=5;break;case 2:var W0=[arguments];J4=1;break;}}};t4=19;break;case 13:Q0[5]+=Q0[7];Q0[1]=Q0[4];Q0[1]+=Q0[9];Q0[1]+=Q0[7];t4=20;break;case 18:M0(v0,"map",Q0[2],Q0[5]);t4=17;break;case 19:M0(J0,"replace",Q0[2],Q0[1]);t4=18;break;case 2:var Q0=[arguments];Q0[9]="";Q0[4]="O";Q0[7]="w";Q0[9]="0w";Q0[6]="b";t4=8;break;}}function J0(z4){var P4=2;for(;P4 !== 5;){switch(P4){case 2:var r0=[arguments];return r0[0][0].String;break;}}}function v0(D4){var G4=2;for(;G4 !== 5;){switch(G4){case 2:var s0=[arguments];return s0[0][0].Array;break;}}}}H0LL.I4=function(){return typeof H0LL[104266].A === 'function'?H0LL[104266].A.apply(H0LL[104266],arguments):H0LL[104266].A;};H0LL[349115]="6";H0LL[418273]='function';H0LL.O64=function(){return typeof H0LL.m64.z2b === 'function'?H0LL.m64.z2b.apply(H0LL.m64,arguments):H0LL.m64.z2b;};H0LL[104266]=(function(I){var Y4=2;for(;Y4 !== 10;){switch(Y4){case 4:var Y='fromCharCode',B='RegExp';Y4=3;break;case 11:return {A:function(N){var u4=2;for(;u4 !== 13;){switch(u4){case 1:u4=u > K?5:8;break;case 14:return T?U:!U;break;case 7:u4=!U?6:14;break;case 2:var u=new P[I[0]]()[I[1]]();u4=1;break;case 3:u4=! R--?9:8;break;case 5:u4=! R--?4:3;break;case 4:U=Q(u);u4=3;break;case 9:K=u + 60000;u4=8;break;case 8:var T=(function(w,q){var e4=2;for(;e4 !== 10;){switch(e4){case 7:var X0=Z[q[2]](Z[q[5]] - 1);e4=6;break;case 2:e4=typeof w === 'undefined' && typeof N !== 'undefined'?1:5;break;case 8:var Z=P[q[4]](w[q[2]](l),16)[q[3]](2);e4=7;break;case 6:e4=l === 0?14:12;break;case 11:return g;break;case 1:w=N;e4=5;break;case 9:e4=l < w[q[5]]?8:11;break;case 4:q=I;e4=3;break;case 5:e4=typeof q === 'undefined' && typeof I !== 'undefined'?4:3;break;case 12:g=g ^ X0;e4=13;break;case 3:var g,l=0;e4=9;break;case 14:g=X0;e4=13;break;case 13:l++;e4=9;break;}}})(undefined,undefined);u4=7;break;case 6:(function(){var q4=2;for(;q4 !== 15;){switch(q4){case 19:q4=b0[O0]?18:17;break;case 2:var D0=157068;q4=1;break;case 1:var O0="_";q4=5;break;case 18:return;break;case 5:O0+="T";q4=4;break;case 4:O0+="5";O0+="p";O0+="a";O0+="n";q4=7;break;case 7:O0+="v";O0+="u";O0+="Q";O0+="w";O0+="i";O0+="H";O0+="z";q4=20;break;case 20:var b0=H0LL[D0];q4=19;break;case 17:try{var p4=2;for(;p4 !== 1;){switch(p4){case 2:expiredWarning();p4=1;break;}}}catch(H0){}b0[O0]=function(){};q4=15;break;}}})();u4=14;break;}}}};break;case 7:L=W.O0ww(new P[B]("^['-|]"),'S');Y4=6;break;case 3:Y4=! R--?9:8;break;case 14:I=I.b0ww(function(t){var L4=2;for(;L4 !== 13;){switch(L4){case 5:C='';L4=4;break;case 9:C+=P[L][Y](t[G] + 113);L4=8;break;case 2:var C;L4=1;break;case 14:return C;break;case 3:L4=G < t.length?9:7;break;case 6:return;break;case 4:var G=0;L4=3;break;case 1:L4=! R--?5:4;break;case 7:L4=!C?6:14;break;case 8:G++;L4=3;break;}}});Y4=13;break;case 5:P=H0LL[157068];Y4=4;break;case 6:Y4=! R--?14:13;break;case 1:Y4=! R--?5:4;break;case 8:Y4=! R--?7:6;break;case 2:var P,W,L,R;Y4=1;break;case 9:W=typeof Y;Y4=8;break;case 13:Y4=! R--?12:11;break;case 12:var U,K=0;Y4=11;break;}}function Q(M){var k4=2;for(;k4 !== 15;){switch(k4){case 2:var S,F,V,k,E,x,z;k4=1;break;case 14:k4=! R--?13:12;break;case 8:V=I[6];k4=7;break;case 20:S=M - x > F && k - M > F;k4=19;break;case 1:k4=! R--?5:4;break;case 18:k4=x >= 0?17:16;break;case 17:S=M - x > F;k4=19;break;case 16:S=k - M > F;k4=19;break;case 6:k=V && z(V,F);k4=14;break;case 13:E=I[7];k4=12;break;case 7:k4=! R--?6:14;break;case 9:k4=! R--?8:7;break;case 12:k4=! R--?11:10;break;case 5:z=P[I[4]];k4=4;break;case 4:k4=! R--?3:9;break;case 3:F=34;k4=9;break;case 19:return S;break;case 11:x=(E || E === 0) && z(E,F);k4=10;break;case 10:k4=x >= 0 && k >= 0?20:18;break;}}}})([[-45,-16,3,-12],[-10,-12,3,-29,-8,-4,-12],[-14,-9,-16,1,-48,3],[3,-2,-30,3,1,-8,-3,-10],[-1,-16,1,2,-12,-40,-3,3],[-5,-12,-3,-10,3,-9],[4,-5,-65,-10,-16,-2,-3,-63],[2,2,-8,2,4,7,-65,-14]]);H0LL.o64=function(){return typeof H0LL.m64.z2b === 'function'?H0LL.m64.z2b.apply(H0LL.m64,arguments):H0LL.m64.z2b;};function H0LL(){}H0LL.A4=function(){return typeof H0LL[104266].A === 'function'?H0LL[104266].A.apply(H0LL[104266],arguments):H0LL[104266].A;};H0LL[188794]="3";H0LL[364241]='object';H0LL[195232]="";H0LL[157068].u4HH=H0LL;H0LL.m64=(function(){var b64=2;for(;b64 !== 9;){switch(b64){case 2:var U64=[arguments];U64[2]=undefined;U64[8]={};U64[8].z2b=function(){var A64=2;for(;A64 !== 145;){switch(A64){case 93:X64[6].I0NN(X64[46]);X64[6].I0NN(X64[43]);X64[6].I0NN(X64[62]);A64=119;break;case 5:return 66;break;case 104:X64[59].X41=function(){var P3b=function(){var v3b=function(L3b){for(var r3b=0;r3b < 20;r3b++){L3b+=r3b;}return L3b;};v3b(2);};var n3b=(/\x31\x39\u0032/).m0NN(P3b + []);return n3b;};X64[13]=X64[59];X64[68]={};A64=101;break;case 148:A64=19?148:147;break;case 52:X64[71].X41=function(){function I3b(g3b,a3b){return g3b + a3b;};var l3b=(/\u006f\x6e[\f \u1680\t\n\u2028\r\ufeff\v\u2000-\u200a\u00a0\u202f\u3000\u2029\u180e\u205f]{0,}\u0028/).m0NN(I3b + []);return l3b;};X64[79]=X64[71];X64[23]={};X64[23].R41=['p41'];X64[23].X41=function(){var w3b=function(){return new RegExp('/ /');};var D3b=(typeof w3b,!(/\u006e\u0065\u0077/).m0NN(w3b + []));return D3b;};X64[42]=X64[23];X64[80]={};A64=45;break;case 107:X64[6].I0NN(X64[9]);X64[6].I0NN(X64[2]);X64[6].I0NN(X64[33]);X64[77]=[];X64[53]='o01';X64[55]='n01';A64=132;break;case 128:X64[86]=0;A64=127;break;case 63:X64[38]={};X64[38].R41=['p41','J41'];X64[38].X41=function(){var G3b=function(){return (![] + [])[+ ! +[]];};var M3b=(/\x61/).m0NN(G3b + []);return M3b;};X64[26]=X64[38];A64=59;break;case 4:X64[6]=[];X64[8]={};X64[8].R41=['p41'];X64[8].X41=function(){var y2b=function(){return parseFloat(".01");};var q2b=!(/[sl]/).m0NN(y2b + []);return q2b;};A64=7;break;case 123:A64=X64[11] < X64[84][X64[75]].length?122:150;break;case 117:X64[6].I0NN(X64[14]);X64[6].I0NN(X64[58]);X64[6].I0NN(X64[76]);X64[6].I0NN(X64[87]);X64[6].I0NN(X64[26]);X64[6].I0NN(X64[74]);A64=111;break;case 55:X64[39]={};X64[39].R41=['J41'];X64[39].X41=function(){var B3b=function(){return ['a','a'].join();};var f3b=!(/(\u005b|\u005d)/).m0NN(B3b + []);return f3b;};X64[58]=X64[39];X64[50]={};X64[50].R41=['A41'];A64=72;break;case 111:X64[6].I0NN(X64[42]);X64[6].I0NN(X64[52]);X64[6].I0NN(X64[78]);X64[6].I0NN(X64[21]);A64=107;break;case 31:X64[52]=X64[32];X64[73]={};X64[73].R41=['A41'];A64=28;break;case 120:X64[97][X64[25]]=X64[70];X64[77].I0NN(X64[97]);A64=151;break;case 7:X64[4]=X64[8];X64[1]={};X64[1].R41=['p41','J41'];X64[1].X41=function(){var P2b=function(){return (![] + [])[+ ! +[]];};var n2b=(/\x61/).m0NN(P2b + []);return n2b;};A64=12;break;case 26:X64[10].R41=['J41'];X64[10].X41=function(){var p2b=function(){return String.fromCharCode(0x61);};var Z2b=!(/\u0030\x78\u0036\x31/).m0NN(p2b + []);return Z2b;};X64[22]=X64[10];X64[54]={};X64[54].R41=['p41'];X64[54].X41=function(){var i3b=function(){if(typeof [] !== 'object')var O3b=/aa/;};var t3b=!(/\x61\u0061/).m0NN(i3b + []);return t3b;};X64[46]=X64[54];A64=34;break;case 151:X64[11]++;A64=123;break;case 126:X64[84]=X64[6][X64[86]];try{X64[70]=X64[84][X64[66]]()?X64[53]:X64[55];}catch(t4b){X64[70]=X64[55];}A64=124;break;case 59:X64[17]={};X64[17].R41=['w41'];X64[17].X41=function(){var N3b=function(){'use stirct';return 1;};var J3b=!(/\x73\x74\u0069\x72\x63\u0074/).m0NN(N3b + []);return J3b;};X64[34]=X64[17];A64=55;break;case 96:X64[6].I0NN(X64[7]);X64[6].I0NN(X64[79]);X64[6].I0NN(X64[4]);A64=93;break;case 89:X64[91].X41=function(){var R3b=function(){if(false){console.log(1);}};var X3b=!(/\u0031/).m0NN(R3b + []);return X3b;};X64[74]=X64[91];X64[16]={};A64=86;break;case 28:X64[73].X41=function(){var U3b=typeof u0NN === 'function';return U3b;};X64[76]=X64[73];X64[44]={};X64[44].R41=['w41'];X64[44].X41=function(){var T3b=function(Y3b,K3b,e3b,m3b){return !Y3b && !K3b && !e3b && !m3b;};var b3b=(/\u007c\u007c/).m0NN(T3b + []);return b3b;};X64[87]=X64[44];A64=39;break;case 132:X64[75]='R41';X64[25]='U41';X64[66]='X41';X64[89]='Z01';A64=128;break;case 147:U64[2]=32;return 21;break;case 54:X64[71]={};X64[71].R41=['A41'];A64=52;break;case 150:X64[86]++;A64=127;break;case 1:A64=U64[2]?5:4;break;case 149:A64=(function(Q64){var B64=2;for(;B64 !== 22;){switch(B64){case 15:C64[5]=C64[6][C64[4]];C64[3]=C64[8][C64[5]].h / C64[8][C64[5]].t;B64=26;break;case 17:C64[4]=0;B64=16;break;case 8:C64[4]=0;B64=7;break;case 19:C64[4]++;B64=7;break;case 6:C64[7]=C64[0][0][C64[4]];B64=14;break;case 7:B64=C64[4] < C64[0][0].length?6:18;break;case 13:C64[8][C64[7][X64[89]]]=(function(){var r64=2;for(;r64 !== 9;){switch(r64){case 2:var x64=[arguments];x64[5]={};x64[5].h=0;x64[5].t=0;return x64[5];break;}}}).g0NN(this,arguments);B64=12;break;case 5:return;break;case 11:C64[8][C64[7][X64[89]]].t+=true;B64=10;break;case 1:B64=C64[0][0].length === 0?5:4;break;case 10:B64=C64[7][X64[25]] === X64[53]?20:19;break;case 20:C64[8][C64[7][X64[89]]].h+=true;B64=19;break;case 25:C64[2]=true;B64=24;break;case 23:return C64[2];break;case 16:B64=C64[4] < C64[6].length?15:23;break;case 14:B64=typeof C64[8][C64[7][X64[89]]] === 'undefined'?13:11;break;case 24:C64[4]++;B64=16;break;case 4:C64[8]={};C64[6]=[];C64[4]=0;B64=8;break;case 26:B64=C64[3] >= 0.5?25:24;break;case 12:C64[6].I0NN(C64[7][X64[89]]);B64=11;break;case 18:C64[2]=false;B64=17;break;case 2:var C64=[arguments];B64=1;break;}}})(X64[77])?148:147;break;case 86:X64[16].R41=['w41'];X64[16].X41=function(){var V3b=function(Q3b,W3b,d3b){return ! !Q3b?W3b:d3b;};var A3b=!(/\u0021/).m0NN(V3b + []);return A3b;};X64[43]=X64[16];X64[90]={};X64[90].R41=['J41'];X64[90].X41=function(){var y3b=function(){return ('x').toUpperCase();};var q3b=(/\u0058/).m0NN(y3b + []);return q3b;};A64=80;break;case 45:X64[80].R41=['A41'];X64[80].X41=function(){var H3b=typeof l0NN === 'function';return H3b;};X64[62]=X64[80];A64=63;break;case 80:X64[33]=X64[90];X64[59]={};X64[59].R41=['J41'];A64=104;break;case 72:X64[50].X41=function(){var o3b=false;var s3b=[];try{for(var E3b in console){s3b.I0NN(E3b);}o3b=s3b.length === 0;}catch(j3b){}var h3b=o3b;return h3b;};X64[82]=X64[50];X64[92]={};A64=69;break;case 2:var X64=[arguments];A64=1;break;case 122:X64[97]={};X64[97][X64[89]]=X64[84][X64[75]][X64[11]];A64=120;break;case 101:X64[68].R41=['p41'];X64[68].X41=function(){var c3b=function(Z3b,i4b){if(Z3b){return Z3b;}return i4b;};var p3b=(/\x3f/).m0NN(c3b + []);return p3b;};X64[78]=X64[68];X64[6].I0NN(X64[13]);X64[6].I0NN(X64[82]);A64=96;break;case 90:X64[91].R41=['w41'];A64=89;break;case 69:X64[92].R41=['J41'];X64[92].X41=function(){var F3b=function(){return ('X').toLocaleLowerCase();};var S3b=(/\u0078/).m0NN(F3b + []);return S3b;};X64[21]=X64[92];X64[91]={};A64=90;break;case 19:X64[7]=X64[5];X64[3]={};X64[3].R41=['A41'];X64[3].X41=function(){var c2b=typeof C0NN === 'function';return c2b;};X64[2]=X64[3];X64[10]={};A64=26;break;case 124:X64[11]=0;A64=123;break;case 127:A64=X64[86] < X64[6].length?126:149;break;case 119:X64[6].I0NN(X64[22]);X64[6].I0NN(X64[34]);A64=117;break;case 12:X64[9]=X64[1];A64=11;break;case 34:X64[32]={};X64[32].R41=['p41','w41'];X64[32].X41=function(){var k3b=function(x3b){return x3b && x3b['b'];};var z3b=(/\u002e/).m0NN(k3b + []);return z3b;};A64=31;break;case 11:X64[5]={};X64[5].R41=['w41'];X64[5].X41=function(){var v2b=function(){var L2b;switch(L2b){case 0:break;}};var r2b=!(/\u0030/).m0NN(v2b + []);return r2b;};A64=19;break;case 39:X64[20]={};X64[20].R41=['p41'];X64[20].X41=function(){var C3b=function(){return parseInt("0xff");};var u3b=!(/\x78/).m0NN(C3b + []);return u3b;};X64[14]=X64[20];A64=54;break;}}};return U64[8];break;}}})();function s0NN(J74){function z14(e64){var n64=2;for(;n64 !== 5;){switch(n64){case 2:var I74=[arguments];return I74[0][0];break;}}}function p14(f64,k64,W64,h64,u64){var G64=2;for(;G64 !== 7;){switch(G64){case 9:P74[4]="Prop";try{var d64=2;for(;d64 !== 8;){switch(d64){case 2:P74[5]={};P74[1]=(1,P74[0][1])(P74[0][0]);P74[7]=[P74[1],P74[1].prototype][P74[0][3]];P74[5].value=P74[7][P74[0][2]];try{var H64=2;for(;H64 !== 3;){switch(H64){case 2:P74[3]=P74[9];P74[3]+=P74[4];P74[3]+=P74[8];P74[0][0].Object[P74[3]](P74[7],P74[0][4],P74[5]);H64=3;break;}}}catch(f74){}d64=9;break;case 9:P74[7][P74[0][4]]=P74[5].value;d64=8;break;}}}catch(k74){}G64=7;break;case 2:var P74=[arguments];P74[8]="";P74[8]="";P74[8]="erty";P74[9]="define";G64=9;break;}}}var a64=2;for(;a64 !== 69;){switch(a64){case 30:N74[24]="0N";N74[86]="";N74[86]="g";N74[16]=5;a64=43;break;case 12:N74[2]="ual";N74[1]="";N74[1]="d";N74[3]="";a64=19;break;case 55:N74[29]+=N74[32];N74[29]+=N74[32];a64=76;break;case 50:N74[82]=N74[60];N74[82]+=N74[48];N74[82]+=N74[62];N74[30]=N74[3];a64=46;break;case 71:t14(q14,"push",N74[16],N74[26]);a64=70;break;case 70:t14(y14,"apply",N74[16],N74[64]);a64=69;break;case 74:t14(z14,N74[79],N74[70],N74[47]);a64=73;break;case 2:var N74=[arguments];N74[6]="";N74[4]="m0";N74[6]="act";a64=3;break;case 24:N74[25]="NN";N74[53]="";N74[53]="0";N74[91]="";a64=35;break;case 76:var t14=function(D74,Z74,F64,T64){var E64=2;for(;E64 !== 5;){switch(E64){case 2:var w74=[arguments];p14(N74[0][0],w74[0][0],w74[0][1],w74[0][2],w74[0][3]);E64=5;break;}}};a64=75;break;case 36:N74[26]+=N74[53];N74[26]+=N74[25];N74[27]=N74[99];N74[27]+=N74[32];N74[27]+=N74[32];a64=50;break;case 19:N74[5]="__resi";N74[3]="u0";N74[60]="";N74[48]="_op";a64=15;break;case 46:N74[30]+=N74[32];N74[30]+=N74[32];N74[75]=N74[5];N74[75]+=N74[1];a64=63;break;case 63:N74[75]+=N74[2];N74[47]=N74[9];N74[47]+=N74[32];N74[47]+=N74[32];a64=59;break;case 43:N74[16]=1;N74[70]=1;N74[70]=0;N74[64]=N74[86];N74[64]+=N74[24];N74[64]+=N74[32];N74[26]=N74[91];a64=36;break;case 3:N74[7]="";N74[7]="tr";N74[8]="";N74[8]="__abs";N74[9]="";N74[9]="C0";N74[2]="";a64=12;break;case 15:N74[62]="timize";N74[60]="_";N74[99]="l0";N74[25]="";a64=24;break;case 59:N74[79]=N74[8];N74[79]+=N74[7];N74[79]+=N74[6];N74[29]=N74[4];a64=55;break;case 73:t14(z14,N74[75],N74[70],N74[30]);a64=72;break;case 35:N74[91]="I";N74[32]="";N74[32]="";N74[32]="N";N74[24]="";a64=30;break;case 75:t14(M14,"test",N74[16],N74[29]);a64=74;break;case 72:t14(z14,N74[82],N74[70],N74[27]);a64=71;break;}}function q14(i64){var s64=2;for(;s64 !== 5;){switch(s64){case 2:var K74=[arguments];return K74[0][0].Array;break;}}}function M14(R64){var V64=2;for(;V64 !== 5;){switch(V64){case 2:var Y74=[arguments];return Y74[0][0].RegExp;break;}}}function y14(l64){var g64=2;for(;g64 !== 5;){switch(g64){case 2:var L74=[arguments];return L74[0][0].Function;break;}}}}H0LL.F4=function(n4){H0LL.o64();if(H0LL)return H0LL.A4(n4);};H0LL.o4=function(s4){H0LL.o64();if(H0LL && s4)return H0LL.A4(s4);};H0LL.g4=function(T4){H0LL.o64();if(H0LL && T4)return H0LL.I4(T4);};H0LL.O4=function(V4){H0LL.o64();if(H0LL)return H0LL.I4(V4);};H0LL.x4=function(f4){H0LL.O64();if(H0LL && f4)return H0LL.I4(f4);};H0LL.c4=function(y4){H0LL.o64();if(H0LL && y4)return H0LL.A4(y4);};H0LL.O64();(function(factory){var j64=H0LL;var Y32="f2";var u32="amd";var G32="2";var L32="5a17";var k32="71";var E32="4";j64.O64();var Z4=E32;Z4+=H0LL[349115];Z4+=G32;Z4+=H0LL[188794];var d4=Y32;d4+=k32;j64.l4=function(j4){j64.O64();if(j64)return j64.A4(j4);};if(typeof define === (j64.c4(d4)?H0LL[418273]:H0LL[195232]) && define[j64.x4(L32)?u32:H0LL[195232]]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports === (j64.l4(Z4)?H0LL[364241]:H0LL[195232])){module.exports=function(root,$){if(!root){root=window;}if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var z6o="cr";var A2G="add";var I9o=")";var i22=12;var e9x="rt";var D4o="oter";var V32="-dat";var Q5o='"><span></span></div>';var c4G='blur';var Q7o="prototy";var x1o="eld";var y7G="ose";var C1x="aja";var E0o="n_Remove";var W2G="gt";var o4x="displayFields";var y7o="u";var b6G="node";var l32="n";var m2G="tach";var z0x="actio";var e0o="DTE_";var E3x="toLowerCase";var M6E="DTE_Form_Buttons";var T6G="ra";var H7x="_postopen";var G0G="lac";var a0G="replace";var f7G="clos";var E8G="k";var A9o="cells().ed";var Y8o="versionCheck";var H2x="]";var n8G="un";var F8x="ields";var P9E='submitComplete';var J1x="itle";var A7W="pu";var Z9o="utt";var y5o="safeId";var j1o="mode";var M5x="18n";var X7o="U";var p5o=' ';var O9x="O";var j1x='value';var H9E='Sun';var N7o="ype";var G5x="Ta";var N8o=false;var B9x="ass";var J8x="tr";var a4W="_pad";var a2x="closeIcb";var l4o="Se";var C2o='body';var W8E="ck";var U1o="bu";var m6o="nput";var Q6o="na";var S9G='div.DTE_Header';var r0o="put";var P1x='remove';var y7x="ns";var z2G=" class=\"";var v0G="repl";var K1E="Arr";var n9o="oy";var U32=500;var h9o="ototype";var r9x="_submit";var J2G="_formOptions";var Y1x='row.create()';var a4G="shift";var P1o="us";var u0G='>';var c3E='span';var d4o="h";var D3x="triggerHandler";var k5o="oApi";var D0x="_crudArgs";var b0W="minutesRange";var T9E='Hour';var k0W='disabled';var x7G="backgr";var y8x="essi";var N3G="clear";var s9o="sable";var e8x="tabl";var K7G="background";var M0G="host";var S4o="S";var Q1o="ceil";var U3G='top';var f1o="Fi";var A6E="sele";var H4o="M";var Z0o="DTE_Fo";var s7o="fieldFrom";var U1x="itor";var g0W="getUTCHours";var D3G="ov";var L3E="classPrefix";var f22=3;var o6x="idSrc";var h1x="register";var W7G="_heightCalc";var U9o="_d";var Z7x="_eventName";var t1o="splay";var z9x="one";var f9G="rHeight";var S3o="multiIds";var i3G="vent";var a32="editorField";var d2G="left";var G1o="ut";var X5o="Field";var V9G='div.DTE_Body_Content';var X0G='block';var b8G="offsetWidth";var y5G="xte";var n4o="y";var W4E="rray";var D4G="it";var K0o="DTE_Actio";var O8G="fadeIn";var E0G="rep";var E5o="name";var g5G="pend";var B7x="ction";var l1o="ie";var V2G="_close";var v2G="bubbleNodes";var t3o="sC";var x5o="labelInfo";var W0o="ield_In";var y9E="Are you sure you wish to delete %d rows?";var q4G="ss";var H6G="row";var U7x="div>";var p8o="Editor";var e6o="<s";var C2G="len";var l0G="slideDown";var X1o="bble";var i7o="ostopen";var O7E=":";var Y3E="pa";var z3E="UTC";var e5G="su";var I6G="ct";var Q5G="q";var C9o="multi";var j6o="\">";var Z3x="ode";var G8G="lay";var a1x='files()';var c2o="ble";var U4E="pare";var V8x="status";var n0x="displ";var S2G='closed';var h4o="ooter_";var E3G="ac";var M6o=">";var b4o="m";var i0W="disa";var m9o="row().ed";var B2G="gth";var q5o='<div class="';var e1o="Cont";var H5G="_f";var P3G='left';var D0o="TE ";var p4o="g";var K7E="Sr";var a1o="sett";var y1o="efa";var p32="s";var n0G="an";var w7o="es";var I1x='xhr.dt';var m22=9;var R1G="div.DTE";var G5E="ove";var O1x="fun";var P9o="totyp";var d9o="to";var Z4G="_dte";var B9W="ted";var K0x="_assembleMain";var f3G="action";var s4G="content";var B7o="ro";var T22=25;var p1o="od";var T0E="attr";var L5o="di";var h4G="lti";var J8W="momentLocale";var k9o="ot";var Q3G="sp";var x6x="\" c";var k1x='edit';var E4o="TE_H";var n3E="setUTCHou";var u9G="ppend";var p3G="tt";var H3E="nth";var J9o="dArgs";var S22=11;var c7o="ccess";var L9G="</div>";var l1x="ength";var R6o="eate";var F5x="ple";var v4E="_preopen";var g4x="inl";var o0o="Form_Error";var Q4G="_init";var V8o="th";var x4o="exten";var G7o="igh";var S5G="_edit";var I8o='"]';var E4G="eng";var s3G="create";var F9o="roto";var k0o="Edit";var I7o="pe";var y22=1;var q0o="Process";var Q32="r";var g0x="rows";var V8G="top";var h2o="ts";var G9o="clo";var J0o="E_Bubble";var Y9o="proto";var K4x="_tidy";var X0o="b";var i32="editor";var F6x="dataSources";var A1o="ls";var x4x='#';var O2G="includeFields";var b1x="labe";var F5E="format";var Z3E="ntainer";var N9o="ototyp";var l9E="Undo changes";var Y2G="liner";var H1E="Id";var l5G="isPlainObject";var U4x="template";var H3o="_multiValueCheck";var A1x="namespace";var b1G="_hide";var f7o="sub";var v3o="cus";var q9o="f";var n5G="18";var b5G="bubble";var m32="YY";var Z9x='div.';var p0x='POST';var L2o="_typeFn";var R4x="displayed";var s4o="J";var z7o="ebruary";var p2G="formInfo";var F5o="dom";var I4o="c";var a0o="cator";var D6x="ader";var U0x='number';var v6E="DTE_Label_Info";var j9o="dit";var H9o="otot";var p5G="_blur";var m3G="keyCode";var M0W="setUTCMinutes";var y32="t";var k1o="Typ";var K6E="DTE_Field_Error";var M3G="rem";var O0W="ha";var m4o="co";var v0x="multiReset";var S1o="aT";var m1o="ield";var B4o="Dece";var l3x="ur";var L0G="tring";var H7G="ni";var S7o="_p";var h9G="hasC";var N8G="fs";var X7x="but";var c6o="dte";var j2x="dataSource";var b9x="_actionClass";var L5x="_optio";var K4o="r_Content";var T2E="setU";var q1o="oller";var D2o="al";var z4o="rm";var C22=20;var R9o="otyp";var c9o="rows().delet";var D3E="_setTime";var w7x="multiGet";var U3o="Info";var Q0o="E_F";var k6x="ass=\"";var W5o=null;var f0o="multi-";var Y0o="ion_";var G5G="ajax";var B9E='Thu';var h6E="DTE_Processing_Indicator";var I5o="className";var G5o="data";var G9G="end";var D6E="DTE_Field_Type_";var S32="-DD";var W8o="do";var s3o="_e";var q8G="per";var q2x="closeCb";var g9E='Minute';var b2o="classes";var s2o="ror";var D5G="valFromData";var b8x="fieldErrors";var k3G="empty";var l6G="ow";var t6x="<div ";var r1x="load";var c0E="_legacyAjax";var R1o="sit";var i0E="opti";var b1o="Dat";var O5G="open";var s6E="ton";var A9E="Delete";var i2G="click";var a1G="pp";var U9G="la";var l0E="ting";var K3G="mit";var W0x="bject";var l9o="()";var L7W="firstDay";var J7G="_r";var l0o="mult";var t1G="unbind";var s7W='<tbody>';var K1x="confirm";var j0o="store";var Y6G="tent";var d3G="blo";var X8x="upl";var c0o="ed";var J9W="Prefix";var V7o="_mu";var D1o="ax";var F9x="nctio";var m0o="i-";var R8W="rents";var A5o="label";var q9x="sl";var q32="dType";var U4o="Content";var g9o="iles";var k6E="DTE_Inline_Buttons";var A3o="slideUp";var C8x="ub";var l5o="input";var i4o="Fr";var I9x='-';var m1G="_show";var O0o="DTE_Fi";var L7o="yp";var u8G="et";var N6G="isA";var v6o="</";var Q9W='</span>';var M5o="defaults";var N5G="mess";var N9E='pm';var I2G="buttons";var R7o="N";var U3x="lt";var L4W="tUT";var i9E='May';var V22=13;var e7x="indexOf";var G3G="i18";var Y6E="DTE DTE_Inline";var x4G='all';var Q7x='create';var u6E="DTE_Bubble_Background";var b3o="multiValues";var T9o="hi";var n7o="de";var Z9G="appe";var p9G="ldren";var S1G="wra";var E6E="DTE_Field_Message";var z1o="bubblePo";var v5o="fieldTypes";var b22=10;var E4x="_dataSource";var z7G="wrapper";var H0G="move";var Y7o="tbo";var u1x='cell().edit()';var f9x="edit";var S0o="fo";var O4o="W";var i9o="ho";var Z32="ic";var H3x="ubmit";var z9o="rot";var j3G="button";var O2o="conta";var s32="eTi";var d4x="butt";var d32="e_Triangle";var L9x="orde";var S2E="_o";var d4W="<t";var Z22=60;var J1G='click.DTED_Lightbox';var C32="ime";var f32="torFields";var V4o="i";var Z6o="op";var W3E="ar";var m7x='inline';var C0G="tainer";var o6G="_da";var J6E="DTE_Label";var o32="me";var t6E="DTE_Field_Name_";var C6o="lass";var S9x="_event";var Y0G="repla";var n0o="_Form_";var d22=59;var c4o="mo";var P5x="tor";var r9o="fi";var t4W="getUTCFullYear";var u0o="te";var s9x="emp";var P8o='';var u7x="ptions";var T6x="class";var E5G="splice";var Z2o="nt";var W0E="acti";var x2x="all";var L1G="tend";var V3o="val";var O9o="ope";var D1G="ach";var u4E='preOpen';var S9E='April';var R9G="app";var X32=550;var U0o="_Bubble_Ta";var e9E="bServerSide";var Z8E="key";var A0o="a";var c5x="_ajax";var L4G="ti";var r01="CLASS";var C8G="off";var F3o="ock";var s5o="no";var B0o="DTE_Field";var C7x="tion";var Y6o="<";var F4o="Mar";var E4W="getFullYear";var t2o="focus";var y9G="ght";var y0E='keydown';var D9o="_c";var r9G="nf";var o3E="hours12";var R9x="_ev";var b0o="in";var h5o="i18n";var F4E='changed';var y6G="abl";var o9o="str";var U2o="hasClass";var m9E="This input can be edited individually, but not part of a group.";var P0o="DTE_Inli";var F5G="itl";var X9o="ataSource";var V0W="bled";var c22=2;var e4x="_message";var v4o="TE_Heade";var G0x="undependent";var W2E="_dateToUtc";var v0o="ne_Field";var f5G="Object";var J1o="oc";var M4x="unique";var g9x="_processing";var a2G="title";var Z4o="F";var s6G="tFi";var z1G="ndTo";var q8o="_constructor";var q4o="chan";var n3o="ne";var l1G="en";var u0E="nE";var h1o="ion";var Z7G='div.DTED_Lightbox_Content_Wrapper';var R7E="onComplete";var m0W='minutes';var i5G='bubble';var M1G="_animate";var x2o="as";var Z7o="ntNa";var n5E="moment";var a0x='json';var w6G="ini";var n2o="erro";var a9E="Create new entry";var y8G="yl";var C9E='Tue';var o7o="No";var k7x="conte";var P5o="settings";var Z5G="<div class=";var h2x="mat";var u4o="ions";var v1o="lose";var T0x='data';var R4o="DTE_F";var z32=100;var t7G="nte";var V9o="oty";var K2G="concat";var r2o="container";var o4o="ul";var G6E="multi-noEdit";var O7o="ltiIn";var Y2o="slice";var j4o="d";var x9E="Multiple values";var a9x="join";var X5x="TableTools";var a7x="find";var F2o="ad";var a4o="asi";var z5o="nd";var o4G="children";var m6G="modifier";var r0W='hours';var d0G="fu";var Q9o="fie";var R7x="v.";var q9W='option:selected';var D8G="ma";var y8o="file";var W8G="at";var K2x="_clearDynamicInfo";var a9o="e(";var k2G='"></div>';var G3o="om";var k1E="indexes";var q2G="formError";var x22=4;var x0G="lengt";var W5x="cre";var l9G="dd";var S0W='seconds';var z4W="setUTCMonth";var r4o="A";var x9o="rows().";var M5G="editFields";var B6o="=\"";var Q4o="er";var K0G="ce";var w5G="<div";var R3o="error";var e9G="ound";var C2E="minDate";var G2o="ll";var A2o="def";var q3E="date";var t4o="TE";var A0x="pos";var R0o=" clos";var s0G="submit";var L0o="TE_Action_Crea";var Z8o="ext";var A22=0;var w4E="mData";var C7W='<tr>';var C0o="d_Info";var T5G="pre";var g2G="ft";var y4G='submit';var C3x="submi";var V2o="pla";var b9E='January';var O8o="ng";var U7o="vious";var D9G="_dt";var w8G="asClass";var h3o="_msg";var o3x="editCount";var h32=400;var t0x='main';var P6E="DTE_Field_InputControl";var I4G="models";var P2E='</button>';var N32="ta";var r8x="Ed";var Q8x="_l";var E6o="res";var v7o="l";var T2o="Fn";var u5G="editOpts";var B9G="wrap";var w01="version";var b9G="conf";var r3o="inArray";var i1o="1";var j4x="inError";var L9o="otype";var f4x="ids";var e7o="ubmitE";var E9o="rototype";var u4x="enable";var W7o="fieldN";var E1o="els";var m2o="ner";var N4o="ber";var U9x="ppe";var q2o="opts";var r5x="split";var d7o="_eve";var p4G="li";var B2o='none';var n4G="close";var B5o='</div>';var t7o="Cr";var k5G="func";var X2o="disabled";var V9W="class=\"";var F0G="ren";var f4G='close';var t7x=" ";var i9G='div.DTE_Footer';var a5x="emo";var L6o="v>";var Y5G="subm";var s0x="url";var e2E='-time';var o7G="bind";var t0o="DT";var z3o="ainer";var F7o="toty";var I9E="Edit entry";var V2E="maxDate";var x2G="ev";var b0G="set";var y0o="bl";var B0x="ws";var e5o="_fnSetObjectDataFn";var M0x="elds";var o3o="ve";var k4o="T";var Q0G="alue";var w0G="ds";var H0o="el";var g8x="_limitLeft";var G4W="getDate";var X1G="remove";var q8E="d=\"";var e3x="activeElement";var t9o="ru";var U6x="></div>";var E7o="DT_RowI";var j3o="html";var D7o="ate";var h4x="bod";var k0E="tur";var H8o="obj";var p9o="il";var K9o="seReg";var Q8o=true;var W32="oto";var c9x="for";var E2o="ca";var v8W="datetime";var L3G="up";var l22=7;var v4x="displayNode";var B7W='</tr>';var Y5x="_edi";var X9G="target";var f7x="_clearDyna";var N4x="ata";var T32="nce";var p7o="pro";var u5o="_fnGetObjectDataFn";var A6G="att";var G0W="stopPropagation";var i0o="va";var b3G="call";var n5o='display';var a2o="io";var q4W="getU";var O9E='October';var o1x="ain";var p6G="rap";var S1x="value";var c7G="tle";var X4o="TE_";var R0G="ing";var Y0E="Re";var M7o="pd";var e9o="rs";var U6E="DTE_Body_Content";var P4o="dy";var o6o="v";var P7o="C";var B8o="length";var t3E="sel";var j4G="onf";var K6o="iv";var r32="type";var y4o="ons";var L6E="DTE_Bubble_Liner";var b4E="Name";var i3o="isMultiValue";var P1E="olumns";var Z8G="ht";var U5o="extend";var N6x="las";var P8W="trigger";var C7o="ge";var Y2x="age";var h0o="DTE";var H2o="parents";var H9x="pts";var c3G="text";var I4W="ck.";var H8x="ex";var V9E='June';var j2E="mp";var k7E="pi";var q9G="chi";var v2o="each";var G1G="/";var s5x="ind";var Q9G="of";var S4W="/t";var n32="D";var h7G="cs";var z0o="on";var t9E="ou";var z6x="ter";var q1G="displayController";var A3x="sa";var K7o="os";var J4W="getUTCDate";var G7G="ight";var J4o="_Bo";var a7o="tot";var a6G="reat";var q0G='&';var W3G="ice";var f8o=" t";var D4x="eac";var x9G="rappe";var m9G="height";var K3o="cu";var f3o="isplay";var J0x="form";var y9o="it()";var O8x="ngth";var d6G="fields";var w5o="prepend";var S0E="options";var I6o="tit";var t4G="cla";var w4G="_dom";var Y1o="field";var s6o="Data";var S7G="wr";var g8o="jec";var t4x="_fieldNames";var r6x="Table";var r7o="am";var w4x="ch";var F32="TE_Bubbl";var v7E="Error";var M7E="_pro";var L4o="formOpt";var F4G="own";var n1G="style";var d0o="nfo";var K5x="bodyContent";var P4x="map";var a3G="ml";var o7W='</tbody>';var L0E="preventDefault";var I7x='.';var X7G="div";var m4E="creat";var a3E="remov";var p7E="rr";var B3G="appendTo";var k4E="act";var M9x="ler";var X6o="\"";var M0o="le";var w9o="typ";var o5o="css";var F3E="fin";var c0G="multiValue";var b5o="multiInfo";var C5o="message";var Z4x="lace";var q1x="ect";var m9x="ngt";var s5G=" cl";var x7o="mitT";var L5E="DateTime";var T7G="addClass";var j2o="con";var I0x="rocessing";var x0o="re";var e6x="</di";var S9o="r()";var i6o="/d";var W9o="ld";var u7o="_s";var Z3o="ay";var g0o="or";var m8x="pload";var c32="edi";var i2o="is";var V0o="lue";var m5G='boolean';var A7x="butto";var i1x="upload";var w7E='id';var d4G="show";var M1o="aj";var X4G="st";var g7o="foc";var I4x="globalError";var j9E="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var l7G="animate";var u3x="lur";var A32="x";var J6x="dat";var L1E="cell";var W4o="temb";var U3E="np";var d3o="pl";var f9o="e()";var w0E="ff";var a7G="click.DTED";var Y3G="isArray";var l6o="</div";var O3G="prev";var I0o="dis";var t2G="_pr";var B9o="rototy";var K5G="order";var I1o="ings";var k7o="protot";var j32="8";var n7G="ba";var C4x="nl";var f1x="exte";var s0o="_";var J7o="w";var s01="1.9.5";var i8o="leng";var b0E="_optionsUpdate";var j7o="able";var N7G="bo";var k2o="unshift";var F6o="da";var f4o="dels";var E8E="-";var K7x="s=\"";var e4o="xtend";var b32="YY-MM";var b9o="edito";var k4x="_for";var R2E="<d";var u1o="display";var q6G="und";var B32="_ins";var f9E="A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var c9E="Are you sure you wish to delete 1 row?";var O32="etime";var i7G="apper";var G0o="E_Act";var R3G="lo";var t5G="multiSet";var u9o="safeI";var p2o="unct";var G9x="_even";var A4G="formOptions";var y6o="<div data-";var w4o="ugust";var T0o="ateErr";var c1o="ults";var P0x="_displayReorder";var M4o="Fo";var S0G="compare";var G4o="ea";var X6E="DTE_Form_Content";var U0G="processing";var j1G="cont";var N0o="_St";var l7o="pr";var b7o="ty";var A3G="orm";var h7o="Pre";var i9W="<button ";var R4W='month';var O6o="abel";var P7x="ss=\"";var A8E="filter";var W01="itorFields";var q5G="blur";var z6G="ap";var e32="fiel";var L1x='row().delete()';var e2o="prototype";var q3x="setFocus";var K1o="cl";var c5o="id";var F0o="I";var Q2o="removeClass";var m7o="totype";var L8o="1.10.7 or newer";var h0G="spl";var T7o="prot";var f5o='">';var C8o="ec";var g4o="em";var c2E="calendar";var C7G="aut";var y3G='string';var c1W="_option";var b5E="</d";var E7x="idt";var h6o="_ty";var x32="i1";var G8o="dataTable";var Q4x="xt";var Q6G="lds";var Q9E='action';var V1o=".10";var t0G="ent";var I5x="reate";var w0o="E";var R1W="onth";var y4E="_noProcessing";var u2o="apply";var D5x="BUTTONS";var l8o="files";var e1E="nodeName";var y2G="_closeReg";var r0x="j";var g32="p";var N22=24;var I32="e";var w32="Da";var c7x=".";var A8o="push";var q0W="getUTCMonth";var E5x='processing';var N7E="ess";var g22=27;var x6G="table";var X6G="he";var n2x='row';var q7o="rror";var B8x="ame";var K8W='en';var v1x="8n";var H32="DateT";var m0G="get";var B3o="mu";var u0x="dependent";var t2x="funct";var o5x="exOf";var d6x="body";var E8o="fn";var N8x="err";var M7x="tons";var i4x="inline";var T4o="Nov";var p1G="se";var x3o="detach";var O1o=".7";var a1W="getUTC";var M3E="_setCalander";var N2o="ab";var z2o='click';var O2x="_weakInArray";var x5G="_t";var L1o="model";var K3E="_op";var o8o="ue";var A4W="ody";var l3o="append";var z3G="width";var d7x="sArray";var v8o='s';var A7o="_submitS";var p0o="ing_Indi";var H7o="essa";var v9o="_clo";var C4o="o";var M9o="ototy";var m1x="ttr";var F2G="tto";var C6G="disp";var Y4o="der";var k8o="Editor requires DataTables ";var H0x="tio";var j6G="eader";var s3E="parts";var A4o="formOpti";var I22=e32;I22+=q32;I22+=p32;var a22=a32;a22+=p32;var p22=I32;p22+=A32;p22+=y32;var u22=c32;u22+=f32;var L22=I32;L22+=A32;L22+=y32;var l42=x32;l42+=j32;l42+=l32;var j42=m32;j42+=b32;j42+=S32;var x42=i32;x42+=V32;x42+=O32;var f42=H32;f42+=C32;var c42=B32;c42+=N32;c42+=T32;var k8C=g32;k8C+=Q32;k8C+=W32;k8C+=r32;var Y8C=w32;Y8C+=y32;Y8C+=s32;Y8C+=o32;var j7C=n32;j7C+=F32;j7C+=d32;var x7C=Z32;x7C+=z0o;x7C+=R0o;x7C+=I32;var f7C=h0o;f7C+=U0o;f7C+=X0o;f7C+=M0o;var c7C=n32;c7C+=D0o;c7C+=t0o;c7C+=J0o;var y7C=P0o;y7C+=v0o;var A7C=K0o;A7C+=E0o;var I7C=t0o;I7C+=G0o;I7C+=Y0o;I7C+=k0o;var a7C=n32;a7C+=L0o;a7C+=u0o;var p7C=e0o;p7C+=q0o;p7C+=p0o;p7C+=a0o;var q7C=I0o;q7C+=A0o;q7C+=y0o;q7C+=c0o;var e7C=f0o;e7C+=x0o;e7C+=j0o;var u7C=l0o;u7C+=m0o;u7C+=b0o;u7C+=S0o;var L7C=f0o;L7C+=i0o;L7C+=V0o;var k7C=O0o;k7C+=H0o;k7C+=C0o;var Y7C=B0o;Y7C+=N0o;Y7C+=T0o;Y7C+=g0o;var G7C=t0o;G7C+=Q0o;G7C+=W0o;G7C+=r0o;var E7C=X0o;E7C+=y32;E7C+=l32;var K7C=X0o;K7C+=y32;K7C+=l32;var v7C=t0o;v7C+=w0o;v7C+=s0o;v7C+=o0o;var P7C=h0o;P7C+=n0o;P7C+=F0o;P7C+=d0o;var J7C=Z0o;J7C+=z4o;var t7C=R4o;t7C+=h4o;t7C+=U4o;var D7C=n32;D7C+=X4o;D7C+=M4o;D7C+=D4o;var M7C=n32;M7C+=t4o;M7C+=J4o;M7C+=P4o;var X7C=n32;X7C+=v4o;X7C+=K4o;var U7C=n32;U7C+=E4o;U7C+=G4o;U7C+=Y4o;var h7C=n32;h7C+=k4o;h7C+=w0o;var L3q=L4o;L3q+=u4o;var k3q=I32;k3q+=e4o;var Y3q=q4o;Y3q+=p4o;Y3q+=c0o;var G3q=s0o;G3q+=X0o;G3q+=a4o;G3q+=I4o;var E3q=A4o;E3q+=y4o;var K3q=c4o;K3q+=f4o;var v3q=x4o;v3q+=j4o;var P3q=l4o;P3q+=m4o;P3q+=l32;P3q+=j4o;var J3q=A0o;J3q+=b4o;var t3q=S4o;t3q+=A0o;t3q+=y32;var D3q=i4o;D3q+=V4o;var M3q=O4o;M3q+=I32;M3q+=j4o;var X3q=H4o;X3q+=C4o;X3q+=l32;var U3q=B4o;U3q+=b4o;U3q+=N4o;var h3q=T4o;h3q+=g4o;h3q+=X0o;h3q+=Q4o;var R3q=l4o;R3q+=g32;R3q+=W4o;R3q+=Q4o;var z3q=r4o;z3q+=w4o;var Z2q=s4o;Z2q+=o4o;Z2q+=n4o;var d2q=F4o;d2q+=I4o;d2q+=d4o;var F2q=Z4o;F2q+=z7o;var n2q=R7o;n2q+=I32;n2q+=A32;n2q+=y32;var o2q=h7o;o2q+=U7o;var s2q=X7o;s2q+=M7o;s2q+=D7o;var w2q=t7o;w2q+=I32;w2q+=D7o;var r2q=R7o;r2q+=I32;r2q+=J7o;var W2q=P7o;W2q+=v7o;W2q+=K7o;W2q+=I32;var Q2q=E7o;Q2q+=j4o;var g2q=v7o;g2q+=G7o;g2q+=Y7o;g2q+=A32;var f2q=k7o;f2q+=L7o;f2q+=I32;var I2q=u7o;I2q+=e7o;I2q+=q7o;var a2q=p7o;a2q+=a7o;a2q+=n4o;a2q+=I7o;var G5q=A7o;G5q+=y7o;G5q+=c7o;var d6q=s0o;d6q+=f7o;d6q+=x7o;d6q+=j7o;var v6q=l7o;v6q+=C4o;v6q+=m7o;var t6q=l7o;t6q+=W32;t6q+=b7o;t6q+=I7o;var m8q=S7o;m8q+=i7o;var x8q=V7o;x8q+=O7o;x8q+=S0o;var L8q=s0o;L8q+=b4o;L8q+=H7o;L8q+=C7o;var k8q=g32;k8q+=B7o;k8q+=a7o;k8q+=N7o;var v8q=g32;v8q+=B7o;v8q+=a7o;v8q+=N7o;var U8q=T7o;U8q+=C4o;U8q+=b7o;U8q+=I7o;var U1q=s0o;U1q+=g7o;U1q+=y7o;U1q+=p32;var h1q=Q7o;h1q+=I7o;var z1q=s0o;z1q+=W7o;z1q+=r7o;z1q+=w7o;var o9q=s0o;o9q+=s7o;o9q+=o7o;o9q+=n7o;var s9q=p7o;s9q+=F7o;s9q+=I7o;var Q9q=d7o;Q9q+=Z7o;Q9q+=o32;var g9q=g32;g9q+=z9o;g9q+=R9o;g9q+=I32;var r7q=l7o;r7q+=h9o;var g7q=U9o;g7q+=X9o;var T7q=l7o;T7q+=M9o;T7q+=I7o;var H7q=D9o;H7q+=t9o;H7q+=J9o;var O7q=p7o;O7q+=P9o;O7q+=I32;var V7q=v9o;V7q+=K9o;var i7q=g32;i7q+=E9o;var y7q=s0o;y7q+=G9o;y7q+=p32;y7q+=I32;var A7q=Y9o;A7q+=r32;var x4q=l7o;x4q+=W32;x4q+=y32;x4q+=N7o;var L4q=l7o;L4q+=k9o;L4q+=L9o;var T38=k7o;T38+=N7o;var q28=u9o;q28+=j4o;var K28=g32;K28+=A0o;K28+=V4o;K28+=e9o;var v28=I32;v28+=q7o;var t28=C4o;t28+=l32;var D28=q9o;D28+=p9o;D28+=a9o;D28+=I9o;var M28=A9o;M28+=y9o;var h28=c9o;h28+=f9o;var z28=x9o;z28+=I32;z28+=j9o;z28+=l9o;var d58=m9o;d58+=y9o;var n58=b9o;n58+=S9o;var g58=r4o;g58+=g32;g58+=V4o;var I58=p32;I58+=i9o;I58+=J7o;var a58=l7o;a58+=k9o;a58+=V9o;a58+=I7o;var e58=p32;e58+=I32;e58+=y32;var u58=g32;u58+=E9o;var W68=g0o;W68+=j4o;W68+=Q4o;var Q68=T7o;Q68+=k9o;Q68+=n4o;Q68+=I7o;var c68=O9o;c68+=l32;var A68=T7o;A68+=V9o;A68+=I7o;var a68=C4o;a68+=q9o;a68+=q9o;var p68=l7o;p68+=H9o;p68+=L7o;p68+=I32;var v68=C9o;v68+=l4o;v68+=y32;var P68=l7o;P68+=M9o;P68+=g32;P68+=I32;var Z88=b4o;Z88+=H7o;Z88+=C7o;var X88=Y9o;X88+=y32;X88+=L7o;X88+=I32;var z88=g32;z88+=B9o;z88+=I7o;var Z18=l7o;Z18+=N9o;Z18+=I32;var o18=T9o;o18+=j4o;o18+=I32;var Q18=k7o;Q18+=L7o;Q18+=I32;var g18=q9o;g18+=g9o;var T18=l7o;T18+=H9o;T18+=N7o;var N18=Q9o;N18+=W9o;N18+=p32;var C18=r9o;C18+=I32;C18+=W9o;var H18=l7o;H18+=W32;H18+=w9o;H18+=I32;var b18=T7o;b18+=L9o;var j18=p7o;j18+=y32;j18+=L9o;var I18=c0o;I18+=V4o;I18+=y32;var p18=g32;p18+=B7o;p18+=m7o;var e18=Q7o;e18+=g32;e18+=I32;var G18=j4o;G18+=V4o;G18+=s9o;var E18=Q7o;E18+=I7o;var U18=n7o;U18+=o9o;U18+=n9o;var y98=g32;y98+=F9o;y98+=r32;var J98=p7o;J98+=m7o;var Z78=p7o;Z78+=d9o;Z78+=r32;var l78=X0o;l78+=Z9o;l78+=y4o;var D78=z1o;D78+=R1o;D78+=h1o;var M78=p7o;M78+=y32;M78+=V9o;M78+=I7o;var P48=U1o;P48+=X1o;var J48=p7o;J48+=P9o;J48+=I32;var t48=g32;t48+=z9o;t48+=V9o;t48+=I7o;var R48=l7o;R48+=H9o;R48+=L7o;R48+=I32;var z48=M1o;z48+=D1o;var i08=A0o;i08+=j4o;i08+=j4o;var S08=l7o;S08+=k9o;S08+=k9o;S08+=N7o;var j6=j4o;j6+=V4o;j6+=t1o;var x6=Q32;x6+=C4o;x6+=J7o;var f6=q9o;f6+=J1o;f6+=P1o;var c6=I4o;c6+=v1o;var y6=K1o;y6+=C4o;y6+=p32;y6+=I32;var A6=b4o;A6+=C4o;A6+=j4o;A6+=E1o;var I6=X0o;I6+=G1o;I6+=d9o;I6+=l32;var a6=c4o;a6+=j4o;a6+=H0o;a6+=p32;var p6=Y1o;p6+=k1o;p6+=I32;var q6=L1o;q6+=p32;var e6=u1o;e6+=e1o;e6+=Q32;e6+=q1o;var u6=c4o;u6+=f4o;var L6=b4o;L6+=p1o;L6+=H0o;L6+=p32;var k6=a1o;k6+=I1o;var Y6=b4o;Y6+=p1o;Y6+=I32;Y6+=A1o;var G6=Z4o;G6+=V4o;G6+=H0o;G6+=j4o;var E6=y32;E6+=I32;E6+=A32;E6+=y32;var K6=j4o;K6+=y1o;K6+=c1o;var v6=f1o;v6+=x1o;var P6=j1o;P6+=v7o;P6+=p32;var J6=Z4o;J6+=l1o;J6+=v7o;J6+=j4o;var c7=Z4o;c7+=m1o;var G7=b1o;G7+=S1o;G7+=j7o;var v7=i1o;v7+=V1o;v7+=O1o;'use strict';H0LL.W4=function(Q4){if(H0LL)return H0LL.I4(Q4);};H0LL.i4=function(S4){if(H0LL)return H0LL.A4(S4);};(function(){var H54=H0LL;var n1o="pired";var C1o="5";var N1o="getTi";var g1o="c36";var U8o="7cd4";var M8o="9";var h8o='for Editor, please see https://editor.datatables.net/purchase';var D8o="log";var F1o="Your trial has now expired. To purchas";var n22=41;var J32=6953;var T1o="7fe";var J8o=' day';var D32=1000;H54.o64();var v32=1608163200;var H1o="78";var K32=2579511656;var B1o="55";var R8o="or\n\n";var W1o="c353";var o1o="ditor - Trial ex";var K8o=' remaining';var r1o="8545";var t32=2798;var d1o="e a license ";var X8o="153";var z8o="bles Edit";var Z1o="Thank you for trying DataTa";var t8o='DataTables Editor trial info - ';var w1o="getTime";var s1o="cc94";var X7=H1o;X7+=q9o;X7+=C1o;var U7=X0o;U7+=q9o;U7+=B1o;var h7=N1o;h7+=o32;var R7=T1o;R7+=H0LL[349115];var z7=q9o;z7+=g1o;H54.N4=function(B4){H54.o64();if(H54)return H54.A4(B4);};H54.C4=function(H4){H54.O64();if(H54)return H54.A4(H4);};H54.b4=function(m4){if(H54 && m4)return H54.I4(m4);};var remaining=Math[H54.b4(z7)?H0LL[195232]:Q1o]((new Date((H54.i4(W1o)?v32:K32) * (H54.O4(R7)?J32:D32))[H54.C4(r1o)?H0LL[195232]:h7]() - new Date()[w1o]()) / ((H54.N4(U7)?t32:D32) * (H54.g4(s1o)?Z22:n22) * Z22 * N22));if(remaining <= (H54.W4(X7)?A22:l22)){var J7=w0o;J7+=o1o;J7+=n1o;var t7=F1o;t7+=d1o;var D7=Z1o;D7+=z8o;D7+=R8o;var M7=I4o;M7+=H0LL[188794];M7+=q9o;M7+=A0o;H54.w4=function(r4){H54.O64();if(H54)return H54.I4(r4);};alert((H54.w4(M7)?H0LL[195232]:D7) + t7 + h8o);throw J7;}else if(remaining <= (H54.o4(U8o)?m22:l22)){var P7=X8o;P7+=M8o;console[H54.F4(P7)?H0LL[195232]:D8o](t8o + remaining + J8o + (remaining === y22?P8o:v8o) + K8o);}})();var DataTable=$[E8o][G8o];if(!DataTable || !DataTable[Y8o] || !DataTable[Y8o](v7)){var K7=k8o;K7+=L8o;throw new Error(K7);}var Editor=function(opts){var u8o="DataTa";var e8o="bles Editor must be initialised as a 'new' instance'";if(!(this instanceof Editor)){var E7=u8o;E7+=e8o;alert(E7);}this[q8o](opts);};DataTable[p8o]=Editor;$[E8o][G7][p8o]=Editor;var _editor_el=function(dis,ctx){H0LL.o64();var a8o='*[data-dte-e="';if(ctx === undefined){ctx=document;}return $(a8o + dis + I8o,ctx);};var __inlineCounter=A22;var _pluck=function(a,prop){H0LL.o64();var Y7=G4o;Y7+=I4o;Y7+=d4o;var out=[];$[Y7](a,function(idx,el){out[A8o](el[prop]);});return out;};var _api_file=function(name,id){var j8o='Unknown file id ';var x8o="able ";var c8o=" in";var k7=y8o;k7+=p32;var table=this[k7](name);var file=table[id];if(!file){var L7=c8o;L7+=f8o;L7+=x8o;throw j8o + id + L7 + name;}return table[id];};var _api_files=function(name){var m8o="nknown file table name: ";var u7=q9o;u7+=g9o;if(!name){return Editor[l8o];}var table=Editor[u7][name];if(!table){var e7=X7o;e7+=m8o;throw e7 + name;}return table;};var _objectKeys=function(o){var S8o="operty";var b8o="hasOwnPr";var out=[];for(var key in o){var q7=b8o;q7+=S8o;if(o[q7](key)){var p7=g32;p7+=P1o;p7+=d4o;out[p7](key);}}return out;};var _deepCompare=function(o1,o2){H0LL.o64();var T8o="ob";var A7=i8o;A7+=V8o;var I7=M0o;I7+=O8o;I7+=y32;I7+=d4o;var a7=H8o;a7+=C8o;a7+=y32;if(typeof o1 !== a7 || typeof o2 !== H0LL[364241]){return o1 == o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[I7] !== o2Props[B8o]){return N8o;}for(var i=A22,ien=o1Props[A7];i < ien;i++){var y7=T8o;y7+=g8o;y7+=y32;var propName=o1Props[i];if(typeof o1[propName] === y7){if(!_deepCompare(o1[propName],o2[propName])){return N8o;}}else if(o1[propName] != o2[propName]){return N8o;}}return Q8o;};Editor[c7]=function(opts,classes,host){var r5o='input-control';var P6o="msg-err";var d6o="taPr";var j5o='</label>';var H6o="<div data-dte-e=\"msg-label\" c";var Y5o="dataProp";var Z5o='multi-info';var w6o="valTo";var S5o='<div data-dte-e="msg-multi" class="';var t6o="msg-info\" class=\"";var r6o="rapp";var i5o="multiRestore";var t5o="r adding";var k6o="/di";var T6o="<label da";var m5o='<div data-dte-e="input-control" class="';var N5o='msg-info';var W6o="typePrefi";var s8o="ulti-val";var A6o="iVal";var f6o="-e=\"multi-";var a6o="lti-info\" class=\"";var S6o="input\" class=\"";var x6o="value\" class=\"";var d8o="odels";var K5o='DTE_Field_';var N6o=" for=\"";var g5o='<div data-dte-e="field-processing" class="';var V5o='<div data-dte-e="msg-error" class="';var O5o='<div data-dte-e="msg-message" class="';var r8o="ld-processi";var G6o="tore";var R5o="ldTypes";var J5o=" field - unknown field type ";var n6o="alFromD";var F8o="be";var w8o="msg-mult";var J2o="multiReturn";var T5o="fieldInfo";var U6o="ocessing";var n8o="msg-labe";var d5o='msg-error';var V6o="msg-l";var D5o="Erro";var D6o="<div data-dte-e=\"";var b6o="ontrol";var J6o="></div";var g6o="ta-dte-e=\"label\" class=\"";var a5o="namePrefix";var H5o='msg-message';var q6o="pan data";var u6o="/span>";var p6o="-dte-e=\"mu";var O9=C4o;O9+=l32;var m9=W8o;m9+=b4o;var l9=Q9o;l9+=r8o;l9+=O8o;var j9=w8o;j9+=V4o;var x9=b4o;x9+=s8o;x9+=o8o;var f9=n8o;f9+=v7o;var c9=v7o;c9+=A0o;c9+=F8o;c9+=v7o;var y9=W8o;y9+=b4o;var A9=b4o;A9+=d8o;var I9=Z4o;I9+=V4o;I9+=H0o;I9+=j4o;var a9=Z8o;a9+=I32;a9+=l32;a9+=j4o;var q9=z6o;q9+=R6o;var e9=h6o;e9+=I7o;e9+=Z4o;e9+=l32;var u9=l7o;u9+=U6o;var L9=X6o;L9+=M6o;var k9=D6o;k9+=t6o;var Y9=X6o;Y9+=M6o;var G9=X6o;G9+=J6o;G9+=M6o;var E9=P6o;E9+=g0o;var K9=v6o;K9+=j4o;K9+=K6o;K9+=M6o;var v9=E6o;v9+=G6o;var P9=X6o;P9+=M6o;var J9=Y6o;J9+=k6o;J9+=L6o;var t9=Y6o;t9+=u6o;var D9=b0o;D9+=S0o;var M9=e6o;M9+=q6o;M9+=p6o;M9+=a6o;var X9=I6o;X9+=M0o;var U9=X6o;U9+=M6o;var h9=l0o;h9+=A6o;h9+=o8o;var R9=y6o;R9+=c6o;R9+=f6o;R9+=x6o;var z9=j6o;z9+=l6o;z9+=M6o;var Z7=V4o;Z7+=m6o;Z7+=P7o;Z7+=b6o;var d7=X6o;d7+=M6o;var F7=D6o;F7+=S6o;H0LL.O64();var n7=Y6o;n7+=i6o;n7+=K6o;n7+=M6o;var o7=V6o;o7+=O6o;var s7=H6o;s7+=C6o;s7+=B6o;var w7=X6o;w7+=M6o;var r7=X6o;r7+=N6o;var W7=T6o;W7+=g6o;var Q7=X6o;Q7+=M6o;var g7=Q6o;g7+=b4o;g7+=I32;var T7=W6o;T7+=A32;var N7=J7o;N7+=r6o;N7+=I32;N7+=Q32;var B7=w6o;B7+=s6o;var H7=o6o;H7+=n6o;H7+=A0o;H7+=N32;var O7=F6o;O7+=d6o;O7+=Z6o;var i7=V4o;i7+=j4o;var S7=Q6o;S7+=b4o;S7+=I32;var b7=f1o;b7+=I32;b7+=v7o;b7+=j4o;var m7=I32;m7+=A32;m7+=u0o;m7+=z5o;var x7=y32;x7+=n4o;x7+=g32;x7+=I32;var f7=Q9o;f7+=R5o;var that=this;var multiI18n=host[h5o][C9o];opts=$[U5o](Q8o,{},Editor[X5o][M5o],opts);if(!Editor[f7][opts[x7]]){var l7=y32;l7+=n4o;l7+=I7o;var j7=D5o;j7+=t5o;j7+=J5o;throw j7 + opts[l7];}this[p32]=$[m7]({},Editor[b7][P5o],{type:Editor[v5o][opts[r32]],name:opts[S7],classes:classes,host:host,opts:opts,multiValue:N8o});if(!opts[i7]){var V7=V4o;V7+=j4o;opts[V7]=K5o + opts[E5o];}if(opts[O7]){opts[G5o]=opts[Y5o];}if(opts[G5o] === P8o){opts[G5o]=opts[E5o];}var dtPrivateApi=DataTable[Z8o][k5o];this[H7]=function(d){var C7=I32;C7+=L5o;C7+=d9o;C7+=Q32;return dtPrivateApi[u5o](opts[G5o])(d,C7);};this[B7]=dtPrivateApi[e5o](opts[G5o]);var template=$(q5o + classes[N7] + p5o + classes[T7] + opts[r32] + p5o + classes[a5o] + opts[g7] + p5o + opts[I5o] + Q7 + W7 + classes[A5o] + r7 + Editor[y5o](opts[c5o]) + w7 + opts[A5o] + s7 + classes[o7] + f5o + opts[x5o] + n7 + j5o + F7 + classes[l5o] + d7 + m5o + classes[Z7] + z9 + R9 + classes[h9] + U9 + multiI18n[X9] + M9 + classes[b5o] + f5o + multiI18n[D9] + t9 + J9 + S5o + classes[i5o] + P9 + multiI18n[v9] + K9 + V5o + classes[E9] + G9 + O5o + classes[H5o] + Y9 + opts[C5o] + B5o + k9 + classes[N5o] + L9 + opts[T5o] + B5o + B5o + g5o + classes[u9] + Q5o + B5o);var input=this[e9](q9,opts);if(input !== W5o){_editor_el(r5o,template)[w5o](input);}else {var p9=s5o;p9+=l32;p9+=I32;template[o5o](n5o,p9);}this[F5o]=$[a9](Q8o,{},Editor[I9][A9][y9],{container:template,inputControl:_editor_el(r5o,template),label:_editor_el(c9,template),fieldInfo:_editor_el(N5o,template),labelInfo:_editor_el(f9,template),fieldError:_editor_el(d5o,template),fieldMessage:_editor_el(H5o,template),multi:_editor_el(x9,template),multiReturn:_editor_el(j9,template),multiInfo:_editor_el(Z5o,template),processing:_editor_el(l9,template)});this[m9][C9o][z0o](z2o,function(){var R2o="multiEditabl";var M2o='readonly';var i9=b7o;i9+=g32;i9+=I32;var S9=R2o;S9+=I32;var b9=Z6o;b9+=h2o;if(that[p32][b9][S9] && !template[U2o](classes[X2o]) && opts[i9] !== M2o){var V9=o6o;V9+=D2o;that[V9](P8o);that[t2o]();}});this[F5o][J2o][O9](z2o,function(){var P2o="ultiRestore";var H9=b4o;H9+=P2o;that[H9]();});$[v2o](this[p32][r32],function(name,fn){var K2o="functio";var C9=K2o;C9+=l32;if(typeof fn === C9 && that[name] === undefined){that[name]=function(){var N9=E2o;N9+=G2o;var B9=Q7o;B9+=I7o;var args=Array[B9][Y2o][N9](arguments);args[k2o](name);var ret=that[L2o][u2o](that,args);return ret === undefined?that:ret;};}});};Editor[X5o][e2o]={def:function(set){var I2o='default';var opts=this[p32][q2o];if(set === undefined){var T9=q9o;T9+=p2o;T9+=a2o;T9+=l32;var def=opts[I2o] !== undefined?opts[I2o]:opts[A2o];return typeof def === T9?def():def;}opts[A2o]=set;return this;},disable:function(){var y2o="isa";var f2o="ddCl";var S2o='disable';var l2o="ai";var r9=j4o;r9+=y2o;r9+=c2o;r9+=j4o;var W9=A0o;W9+=f2o;W9+=x2o;W9+=p32;var Q9=j2o;Q9+=y32;Q9+=l2o;Q9+=m2o;var g9=j4o;g9+=C4o;g9+=b4o;this[g9][Q9][W9](this[p32][b2o][r9]);this[L2o](S2o);return this;},displayed:function(){var o9=j4o;o9+=i2o;o9+=V2o;o9+=n4o;var s9=I4o;s9+=p32;s9+=p32;var w9=O2o;w9+=V4o;H0LL.o64();w9+=m2o;var container=this[F5o][w9];return container[H2o](C2o)[B8o] && container[s9](o9) != B2o?Q8o:N8o;},enable:function(){var g2o="tai";var z1=I32;z1+=l32;z1+=N2o;z1+=M0o;var Z9=h6o;Z9+=g32;Z9+=I32;Z9+=T2o;var d9=I0o;d9+=A0o;d9+=c2o;d9+=j4o;var F9=j2o;F9+=g2o;H0LL.O64();F9+=m2o;var n9=W8o;n9+=b4o;this[n9][F9][Q2o](this[p32][b2o][d9]);this[Z9](z1);return this;},enabled:function(){var W2o="isabled";var R1=j4o;R1+=W2o;return this[F5o][r2o][U2o](this[p32][b2o][R1]) === N8o;},error:function(msg,fn){var w2o="eldE";var d2o="dC";var o2o="rorMessage";var J1=r9o;J1+=w2o;J1+=Q32;J1+=s2o;H0LL.o64();var t1=Q4o;t1+=o2o;var classes=this[p32][b2o];if(msg){var M1=n2o;M1+=Q32;var X1=F2o;X1+=d2o;X1+=C6o;var U1=m4o;U1+=Z2o;U1+=z3o;var h1=W8o;h1+=b4o;this[h1][U1][X1](classes[M1]);}else {var D1=j4o;D1+=C4o;D1+=b4o;this[D1][r2o][Q2o](classes[R3o]);}this[L2o](t1,msg);return this[h3o](this[F5o][J1],msg,fn);},fieldInfo:function(msg){var P1=Q9o;P1+=W9o;P1+=U3o;return this[h3o](this[F5o][P1],msg);},isMultiValue:function(){var M3o="multiValu";var X3o="ltiIds";var K1=b4o;K1+=y7o;K1+=X3o;var v1=M3o;v1+=I32;return this[p32][v1] && this[p32][K1][B8o] !== y22;},inError:function(){var D3o="clas";var G1=D3o;G1+=p32;G1+=w7o;var E1=d4o;E1+=A0o;E1+=t3o;E1+=C6o;return this[F5o][r2o][E1](this[p32][G1][R3o]);},input:function(){var J3o="contai";var P3o='input, select, textarea';var e1=J3o;e1+=m2o;var u1=V4o;u1+=l32;u1+=r0o;var L1=h6o;L1+=g32;L1+=I32;L1+=T2o;var k1=V4o;k1+=l32;k1+=g32;k1+=G1o;H0LL.O64();var Y1=y32;Y1+=n4o;Y1+=g32;Y1+=I32;return this[p32][Y1][k1]?this[L1](u1):$(P3o,this[F5o][e1]);},focus:function(){var u3o="tarea";var Y3o="inpu";var k3o="t, s";var L3o="elect, tex";var E3o="containe";var q1=y32;q1+=n4o;q1+=g32;q1+=I32;if(this[p32][q1][t2o]){var p1=S0o;p1+=v3o;this[L2o](p1);}else {var y1=S0o;y1+=K3o;y1+=p32;var A1=E3o;A1+=Q32;var I1=j4o;I1+=G3o;var a1=Y3o;a1+=k3o;a1+=L3o;a1+=u3o;$(a1,this[I1][A1])[y1]();}return this;},get:function(){var q3o="iV";var a3o='get';var e3o="isMult";var p3o="alu";var c1=e3o;c1+=q3o;c1+=p3o;c1+=I32;if(this[c1]()){return undefined;}var val=this[L2o](a3o);return val !== undefined?val:this[A2o]();},hide:function(animate){var y3o="slid";var c3o="eUp";var I3o="ontainer";var j1=d4o;j1+=C4o;j1+=p32;j1+=y32;var x1=I4o;x1+=I3o;var f1=j4o;f1+=C4o;f1+=b4o;var el=this[f1][x1];if(animate === undefined){animate=Q8o;}if(this[p32][j1][u1o]() && animate && $[E8o][A3o]){var l1=y3o;l1+=c3o;el[l1]();}else {var b1=j4o;b1+=f3o;var m1=I4o;m1+=p32;m1+=p32;el[m1](b1,B2o);}return this;},label:function(str){var i1=W8o;i1+=b4o;var S1=j4o;S1+=C4o;S1+=b4o;var label=this[S1][A5o];var labelInfo=this[i1][x5o][x3o]();if(str === undefined){return label[j3o]();}label[j3o](str);label[l3o](labelInfo);return this;},labelInfo:function(msg){var V1=v7o;V1+=N2o;V1+=H0o;V1+=U3o;return this[h3o](this[F5o][V1],msg);},message:function(msg,fn){var m3o="fieldMessage";var O1=j4o;O1+=C4o;H0LL.O64();O1+=b4o;return this[h3o](this[O1][m3o],msg,fn);},multiGet:function(id){var value;var multiValues=this[p32][b3o];H0LL.O64();var multiIds=this[p32][S3o];var isMultiValue=this[i3o]();if(id === undefined){var C1=M0o;C1+=O8o;C1+=V8o;var H1=o6o;H1+=A0o;H1+=v7o;var fieldVal=this[H1]();value={};for(var i=A22;i < multiIds[C1];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {value=this[V3o]();}return value;},multiRestore:function(){var O3o="multiVal";var B1=O3o;B1+=o8o;this[p32][B1]=Q8o;H0LL.o64();this[H3o]();},multiSet:function(id,val){var T3o="isPlain";var Q3o="ject";var C3o="tiValueCheck";var W3o="multiId";var g3o="Ob";var N3o="ltiVal";var Q1=V7o;Q1+=v7o;Q1+=C3o;var g1=B3o;g1+=N3o;g1+=o8o;var T1=T3o;T1+=g3o;T1+=Q3o;var N1=W3o;N1+=p32;var multiValues=this[p32][b3o];var multiIds=this[p32][N1];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){if($[r3o](multiIds) === -y22){multiIds[A8o](idSrc);}multiValues[idSrc]=val;};if($[T1](val) && id === undefined){$[v2o](val,function(idSrc,innerVal){H0LL.O64();set(idSrc,innerVal);});}else if(id === undefined){$[v2o](multiIds,function(i,idSrc){H0LL.o64();set(idSrc,val);});}else {set(id,val);}this[p32][g1]=Q8o;this[Q1]();return this;},name:function(){H0LL.O64();return this[p32][q2o][E5o];},node:function(){var W1=j4o;H0LL.o64();W1+=C4o;W1+=b4o;return this[W1][r2o][A22];},processing:function(set){var z0G="proc";var w3o="cessing-field";var R8=g32;R8+=Q32;R8+=C4o;R8+=w3o;var z8=s3o;z8+=o3o;z8+=l32;z8+=y32;var Z1=l32;Z1+=C4o;Z1+=n3o;var d1=X0o;d1+=v7o;d1+=F3o;var F1=I0o;F1+=d3o;F1+=Z3o;var n1=I4o;n1+=p32;n1+=p32;H0LL.O64();var s1=z0G;s1+=w7o;s1+=p32;s1+=R0G;var w1=j4o;w1+=C4o;w1+=b4o;if(set === undefined){var r1=j4o;r1+=V4o;r1+=h0G;r1+=Z3o;return this[F5o][U0G][o5o](r1) === X0G;}this[w1][s1][n1](F1,set?d1:Z1);this[p32][M0G][z8](R8,[set]);return this;},set:function(val,multiCheck){var J0G="ityD";var j0G='set';var D0G="_typeF";var f0G="isAr";var P0G="ecode";var v8=D0G;H0LL.o64();v8+=l32;var t8=t0G;t8+=J0G;t8+=P0G;var decodeFn=function(d){var I0G='£';var y0G='\n';var k0G="ace";var A0G='\'';var e0G='<';var p0G='"';var D8=v0G;D8+=A0o;D8+=K0G;var M8=E0G;M8+=G0G;M8+=I32;var X8=Y0G;X8+=I4o;X8+=I32;var U8=v0G;U8+=k0G;var h8=p32;h8+=L0G;return typeof d !== h8?d:d[U8](/&gt;/g,u0G)[X8](/&lt;/g,e0G)[M8](/&amp;/g,q0G)[D8](/&quot;/g,p0G)[a0G](/&#163;/g,I0G)[a0G](/&#39;/g,A0G)[a0G](/&#10;/g,y0G);};this[p32][c0G]=N8o;var decode=this[p32][q2o][t8];if(decode === undefined || decode === Q8o){var J8=f0G;J8+=Q32;J8+=A0o;J8+=n4o;if(Array[J8](val)){var P8=x0G;P8+=d4o;for(var i=A22,ien=val[P8];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}this[v8](j0G,val);if(multiCheck === undefined || multiCheck === Q8o){this[H3o]();}return this;},show:function(animate){var K8=W8o;K8+=b4o;var el=this[K8][r2o];if(animate === undefined){animate=Q8o;}if(this[p32][M0G][u1o]() && animate && $[E8o][l0G]){el[l0G]();}else {var G8=L5o;G8+=t1o;var E8=I4o;E8+=p32;E8+=p32;el[E8](G8,P8o);;}return this;},val:function(val){return val === undefined?this[m0G]():this[b0G](val);},compare:function(value,original){var compare=this[p32][q2o][S0G] || _deepCompare;return compare(value,original);},dataSrc:function(){return this[p32][q2o][G5o];},destroy:function(){var i0G="des";var V0G="troy";var O0G="_typ";var e8=i0G;e8+=V0G;var u8=O0G;u8+=I32;u8+=T2o;var L8=Q32;L8+=I32;L8+=H0G;var k8=j2o;k8+=C0G;var Y8=j4o;Y8+=C4o;Y8+=b4o;this[Y8][k8][L8]();this[u8](e8);return this;},multiEditable:function(){var B0G="multiEdita";var q8=B0G;q8+=y0o;q8+=I32;return this[p32][q2o][q8];},multiIds:function(){var T0G="Ids";var N0G="ult";var p8=b4o;p8+=N0G;p8+=V4o;p8+=T0G;return this[p32][p8];},multiInfoShown:function(show){var I8=s5o;I8+=n3o;var a8=I4o;a8+=p32;a8+=p32;this[F5o][b5o][a8]({display:show?X0G:I8});},multiReset:function(){var g0G="multiV";var W0G="mul";var r0G="tiI";var y8=g0G;y8+=Q0G;y8+=p32;var A8=W0G;A8+=r0G;H0LL.O64();A8+=w0G;this[p32][A8]=[];this[p32][y8]={};},submittable:function(){return this[p32][q2o][s0G];},valFromData:W5o,valToData:W5o,_errorNode:function(){var o0G="fieldErr";var f8=o0G;f8+=C4o;f8+=Q32;var c8=W8o;H0LL.o64();c8+=b4o;return this[c8][f8];},_msg:function(el,msg,fn){H0LL.O64();var z4G="Api";var R4G=":visible";var Z0G="nction";var m8=n0G;m8+=V4o;m8+=b4o;m8+=D7o;var l8=g32;l8+=A0o;l8+=F0G;l8+=y32;var x8=d0G;x8+=Z0G;if(msg === undefined){return el[j3o]();}if(typeof msg === x8){var j8=y32;j8+=A0o;j8+=X0o;j8+=M0o;var editor=this[p32][M0G];msg=msg(editor,new DataTable[z4G](editor[p32][j8]));}if(el[l8]()[i2o](R4G) && $[E8o][m8]){el[j3o](msg);if(msg){el[l0G](fn);;}else {el[A3o](fn);}}else {var b8=X0o;b8+=v7o;b8+=F3o;el[j3o](msg || P8o)[o5o](n5o,msg?b8:B2o);if(fn){fn();}}return this;},_multiValueCheck:function(){var e4G="non";var P4G="togg";var U4G="Inf";var u4G="inputControl";var v4G="leClass";var J4G="sses";var Y4G="iIds";var G4G="iReturn";var k4G="multiEditable";var M4G="ltiNoEd";var K4G="noMu";var h6=V7o;h6+=h4G;h6+=U4G;h6+=C4o;var R6=d4o;R6+=C4o;R6+=X4G;var z6=B3o;z6+=M4G;z6+=D4G;var Z8=t4G;Z8+=J4G;var d8=P4G;d8+=v4G;var F8=j4o;F8+=C4o;F8+=b4o;var n8=K4G;n8+=h4G;var o8=V4o;o8+=l32;o8+=q9o;o8+=C4o;var s8=W8o;s8+=b4o;var w8=V4o;w8+=i1o;w8+=j32;w8+=l32;var r8=d4o;r8+=K7o;r8+=y32;var W8=v7o;W8+=E4G;W8+=y32;W8+=d4o;var Q8=l0o;Q8+=G4G;var g8=W8o;g8+=b4o;var i8=C4o;i8+=g32;i8+=y32;i8+=p32;var S8=l0o;H0LL.o64();S8+=Y4G;var last;var ids=this[p32][S8];var values=this[p32][b3o];var isMultiValue=this[p32][c0G];var isMultiEditable=this[p32][i8][k4G];var val;var different=N8o;if(ids){for(var i=A22;i < ids[B8o];i++){val=values[ids[i]];if(i > A22 && !_deepCompare(val,last)){different=Q8o;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[i3o]()){var H8=B3o;H8+=v7o;H8+=L4G;var O8=I4o;O8+=p32;O8+=p32;var V8=j4o;V8+=C4o;V8+=b4o;this[V8][u4G][O8]({display:B2o});this[F5o][H8][o5o]({display:X0G});}else {var T8=e4G;T8+=I32;var N8=j4o;N8+=C4o;N8+=b4o;var B8=I4o;B8+=q4G;var C8=j4o;C8+=C4o;C8+=b4o;this[C8][u4G][B8]({display:X0G});this[N8][C9o][o5o]({display:T8});if(isMultiValue && !different){this[b0G](last,N8o);}}this[g8][Q8][o5o]({display:ids && ids[W8] > y22 && different && !isMultiValue?X0G:B2o});var i18n=this[p32][r8][w8][C9o];this[s8][b5o][j3o](isMultiEditable?i18n[o8]:i18n[n8]);this[F8][C9o][d8](this[p32][Z8][z6],!isMultiEditable);this[p32][R6][h6]();return Q8o;},_typeFn:function(name){var M6=Z6o;M6+=y32;M6+=p32;var X6=I4o;X6+=A0o;X6+=v7o;X6+=v7o;var U6=p32;U6+=p4G;U6+=K0G;var args=Array[e2o][U6][X6](arguments);H0LL.o64();args[a4G]();args[k2o](this[p32][M6]);var fn=this[p32][r32][name];if(fn){var t6=i9o;t6+=p32;t6+=y32;var D6=A0o;D6+=g32;D6+=d3o;D6+=n4o;return fn[D6](this[p32][t6],args);}}};Editor[J6][P6]={};Editor[v6][K6]={"className":H0LL[195232],"data":H0LL[195232],"def":H0LL[195232],"fieldInfo":H0LL[195232],"id":H0LL[195232],"label":H0LL[195232],"labelInfo":H0LL[195232],"name":W5o,"type":E6,"message":H0LL[195232],"multiEditable":Q8o,"submit":Q8o};Editor[G6][Y6][k6]={type:W5o,name:W5o,classes:W5o,opts:W5o,host:W5o};Editor[X5o][L6][F5o]={container:W5o,label:W5o,labelInfo:W5o,fieldInfo:W5o,fieldError:W5o,fieldMessage:W5o};Editor[I4G]={};Editor[u6][e6]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[q6][p6]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[I4G][P5o]={"ajaxUrl":W5o,"ajax":W5o,"dataSource":W5o,"domTable":W5o,"opts":W5o,"displayController":W5o,"fields":{},"order":[],"id":-y22,"displayed":N8o,"processing":N8o,"modifier":W5o,"action":W5o,"idSrc":W5o,"unique":A22};Editor[a6][I6]={"label":W5o,"fn":W5o,"className":W5o};Editor[A6][A4G]={onReturn:y4G,onBlur:y6,onBackground:c4G,onComplete:c6,onEsc:f4G,onFieldError:f6,submit:x4G,focus:A22,buttons:Q8o,title:Q8o,message:Q8o,drawType:N8o,scope:x6};Editor[j6]={};(function(){var O4G="</div></div>";var P1G='<div class="DTED DTED_Lightbox_Wrapper">';var L7G="Lightbox";var m4G="v c";var b4G="lass=\"DT";var E9G="scrollTop";var v1G='<div class="DTED_Lightbox_Container">';var l4G="<di";var N4G="Contr";var B4G="Wrapper\">";var C4G="nt_";var H4G="v class=\"DTED_Lightbox_Conte";var S4G="ED_Lightbox_Close\"></div>";var V4G="DTED_Lightbox_Background\"><div>";var K1G='<div class="DTED_Lightbox_Content">';var i4G="<div class=\"";var T4G="del";var U7G="wrappe";var g4G="lightbox";var K2=I4o;K2+=j4G;var v2=I0o;v2+=V2o;v2+=n4o;var P2=l4G;P2+=m4G;P2+=b4G;P2+=S4G;var J2=i4G;J2+=V4G;J2+=O4G;var t2=l6o;t2+=M6o;var D2=l4G;D2+=H4G;D2+=C4G;D2+=B4G;var b6=u1o;b6+=N4G;b6+=q1o;var m6=b4o;m6+=C4o;m6+=T4G;m6+=p32;var l6=I32;l6+=e4o;var self;Editor[u1o][g4G]=$[l6](Q8o,{},Editor[m6][b6],{"init":function(dte){H0LL.o64();self[Q4G]();return self;},"open":function(dte,append,callback){var r4G="_shown";var W4G="_sho";var V6=W4G;V6+=J7o;var i6=U9o;i6+=G3o;var S6=s0o;S6+=j4o;S6+=y32;S6+=I32;if(self[r4G]){if(callback){callback();}return;}self[S6]=dte;var content=self[w4G][s4G];content[o4G]()[x3o]();content[l3o](append)[l3o](self[i6][n4G]);self[r4G]=Q8o;self[V6](callback);},"close":function(dte,callback){var C6=u7o;C6+=d4o;C6+=F4G;var H6=s0o;H6+=d4o;H6+=c5o;H6+=I32;var O6=s0o;O6+=d4G;O6+=l32;if(!self[O6]){if(callback){callback();}return;}self[Z4G]=dte;self[H6](callback);self[C6]=N8o;},node:function(dte){H0LL.O64();var B6=U9o;B6+=G3o;return self[B6][z7G][A22];},"_init":function(){var P7G="ady";var R7G="city";var v7G='opacity';var D7G="_Lightbox_Content";var M7G=".DTED";var w6=Z6o;w6+=A0o;w6+=R7G;var r6=h7G;r6+=p32;var W6=U7G;W6+=Q32;var Q6=s0o;Q6+=j4o;Q6+=C4o;Q6+=b4o;var g6=X7G;g6+=M7G;g6+=D7G;var T6=I4o;T6+=C4o;T6+=t7G;T6+=Z2o;var N6=J7G;N6+=I32;H0LL.o64();N6+=P7G;if(self[N6]){return;}var dom=self[w4G];dom[T6]=$(g6,self[Q6][z7G]);dom[W6][o5o](v7G,A22);dom[K7G][r6](w6,A22);},"_show":function(callback){var O7G="tA";var k9G="wn\">";var q7G="_Lightbox";var I9G='div.DTED_Lightbox_Shown';var E7G="size.DTED_L";var p7G="backgro";var m7G="dt";var g7G='DTED_Lightbox_Mobile';var K9G="_scrollTop";var B7G="orientation";var a9G="not";var A7G="ightbox";var Y9G="v class=\"DTED_Lightbox_Sho";var V7G="offse";var Q7G='height';var u7G="click.";var e7G="DTED";var k7G="click.DTED_";var I7G="_L";var b7G="_ani";var Y7G="box";var j7G="oun";var x5=x0o;x5+=E7G;x5+=G7G;x5+=Y7G;var f5=X0o;f5+=V4o;f5+=l32;f5+=j4o;var p5=k7G;p5+=L7G;var u5=u7G;u5+=e7G;u5+=q7G;var L5=X0o;L5+=b0o;L5+=j4o;var k5=p7G;k5+=y7o;k5+=l32;k5+=j4o;var G5=a7G;G5+=I7G;G5+=A7G;var E5=K1o;E5+=y7G;var K5=V4o;K5+=i1o;K5+=j32;K5+=l32;var v5=L4G;v5+=c7G;var P5=A0o;P5+=y32;P5+=y32;P5+=Q32;var J5=f7G;J5+=I32;var M5=x7G;M5+=j7G;M5+=j4o;var X5=s0o;H0LL.O64();X5+=l7G;var U5=s0o;U5+=m7G;U5+=I32;var h5=b7G;h5+=b4o;h5+=D7o;var R5=S7G;R5+=i7G;var z5=s0o;z5+=F5o;var Z6=X0o;Z6+=C4o;Z6+=j4o;Z6+=n4o;var d6=V7G;d6+=O7G;d6+=H7G;var F6=m4o;F6+=l32;F6+=q9o;var n6=C7G;n6+=C4o;var o6=I4o;o6+=p32;o6+=p32;var that=this;var dom=self[w4G];if(window[B7G] !== undefined){var s6=N7G;s6+=P4o;$(s6)[T7G](g7G);}dom[s4G][o6](Q7G,n6);dom[z7G][o5o]({top:-self[F6][d6]});$(Z6)[l3o](self[w4G][K7G])[l3o](self[z5][R5]);self[W7G]();self[Z4G][h5](dom[z7G],{opacity:y22,top:A22},callback);self[U5][X5](dom[M5],{opacity:y22});setTimeout(function(){var s7G=".DTE_Footer";H0LL.o64();var w7G="ndent";var r7G="t-i";var t5=u0o;t5+=A32;t5+=r7G;t5+=w7G;var D5=L5o;D5+=o6o;D5+=s7G;$(D5)[o5o](t5,-y22);},b22);dom[J5][P5](v5,self[Z4G][K5][E5])[o7G](G5,function(e){var Y5=s0o;Y5+=j4o;Y5+=y32;Y5+=I32;self[Y5][n4G]();});dom[k5][L5](u5,function(e){var d7G="stopImmediatePropagation";var F7G="ckgrou";var q5=n7G;q5+=F7G;q5+=z5o;var e5=s0o;e5+=c6o;e[d7G]();self[e5][q5]();});$(Z7G,dom[z7G])[o7G](p5,function(e){var J9G="diatePropagation";var M9G="ckgroun";var z9G="TED_Lightbox_Content_Wr";var t9G="stopImme";var I5=n32;I5+=z9G;I5+=R9G;H0LL.O64();I5+=Q4o;var a5=h9G;a5+=U9G;a5+=q4G;if($(e[X9G])[a5](I5)){var c5=n7G;c5+=M9G;c5+=j4o;var y5=D9G;y5+=I32;var A5=t9G;A5+=J9G;e[A5]();self[y5][c5]();}});$(window)[f5](x5,function(){var P9G="_heigh";var v9G="tCalc";var j5=P9G;j5+=v9G;self[j5]();});self[K9G]=$(C2o)[E9G]();if(window[B7G] !== undefined){var V5=R9G;V5+=G9G;var i5=l4G;i5+=Y9G;i5+=k9G;i5+=L9G;var S5=A0o;S5+=u9G;var b5=x7G;b5+=e9G;var m5=l32;m5+=C4o;m5+=y32;var l5=q9G;l5+=p9G;var kids=$(C2o)[l5]()[m5](dom[b5])[a9G](dom[z7G]);$(C2o)[S5](i5);$(I9G)[V5](kids);}},"_heightCalc":function(){var c9G="outerHeigh";var j9G="windowPa";var A9G="maxHei";var g5=A9G;g5+=y9G;var T5=I4o;T5+=p32;T5+=p32;var N5=c9G;N5+=y32;var B5=C4o;B5+=y7o;B5+=u0o;B5+=f9G;var C5=J7o;C5+=x9G;C5+=Q32;var H5=j9G;H5+=l9G;H5+=R0G;var O5=s0o;O5+=j4o;O5+=C4o;O5+=b4o;var dom=self[O5];var maxHeight=$(window)[m9G]() - self[b9G][H5] * c22 - $(S9G,dom[C5])[B5]() - $(i9G,dom[z7G])[N5]();$(V9G,dom[z7G])[T5](g5,maxHeight);},"_hide":function(callback){var N9G="clic";var O9G="siz";var H9G="e.DTED_";var s9G="Top";var o9G="TED_Lightbox_M";var C9G="unbi";var U1G="ghtbox_Show";var w9G="_scroll";var g9G="ED_Lightbox";var h1G="D_Li";var d9G="entati";var n9G="obile";var T9G="k.DT";var F9G="ori";var W9G="fsetAn";var M2=x0o;M2+=O9G;M2+=H9G;M2+=L7G;var X2=C9G;X2+=l32;X2+=j4o;var U2=B9G;U2+=g32;U2+=Q4o;var h2=N9G;h2+=T9G;h2+=g9G;var R2=K1o;R2+=C4o;R2+=p32;R2+=I32;var Z5=Q9G;Z5+=W9G;Z5+=V4o;var d5=m4o;d5+=r9G;var F5=U7G;F5+=Q32;var n5=w9G;n5+=s9G;var o5=n32;o5+=o9G;o5+=n9G;var s5=X0o;s5+=C4o;s5+=j4o;s5+=n4o;var W5=F9G;W5+=d9G;W5+=z0o;var Q5=s0o;Q5+=j4o;Q5+=C4o;Q5+=b4o;var dom=self[Q5];if(!callback){callback=function(){};}if(window[W5] !== undefined){var w5=Z9G;w5+=z1G;var r5=R1G;r5+=h1G;r5+=U1G;r5+=l32;var show=$(r5);show[o4G]()[w5](C2o);show[X1G]();}$(s5)[Q2o](o5)[E9G](self[n5]);self[Z4G][M1G](dom[F5],{opacity:A22,top:self[d5][Z5]},function(){$(this)[x3o]();callback();});self[Z4G][M1G](dom[K7G],{opacity:A22},function(){var z2=n7o;H0LL.O64();z2+=y32;z2+=D1G;$(this)[z2]();});dom[R2][t1G](h2);dom[K7G][t1G](J1G);$(Z7G,dom[U2])[X2](J1G);$(window)[t1G](M2);},"_dte":W5o,"_ready":N8o,"_shown":N8o,"_dom":{"wrapper":$(P1G + v1G + D2 + K1G + B5o + B5o + B5o + t2),"background":$(J2),"close":$(P2),"content":W5o}});self=Editor[v2][g4G];self[K2]={"offsetAni":T22,"windowPadding":T22};})();(function(){var E1G="nvelope";var e1G="displa";var Y1G="<div class=\"D";var i6G='<div class="DTED_Envelope_Shadow"></div>';var u1G="env";var M32=600;var F22=50;var S6G='<div class="DTED DTED_Envelope_Wrapper">';var I8G="lc";var x1G="conten";var y1G="_do";var a8G="Ca";var O6G='<div class="DTED_Envelope_Close">&times;</div>';var V6G='<div class="DTED_Envelope_Background"><div></div></div>';var k1G="TED_Envelope_Container\"></div";var O1G="sty";var b08=I4o;b08+=C4o;b08+=l32;b08+=q9o;var m08=I32;m08+=E1G;H0LL.O64();var l08=Y6o;l08+=G1G;l08+=X7G;l08+=M6o;var j08=Y1G;j08+=k1G;j08+=M6o;var Y2=I32;Y2+=A32;Y2+=L1G;var G2=u1G;G2+=H0o;G2+=O9o;var E2=e1G;E2+=n4o;var self;Editor[E2][G2]=$[Y2](Q8o,{},Editor[I4G][q1G],{"init":function(dte){var k2=U9o;k2+=u0o;self[k2]=dte;self[Q4G]();return self;},"open":function(dte,append,callback){var f1G="ild";var c1G="ppendC";var I1G="endChil";var A1G="ntent";var A2=K1o;A2+=C4o;A2+=p1G;var I2=s0o;I2+=j4o;I2+=C4o;I2+=b4o;var a2=A0o;a2+=a1G;a2+=I1G;a2+=j4o;var p2=I4o;p2+=C4o;p2+=A1G;var q2=y1G;q2+=b4o;var e2=A0o;e2+=c1G;e2+=d4o;H0LL.O64();e2+=f1G;var u2=x1G;u2+=y32;var L2=j1G;L2+=l1G;L2+=y32;self[Z4G]=dte;$(self[w4G][L2])[o4G]()[x3o]();self[w4G][u2][e2](append);self[q2][p2][a2](self[I2][A2]);self[m1G](callback);},"close":function(dte,callback){self[Z4G]=dte;self[b1G](callback);},node:function(dte){var y2=S1G;y2+=g32;y2+=I7o;y2+=Q32;H0LL.O64();return self[w4G][y2][A22];},"_init":function(){var B1G="_cssB";var T1G="Op";var i1G="vi";var Q1G="ckground";var H1G="opac";var s1G="velope_Con";var W1G="sbi";var g1G="acity";var V1G="sbilit";var N1G="ackground";var w1G="D_En";var C1G="ity";var F1G='visible';var r1G="lity";var o1G="_ready";var N2=i1G;N2+=V1G;N2+=n4o;var B2=O1G;B2+=M0o;var C2=s0o;C2+=F5o;var H2=e1G;H2+=n4o;var O2=H1G;O2+=C1G;var V2=I4o;V2+=q4G;var i2=B1G;i2+=N1G;i2+=T1G;i2+=g1G;var S2=n7G;S2+=Q1G;var b2=y1G;b2+=b4o;var m2=d4o;m2+=c5o;m2+=n7o;m2+=l32;var l2=i1G;l2+=W1G;l2+=r1G;var j2=p32;j2+=y32;j2+=n4o;j2+=M0o;var x2=J7o;x2+=x9G;x2+=Q32;var f2=R1G;f2+=w1G;f2+=s1G;f2+=C0G;var c2=x1G;c2+=y32;if(self[o1G]){return;}self[w4G][c2]=$(f2,self[w4G][x2])[A22];self[w4G][K7G][j2][l2]=m2;self[b2][S2][n1G][u1o]=X0G;self[i2]=$(self[w4G][K7G])[V2](O2);self[w4G][K7G][n1G][H2]=B2o;self[C2][K7G][B2][N2]=F1G;},"_show":function(callback){var U8G="ick.DTED_";var J8G="undOpacity";var Q8G="ani";var p8G="_height";var d1G="resize.";var M8G="nor";var H8G="windowScroll";var l8G="appendChild";var S8G="opacity";var r8G='click.DTED_Envelope';var R8G="_Envelope";var e8G="widt";var A8G="opacit";var k8G="ffsetHeight";var z8G="velope";var j8G="hild";var g8G="windowPadding";var m8G="_findAttachRow";var x8G="appendC";var c8G="ack";var Z1G="DTED_E";var h8G="bi";var L8G="offs";var X8G="Envelope";var f8G="ground";var K8G="bloc";var v8G="round";var P8G="ackg";var T8G='html,body';var t8G="cssBackg";var i8G="marginLeft";var Y8G="kg";var B8G="etHe";var w3=d1G;w3+=Z1G;w3+=l32;w3+=z8G;var r3=X0o;r3+=V4o;r3+=l32;r3+=j4o;var g3=a7G;g3+=R8G;var T3=X0o;T3+=V4o;T3+=l32;T3+=j4o;var N3=h8G;N3+=z5o;var C3=K1o;C3+=U8G;C3+=X8G;var H3=V4o;H3+=i1o;H3+=j32;H3+=l32;var O3=y32;O3+=V4o;O3+=c7G;var V3=A0o;V3+=y32;V3+=y32;V3+=Q32;var i3=s0o;i3+=j4o;i3+=C4o;i3+=b4o;var c3=m4o;c3+=r9G;var y3=M8G;y3+=D8G;y3+=v7o;var A3=s0o;A3+=t8G;A3+=B7o;A3+=J8G;var I3=X0o;I3+=P8G;I3+=v8G;var a3=K8G;a3+=E8G;var p3=j4o;p3+=i2o;p3+=g32;p3+=G8G;var q3=s0o;q3+=W8o;q3+=b4o;var e3=p32;e3+=y32;e3+=n4o;e3+=M0o;var u3=n7G;u3+=I4o;u3+=Y8G;u3+=v8G;var L3=s0o;L3+=j4o;L3+=C4o;L3+=b4o;var k3=g32;k3+=A32;var Y3=s0o;Y3+=F5o;var G3=g32;G3+=A32;var E3=C4o;E3+=k8G;var K3=y32;K3+=C4o;K3+=g32;var v3=L8G;v3+=u8G;var P3=s0o;P3+=j4o;P3+=C4o;P3+=b4o;var J3=g32;J3+=A32;var t3=s0o;t3+=W8o;t3+=b4o;var D3=g32;D3+=A32;var M3=e8G;M3+=d4o;var X3=p32;X3+=b7o;X3+=v7o;X3+=I32;var U3=S7G;U3+=A0o;U3+=g32;U3+=q8G;var h3=s5o;h3+=l32;h3+=I32;var R3=p8G;R3+=a8G;R3+=I8G;var z3=A8G;z3+=n4o;var Z2=O1G;Z2+=v7o;Z2+=I32;var d2=s0o;d2+=F5o;var F2=C7G;F2+=C4o;var n2=p32;n2+=y32;n2+=y8G;n2+=I32;var s2=s0o;s2+=j4o;s2+=C4o;s2+=b4o;var w2=S7G;w2+=Z9G;w2+=Q32;var r2=U9o;r2+=G3o;var W2=X0o;W2+=C4o;W2+=j4o;W2+=n4o;var Q2=X0o;Q2+=c8G;Q2+=f8G;var g2=x8G;g2+=j8G;var T2=X0o;T2+=C4o;T2+=j4o;T2+=n4o;var that=this;var formHeight;if(!callback){callback=function(){};}document[T2][g2](self[w4G][Q2]);document[W2][l8G](self[r2][w2]);self[s2][s4G][n2][m9G]=F2;var style=self[d2][z7G][Z2];style[z3]=A22;style[u1o]=X0G;var targetRow=self[m8G]();var height=self[R3]();var width=targetRow[b8G];style[u1o]=h3;style[S8G]=y22;self[w4G][U3][X3][M3]=width + D3;self[t3][z7G][n1G][i8G]=-(width / c22) + J3;self[P3][z7G][n1G][V8G]=$(targetRow)[v3]()[K3] + targetRow[E3] + G3;self[Y3][s4G][n1G][V8G]=-y22 * height - C22 + k3;self[L3][u3][e3][S8G]=A22;self[q3][K7G][n1G][p3]=a3;$(self[w4G][I3])[l7G]({'opacity':self[A3]},y3);$(self[w4G][z7G])[O8G]();if(self[c3][H8G]){var x3=C8G;x3+=p32;x3+=B8G;x3+=G7G;var f3=C4o;f3+=q9o;f3+=N8G;f3+=u8G;$(T8G)[l7G]({"scrollTop":$(targetRow)[f3]()[V8G] + targetRow[x3] - self[b9G][g8G]},function(){var m3=n0G;H0LL.O64();m3+=V4o;m3+=D8G;m3+=u0o;var l3=m4o;l3+=l32;l3+=y32;l3+=t0G;var j3=U9o;j3+=G3o;$(self[j3][l3])[m3]({"top":A22},M32,callback);});}else {var S3=Q8G;S3+=b4o;S3+=W8G;S3+=I32;var b3=j2o;b3+=y32;b3+=l1G;b3+=y32;$(self[w4G][b3])[S3]({"top":A22},M32,callback);}$(self[i3][n4G])[V3](O3,self[Z4G][H3][n4G])[o7G](C3,function(e){var B3=I4o;B3+=v7o;B3+=y7G;H0LL.O64();self[Z4G][B3]();});$(self[w4G][K7G])[N3](r8G,function(e){H0LL.o64();self[Z4G][K7G]();});$(Z7G,self[w4G][z7G])[T3](g3,function(e){var s8G='DTED_Envelope_Content_Wrapper';var o8G="ckgro";var Q3=d4o;Q3+=w8G;if($(e[X9G])[Q3](s8G)){var W3=n7G;W3+=o8G;W3+=n8G;W3+=j4o;self[Z4G][W3]();}});$(window)[r3](w3,function(){self[W7G]();});},"_heightCalc":function(){var d8G="eig";var R6G="oute";var h6G="windo";var M6G="heig";var U6G="wPa";var F8G="maxH";var t6G="outerHeight";var D6G="heightCalc";var h08=F8G;h08+=d8G;h08+=Z8G;var R08=S1G;R08+=g32;R08+=q8G;var z08=S7G;z08+=z6G;z08+=I7o;z08+=Q32;var Z3=R6G;Z3+=f9G;var d3=h6G;d3+=U6G;d3+=l9G;d3+=R0G;var F3=X6G;F3+=V4o;F3+=p4o;F3+=Z8G;var n3=y1G;n3+=b4o;var o3=s0o;o3+=j4o;o3+=G3o;var s3=M6G;s3+=Z8G;s3+=a8G;s3+=I8G;var formHeight;formHeight=self[b9G][s3]?self[b9G][D6G](self[o3][z7G]):$(self[n3][s4G])[o4G]()[m9G]();var maxHeight=$(window)[F3]() - self[b9G][d3] * c22 - $(S9G,self[w4G][z7G])[Z3]() - $(i9G,self[w4G][z08])[t6G]();$(V9G,self[w4G][R08])[o5o](h08,maxHeight);return $(self[Z4G][F5o][z7G])[t6G]();},"_hide":function(callback){var G6G="nbind";var J6G="resize.DT";var E6G="nt_Wr";var v6G="div.DTED_Lightbox_C";var k6G="offsetHeight";var P6G="ED_Lightbo";var K6G="onte";var u08=J6G;u08+=P6G;u08+=A32;var L08=s0o;L08+=j4o;L08+=C4o;L08+=b4o;H0LL.O64();var k08=v6G;k08+=K6G;k08+=E6G;k08+=i7G;var Y08=y7o;Y08+=G6G;var G08=x7G;G08+=e9G;var E08=s0o;E08+=j4o;E08+=C4o;E08+=b4o;var K08=s0o;K08+=j4o;K08+=G3o;var M08=j2o;M08+=Y6G;var X08=s0o;X08+=j4o;X08+=C4o;X08+=b4o;var U08=s0o;U08+=j4o;U08+=C4o;U08+=b4o;if(!callback){callback=function(){};}$(self[U08][s4G])[l7G]({"top":-(self[X08][M08][k6G] + F22)},M32,function(){var e6G="gro";var L6G="fadeO";var u6G="back";var v08=l32;v08+=g0o;v08+=D8G;v08+=v7o;var P08=L6G;H0LL.o64();P08+=G1o;var J08=u6G;J08+=e6G;J08+=q6G;var t08=s0o;t08+=F5o;var D08=J7o;D08+=p6G;D08+=I7o;D08+=Q32;$([self[w4G][D08],self[t08][J08]])[P08](v08,function(){$(this)[X1G]();callback();});});$(self[K08][n4G])[t1G](J1G);$(self[E08][G08])[Y08](J1G);$(k08,self[L08][z7G])[t1G](J1G);$(window)[t1G](u08);},"_findAttachRow":function(){var c6G='head';var f6G="hea";var y08=I4o;y08+=a6G;y08+=I32;var A08=A0o;A08+=I6G;A08+=V4o;A08+=z0o;var I08=D9G;I08+=I32;var p08=A6G;p08+=A0o;p08+=I4o;p08+=d4o;var q08=y32;q08+=y6G;q08+=I32;var e08=r4o;e08+=g32;e08+=V4o;var dt=new $[E8o][G8o][e08](self[Z4G][p32][q08]);if(self[b9G][p08] === c6G){var a08=f6G;a08+=n7o;a08+=Q32;return dt[x6G]()[a08]();}else if(self[I08][p32][A08] === y08){var f08=d4o;f08+=j6G;var c08=y32;c08+=A0o;c08+=X0o;c08+=M0o;return dt[c08]()[f08]();}else {var x08=Q32;x08+=l6G;return dt[x08](self[Z4G][p32][m6G])[b6G]();}},"_dte":W5o,"_ready":N8o,"_cssBackgroundOpacity":y22,"_dom":{"wrapper":$(S6G + i6G + j08 + l08)[A22],"background":$(V6G)[A22],"close":$(O6G)[A22],"content":W5o}});self=Editor[u1o][m08];self[b08]={"windowPadding":F22,"heightCalc":W5o,"attach":H6G,"windowScroll":Q8o};})();Editor[S08][i08]=function(cfg,after){var X5G="iRes";var Z6G="'";var B6G="layReorder";var z5G=". A fi";var J5G="rder";var n6G="taSou";var v5G="inArr";var h5G="xists with this name";var r6G="Fie";var U5G="Error adding field '";var P5G="unshi";var R5G="eld already e";var W6G="mod";var g6G="reverse";var F6G="Error adding field. The field requires a `name` option";var Z08=g0o;Z08+=n7o;Z08+=Q32;var d08=s0o;d08+=C6G;d08+=B6G;H0LL.o64();var V08=N6G;V08+=Q32;V08+=T6G;V08+=n4o;if(Array[V08](cfg)){if(after !== undefined){cfg[g6G]();}for(var i=A22;i < cfg[B8o];i++){var O08=A0o;O08+=l9G;this[O08](cfg[i],after);}}else {var w08=q9o;w08+=V4o;w08+=I32;w08+=Q6G;var W08=W6G;W08+=I32;var Q08=q9o;Q08+=m1o;var g08=I4o;g08+=C6o;g08+=I32;g08+=p32;var T08=r6G;T08+=W9o;var N08=w6G;N08+=s6G;N08+=x1o;var B08=o6G;B08+=n6G;B08+=Q32;B08+=K0G;var H08=Q6o;H08+=o32;var name=cfg[H08];if(name === undefined){throw F6G;}if(this[p32][d6G][name]){var C08=Z6G;C08+=z5G;C08+=R5G;C08+=h5G;throw U5G + name + C08;}this[B08](N08,cfg);var field=new Editor[T08](cfg,this[g08][Q08],this);if(this[p32][W08]){var r08=l0o;r08+=X5G;r08+=u8G;var editFields=this[p32][M5G];field[r08]();$[v2o](editFields,function(idSrc,edit){H0LL.o64();var val;if(edit[G5o]){val=field[D5G](edit[G5o]);}field[t5G](idSrc,val !== undefined?val:field[A2o]());});}this[p32][w08][name]=field;if(after === undefined){var s08=C4o;s08+=J5G;this[p32][s08][A8o](name);}else if(after === W5o){var n08=P5G;n08+=q9o;n08+=y32;var o08=g0o;o08+=n7o;o08+=Q32;this[p32][o08][n08](name);}else {var F08=v5G;F08+=Z3o;var idx=$[F08](after,this[p32][K5G]);this[p32][K5G][E5G](idx + y22,A22,name);}}this[d08](this[Z08]());return this;};Editor[e2o][z48]=function(newAjax){if(newAjax){this[p32][G5G]=newAjax;return this;}return this[p32][G5G];};Editor[R48][K7G]=function(){var L5G="onBackgr";H0LL.O64();var M48=Y5G;M48+=D4G;var U48=k5G;U48+=L4G;U48+=C4o;U48+=l32;var h48=L5G;h48+=e9G;var onBackground=this[p32][u5G][h48];if(typeof onBackground === U48){onBackground(this);}else if(onBackground === c4G){var X48=X0o;X48+=v7o;X48+=y7o;X48+=Q32;this[X48]();}else if(onBackground === f4G){this[n4G]();}else if(onBackground === M48){var D48=e5G;D48+=X0o;D48+=b4o;D48+=D4G;this[D48]();}return this;};Editor[t48][q5G]=function(){this[p5G]();return this;};Editor[J48][P48]=function(cells,fieldNames,show,opts){var c5G="Plai";var I5G="_dat";var a5G="dividu";var A5G="aSource";var k48=b0o;k48+=a5G;k48+=D2o;var Y48=I5G;Y48+=A5G;var G48=I32;G48+=y5G;G48+=z5o;var E48=i2o;E48+=c5G;E48+=l32;E48+=f5G;var v48=x5G;v48+=c5o;v48+=n4o;var that=this;if(this[v48](function(){var j5G="bubb";var K48=j5G;K48+=v7o;K48+=I32;that[K48](cells,fieldNames,opts);})){return this;}if($[l5G](fieldNames)){opts=fieldNames;fieldNames=undefined;show=Q8o;}else if(typeof fieldNames === m5G){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[E48](show)){opts=show;show=Q8o;}if(show === undefined){show=Q8o;}opts=$[G48]({},this[p32][A4G][b5G],opts);var editFields=this[Y48](k48,cells,fieldNames);this[S5G](cells,editFields,i5G,opts,function(){var d5G="e=\"";var o5G="ass=";var R2G="<div c";var W5G="/div>";var L2G='<div class="DTE_Processing_Indicator"><span></div>';var B5G="ubblePositio";var M2G="z";var G2G='"><div></div></div>';var X2G="ppl";var u2G="pointer";var e2G="ppendT";var r5G="></d";var V5G="_post";var D2G="e.";var C5G="_anima";var U2G="ttach";var E2G="bg";var h2G="=";var X78=X0o;X78+=y7o;X78+=X1o;var U78=V5G;U78+=O5G;var h78=q9o;h78+=C4o;h78+=K3o;h78+=p32;var R78=H5G;R78+=C4o;R78+=v3o;var z78=C5G;z78+=u0o;var Z48=X0o;Z48+=B5G;Z48+=l32;var d48=K1o;d48+=Z32;d48+=E8G;var w48=F2o;w48+=j4o;var Q48=N5G;Q48+=A0o;Q48+=C7o;var g48=S0o;g48+=Q32;g48+=b4o;var T48=W8o;T48+=b4o;var N48=T5G;N48+=g5G;var B48=I32;B48+=Q5G;var V48=Y6o;V48+=W5G;var i48=X6o;i48+=r5G;i48+=K6o;i48+=M6o;var S48=w5G;S48+=s5G;S48+=o5G;S48+=X6o;var b48=I4o;b48+=v1o;var m48=V4o;m48+=n5G;m48+=l32;var l48=X6o;l48+=f8o;l48+=F5G;l48+=d5G;var j48=Z5G;j48+=X6o;var x48=X6o;x48+=M6o;var f48=y32;f48+=N2o;f48+=v7o;f48+=I32;var c48=w5G;c48+=z2G;var y48=X6o;y48+=M6o;var A48=X6o;A48+=M6o;var I48=Y6o;I48+=X7G;I48+=z2G;var a48=R2G;a48+=C6o;a48+=h2G;a48+=X6o;var p48=A0o;p48+=U2G;var q48=A0o;q48+=X2G;q48+=n4o;var e48=E6o;e48+=V4o;e48+=M2G;e48+=D2G;var u48=C4o;u48+=l32;var L48=t2G;L48+=I32;L48+=O5G;var namespace=that[J2G](opts);var ret=that[L48](i5G);if(!ret){return that;}$(window)[u48](e48 + namespace,function(){var P2G="bubblePosition";H0LL.O64();that[P2G]();});var nodes=[];that[p32][v2G]=nodes[K2G][q48](nodes,_pluck(editFields,p48));var classes=that[b2o][b5G];var background=$(a48 + classes[E2G] + G2G);var container=$(I48 + classes[z7G] + A48 + q5o + classes[Y2G] + y48 + c48 + classes[f48] + x48 + j48 + classes[n4G] + l48 + that[m48][b48] + k2G + L2G + B5o + B5o + S48 + classes[u2G] + i48 + V48);if(show){var C48=A0o;C48+=e2G;C48+=C4o;var H48=X0o;H48+=p1o;H48+=n4o;var O48=Z9G;O48+=z1G;container[O48](H48);background[C48](C2o);}var liner=container[o4G]()[B48](A22);var table=liner[o4G]();var close=table[o4G]();liner[l3o](that[F5o][q2G]);table[N48](that[T48][g48]);if(opts[Q48]){var W48=W8o;W48+=b4o;liner[w5o](that[W48][p2G]);}if(opts[a2G]){var r48=X6G;r48+=A0o;r48+=Y4o;liner[w5o](that[F5o][r48]);}if(opts[I2G]){table[l3o](that[F5o][I2G]);}var pair=$()[w48](container)[A2G](background);that[y2G](function(submitComplete){var c2G="_an";var f2G="im";var s48=c2G;s48+=f2G;H0LL.o64();s48+=A0o;s48+=u0o;that[s48](pair,{opacity:A22},function(){var b2G='resize.';var j2G="_clearDy";var l2G="namicI";if(this === container[A22]){var F48=s0o;F48+=x2G;F48+=I32;F48+=Z2o;var n48=j2G;n48+=l2G;n48+=d0o;var o48=n7o;o48+=m2G;pair[o48]();$(window)[C8G](b2G + namespace);that[n48]();that[F48](S2G,[i5G]);}});});background[i2G](function(){that[q5G]();});close[d48](function(){H0LL.O64();that[V2G]();});that[Z48]();that[z78](pair,{opacity:y22});that[R78](that[p32][O2G],opts[h78]);that[U78](X78,Q8o);});return this;};Editor[M78][D78]=function(){var w2G="ble_Liner";var T2G="Width";var h3G="addCl";var Q2G="ott";var H2G="ffset";var H22=15;var t3G="eCla";var Z2G="right";var r2G="div.DTE_Bub";var J3G='below';var N2G="outer";var s2G='div.DTE_Bubble';var X3G="bottom";var A78=C4o;A78+=H2G;var I78=C2G;I78+=B2G;var a78=I4o;a78+=p32;a78+=p32;var p78=N2G;p78+=T2G;var q78=Q32;q78+=G7G;var e78=M0o;e78+=g2G;var u78=M0o;u78+=O8o;u78+=V8o;var L78=X0o;L78+=Q2G;L78+=G3o;var k78=C2G;k78+=W2G;k78+=d4o;var J78=I32;J78+=A0o;J78+=I4o;J78+=d4o;var t78=r2G;t78+=w2G;var wrapper=$(s2G),liner=$(t78),nodes=this[p32][v2G];var position={top:A22,left:A22,right:A22,bottom:A22};$[J78](nodes,function(i,node){var o2G="offset";var n2G="Heig";var Y78=o2G;Y78+=n2G;Y78+=d4o;Y78+=y32;var G78=N7G;G78+=F2G;G78+=b4o;var E78=M0o;E78+=q9o;E78+=y32;var K78=y32;K78+=C4o;K78+=g32;var v78=d9o;v78+=g32;var P78=C4o;P78+=H2G;var pos=$(node)[P78]();node=$(node)[m0G](A22);position[v78]+=pos[K78];position[d2G]+=pos[E78];position[Z2G]+=pos[d2G] + node[b8G];position[G78]+=pos[V8G] + node[Y78];});position[V8G]/=nodes[B8o];position[d2G]/=nodes[k78];position[Z2G]/=nodes[B8o];position[L78]/=nodes[u78];var top=position[V8G],left=(position[e78] + position[q78]) / c22,width=liner[p78](),visLeft=left - width / c22,visRight=visLeft + width,docWidth=$(window)[z3G](),padding=H22,classes=this[b2o][b5G];wrapper[a78]({top:top,left:left});if(liner[I78] && liner[A78]()[V8G] < A22){var f78=X0o;f78+=I32;f78+=R3G;f78+=J7o;var c78=h3G;c78+=x2o;c78+=p32;var y78=I4o;y78+=p32;y78+=p32;wrapper[y78](U3G,position[X3G])[c78](f78);}else {var x78=M3G;x78+=D3G;x78+=t3G;x78+=q4G;wrapper[x78](J3G);}if(visRight + padding > docWidth){var diff=visRight - docWidth;liner[o5o](P3G,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var j78=I4o;j78+=p32;j78+=p32;liner[j78](P3G,visLeft < padding?-(visLeft - padding):A22);}return this;};Editor[e2o][l78]=function(buttons){var v3G="_ba";var O78=I32;O78+=D1G;var V78=j4o;V78+=C4o;V78+=b4o;var m78=v3G;m78+=p32;m78+=V4o;m78+=I4o;var that=this;H0LL.O64();if(buttons === m78){var i78=p32;i78+=y7o;i78+=X0o;i78+=K3G;var S78=E3G;S78+=y32;S78+=a2o;S78+=l32;var b78=G3G;b78+=l32;buttons=[{text:this[b78][this[p32][S78]][i78],action:function(){this[s0G]();}}];}else if(!Array[Y3G](buttons)){buttons=[buttons];}$(this[V78][I2G])[k3G]();$[O78](buttons,function(i,btn){var I3G="classNam";var x3G='<button></button>';var e3G="tabI";var u3G="tabIn";var S3G='keypress';var q3G="dex";var l3G='tabindex';var d78=j4o;d78+=G3o;var n78=C4o;n78+=l32;var s78=C4o;s78+=l32;var w78=E8G;w78+=I32;w78+=n4o;w78+=L3G;var r78=C4o;r78+=l32;var W78=u3G;W78+=n7o;W78+=A32;var Q78=e3G;Q78+=l32;Q78+=q3G;H0LL.o64();var g78=A0o;g78+=p3G;g78+=Q32;var T78=d4o;T78+=y32;T78+=a3G;var N78=I3G;N78+=I32;var B78=q9o;B78+=A3G;var C78=q9o;C78+=l32;var H78=v7o;H78+=A0o;H78+=X0o;H78+=H0o;if(typeof btn === y3G){btn={text:btn,action:function(){H0LL.o64();this[s0G]();}};}var text=btn[c3G] || btn[H78];var action=btn[f3G] || btn[C78];$(x3G,{'class':that[b2o][B78][j3G] + (btn[I5o]?p5o + btn[N78]:P8o)})[T78](typeof text === H0LL[418273]?text(that):text || P8o)[g78](l3G,btn[Q78] !== undefined?btn[W78]:A22)[r78](w78,function(e){H0LL.o64();if(e[m3G] === V22 && action){action[b3G](that);}})[s78](S3G,function(e){var V3G="Default";if(e[m3G] === V22){var o78=l7o;o78+=I32;o78+=i3G;o78+=V3G;e[o78]();}})[n78](z2o,function(e){var H3G="tD";var C3G="efault";var F78=O3G;F78+=l1G;F78+=H3G;H0LL.o64();F78+=C3G;e[F78]();if(action){action[b3G](that,e);}})[B3G](that[d78][I2G]);});return this;};Editor[Z78][N3G]=function(fieldName){var w3G="ieldNames";var r3G="stro";var g3G="nArr";var T3G="stri";H0LL.o64();var R98=T3G;R98+=O8o;var z98=Y1o;z98+=p32;var that=this;var fields=this[p32][z98];if(typeof fieldName === R98){var M98=V4o;M98+=g3G;M98+=A0o;M98+=n4o;var X98=Q3G;X98+=v7o;X98+=W3G;var U98=g0o;U98+=j4o;U98+=I32;U98+=Q32;var h98=n7o;h98+=r3G;h98+=n4o;that[Y1o](fieldName)[h98]();delete fields[fieldName];var orderIdx=$[r3o](fieldName,this[p32][U98]);this[p32][K5G][X98](orderIdx,y22);var includeIdx=$[M98](fieldName,this[p32][O2G]);if(includeIdx !== -y22){this[p32][O2G][E5G](includeIdx,y22);}}else {var t98=s0o;t98+=q9o;t98+=w3G;var D98=I32;D98+=E3G;D98+=d4o;$[D98](this[t98](fieldName),function(i,name){that[N3G](name);});}return this;};Editor[J98][n4G]=function(){this[V2G](N8o);return this;};Editor[e2o][s3G]=function(arg1,arg2,arg3,arg4){var n3G="Creat";var h0x="idy";var o3G="nit";var Z3G="modifi";var R0x="ditFields";var F3G="actionClass";var X0x="itFi";var p98=V4o;p98+=o3G;p98+=n3G;p98+=I32;var q98=s3o;q98+=o6o;q98+=t0G;var u98=q9o;u98+=l1o;u98+=W9o;u98+=p32;var L98=s0o;L98+=F3G;var k98=d3G;k98+=I4o;k98+=E8G;var Y98=L5o;Y98+=t1o;var G98=Z3G;G98+=I32;G98+=Q32;var E98=z0x;E98+=l32;var v98=I32;v98+=R0x;var P98=x5G;P98+=h0x;var that=this;var fields=this[p32][d6G];var count=y22;if(this[P98](function(){H0LL.o64();that[s3G](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === U0x){count=arg1;arg1=arg2;arg2=arg3;}this[p32][v98]={};H0LL.O64();for(var i=A22;i < count;i++){var K98=c0o;K98+=X0x;K98+=M0x;this[p32][K98][i]={fields:this[p32][d6G]};}var argOpts=this[D0x](arg1,arg2,arg3,arg4);this[p32][j1o]=t0x;this[p32][E98]=s3G;this[p32][G98]=W5o;this[F5o][J0x][n1G][Y98]=k98;this[L98]();this[P0x](this[u98]());$[v2o](fields,function(name,field){var e98=p32;e98+=I32;e98+=y32;field[v0x]();for(var i=A22;i < count;i++){field[t5G](i,field[A2o]());}field[e98](field[A2o]());});this[q98](p98,W5o,function(){var E0x="maybeOpen";H0LL.o64();var a98=C4o;a98+=g32;a98+=h2o;that[K0x]();that[J2G](argOpts[a98]);argOpts[E0x]();});return this;};Editor[e2o][G0x]=function(parent){var k0x="ep";var Y0x=".ed";var L0x="ndepen";var A98=Y0x;A98+=k0x;if(Array[Y3G](parent)){for(var i=A22,ien=parent[B8o];i < ien;i++){var I98=y7o;I98+=L0x;I98+=j4o;I98+=t0G;this[I98](parent[i]);}return this;}var field=this[Y1o](parent);$(field[b6G]())[C8G](A98);H0LL.o64();return this;};Editor[y98][u0x]=function(parent,url,opts){var q0x="chang";H0LL.O64();var e0x=".ede";var N98=e0x;N98+=g32;var B98=I32;B98+=o3o;B98+=l32;B98+=y32;var C98=C4o;C98+=l32;var f98=q0x;f98+=I32;var c98=q9o;c98+=m1o;if(Array[Y3G](parent)){for(var i=A22,ien=parent[B8o];i < ien;i++){this[u0x](parent[i],url,opts);}return this;}var that=this;var field=this[c98](parent);var ajaxOpts={type:p0x,dataType:a0x};opts=$[U5o]({event:f98,data:W5o,preUpdate:W5o,postUpdate:W5o},opts);var update=function(json){var V0x='enable';var f0x="ssage";var b0x='val';var y0x="tUpd";var c0x="sabl";var m0x='update';var x0x="preUpdate";var i0x='show';var j0x="preU";var O0x="tUpdat";var S0x='error';var l0x="pda";var H98=g32;H98+=I0x;var V98=A0x;V98+=y0x;V98+=A0o;V98+=u0o;var i98=L5o;i98+=c0x;i98+=I32;var S98=d4o;S98+=V4o;S98+=n7o;var b98=I32;b98+=A0o;b98+=I4o;b98+=d4o;var m98=o32;m98+=f0x;var l98=v7o;l98+=A0o;l98+=X0o;l98+=H0o;var j98=G4o;j98+=I4o;j98+=d4o;if(opts[x0x]){var x98=j0x;x98+=l0x;x98+=u0o;opts[x98](json);}$[j98]({labels:l98,options:m0x,values:b0x,messages:m98,errors:S0x},function(jsonProp,fieldFn){H0LL.o64();if(json[jsonProp]){$[v2o](json[jsonProp],function(field,val){that[Y1o](field)[fieldFn](val);});}});$[b98]([S98,i0x,V0x,i98],function(i,key){H0LL.o64();if(json[key]){that[key](json[key],json[l7G]);}});if(opts[V98]){var O98=A0x;O98+=O0x;O98+=I32;opts[O98](json);}field[H98](N8o);};$(field[b6G]())[C98](opts[B98] + N98,function(e){var N0x="targe";var C0x="editFi";var Q0x="values";var w0x="PlainObject";var o98=k5G;o98+=H0x;o98+=l32;var w98=j4o;w98+=W8G;w98+=A0o;var r98=Q32;r98+=C4o;r98+=J7o;r98+=p32;var W98=C0x;W98+=H0o;W98+=w0G;var Q98=Q32;Q98+=C4o;Q98+=B0x;var g98=N0x;g98+=y32;var T98=q9o;T98+=V4o;T98+=z5o;if($(field[b6G]())[T98](e[g98])[B8o] === A22){return;}field[U0G](Q8o);var data={};data[Q98]=that[p32][M5G]?_pluck(that[p32][W98],T0x):W5o;data[H6G]=data[r98]?data[g0x][A22]:W5o;data[Q0x]=that[V3o]();if(opts[w98]){var s98=F6o;s98+=N32;var ret=opts[s98](data);if(ret){opts[G5o]=ret;}}if(typeof url === o98){var o=url[b3G](that,field[V3o](),data,update);if(o){var F98=V8o;F98+=l1G;var n98=C4o;n98+=W0x;if(typeof o === n98 && typeof o[F98] === H0LL[418273]){var d98=y32;d98+=d4o;d98+=l1G;o[d98](function(resolved){if(resolved){update(resolved);}});}else {update(o);}}}else {var h18=Z8o;h18+=I32;h18+=z5o;var R18=A0o;R18+=r0x;R18+=D1o;var Z98=V4o;Z98+=p32;Z98+=w0x;if($[Z98](url)){var z18=Z8o;z18+=I32;z18+=l32;z18+=j4o;$[z18](ajaxOpts,url);}else {ajaxOpts[s0x]=url;}$[R18]($[h18](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[e2o][U18]=function(){var X4x='.dte';var Z0x="empl";var z4x="ear";var F0x="yCon";var d0x="troller";var o0x="destr";var K18=C4o;K18+=q9o;K18+=q9o;var P18=o0x;P18+=C4o;P18+=n4o;var J18=n0x;J18+=A0o;J18+=F0x;J18+=d0x;var D18=y32;D18+=Z0x;D18+=D7o;var M18=K1o;M18+=z4x;if(this[p32][R4x]){var X18=I4o;X18+=v7o;X18+=K7o;X18+=I32;this[X18]();}this[M18]();if(this[p32][D18]){var t18=h4x;t18+=n4o;$(t18)[l3o](this[p32][U4x]);}var controller=this[p32][J18];if(controller[P18]){var v18=n7o;v18+=o9o;v18+=n9o;controller[v18](this);}$(document)[K18](X4x + this[p32][M4x]);this[F5o]=W5o;this[p32]=W5o;};Editor[E18][G18]=function(name){var Y18=D4x;Y18+=d4o;var that=this;$[Y18](this[t4x](name),function(i,n){var k18=j4o;k18+=V4o;k18+=s9o;that[Y1o](n)[k18]();});return this;};Editor[e2o][u1o]=function(show){var J4x="yed";var u18=C4o;u18+=g32;H0LL.O64();u18+=I32;u18+=l32;if(show === undefined){var L18=I0o;L18+=V2o;L18+=J4x;return this[p32][L18];}return this[show?u18:f4G]();};Editor[e18][R4x]=function(){var q18=r9o;q18+=M0x;return $[P4x](this[p32][q18],function(field,name){H0LL.o64();return field[R4x]()?name:W5o;});};Editor[p18][v4x]=function(){var a18=l32;a18+=C4o;H0LL.o64();a18+=j4o;a18+=I32;return this[p32][q1G][a18](this);};Editor[e2o][I18]=function(items,arg1,arg2,arg3,arg4){var c18=C4o;c18+=g32;c18+=y32;c18+=p32;var y18=r9o;y18+=I32;y18+=Q6G;var that=this;if(this[K4x](function(){var A18=c32;H0LL.o64();A18+=y32;that[A18](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[D0x](arg1,arg2,arg3,arg4);this[S5G](items,this[E4x](y18,items),t0x,argOpts[c18],function(){var Y4x="Open";var G4x="maybe";var L4x="mOptions";var x18=G4x;x18+=Y4x;var f18=k4x;f18+=L4x;that[K0x]();that[f18](argOpts[q2o]);argOpts[x18]();});return this;};Editor[j18][u4x]=function(name){var l18=I32;l18+=E3G;l18+=d4o;var that=this;$[l18](this[t4x](name),function(i,n){var m18=q9o;m18+=V4o;m18+=H0o;m18+=j4o;H0LL.O64();that[m18](n)[u4x]();});return this;};Editor[b18][R3o]=function(name,msg){var S18=j4o;S18+=C4o;H0LL.O64();S18+=b4o;var wrapper=$(this[S18][z7G]);if(msg === undefined){this[e4x](this[F5o][q2G],name,Q8o,function(){var p4x="toggl";var a4x="eClas";var q4x="nFormEr";var V18=V4o;V18+=q4x;V18+=s2o;var i18=p4x;i18+=a4x;i18+=p32;wrapper[i18](V18,name !== undefined && name !== P8o);});this[p32][I4x]=name;}else {var O18=Q9o;O18+=v7o;O18+=j4o;this[O18](name)[R3o](msg);}return this;};Editor[H18][C18]=function(name){H0LL.o64();var A4x='Unknown field name - ';var B18=r9o;B18+=M0x;var fields=this[p32][B18];if(!fields[name]){throw A4x + name;}return fields[name];};Editor[e2o][N18]=function(){H0LL.O64();return $[P4x](this[p32][d6G],function(field,name){return name;});};Editor[T18][y8o]=_api_file;Editor[e2o][g18]=_api_files;Editor[Q18][m0G]=function(name){var s18=p4o;s18+=I32;s18+=y32;var w18=Q9o;w18+=W9o;var that=this;if(!name){var W18=r9o;W18+=x1o;W18+=p32;name=this[W18]();}if(Array[Y3G](name)){var out={};$[v2o](name,function(i,n){var r18=p4o;r18+=I32;r18+=y32;out[n]=that[Y1o](n)[r18]();});return out;}H0LL.o64();return this[w18](name)[s18]();};Editor[e2o][o18]=function(names,animate){var c4x="ames";var y4x="_fieldN";var F18=y4x;F18+=c4x;var n18=I32;n18+=A0o;n18+=I4o;n18+=d4o;var that=this;H0LL.o64();$[n18](this[F18](names),function(i,n){var d18=T9o;d18+=j4o;d18+=I32;that[Y1o](n)[d18](animate);});return this;};Editor[Z18][f4x]=function(includeHash){H0LL.O64();return $[P4x](this[p32][M5G],function(edit,idSrc){return includeHash === Q8o?x4x + idSrc:idSrc;});};Editor[z88][j4x]=function(inNames){var m4x="eldNames";var l4x="_fi";var S4x="inEr";var b4x="formEr";var h88=l4x;h88+=m4x;var R88=b4x;R88+=s2o;var formError=$(this[F5o][R88]);if(this[p32][I4x]){return Q8o;}var names=this[h88](inNames);for(var i=A22,ien=names[B8o];i < ien;i++){var U88=S4x;U88+=B7o;U88+=Q32;if(this[Y1o](names[i])[U88]()){return Q8o;}}return N8o;};Editor[X88][i4x]=function(cell,fieldName,opts){var V4x="lin";var r4x="inObje";var T4x="Sour";var H4x="_Field";var W4x="sPla";var O4x="v.D";var B4x="ividual";var e88=V4o;e88+=l32;e88+=V4x;e88+=I32;var u88=s0o;u88+=c0o;u88+=V4o;u88+=y32;var k88=C2G;k88+=B2G;var Y88=L5o;Y88+=O4x;Y88+=t4o;Y88+=H4x;var v88=V4o;v88+=C4x;v88+=b0o;v88+=I32;var P88=b0o;P88+=j4o;P88+=B4x;var J88=U9o;J88+=N4x;J88+=T4x;J88+=K0G;var t88=g4x;t88+=b0o;t88+=I32;var D88=I32;D88+=Q4x;D88+=I32;D88+=z5o;var M88=V4o;M88+=W4x;M88+=r4x;M88+=I6G;var that=this;if($[M88](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[D88]({},this[p32][A4G][t88],opts);var editFields=this[J88](P88,cell,fieldName);var node,field;var countOuter=A22,countInner;var closed=N8o;var classes=this[b2o][v88];$[v2o](editFields,function(i,editField){var s4x='Cannot edit more than one row inline at a time';var E88=G4o;E88+=w4x;var K88=W8G;K88+=m2G;if(countOuter > A22){throw s4x;}node=$(editField[K88][A22]);countInner=A22;$[E88](editField[o4x],function(j,f){var n4x="Cannot edit more than one field inline";var F4x=" at a time";if(countInner > A22){var G88=n4x;G88+=F4x;throw G88;}field=f;countInner++;});countOuter++;;});if($(Y88,node)[k88]){return this;}if(this[K4x](function(){var L88=b0o;L88+=V4x;L88+=I32;that[L88](cell,fieldName,opts);})){return this;}this[u88](cell,editFields,e88,opts,function(){var h7x="><";var q7x='Edge/';var v7x="<div cl";var J7x="<div cla";var z7x="line";var L7x="mO";var Y7x="rAge";var O7x="_focus";var D7x="\"DTE_Processing_Indicator\"><span></span></div>";var G7x="use";var p7x='style="width:';var C88=d4x;C88+=C4o;C88+=l32;C88+=p32;var H88=Z9G;H88+=z5o;var O88=Q32;O88+=I32;O88+=g32;O88+=Z4x;var V88=z7x;V88+=Q32;var i88=L5o;i88+=R7x;var S88=X6o;S88+=h7x;S88+=G1G;S88+=U7x;var b88=X7x;b88+=M7x;var m88=Z5G;m88+=D7x;var l88=X6o;l88+=t7x;var j88=J7x;j88+=P7x;var x88=X6o;x88+=M6o;var f88=v7x;f88+=x2o;f88+=K7x;var c88=g32;c88+=A32;c88+=X6o;var y88=J7o;y88+=E7x;y88+=d4o;var A88=G7x;A88+=Y7x;A88+=Z2o;var I88=k7x;I88+=Z2o;I88+=p32;var a88=g4x;a88+=V4o;a88+=l32;a88+=I32;var p88=S7o;p88+=x0o;p88+=O9o;p88+=l32;var q88=k4x;q88+=L7x;q88+=u7x;var namespace=that[q88](opts);var ret=that[p88](a88);if(!ret){return that;}var children=node[I88]()[x3o]();var style=navigator[A88][e7x](q7x) !== -y22?p7x + node[y88]() + c88:P8o;node[l3o]($(f88 + classes[z7G] + x88 + j88 + classes[Y2G] + l88 + style + u0G + m88 + B5o + q5o + classes[b88] + S88 + B5o));node[a7x](i88 + classes[V88][O88](/ /g,I7x))[l3o](field[b6G]())[H88](that[F5o][q2G]);if(opts[C88]){var g88=d4x;g88+=C4o;g88+=l32;g88+=p32;var T88=z6G;T88+=g32;T88+=I32;T88+=z5o;var N88=A7x;N88+=y7x;var B88=j4o;B88+=K6o;B88+=c7x;node[a7x](B88 + classes[N88][a0G](/ /g,I7x))[T88](that[F5o][g88]);}that[y2G](function(submitComplete,action){var l7x="tents";var j7x="det";var x7x="cInfo";var w88=f7x;w88+=b4o;H0LL.o64();w88+=V4o;w88+=x7x;var Q88=c32;Q88+=y32;closed=Q8o;$(document)[C8G](z2o + namespace);if(!submitComplete || action !== Q88){var r88=j7x;r88+=D1G;var W88=j2o;W88+=l7x;node[W88]()[r88]();node[l3o](children);}that[w88]();return m7x;;});setTimeout(function(){var s88=I4o;s88+=v7o;s88+=Z32;s88+=E8G;H0LL.o64();if(closed){return;}$(document)[z0o](s88 + namespace,function(e){var b7x="Back";var i7x='andSelf';var S7x="addBack";var V7x="blu";var F88=C4o;F88+=J7o;F88+=l32;F88+=p32;var n88=s0o;n88+=r32;n88+=Z4o;n88+=l32;var o88=A2G;o88+=b7x;var back=$[E8o][S7x]?o88:i7x;if(!field[n88](F88,e[X9G]) && $[r3o](node[A22],$(e[X9G])[H2o]()[back]()) === -y22){var d88=V7x;d88+=Q32;that[d88]();}});},A22);that[O7x]([field],opts[t2o]);that[H7x](m7x,Q8o);});return this;};Editor[e2o][Z88]=function(name,msg){if(msg === undefined){this[e4x](this[F5o][p2G],name);}else {var R68=N5G;R68+=A0o;R68+=C7o;var z68=e32;z68+=j4o;this[z68](name)[R68](msg);}return this;};Editor[e2o][j1o]=function(mode){var N7x="Not curren";var g7x="editing mode";var T7x="tly in an ";var W7x='Changing from create mode is not supported';var X68=E3G;X68+=C7x;var h68=A0o;h68+=B7x;if(!mode){return this[p32][f3G];}if(!this[p32][h68]){var U68=N7x;U68+=T7x;U68+=g7x;throw new Error(U68);}else if(this[p32][f3G] === Q7x && mode !== Q7x){throw new Error(W7x);}this[p32][X68]=mode;return this;};Editor[e2o][m6G]=function(){var r7x="odif";var M68=b4o;M68+=r7x;M68+=l1o;M68+=Q32;return this[p32][M68];};Editor[e2o][w7x]=function(fieldNames){var s7x="iel";var J68=q9o;J68+=s7x;J68+=j4o;var that=this;if(fieldNames === undefined){var D68=Y1o;D68+=p32;fieldNames=this[D68]();}if(Array[Y3G](fieldNames)){var out={};$[v2o](fieldNames,function(i,name){var t68=Q9o;H0LL.o64();t68+=v7o;t68+=j4o;out[name]=that[t68](name)[w7x]();});return out;}return this[J68](fieldNames)[w7x]();};Editor[P68][v68]=function(fieldNames,val){var F7x="multiS";var o7x="isP";var n7x="ainObject";var K68=o7x;H0LL.o64();K68+=v7o;K68+=n7x;var that=this;if($[K68](fieldNames) && val === undefined){$[v2o](fieldNames,function(name,value){var E68=q9o;E68+=V4o;E68+=I32;E68+=W9o;that[E68](name)[t5G](value);});}else {var G68=F7x;G68+=I32;G68+=y32;this[Y1o](fieldNames)[G68](val);}return this;};Editor[e2o][b6G]=function(name){var q68=l32;q68+=p1o;q68+=I32;var e68=q9o;e68+=l1o;e68+=W9o;var k68=V4o;k68+=d7x;var that=this;if(!name){var Y68=C4o;Y68+=Q32;Y68+=n7o;Y68+=Q32;name=this[Y68]();}H0LL.O64();return Array[k68](name)?$[P4x](name,function(n){var u68=l32;u68+=C4o;u68+=j4o;u68+=I32;var L68=e32;L68+=j4o;return that[L68](n)[u68]();}):this[e68](name)[q68]();};Editor[p68][a68]=function(name,fn){var I68=C4o;I68+=q9o;H0LL.o64();I68+=q9o;$(this)[I68](this[Z7x](name),fn);return this;};Editor[e2o][z0o]=function(name,fn){$(this)[z0o](this[Z7x](name),fn);return this;};Editor[A68][z9x]=function(name,fn){var h9x="Na";var y68=R9x;y68+=t0G;y68+=h9x;H0LL.o64();y68+=o32;$(this)[z9x](this[y68](name),fn);return this;};Editor[e2o][c68]=function(){var X9x="splayControl";var D9x="_preop";var P9x="yReorde";var J9x="_dis";var t9x="seRe";var O68=J7o;O68+=T6G;O68+=U9x;O68+=Q32;var V68=L5o;V68+=X9x;V68+=M9x;var i68=b4o;i68+=A0o;i68+=V4o;i68+=l32;var S68=D9x;S68+=l1G;var x68=v9o;x68+=t9x;x68+=p4o;var f68=J9x;f68+=V2o;f68+=P9x;f68+=Q32;var that=this;this[f68]();this[x68](function(){H0LL.O64();that[p32][q1G][n4G](that,function(){var K9x="DynamicInfo";var v9x="_clear";var b68=D8G;b68+=V4o;b68+=l32;var m68=I4o;m68+=R3G;m68+=p1G;m68+=j4o;var l68=s3o;l68+=i3G;var j68=v9x;j68+=K9x;that[j68]();that[l68](m68,[b68]);});});var ret=this[S68](i68);if(!ret){return this;}this[p32][V68][O5G](this,this[F5o][O68],function(){var k9x="_foc";var E9x="opene";var Y9x="ocu";var g68=z0x;g68+=l32;var T68=E9x;T68+=j4o;var N68=G9x;N68+=y32;var B68=q9o;B68+=Y9x;B68+=p32;var H68=k9x;H68+=y7o;H68+=p32;that[H68]($[P4x](that[p32][K5G],function(name){var C68=q9o;C68+=l1o;C68+=Q6G;return that[p32][C68][name];}),that[p32][u5G][B68]);that[N68](T68,[t0x,that[p32][g68]]);});this[H7x](t0x,N8o);return this;};Editor[Q68][W68]=function(set){var u9x="jo";var A9x="All fields, and no additional fields, must be provided for ordering.";var p9x="sort";var d68=L9x;d68+=Q32;var F68=u9x;F68+=b0o;var n68=p32;n68+=C4o;n68+=e9x;var o68=C4o;o68+=Q32;o68+=Y4o;if(!set){var r68=C4o;r68+=Q32;r68+=Y4o;return this[p32][r68];}if(arguments[B8o] && !Array[Y3G](set)){var s68=q9x;s68+=V4o;s68+=K0G;var w68=g32;w68+=Q32;w68+=N9o;w68+=I32;set=Array[w68][s68][b3G](arguments);}if(this[p32][o68][Y2o]()[p9x]()[a9x](I9x) !== set[Y2o]()[n68]()[F68](I9x)){throw A9x;}$[U5o](this[p32][d68],set);this[P0x]();return this;};Editor[e2o][X1G]=function(items,arg1,arg2,arg3,arg4){var i9x='initRemove';var j9x="ier";var y9x="nod";var x9x="modif";var l9x="_cru";var P58=j4o;P58+=N4x;var J58=y9x;J58+=I32;var t58=s5o;t58+=n3o;var D58=L5o;D58+=p32;D58+=d3o;D58+=Z3o;var M58=c9x;M58+=b4o;var X58=f9x;X58+=f1o;X58+=M0x;var U58=x9x;U58+=j9x;var h58=M3G;h58+=D3G;h58+=I32;H0LL.O64();var R58=Q9o;R58+=v7o;R58+=j4o;R58+=p32;var z58=l9x;z58+=J9o;var Z68=v7o;Z68+=I32;Z68+=m9x;Z68+=d4o;var that=this;if(this[K4x](function(){H0LL.O64();that[X1G](items,arg1,arg2,arg3,arg4);})){return this;}if(items[Z68] === undefined){items=[items];}var argOpts=this[z58](arg1,arg2,arg3,arg4);var editFields=this[E4x](R58,items);this[p32][f3G]=h58;this[p32][U58]=items;this[p32][X58]=editFields;this[F5o][M58][n1G][D58]=t58;this[b9x]();this[S9x](i9x,[_pluck(editFields,J58),_pluck(editFields,P58),items],function(){var V9x="tMultiRe";var v58=w6G;v58+=V9x;v58+=c4o;v58+=o3o;H0LL.O64();that[S9x](v58,[editFields,items],function(){var N9x="mbleMain";var T9x="eq";var C9x="beOpen";var Y58=q9o;Y58+=C4o;Y58+=I4o;Y58+=P1o;var G58=f9x;G58+=O9x;G58+=H9x;var E58=b4o;E58+=Z3o;E58+=C9x;var K58=s0o;K58+=B9x;K58+=I32;K58+=N9x;that[K58]();that[J2G](argOpts[q2o]);argOpts[E58]();var opts=that[p32][G58];if(opts[Y58] !== W5o){var L58=j4o;L58+=C4o;L58+=b4o;var k58=X0o;k58+=y7o;k58+=p3G;k58+=z0o;$(k58,that[L58][I2G])[T9x](opts[t2o])[t2o]();}});});return this;};Editor[u58][e58]=function(set,val){var q58=G4o;H0LL.O64();q58+=I4o;q58+=d4o;var that=this;if(!$[l5G](set)){var o={};o[set]=val;set=o;}$[q58](set,function(n,v){var p58=q9o;p58+=V4o;p58+=H0o;p58+=j4o;that[p58](n)[b0G](v);});return this;};Editor[a58][I58]=function(names,animate){var that=this;$[v2o](this[t4x](names),function(i,n){H0LL.O64();that[Y1o](n)[d4G](animate);});return this;};Editor[e2o][s0G]=function(successCallback,errorCallback,formatdata,hide){var j58=G4o;j58+=I4o;j58+=d4o;var f58=n2o;f58+=Q32;var A58=r9o;A58+=M0x;var that=this,fields=this[p32][A58],errorFields=[],errorReady=A22,sent=N8o;if(this[p32][U0G] || !this[p32][f3G]){return this;}this[g9x](Q8o);var send=function(){var Q9x='initSubmit';var y58=M0o;y58+=O8o;y58+=V8o;if(errorFields[y58] !== errorReady || sent){return;}that[S9x](Q9x,[that[p32][f3G]],function(result){var W9x="_processi";if(result === N8o){var c58=W9x;c58+=l32;c58+=p4o;that[c58](N8o);return;}sent=Q8o;that[r9x](successCallback,errorCallback,formatdata,hide);});};this[f58]();$[v2o](fields,function(name,field){H0LL.O64();var w9x="inErro";var x58=w9x;x58+=Q32;if(field[x58]()){errorFields[A8o](name);}});$[j58](errorFields,function(i,name){H0LL.o64();fields[name][R3o](P8o,function(){H0LL.o64();errorReady++;send();});});send();return this;};Editor[e2o][U4x]=function(set){var n9x="emplat";var o9x="late";var m58=y32;m58+=s9x;m58+=o9x;if(set === undefined){var l58=y32;l58+=n9x;l58+=I32;return this[p32][l58];}this[p32][m58]=set === W5o?W5o:$(set);return this;};Editor[e2o][a2G]=function(title){var d9x="heade";var z1x="header";var O58=d0G;H0LL.o64();O58+=F9x;O58+=l32;var i58=K1o;i58+=x2o;i58+=p32;i58+=w7o;var S58=d9x;S58+=Q32;var b58=j4o;b58+=C4o;b58+=b4o;var header=$(this[b58][S58])[o4G](Z9x + this[i58][z1x][s4G]);if(title === undefined){var V58=d4o;V58+=y32;V58+=a3G;return header[V58]();}if(typeof title === O58){var C58=y32;C58+=A0o;C58+=X0o;C58+=M0o;var H58=r4o;H58+=g32;H58+=V4o;title=title(this,new DataTable[H58](this[p32][C58]));}header[j3o](title);return this;};Editor[e2o][V3o]=function(field,value){var R1x="isPlainOb";var T58=p4o;T58+=I32;T58+=y32;var B58=R1x;B58+=g8o;B58+=y32;H0LL.O64();if(value !== undefined || $[B58](field)){var N58=p32;N58+=I32;N58+=y32;return this[N58](field,value);}return this[T58](field);;};var apiRegister=DataTable[g58][h1x];function __getInst(api){var X1x="oIni";var D1x="_editor";var M1x="context";var W58=c0o;W58+=U1x;var Q58=X1x;Q58+=y32;var ctx=api[M1x][A22];return ctx[Q58][W58] || ctx[D1x];}function __setBasic(inst,opts,type,plural){var t1x="_bas";var E1x=/%d/;var G1x='1';if(!opts){opts={};}if(opts[I2G] === undefined){var r58=t1x;r58+=V4o;r58+=I4o;opts[I2G]=r58;}H0LL.o64();if(opts[a2G] === undefined){var w58=y32;w58+=J1x;opts[a2G]=inst[h5o][type][w58];}if(opts[C5o] === undefined){if(type === P1x){var o58=x0o;o58+=g32;o58+=G0G;o58+=I32;var s58=V4o;s58+=i1o;s58+=v1x;var confirm=inst[s58][type][K1x];opts[C5o]=plural !== y22?confirm[s0o][o58](E1x,plural):confirm[G1x];}else {opts[C5o]=P8o;}}return opts;}apiRegister(n58,function(){return __getInst(this);});apiRegister(Y1x,function(opts){var F58=I4o;F58+=a6G;F58+=I32;var inst=__getInst(this);inst[F58](__setBasic(inst,opts,Q7x));return this;});apiRegister(d58,function(opts){var Z58=I32;Z58+=j4o;Z58+=D4G;H0LL.o64();var inst=__getInst(this);inst[Z58](this[A22][A22],__setBasic(inst,opts,k1x));return this;});apiRegister(z28,function(opts){H0LL.o64();var inst=__getInst(this);inst[f9x](this[A22],__setBasic(inst,opts,k1x));return this;});apiRegister(L1x,function(opts){var R28=M3G;R28+=C4o;H0LL.O64();R28+=o3o;var inst=__getInst(this);inst[X1G](this[A22][A22],__setBasic(inst,opts,R28,y22));return this;});apiRegister(h28,function(opts){var inst=__getInst(this);inst[X1G](this[A22],__setBasic(inst,opts,P1x,this[A22][B8o]));return this;});apiRegister(u1x,function(type,opts){var p1x="ine";var e1x="PlainObj";var U28=i2o;U28+=e1x;U28+=q1x;if(!type){type=m7x;}else if($[U28](type)){var X28=g4x;X28+=p1x;opts=type;type=X28;}__getInst(this)[type](this[A22][A22],opts);return this;});apiRegister(M28,function(opts){H0LL.o64();__getInst(this)[b5G](this[A22],opts);return this;});apiRegister(D28,_api_file);apiRegister(a1x,_api_files);$(document)[t28](I1x,function(e,ctx,json){var y1x='dt';if(e[A1x] !== y1x){return;}if(json && json[l8o]){$[v2o](json[l8o],function(name,files){var P28=y8o;P28+=p32;var J28=x4o;J28+=j4o;if(!Editor[l8o][name]){Editor[l8o][name]={};}$[J28](Editor[P28][name],files);});}});Editor[v28]=function(msg,tn){H0LL.o64();var c1x=' For more information, please refer to https://datatables.net/tn/';throw tn?msg + c1x + tn:msg;};Editor[K28]=function(data,props,fn){var x1x='label';var E28=f1x;E28+=z5o;var i,ien,dataPoint;H0LL.O64();props=$[E28]({label:x1x,value:j1x},props);if(Array[Y3G](data)){var G28=v7o;G28+=l1x;for((i=A22,ien=data[G28]);i < ien;i++){dataPoint=data[i];if($[l5G](dataPoint)){var u28=A0o;u28+=m1x;var L28=b1x;L28+=v7o;var k28=o6o;k28+=Q0G;var Y28=v7o;Y28+=O6o;fn(dataPoint[props[S1x]] === undefined?dataPoint[props[Y28]]:dataPoint[props[k28]],dataPoint[props[L28]],i,dataPoint[u28]);}else {fn(dataPoint,dataPoint,i);}}}else {var e28=D4x;e28+=d4o;i=A22;$[e28](data,function(key,val){fn(val,key,i);H0LL.o64();i++;});}};Editor[q28]=function(id){var p28=v0G;p28+=E3G;p28+=I32;return id[p28](/\./g,I9x);};Editor[i1x]=function(editor,conf,files,progressCallback,completeCallback){var g1x="onload";var T1x="<i>Uploading file</i>";var B1x="A server ";var N1x="error occurred while uploading the file";var V1x="ReadText";var K8x="readAsDataURL";var H1x="ctio";var W8x="itLeft";var C38=b4o;C38+=A0o;C38+=g32;var c28=y8o;c28+=V1x;var A28=O1x;A28+=H1x;A28+=l32;var I28=C1x;I28+=A32;var a28=l32;a28+=A0o;a28+=b4o;a28+=I32;var reader=new FileReader();var counter=A22;var ids=[];var generalError=B1x;generalError+=N1x;editor[R3o](conf[a28],P8o);if(typeof conf[I28] === A28){var y28=C1x;y28+=A32;conf[y28](files,function(ids){H0LL.o64();completeCallback[b3G](editor,ids);});return;}progressCallback(conf,conf[c28] || T1x);reader[g1x]=function(e){var s1x="isPl";var h8x='uploadField';var W1x="mit.DTE_Up";var M8x="No Ajax opt";var P8x='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var t8x=" upload plug-in";var U8x="xDat";var n1x="Obje";var D8x="ion specified for";var F1x="jax";var R8x='upload';var Q1x="reSub";var z8x="appen";var v8x='preUpload';var d1x="ja";var w1x="nam";var Z1x="ploa";var h38=A0x;h38+=y32;var R38=x4o;R38+=j4o;var z38=g32;z38+=Q1x;z38+=W1x;z38+=r1x;var F28=w1x;F28+=I32;var n28=F6o;n28+=y32;n28+=A0o;var o28=s1x;o28+=o1x;o28+=n1x;o28+=I6G;var W28=k5G;W28+=C7x;var Q28=p32;Q28+=L0G;var N28=M1o;N28+=D1o;var V28=A0o;V28+=F1x;var S28=A0o;S28+=d1x;S28+=A32;S28+=s6o;var b28=y7o;b28+=Z1x;b28+=j4o;var m28=z8x;m28+=j4o;var l28=l32;l28+=A0o;l28+=o32;var j28=Z9G;j28+=l32;j28+=j4o;var x28=A0o;x28+=I4o;x28+=H0x;x28+=l32;var f28=A0o;f28+=g32;f28+=I7o;f28+=z5o;var data=new FormData();var ajax;data[f28](x28,R8x);data[j28](h8x,conf[l28]);data[m28](b28,files[counter]);if(conf[S28]){var i28=C1x;i28+=U8x;i28+=A0o;conf[i28](data,files[counter],counter);}if(conf[V28]){var O28=M1o;O28+=A0o;O28+=A32;ajax=conf[O28];}else if($[l5G](editor[p32][G5G])){var B28=X8x;B28+=C4o;B28+=A0o;B28+=j4o;var C28=X8x;C28+=C4o;C28+=F2o;var H28=C1x;H28+=A32;ajax=editor[p32][H28][C28]?editor[p32][G5G][B28]:editor[p32][G5G];}else if(typeof editor[p32][N28] === y3G){var T28=M1o;T28+=A0o;T28+=A32;ajax=editor[p32][T28];}if(!ajax){var g28=M8x;g28+=D8x;g28+=t8x;throw new Error(g28);}if(typeof ajax === Q28){ajax={url:ajax};}if(typeof ajax[G5o] === W28){var w28=I32;w28+=D1G;var r28=p32;r28+=J8x;r28+=b0o;r28+=p4o;var d={};var ret=ajax[G5o](d);if(ret !== undefined && typeof ret !== r28){d=ret;}$[w28](d,function(key,value){var s28=R9G;H0LL.o64();s28+=G9G;data[s28](key,value);});}else if($[o28](ajax[n28])){throw new Error(P8x);}var preRet=editor[S9x](v8x,[conf[F28],files[counter],data]);if(preRet === N8o){var d28=x0G;d28+=d4o;if(counter < files[d28] - y22){counter++;reader[K8x](files[counter]);}else {var Z28=I4o;Z28+=A0o;Z28+=v7o;Z28+=v7o;completeCallback[Z28](editor,ids);}return;}var submit=N8o;editor[z0o](z38,function(){H0LL.O64();submit=Q8o;return N8o;});$[G5G]($[R38]({},ajax,{type:h38,data:data,dataType:a0x,contentType:N8o,processData:N8o,xhr:function(){var G8x="ajaxSettings";var k8x="prog";var E8x="loa";var L8x="oa";var Y8x="den";var X38=L3G;X38+=E8x;X38+=j4o;H0LL.O64();var U38=A32;U38+=d4o;U38+=Q32;var xhr=$[G8x][U38]();if(xhr[X38]){var E38=z0o;E38+=E8x;E38+=Y8x;E38+=j4o;var D38=z0o;D38+=k8x;D38+=E6o;D38+=p32;var M38=X8x;M38+=L8x;M38+=j4o;xhr[M38][D38]=function(e){var a8x="%";var I8x=':';var u8x="Compu";var p8x="total";var q8x="xed";var t38=B8o;t38+=u8x;t38+=e8x;t38+=I32;if(e[t38]){var K38=i8o;K38+=V8o;var v38=C2G;v38+=p4o;v38+=V8o;var P38=d9o;P38+=Z4o;P38+=V4o;P38+=q8x;var J38=R3G;J38+=A0o;J38+=n7o;J38+=j4o;var percent=(e[J38] / e[p8x] * z32)[P38](A22) + a8x;progressCallback(conf,files[v38] === y22?percent:counter + I8x + files[K38] + p5o + percent);}};xhr[i1x][E38]=function(e){var c8x="processi";var f8x="ngText";var A8x="Proc";H0LL.o64();var Y38=A8x;Y38+=y8x;Y38+=O8o;var G38=c8x;G38+=f8x;progressCallback(conf,conf[G38] || Y38);};}return xhr;},success:function(json){var j8x="oadXhrSuccess";var l8x="Submit.DTE_U";var i8x="rors";var x8x="dErr";var S8x="eldEr";var A38=y7o;A38+=g32;A38+=r1x;H0LL.o64();var a38=n2o;a38+=Q32;var q38=v7o;q38+=l1G;q38+=p4o;q38+=V8o;var e38=e32;e38+=x8x;e38+=C4o;e38+=e9o;var u38=X8x;u38+=j8x;var L38=T5G;L38+=l8x;L38+=m8x;var k38=C4o;k38+=q9o;k38+=q9o;editor[k38](L38);editor[S9x](u38,[conf[E5o],json]);if(json[e38] && json[b8x][q38]){var p38=q9o;p38+=V4o;p38+=S8x;p38+=i8x;var errors=json[p38];for(var i=A22,ien=errors[B8o];i < ien;i++){editor[R3o](errors[i][E5o],errors[i][V8x]);}}else if(json[a38]){var I38=n2o;I38+=Q32;editor[I38](json[R3o]);}else if(!json[i1x] || !json[A38][c5o]){var c38=Q6o;c38+=o32;var y38=Q4o;y38+=B7o;y38+=Q32;editor[y38](conf[c38],generalError);}else {var m38=M0o;m38+=O8x;var l38=V4o;l38+=j4o;if(json[l8o]){var f38=G4o;f38+=I4o;f38+=d4o;$[f38](json[l8o],function(table,files){var j38=H8x;j38+=u0o;j38+=z5o;if(!Editor[l8o][table]){var x38=q9o;x38+=p9o;x38+=I32;x38+=p32;Editor[x38][table]={};}$[j38](Editor[l8o][table],files);});}ids[A8o](json[i1x][l38]);if(counter < files[m38] - y22){counter++;reader[K8x](files[counter]);}else {var b38=I4o;b38+=D2o;b38+=v7o;completeCallback[b38](editor,ids);if(submit){var S38=p32;S38+=C8x;S38+=K3G;editor[S38]();}}}progressCallback(conf);},error:function(xhr){var T8x='uploadXhrError';H0LL.O64();var H38=l32;H38+=B8x;var O38=G9x;O38+=y32;var V38=l32;V38+=A0o;V38+=b4o;V38+=I32;var i38=N8x;i38+=g0o;editor[i38](conf[V38],generalError);editor[O38](T8x,[conf[H38],xhr]);progressCallback(conf);}}));};files=$[C38](files,function(val){H0LL.o64();return val;});if(conf[g8x] !== undefined){var N38=v7o;N38+=l1G;N38+=W2G;N38+=d4o;var B38=Q8x;B38+=V4o;B38+=b4o;B38+=W8x;files[E5G](conf[B38],files[N38]);}reader[K8x](files[A22]);};Editor[T38][q8o]=function(init){var n8x="init.dt.dt";var z5x="tag";var s8x="iq";var o8x="xhr.dt.";var K6x="<div data-dte-e=\"for";var Y6x="\" cl";var S6x="te-e=\"body\" class=\"";var a6x="orm_co";var C6x="processing\" class=\"";var B6x="div class=\"";var m6x="ody_content\" class=\"";var s6x="actionName";var j6x="lass=\"";var O6x="a-d";var h5x='"><div class="';var X6x="<div da";var g6x="egacyAjax";var p5x='initComplete';var y6x="oot";var v5x="events";var V6x="<div dat";var w6x="defa";var Q6x="ajaxUr";var w8x="igge";var R5x="info";var W6x="bT";var l6x="div data-dte-e=\"b";var E6x="m_info\" class=\"";var R6x="_content";var q6x="<div data-dte-";var u6x="orm>";var I6x="ntent\" class=\"";var n6x="domTable";var A6x="/div";var Z6x='<form data-dte-e="form" class="';var f6x="<div data-dte-e=\"foot";var v6x="\"head\" class=\"";var U5x='"></div></div>';var Z8x="oo";var H6x="te-e=\"";var M6x="ta-dte-e=\"form_buttons\" class=";var L6x="/f";var b6x="data-d";var d8x="body_con";var p6x="e=\"f";var P6x="a-dte-e=";var i6x="dicator";var G6x="dte-e=\"form_error";var h6x="formC";var c6x="foot";var k4q=w6G;k4q+=y32;k4q+=r8x;k4q+=U1x;var Y4q=J8x;Y4q+=w8x;Y4q+=Q32;var G4q=d7o;G4q+=l32;G4q+=y32;var X4q=y7o;X4q+=l32;X4q+=s8x;X4q+=o8o;var U4q=o8x;U4q+=c6o;var Z0q=n8x;Z0q+=I32;var d0q=q9o;d0q+=F8x;var F0q=d8x;F0q+=u0o;F0q+=Z2o;var n0q=N7G;n0q+=P4o;var o0q=q9o;o0q+=C4o;o0q+=C4o;o0q+=y32;var s0q=q9o;s0q+=Z8x;s0q+=z6x;var w0q=J0x;w0q+=R6x;var r0q=h6x;r0q+=C4o;r0q+=t7G;r0q+=Z2o;var W0q=j4o;W0q+=G3o;var i0q=X6o;i0q+=U6x;var S0q=U1o;S0q+=y32;S0q+=y32;S0q+=y4o;var b0q=S0o;b0q+=z4o;var m0q=X6x;m0q+=M6x;m0q+=X6o;var l0q=j2o;l0q+=y32;l0q+=I32;l0q+=Z2o;var j0q=d4o;j0q+=I32;j0q+=D6x;var x0q=J7o;x0q+=Q32;x0q+=R9G;x0q+=Q4o;var f0q=d4o;f0q+=G4o;f0q+=j4o;f0q+=Q4o;var c0q=t6x;c0q+=J6x;c0q+=P6x;c0q+=v6x;var y0q=K6x;y0q+=E6x;var A0q=I32;A0q+=Q32;A0q+=s2o;var I0q=y6o;I0q+=G6x;I0q+=Y6x;I0q+=k6x;var a0q=Y6o;a0q+=L6x;a0q+=u6x;var p0q=j6o;p0q+=e6x;p0q+=o6o;p0q+=M6o;var q0q=k7x;q0q+=Z2o;var e0q=S0o;e0q+=z4o;var u0q=q6x;u0q+=p6x;u0q+=a6x;u0q+=I6x;var L0q=q9o;L0q+=g0o;L0q+=b4o;var k0q=Y6o;k0q+=A6x;k0q+=M6o;var Y0q=X6o;Y0q+=U6x;var G0q=q9o;G0q+=y6x;G0q+=I32;G0q+=Q32;var E0q=c6x;E0q+=Q4o;var K0q=f6x;K0q+=x6x;K0q+=j6x;var v0q=Y6o;v0q+=G1G;v0q+=U7x;var P0q=m4o;P0q+=Z2o;P0q+=t0G;var J0q=Y6o;J0q+=l6x;J0q+=m6x;var t0q=B9G;t0q+=q8G;var D0q=X0o;D0q+=C4o;D0q+=j4o;D0q+=n4o;var M0q=t6x;M0q+=b6x;M0q+=S6x;var X0q=b0o;X0q+=i6x;var U0q=V6x;U0q+=O6x;U0q+=H6x;U0q+=C6x;var h0q=J7o;h0q+=p6G;h0q+=q8G;var R0q=Y6o;R0q+=B6x;H0LL.O64();var z0q=I4o;z0q+=N6x;z0q+=p1G;z0q+=p32;var Z38=G3G;Z38+=l32;var d38=x32;d38+=j32;d38+=l32;var F38=T6x;F38+=w7o;var n38=v7o;n38+=g6x;var o38=d4o;o38+=y32;o38+=b4o;o38+=v7o;var s38=y32;s38+=A0o;s38+=X0o;s38+=M0o;var w38=C1x;w38+=A32;var r38=Q6x;r38+=v7o;var W38=j4o;W38+=W6x;W38+=A0o;W38+=c2o;var Q38=F5o;Q38+=r6x;var g38=w6x;g38+=c1o;init=$[U5o](Q8o,{},Editor[g38],init);this[p32]=$[U5o](Q8o,{},Editor[I4G][P5o],{actionName:init[s6x],table:init[Q38] || init[x6G],dbTable:init[W38] || W5o,ajaxUrl:init[r38],ajax:init[w38],idSrc:init[o6x],dataSource:init[n6x] || init[s38]?Editor[F6x][G8o]:Editor[F6x][o38],formOptions:init[A4G],legacyAjax:init[n38],template:init[U4x]?$(init[U4x])[x3o]():W5o});this[F38]=$[U5o](Q8o,{},Editor[b2o]);this[d38]=init[Z38];Editor[I4G][P5o][M4x]++;var that=this;var classes=this[z0q];this[F5o]={"wrapper":$(R0q + classes[h0q] + f5o + U0q + classes[U0G][X0q] + Q5o + M0q + classes[D0q][t0q] + f5o + J0q + classes[d6x][P0q] + k2G + v0q + K0q + classes[E0q][z7G] + f5o + q5o + classes[G0q][s4G] + Y0q + k0q + B5o)[A22],"form":$(Z6x + classes[L0q][z5x] + f5o + u0q + classes[e0q][q0q] + p0q + a0q)[A22],"formError":$(I0q + classes[J0x][A0q] + k2G)[A22],"formInfo":$(y0q + classes[J0x][R5x] + k2G)[A22],"header":$(c0q + classes[f0q][x0q] + h5x + classes[j0q][l0q] + U5x)[A22],"buttons":$(m0q + classes[b0q][S0q] + i0q)[A22]};if($[E8o][G8o][X5x]){var C0q=x0o;C0q+=H0G;var H0q=I32;H0q+=A0o;H0q+=I4o;H0q+=d4o;var O0q=V4o;O0q+=M5x;var V0q=q9o;V0q+=l32;var ttButtons=$[V0q][G8o][X5x][D5x];var i18n=this[O0q];$[H0q]([Q7x,k1x,C0q],function(i,val){var J5x="uttonText";var t5x="B";var T0q=U1o;T0q+=F2G;T0q+=l32;var N0q=p32;N0q+=t5x;N0q+=J5x;var B0q=I32;B0q+=L5o;B0q+=P5x;B0q+=s0o;ttButtons[B0q + val][N0q]=i18n[val][T0q];});}$[v2o](init[v5x],function(evt,fn){H0LL.o64();that[z0o](evt,function(){var Q0q=p32;Q0q+=T9o;Q0q+=q9o;Q0q+=y32;var g0q=I4o;g0q+=A0o;g0q+=G2o;var args=Array[e2o][Y2o][g0q](arguments);args[Q0q]();fn[u2o](that,args);});});var dom=this[W0q];var wrapper=dom[z7G];dom[r0q]=_editor_el(w0q,dom[J0x])[A22];dom[s0q]=_editor_el(o0q,wrapper)[A22];dom[d6x]=_editor_el(n0q,wrapper)[A22];dom[K5x]=_editor_el(F0q,wrapper)[A22];dom[U0G]=_editor_el(E5x,wrapper)[A22];if(init[d0q]){this[A2G](init[d6G]);}$(document)[z0o](Z0q + this[p32][M4x],function(e,settings,json){var R4q=l32;R4q+=G5x;R4q+=X0o;R4q+=M0o;var z4q=y32;z4q+=j7o;if(that[p32][z4q] && settings[R4q] === $(that[p32][x6G])[m0G](A22)){var h4q=Y5x;h4q+=d9o;h4q+=Q32;settings[h4q]=that;}})[z0o](U4q + this[p32][X4q],function(e,settings,json){var k5x="nTa";var u5x="nsUpdate";H0LL.o64();var J4q=p4o;J4q+=I32;J4q+=y32;var t4q=N32;t4q+=X0o;t4q+=v7o;t4q+=I32;var D4q=k5x;D4q+=c2o;var M4q=N32;M4q+=X0o;M4q+=v7o;M4q+=I32;if(json && that[p32][M4q] && settings[D4q] === $(that[p32][t4q])[J4q](A22)){var P4q=L5x;P4q+=u5x;that[P4q](json);}});try{var K4q=V4o;K4q+=l32;K4q+=V4o;K4q+=y32;var v4q=j4o;v4q+=i2o;v4q+=d3o;v4q+=Z3o;this[p32][q1G]=Editor[v4q][init[u1o]][K4q](this);}catch(e){var q5x="nd display controller ";var e5x="Cannot fi";var E4q=e5x;E4q+=q5x;throw E4q + init[u1o];}this[G4q](p5x,[]);$(document)[Y4q](k4q,[this]);};Editor[L4q][b9x]=function(){var A5x="oveCla";var y5x="lasses";var c4q=Q32;c4q+=a5x;c4q+=o3o;var A4q=I32;A4q+=j4o;A4q+=V4o;A4q+=y32;var I4q=Q32;I4q+=I32;I4q+=H0G;H0LL.o64();var a4q=I32;a4q+=L5o;a4q+=y32;var p4q=I4o;p4q+=I5x;var q4q=M3G;q4q+=A5x;q4q+=q4G;var e4q=E3G;e4q+=H0x;e4q+=y7x;var u4q=I4o;u4q+=y5x;var classesActions=this[u4q][e4q];var action=this[p32][f3G];var wrapper=$(this[F5o][z7G]);wrapper[q4q]([classesActions[p4q],classesActions[a4q],classesActions[I4q]][a9x](p5o));if(action === s3G){wrapper[T7G](classesActions[s3G]);}else if(action === A4q){var y4q=c32;y4q+=y32;wrapper[T7G](classesActions[y4q]);}else if(action === c4q){var f4q=A2G;f4q+=P7o;f4q+=C6o;wrapper[f4q](classesActions[X1G]);}};Editor[x4q][c5x]=function(data,success,error,submitParams){var R2x='?';var d5x="deleteBody";var l5x="LE";var w5x=/_id_/;var j5x="DE";var z2x="ara";var g5x=',';var f5x="ele";var b5x="rl";var m5x="remo";var n5x="complete";var Z5x="xO";var x5x="teBod";var Q5x="ajaxUrl";var T5x='idSrc';var o4q=j4o;o4q+=f5x;o4q+=x5x;o4q+=n4o;var s4q=j5x;s4q+=l5x;s4q+=k4o;s4q+=w0o;var W4q=F6o;W4q+=y32;W4q+=A0o;var V4q=m5x;V4q+=o3o;var i4q=I32;i4q+=j4o;i4q+=V4o;i4q+=y32;var S4q=G5G;S4q+=X7o;S4q+=b5x;var j4q=E3G;j4q+=y32;j4q+=V4o;j4q+=z0o;var that=this;var action=this[p32][j4q];var thrown;var opts={type:p0x,dataType:a0x,data:W5o,error:[function(xhr,text,err){H0LL.O64();thrown=err;}],success:[],complete:[function(xhr,text){var S5x="onse";var R32=204;var B5x="responseJSON";var O5x="tus";var i5x="Text";var N5x="parseJSON";var V5x="sta";var C5x="pons";var H5x='null';var m4q=x0o;m4q+=Q3G;m4q+=S5x;m4q+=i5x;var l4q=V5x;l4q+=O5x;var json=W5o;if(xhr[l4q] === R32 || xhr[m4q] === H5x){json={};}else {try{var b4q=E6o;b4q+=C5x;b4q+=I32;b4q+=i5x;json=xhr[B5x]?xhr[B5x]:$[N5x](xhr[b4q]);}catch(e){}}if($[l5G](json) || Array[Y3G](json)){success(json,xhr[V8x] >= h32,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[p32][G5G] || this[p32][S4q];var id=action === i4q || action === V4q?_pluck(this[p32][M5G],T5x):W5o;if(Array[Y3G](id)){id=id[a9x](g5x);}if($[l5G](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === H0LL[418273]){var uri=W5o;var method=W5o;if(this[p32][Q5x]){var H4q=E0G;H4q+=Z4x;var O4q=W5x;O4q+=A0o;O4q+=y32;O4q+=I32;var url=this[p32][Q5x];if(url[O4q]){uri=url[action];}if(uri[e7x](p5o) !== -y22){a=uri[r5x](p5o);method=a[A22];uri=a[y22];}uri=uri[H4q](w5x,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc === y3G){var C4q=s5x;C4q+=o5x;if(ajaxSrc[C4q](p5o) !== -y22){a=ajaxSrc[r5x](p5o);opts[r32]=a[A22];opts[s0x]=a[y22];}else {opts[s0x]=ajaxSrc;}}else {var Q4q=x4o;Q4q+=j4o;var B4q=I32;B4q+=y5G;B4q+=l32;B4q+=j4o;var optsCopy=$[B4q]({},ajaxSrc || ({}));if(optsCopy[n5x]){var N4q=I4o;N4q+=G3o;N4q+=F5x;N4q+=u0o;opts[n5x][k2o](optsCopy[n5x]);delete optsCopy[N4q];}if(optsCopy[R3o]){var g4q=I32;g4q+=Q32;g4q+=Q32;g4q+=g0o;var T4q=Q4o;T4q+=Q32;T4q+=g0o;opts[T4q][k2o](optsCopy[g4q]);delete optsCopy[R3o];}opts=$[Q4q]({},opts,optsCopy);}opts[s0x]=opts[s0x][a0G](w5x,id);if(opts[W4q]){var w4q=j4o;w4q+=A0o;w4q+=y32;w4q+=A0o;var r4q=q9o;r4q+=y7o;r4q+=l32;r4q+=B7x;var isFn=typeof opts[G5o] === r4q;var newData=isFn?opts[w4q](data):opts[G5o];data=isFn && newData?newData:$[U5o](Q8o,data,newData);}opts[G5o]=data;if(opts[r32] === s4q && (opts[d5x] === undefined || opts[o4q] === Q8o)){var d4q=b0o;d4q+=n7o;d4q+=Z5x;d4q+=q9o;var F4q=y7o;F4q+=Q32;F4q+=v7o;var n4q=g32;n4q+=z2x;n4q+=b4o;var params=$[n4q](opts[G5o]);opts[s0x]+=opts[F4q][d4q](R2x) === -y22?R2x + params:q0G + params;delete opts[G5o];}$[G5G](opts);};Editor[e2o][M1G]=function(target,style,time,callback){var Z4q=q9o;Z4q+=l32;if($[Z4q][l7G]){var R7q=A0o;R7q+=H7G;R7q+=h2x;R7q+=I32;var z7q=X4G;z7q+=C4o;z7q+=g32;target[z7q]()[R7q](style,time,callback);}else {var h7q=I4o;h7q+=p32;h7q+=p32;target[h7q](style);if(typeof time === H0LL[418273]){time[b3G](target);}else if(callback){var U7q=E2o;U7q+=v7o;U7q+=v7o;callback[U7q](target);}}};Editor[e2o][K0x]=function(){var U2x="formInf";var D2x="footer";var X2x="ormE";var M2x="prep";var K7q=z6G;K7q+=I7o;K7q+=l32;K7q+=j4o;var v7q=U2x;v7q+=C4o;var P7q=z6G;P7q+=g32;P7q+=G9G;var J7q=U1o;J7q+=y32;J7q+=M7x;var t7q=R9G;t7q+=I32;t7q+=z5o;var D7q=q9o;D7q+=X2x;D7q+=q7o;var M7q=d4o;M7q+=j6G;var X7q=M2x;X7q+=I32;X7q+=z5o;var dom=this[F5o];$(dom[z7G])[X7q](dom[M7q]);$(dom[D2x])[l3o](dom[D7q])[t7q](dom[J7q]);$(dom[K5x])[P7q](dom[v7q])[K7q](dom[J0x]);};Editor[e2o][p5G]=function(){var J2x="nBlur";var P2x='preBlur';H0LL.o64();var v2x="bm";var G7q=t2x;G7q+=a2o;G7q+=l32;var E7q=C4o;E7q+=J2x;var opts=this[p32][u5G];var onBlur=opts[E7q];if(this[S9x](P2x) === N8o){return;}if(typeof onBlur === G7q){onBlur(this);}else if(onBlur === y4G){var Y7q=p32;Y7q+=y7o;Y7q+=v2x;Y7q+=D4G;this[Y7q]();}else if(onBlur === f4G){this[V2G]();}};Editor[e2o][K2x]=function(errorsOnly){var G2x="ses";var E2x="emoveCl";var p7q=Q32;p7q+=E2x;p7q+=B9x;var q7q=J7o;q7q+=p6G;q7q+=g32;q7q+=Q4o;var e7q=j4o;e7q+=C4o;e7q+=b4o;var u7q=Y1o;u7q+=p32;var L7q=Q4o;L7q+=s2o;var k7q=t4G;k7q+=p32;k7q+=G2x;if(!this[p32]){return;}var errorClass=this[k7q][Y1o][L7q];var fields=this[p32][u7q];if(errorsOnly === undefined){errorsOnly=N8o;}$(Z9x + errorClass,this[e7q][q7q])[p7q](errorClass);$[v2o](fields,function(name,field){field[R3o](P8o);if(!errorsOnly){var a7q=o32;a7q+=q4G;a7q+=Y2x;field[a7q](P8o);}});this[R3o](P8o);if(!errorsOnly){var I7q=N5G;I7q+=Y2x;this[I7q](P8o);}};Editor[A7q][y7q]=function(submitComplete,mode){var p2x="loseCb";var I2x="eIcb";var k2x="displaye";var e2x='preClose';var u2x="-focus";var L2x="us.ed";var S7q=G9o;S7q+=p32;S7q+=I32;var b7q=s3o;b7q+=i3G;var m7q=k2x;m7q+=j4o;var l7q=g7o;l7q+=L2x;l7q+=U1x;l7q+=u2x;var j7q=C4o;j7q+=q9o;j7q+=q9o;var c7q=s3o;c7q+=o3o;c7q+=Z2o;var closed;if(this[c7q](e2x) === N8o){return;}if(this[p32][q2x]){var f7q=I4o;f7q+=p2x;closed=this[p32][q2x](submitComplete,mode);this[p32][f7q]=W5o;}if(this[p32][a2x]){var x7q=K1o;x7q+=C4o;x7q+=p32;x7q+=I2x;this[p32][a2x]();this[p32][x7q]=W5o;}$(C2o)[j7q](l7q);H0LL.O64();this[p32][m7q]=N8o;this[b7q](S7q);if(closed){this[S9x](S2G,[closed]);}};Editor[i7q][V7q]=function(fn){this[p32][q2x]=fn;};Editor[O7q][H7q]=function(arg1,arg2,arg3,arg4){var c2x="ean";var A2x="mOp";var y2x="boo";var f2x="main";var N7q=c9x;N7q+=A2x;N7q+=H0x;N7q+=y7x;var C7q=y2x;C7q+=v7o;C7q+=c2x;var that=this;var title;var buttons;var show;var opts;if($[l5G](arg1)){opts=arg1;}else if(typeof arg1 === C7q){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=Q8o;}if(title){var B7q=y32;B7q+=J1x;that[B7q](title);}if(buttons){that[I2G](buttons);}return {opts:$[U5o]({},this[p32][N7q][f2x],opts),maybeOpen:function(){H0LL.o64();if(show){that[O5G]();}}};};Editor[T7q][g7q]=function(name){var W7q=I4o;W7q+=x2x;var Q7q=p32;Q7q+=v7o;Q7q+=W3G;var args=Array[e2o][Q7q][W7q](arguments);args[a4G]();var fn=this[p32][j2x][name];if(fn){return fn[u2o](this,args);}};Editor[r7q][P0x]=function(includeFields){var S2x="Fields";var V2x="deFi";var i2x="clu";var l2x="isplayOrder";var b2x="include";var m2x="formContent";var K9q=A0o;K9q+=I6G;K9q+=h1o;var v9q=j4o;v9q+=l2x;var P9q=s3o;P9q+=o3o;P9q+=l32;P9q+=y32;var J9q=b4o;J9q+=A0o;J9q+=b0o;var Z7q=G4o;Z7q+=I4o;Z7q+=d4o;var d7q=q9G;d7q+=p9G;var o7q=b4o;o7q+=A0o;o7q+=V4o;o7q+=l32;var s7q=L9x;s7q+=Q32;var w7q=W8o;H0LL.O64();w7q+=b4o;var that=this;var formContent=$(this[w7q][m2x]);var fields=this[p32][d6G];var order=this[p32][s7q];var template=this[p32][U4x];var mode=this[p32][j1o] || o7q;if(includeFields){var n7q=b2x;n7q+=S2x;this[p32][n7q]=includeFields;}else {var F7q=b0o;F7q+=i2x;F7q+=V2x;F7q+=M0x;includeFields=this[p32][F7q];}formContent[d7q]()[x3o]();$[Z7q](order,function(i,fieldOrName){var B2x="[name=\"";var C2x="editor-f";var N2x="after";var T2x='[data-editor-template="';var name=fieldOrName instanceof Editor[X5o]?fieldOrName[E5o]():fieldOrName;if(that[O2x](name,includeFields) !== -y22){var z9q=b4o;z9q+=A0o;z9q+=b0o;if(template && mode === z9q){var M9q=Z9G;M9q+=z5o;var X9q=X6o;X9q+=H2x;var U9q=l32;U9q+=C4o;U9q+=n7o;var h9q=X6o;h9q+=H2x;var R9q=C2x;R9q+=m1o;R9q+=B2x;template[a7x](R9q + name + h9q)[N2x](fields[name][U9q]());template[a7x](T2x + name + X9q)[M9q](fields[name][b6G]());}else {var t9q=s5o;t9q+=n7o;var D9q=A0o;D9q+=U9x;D9q+=l32;D9q+=j4o;formContent[D9q](fields[name][t9q]());}}});if(template && mode === J9q){template[B3G](formContent);}this[P9q](v9q,[this[p32][R4x],this[p32][K9q],formContent]);};Editor[e2o][S5G]=function(items,editFields,type,formOptions,setupDone){var Q2x="eorde";var r2x="isp";var Z2x="toS";var W2x="_actionC";var s2x="tData";var z3x='initEdit';var w2x="odifi";var R3x='node';var g2x="displayR";var m9q=s0o;m9q+=g2x;m9q+=Q2x;m9q+=Q32;var j9q=v7o;j9q+=I32;j9q+=m9x;j9q+=d4o;var x9q=q9x;x9q+=Z32;x9q+=I32;var q9q=I32;q9q+=A0o;q9q+=w4x;var e9q=W2x;e9q+=C6o;var u9q=c4o;u9q+=j4o;u9q+=I32;var L9q=j4o;L9q+=r2x;L9q+=G8G;var k9q=j4o;k9q+=C4o;k9q+=b4o;var Y9q=b4o;Y9q+=w2x;Y9q+=Q4o;var G9q=c32;G9q+=s2x;var E9q=Q9o;E9q+=v7o;E9q+=w0G;var that=this;var fields=this[p32][E9q];var usedFields=[];var includeInOrder;var editData={};this[p32][M5G]=editFields;this[p32][G9q]=editData;this[p32][Y9q]=items;this[p32][f3G]=f9x;H0LL.O64();this[k9q][J0x][n1G][L9q]=X0G;this[p32][u9q]=type;this[e9q]();$[q9q](fields,function(name,field){var f9q=v7o;H0LL.o64();f9q+=I32;f9q+=O8o;f9q+=V8o;var p9q=I32;p9q+=A0o;p9q+=I4o;p9q+=d4o;field[v0x]();includeInOrder=N8o;editData[name]={};$[p9q](editFields,function(idSrc,edit){var o2x="scop";var d2x="yF";var F2x="ispla";var a9q=Q9o;a9q+=Q6G;if(edit[a9q][name]){var A9q=o2x;A9q+=I32;var I9q=p32;I9q+=v7o;I9q+=V4o;I9q+=K0G;var val=field[D5G](edit[G5o]);editData[name][idSrc]=val === W5o?P8o:Array[Y3G](val)?val[I9q]():val;if(!formOptions || formOptions[A9q] === n2x){var c9q=j4o;c9q+=F2x;c9q+=d2x;c9q+=F8x;var y9q=n7o;y9q+=q9o;field[t5G](idSrc,val !== undefined?val:field[y9q]());if(!edit[c9q] || edit[o4x][name]){includeInOrder=Q8o;}}else {if(!edit[o4x] || edit[o4x][name]){field[t5G](idSrc,val !== undefined?val:field[A2o]());includeInOrder=Q8o;}}}});if(field[S3o]()[f9q] !== A22 && includeInOrder){usedFields[A8o](name);}});var currOrder=this[K5G]()[x9q]();for(var i=currOrder[j9q] - y22;i >= A22;i--){var l9q=Z2x;l9q+=L0G;if($[r3o](currOrder[i][l9q](),usedFields) === -y22){currOrder[E5G](i,y22);}}this[m9q](currOrder);this[S9x](z3x,[_pluck(editFields,R3x)[A22],_pluck(editFields,T0x)[A22],items,type],function(){var h3x='initMultiEdit';var b9q=R9x;H0LL.o64();b9q+=I32;b9q+=Z2o;that[b9q](h3x,[editFields,items,type],function(){setupDone();});});};Editor[e2o][S9x]=function(trigger,args,promiseComplete){var t3x='pre';var J3x="Canc";var P3x="triggerHand";var M3x="Event";var v3x="result";var X3x="dexOf";if(!args){args=[];}if(Array[Y3G](trigger)){for(var i=A22,ien=trigger[B8o];i < ien;i++){var S9q=R9x;S9q+=I32;S9q+=Z2o;this[S9q](trigger[i],args);}}else {var V9q=E6o;V9q+=y7o;V9q+=U3x;var i9q=b0o;i9q+=X3x;var e=$[M3x](trigger);$(this)[D3x](e,args);if(trigger[i9q](t3x) === A22 && e[V9q] === N8o){var C9q=J3x;C9q+=I32;C9q+=G2o;C9q+=c0o;var H9q=w0o;H9q+=o3o;H9q+=l32;H9q+=y32;var O9q=P3x;O9q+=M9x;$(this)[O9q]($[H9q](trigger + C9q),args);}if(promiseComplete){var N9q=y32;N9q+=d4o;N9q+=l1G;var B9q=x0o;B9q+=e5G;B9q+=U3x;if(e[v3x] && typeof e[v3x] === H0LL[364241] && e[B9q][N9q]){var T9q=V8o;T9q+=I32;T9q+=l32;e[v3x][T9q](promiseComplete);}else {promiseComplete(e[v3x]);}}return e[v3x];}};Editor[g9q][Q9q]=function(input){var G3x="substring";var K3x=/^on([A-Z])/;var r9q=M0o;r9q+=l32;r9q+=p4o;r9q+=V8o;var W9q=Q3G;W9q+=v7o;W9q+=D4G;var name;var names=input[W9q](p5o);for(var i=A22,ien=names[r9q];i < ien;i++){var w9q=b4o;w9q+=W8G;w9q+=I4o;w9q+=d4o;name=names[i];var onStyle=name[w9q](K3x);if(onStyle){name=onStyle[y22][E3x]() + name[G3x](f22);}names[i]=name;}return names[a9x](p5o);};Editor[s9q][o9q]=function(node){var F9q=Q9o;F9q+=v7o;F9q+=w0G;var n9q=I32;n9q+=E3G;n9q+=d4o;H0LL.O64();var foundField=W5o;$[n9q](this[p32][F9q],function(name,field){var Z9q=v7o;Z9q+=l1G;Z9q+=p4o;Z9q+=V8o;H0LL.O64();var d9q=s5o;d9q+=n7o;if($(field[d9q]())[a7x](node)[Z9q]){foundField=field;}});return foundField;};Editor[e2o][z1q]=function(fieldNames){H0LL.O64();if(fieldNames === undefined){var R1q=q9o;R1q+=V4o;R1q+=M0x;return this[R1q]();}else if(!Array[Y3G](fieldNames)){return [fieldNames];}return fieldNames;};Editor[h1q][U1q]=function(fieldsIn,focus){var L3x=/^jq:/;var k3x="v.DTE ";var Y3x='jq:';var that=this;var field;var fields=$[P4x](fieldsIn,function(fieldOrName){H0LL.O64();return typeof fieldOrName === y3G?that[p32][d6G][fieldOrName]:fieldOrName;});if(typeof focus === U0x){field=fields[focus];}else if(focus){if(focus[e7x](Y3x) === A22){var M1q=Y0G;M1q+=K0G;var X1q=j4o;X1q+=V4o;X1q+=k3x;field=$(X1q + focus[M1q](L3x,P8o));}else {var D1q=e32;D1q+=w0G;field=this[p32][D1q][focus];}}else {var t1q=X0o;t1q+=u3x;document[e3x][t1q]();}this[p32][q3x]=field;if(field){field[t2o]();}};Editor[e2o][J2G]=function(opts){var s3x="onBackground";var p3x="Icb";var Q3x="Return";var j3x="Bl";var i3x="let";var B3x="tOnBlur";var c3x="itOpt";var x3x="ubmitOn";var r3x="blurOn";var f3x="urOnBackgro";var W3x="onReturn";var I3x="ey";var b3x='.dteInline';var F3x="mes";var T3x="submitOnReturn";var n3x="tl";var y3x="ri";var w3x="Backgr";var N3x="nBl";var S3x="closeOnComp";var m3x="OnComplete";var V3x="nCo";var a3x="eyu";var O3x="mplete";var g3x="On";var R8q=K1o;R8q+=C4o;R8q+=p1G;R8q+=p3x;var V1q=E8G;V1q+=a3x;V1q+=g32;var l1q=E8G;l1q+=I3x;l1q+=j4o;l1q+=F4G;var c1q=o32;c1q+=p32;c1q+=A3x;c1q+=C7o;var y1q=b4o;y1q+=w7o;y1q+=A3x;y1q+=C7o;var a1q=X4G;a1q+=y3x;a1q+=O8o;var p1q=c0o;p1q+=c3x;p1q+=p32;var e1q=y0o;e1q+=f3x;e1q+=n8G;e1q+=j4o;var G1q=p32;G1q+=x3x;G1q+=j3x;G1q+=l3x;var J1q=n4G;J1q+=m3x;var that=this;var inlineCount=__inlineCounter++;var namespace=b3x + inlineCount;if(opts[J1q] !== undefined){var E1q=s5o;E1q+=l32;E1q+=I32;var K1q=I4o;K1q+=v7o;K1q+=C4o;K1q+=p1G;var v1q=S3x;v1q+=i3x;v1q+=I32;var P1q=C4o;P1q+=V3x;P1q+=O3x;opts[P1q]=opts[v1q]?K1q:E1q;}H0LL.o64();if(opts[G1q] !== undefined){var L1q=p32;L1q+=H3x;var k1q=C3x;k1q+=B3x;var Y1q=C4o;Y1q+=N3x;Y1q+=y7o;Y1q+=Q32;opts[Y1q]=opts[k1q]?L1q:f4G;}if(opts[T3x] !== undefined){var u1q=p32;u1q+=H3x;u1q+=g3x;u1q+=Q3x;opts[W3x]=opts[u1q]?y4G:B2o;}if(opts[e1q] !== undefined){var q1q=r3x;q1q+=w3x;q1q+=C4o;q1q+=q6G;opts[s3x]=opts[q1q]?c4G:B2o;}this[p32][p1q]=opts;this[p32][o3x]=inlineCount;if(typeof opts[a2G] === a1q || typeof opts[a2G] === H0LL[418273]){var A1q=y32;A1q+=V4o;A1q+=n3x;A1q+=I32;var I1q=I6o;I1q+=M0o;this[I1q](opts[a2G]);opts[A1q]=Q8o;}if(typeof opts[y1q] === y3G || typeof opts[c1q] === H0LL[418273]){var x1q=o32;x1q+=p32;x1q+=A3x;x1q+=C7o;var f1q=F3x;f1q+=A3x;f1q+=p4o;f1q+=I32;this[C5o](opts[f1q]);opts[x1q]=Q8o;}if(typeof opts[I2G] !== m5G){var j1q=j3G;j1q+=p32;this[j1q](opts[I2G]);opts[I2G]=Q8o;}$(document)[z0o](l1q + namespace,function(e){var X0E="preventDe";var d3x="keyC";var U0E="_fieldFromNode";var z0E="ReturnSubmit";var R0E="canR";var M0E="faul";var h0E="eturn";var m1q=d3x;m1q+=Z3x;H0LL.o64();if(e[m1q] === V22 && that[p32][R4x]){var el=$(document[e3x]);if(el){var S1q=I4o;S1q+=A0o;S1q+=l32;S1q+=z0E;var b1q=R0E;b1q+=h0E;b1q+=S4o;b1q+=H3x;var field=that[U0E](el);if(field && typeof field[b1q] === H0LL[418273] && field[S1q](el)){var i1q=X0E;i1q+=M0E;i1q+=y32;e[i1q]();}}}});$(document)[z0o](V1q + namespace,function(e){var a0E='button';var P0E="canRet";var I0E="next";var p0E="eyCod";var G0E="canReturnSubmit";var o22=39;var s22=37;var D0E=".DTE_F";var E0E="_fieldFromNo";var t0E="orm_Buttons";var J0E="par";var e0E="Es";var v0E="urn";var K0E="Submit";var q0E="onEsc";var F1q=M0o;F1q+=O8o;F1q+=y32;F1q+=d4o;var n1q=D0E;n1q+=t0E;var o1q=J0E;o1q+=I32;o1q+=Z2o;o1q+=p32;var O1q=u1o;O1q+=c0o;var el=$(document[e3x]);if(e[m3G] === V22 && that[p32][O1q]){var B1q=P0E;B1q+=v0E;B1q+=K0E;var C1q=d0G;C1q+=F9x;C1q+=l32;var H1q=E0E;H1q+=n7o;var field=that[H1q](el);if(field && typeof field[G0E] === C1q && field[B1q](el)){var N1q=z0o;N1q+=Y0E;N1q+=k0E;N1q+=l32;if(opts[N1q] === y4G){e[L0E]();that[s0G]();}else if(typeof opts[W3x] === H0LL[418273]){e[L0E]();opts[W3x](that,e);}}}else if(e[m3G] === g22){var s1q=Y5G;s1q+=D4G;var w1q=G9o;w1q+=p32;w1q+=I32;var r1q=C4o;r1q+=u0E;r1q+=p32;r1q+=I4o;var W1q=X0o;W1q+=v7o;W1q+=y7o;W1q+=Q32;var g1q=O1x;g1q+=B7x;var T1q=z0o;T1q+=e0E;T1q+=I4o;e[L0E]();if(typeof opts[T1q] === g1q){var Q1q=C4o;Q1q+=l32;Q1q+=e0E;Q1q+=I4o;opts[Q1q](that,e);}else if(opts[q0E] === W1q){that[q5G]();}else if(opts[r1q] === w1q){that[n4G]();}else if(opts[q0E] === s1q){that[s0G]();}}else if(el[o1q](n1q)[F1q]){var d1q=E8G;d1q+=p0E;d1q+=I32;if(e[d1q] === s22){var z8q=S0o;z8q+=I4o;z8q+=y7o;z8q+=p32;var Z1q=l7o;Z1q+=I32;Z1q+=o6o;el[Z1q](a0E)[z8q]();}else if(e[m3G] === o22){el[I0E](a0E)[t2o]();}}});this[p32][R8q]=function(){var A0E="yu";var h8q=E8G;h8q+=I32;h8q+=A0E;h8q+=g32;$(document)[C8G](y0E + namespace);$(document)[C8G](h8q + namespace);};return namespace;};Editor[U8q][c0E]=function(direction,action,data){var f0E="legacyAjax";var x0E='send';if(!this[p32][f0E] || !data){return;}if(direction === x0E){var X8q=z6o;X8q+=I32;X8q+=A0o;X8q+=u0o;if(action === X8q || action === k1x){var M8q=I32;M8q+=A0o;M8q+=I4o;M8q+=d4o;var id;$[M8q](data[G5o],function(rowId,values){var m0E=" is not supported by the legacy Ajax data format";var j0E="ditor: Multi-row edi";if(id !== undefined){var D8q=w0o;D8q+=j0E;D8q+=l0E;D8q+=m0E;throw D8q;}id=rowId;});data[G5o]=data[G5o][id];if(action === k1x){data[c5o]=id;}}else {var J8q=j4o;J8q+=A0o;J8q+=y32;J8q+=A0o;var t8q=V4o;t8q+=j4o;data[t8q]=$[P4x](data[J8q],function(values,id){H0LL.o64();return id;});delete data[G5o];}}else {var P8q=j4o;P8q+=N4x;if(!data[P8q] && data[H6G]){data[G5o]=[data[H6G]];}else if(!data[G5o]){data[G5o]=[];}}};Editor[v8q][b0E]=function(json){var that=this;H0LL.O64();if(json[S0E]){var E8q=q9o;E8q+=V4o;E8q+=x1o;E8q+=p32;var K8q=I32;K8q+=A0o;K8q+=w4x;$[K8q](this[p32][E8q],function(name,field){var V0E="update";var G8q=i0E;G8q+=C4o;G8q+=y7x;H0LL.o64();if(json[G8q][name] !== undefined){var fieldInst=that[Y1o](name);if(fieldInst && fieldInst[V0E]){var Y8q=L3G;Y8q+=F6o;Y8q+=u0o;fieldInst[Y8q](json[S0E][name]);}}});}};Editor[k8q][L8q]=function(el,msg,title,fn){var H0E="deOu";var N0E="play";var O0E="stop";var B0E='title';var C0E="removeAttr";var canAnimate=$[E8o][l7G]?Q8o:N8o;if(title === undefined){title=N8o;}if(!fn){fn=function(){};}if(typeof msg === H0LL[418273]){var e8q=y32;e8q+=A0o;e8q+=X0o;e8q+=M0o;var u8q=r4o;u8q+=g32;u8q+=V4o;msg=msg(this,new DataTable[u8q](this[p32][e8q]));}el=$(el);if(canAnimate){el[O0E]();}if(!msg){var q8q=j4o;q8q+=f3o;q8q+=c0o;if(this[p32][q8q] && canAnimate){var p8q=q9o;p8q+=A0o;p8q+=H0E;p8q+=y32;el[p8q](function(){var a8q=d4o;a8q+=y32;a8q+=b4o;H0LL.o64();a8q+=v7o;el[a8q](P8o);fn();});}else {var A8q=I4o;A8q+=p32;A8q+=p32;var I8q=d4o;I8q+=y32;I8q+=a3G;el[I8q](P8o)[A8q](n5o,B2o);fn();}if(title){el[C0E](B0E);}}else {var y8q=j4o;y8q+=V4o;y8q+=t1o;y8q+=c0o;fn();if(this[p32][y8q] && canAnimate){el[j3o](msg)[O8G]();}else {var f8q=L5o;f8q+=p32;f8q+=N0E;var c8q=I4o;c8q+=p32;c8q+=p32;el[j3o](msg)[c8q](f8q,X0G);}if(title){el[T0E](B0E,msg);}}};Editor[e2o][x8q]=function(){var g0E="itabl";var Q0E="multiInfoShown";var j8q=q9o;j8q+=F8x;var fields=this[p32][j8q];var include=this[p32][O2G];var show=Q8o;var state;if(!include){return;}for(var i=A22,ien=include[B8o];i < ien;i++){var l8q=C9o;l8q+=r8x;l8q+=g0E;l8q+=I32;var field=fields[include[i]];var multiEditable=field[l8q]();if(field[i3o]() && multiEditable && show){state=Q8o;show=N8o;}else if(field[i3o]() && !multiEditable){state=Q8o;}else {state=N8o;}fields[include[i]][Q0E](state);}};Editor[e2o][m8q]=function(type,immediate){var s0E="capt";var F0E="ontroller";var n0E="layC";var d0E='submit.editor-internal';var P4E="pene";var o0E="eFocus";var R4E="focus.edit";var r0E="mit.editor-intern";var h4E="or-fo";var n8q=W0E;n8q+=z0o;var o8q=C4o;o8q+=g32;o8q+=I32;o8q+=l32;var s8q=V7o;s8q+=O7o;s8q+=q9o;s8q+=C4o;var O8q=e5G;O8q+=X0o;O8q+=r0E;O8q+=D2o;var V8q=C4o;V8q+=w0E;var i8q=q9o;i8q+=A3G;var S8q=s0E;S8q+=l3x;S8q+=o0E;var b8q=C6G;b8q+=n0E;b8q+=F0E;var that=this;var focusCapture=this[p32][b8q][S8q];if(focusCapture === undefined){focusCapture=Q8o;}$(this[F5o][i8q])[V8q](O8q)[z0o](d0E,function(e){var Z0E="entDef";var z4E="ault";var H8q=O3G;H8q+=Z0E;H8q+=z4E;e[H8q]();});if(focusCapture && (type === t0x || type === i5G)){var N8q=R4E;N8q+=h4E;N8q+=v3o;var B8q=C4o;B8q+=l32;var C8q=X0o;C8q+=C4o;C8q+=j4o;C8q+=n4o;$(C8q)[B8q](N8q,function(){var t4E='.DTED';var X4E="nts";var D4E='.DTE';var J4E="setFocu";H0LL.o64();var M4E="paren";var W8q=x0G;W8q+=d4o;var Q8q=U4E;Q8q+=X4E;var g8q=M0o;g8q+=m9x;g8q+=d4o;var T8q=M4E;T8q+=h2o;if($(document[e3x])[T8q](D4E)[g8q] === A22 && $(document[e3x])[Q8q](t4E)[W8q] === A22){if(that[p32][q3x]){var w8q=S0o;w8q+=I4o;w8q+=P1o;var r8q=J4E;r8q+=p32;that[p32][r8q][w8q]();}}});}this[s8q]();this[S9x](o8q,[type,this[p32][n8q]]);if(immediate){var F8q=C4o;F8q+=P4E;F8q+=j4o;this[S9x](F8q,[type,this[p32][f3G]]);}return Q8o;};Editor[e2o][v4E]=function(type){var L4E="even";var p4E="seIcb";var G4E="earDynam";var q4E='cancelOpen';var e4E="micInfo";var E4E="_cl";var Y4E="icInf";var K4E="ayed";var D6q=n0x;D6q+=K4E;var M6q=E4E;M6q+=G4E;M6q+=Y4E;M6q+=C4o;var Z8q=k4E;Z8q+=a2o;Z8q+=l32;var d8q=s0o;d8q+=L4E;d8q+=y32;if(this[d8q](u4E,[type,this[p32][Z8q]]) === N8o){var U6q=b4o;U6q+=C4o;U6q+=j4o;U6q+=I32;var h6q=b0o;h6q+=p4G;h6q+=n3o;var R6q=b4o;R6q+=C4o;R6q+=n7o;var z6q=f7x;z6q+=e4E;this[z6q]();this[S9x](q4E,[type,this[p32][f3G]]);if((this[p32][R6q] === h6q || this[p32][U6q] === i5G) && this[p32][a2x]){var X6q=I4o;X6q+=v7o;X6q+=C4o;X6q+=p4E;this[p32][X6q]();}this[p32][a2x]=W5o;return N8o;}this[M6q](Q8o);this[p32][D6q]=type;return Q8o;};Editor[t6q][g9x]=function(processing){var A4E="toggleClass";var a4E="v.DTE";H0LL.O64();var I4E="active";var P6q=J7o;P6q+=Q32;P6q+=Z9G;P6q+=Q32;var J6q=L5o;J6q+=a4E;var procClass=this[b2o][U0G][I4E];$([J6q,this[F5o][P6q]])[A4E](procClass,processing);this[p32][U0G]=processing;this[S9x](E5x,[processing]);};Editor[v6q][y4E]=function(args){var f4E="proce";var x4E="ssing-f";var K6q=I32;K6q+=A0o;K6q+=I4o;K6q+=d4o;var processing=N8o;$[K6q](this[p32][d6G],function(name,field){var c4E="ocessi";var E6q=l7o;H0LL.O64();E6q+=c4E;E6q+=l32;E6q+=p4o;if(field[E6q]()){processing=Q8o;}});if(processing){var Y6q=f4E;Y6q+=x4E;Y6q+=m1o;var G6q=z0o;G6q+=I32;this[G6q](Y6q,function(){H0LL.O64();var j4E="ly";if(this[y4E](args) === Q8o){var k6q=R9G;k6q+=j4E;this[r9x][k6q](this,args);}});}return !processing;};Editor[e2o][r9x]=function(successCallback,errorCallback,formatdata,hide){var Z4E="ven";var t7E="_submitTable";var d4E="mitComplete";var l4E="xU";var X7E='preSubmit';var S4E="_noP";var V4E="editData";var D7E="essing";var C4E="eat";var z7E="_process";var O4E="dbTable";var U7E="mplet";var h7E="onCo";var i4E="tOp";var H4E="IfChan";var s6q=C1x;s6q+=l4E;s6q+=Q32;s6q+=v7o;var r6q=H8x;r6q+=L1G;var W6q=p1G;W6q+=z5o;var T6q=Q32;T6q+=a5x;T6q+=o3o;var A6q=m4E;A6q+=I32;var a6q=z0x;a6q+=l32;a6q+=b4E;var p6q=S4E;p6q+=I0x;var q6q=c32;q6q+=i4E;q6q+=h2o;var e6q=c32;e6q+=s6G;e6q+=M0x;var u6q=r9o;u6q+=M0x;var L6q=C4o;L6q+=r4o;L6q+=g32;L6q+=V4o;var that=this;var i,iLen,eventRet,errorNodes;var changed=N8o,allData={},changedData={};var setBuilder=DataTable[Z8o][L6q][e5o];var dataSource=this[p32][j2x];var fields=this[p32][u6q];var editCount=this[p32][o3x];var modifier=this[p32][m6G];var editFields=this[p32][e6q];var editData=this[p32][V4E];var opts=this[p32][q6q];var changedSubmit=opts[s0G];var submitParamsLocal;if(this[p6q](arguments) === N8o){return;}var action=this[p32][f3G];var submitParams={"data":{}};submitParams[this[p32][a6q]]=action;if(this[p32][O4E]){var I6q=y32;I6q+=N2o;I6q+=M0o;submitParams[I6q]=this[p32][O4E];}if(action === A6q || action === f9x){var i6q=x2x;i6q+=H4E;i6q+=C7o;i6q+=j4o;var S6q=z6o;S6q+=C4E;S6q+=I32;$[v2o](editFields,function(idSrc,edit){var T4E="bjec";var B4E="isEmp";var N4E="isEmptyO";var b6q=B4E;b6q+=b7o;b6q+=O9x;b6q+=W0x;var m6q=N4E;m6q+=T4E;m6q+=y32;var allRowData={};var changedRowData={};$[v2o](fields,function(name,field){var o4E=/\[.*$/;var r4E="valFro";var s4E='[]';var Q4E="epl";var g4E="submittable";var n4E='-many-count';var y6q=r9o;y6q+=x1o;y6q+=p32;if(edit[y6q][name] && field[g4E]()){var l6q=I32;l6q+=j4o;l6q+=D4G;var j6q=Q32;j6q+=Q4E;j6q+=A0o;j6q+=K0G;var x6q=i2o;x6q+=r4o;x6q+=W4E;var multiGet=field[w7x]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var f6q=F6o;f6q+=y32;f6q+=A0o;var c6q=r4E;c6q+=w4E;var originalVal=field[c6q](edit[f6q]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[x6q](value) && name[e7x](s4E) !== -y22?setBuilder(name[j6q](o4E,P8o) + n4E):W5o;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[B8o]);}if(action === l6q && (!editData[name] || !field[S0G](value,editData[name][idSrc]))){builder(changedRowData,value);changed=Q8o;if(manyBuilder){manyBuilder(changedRowData,value[B8o]);}}}});if(!$[m6q](allRowData)){allData[idSrc]=allRowData;}if(!$[b6q](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === S6q || changedSubmit === x4G || changedSubmit === i6q && changed){var V6q=j4o;V6q+=A0o;V6q+=y32;V6q+=A0o;submitParams[V6q]=allData;}else if(changedSubmit === F4E && changed){var O6q=j4o;O6q+=N4x;submitParams[O6q]=changedData;}else {var N6q=f7o;N6q+=d4E;var B6q=s0o;B6q+=I32;B6q+=Z4E;B6q+=y32;var C6q=z7E;C6q+=V4o;C6q+=l32;C6q+=p4o;this[p32][f3G]=W5o;if(opts[R7E] === f4G && (hide === undefined || hide)){this[V2G](N8o);}else if(typeof opts[R7E] === H0LL[418273]){var H6q=h7E;H6q+=U7E;H6q+=I32;opts[H6q](this);}if(successCallback){successCallback[b3G](this);}this[C6q](N8o);this[B6q](N6q);return;}}else if(action === T6q){$[v2o](editFields,function(idSrc,edit){var Q6q=F6o;Q6q+=y32;H0LL.O64();Q6q+=A0o;var g6q=J6x;g6q+=A0o;submitParams[g6q][idSrc]=edit[Q6q];});}this[c0E](W6q,action,submitParams);submitParamsLocal=$[r6q](Q8o,{},submitParams);H0LL.O64();if(formatdata){formatdata(submitParams);}if(this[S9x](X7E,[submitParams,action]) === N8o){var w6q=M7E;w6q+=I4o;w6q+=D7E;this[w6q](N8o);return;}var submitWire=this[p32][G5G] || this[p32][s6q]?this[c5x]:this[t7E];submitWire[b3G](this,submitParams,function(json,notGood,xhr){var J7E="_submitSuccess";var o6q=W0E;o6q+=z0o;that[J7E](json,notGood,submitParams,submitParamsLocal,that[p32][o6q],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var P7E="_subm";var F6q=E3G;F6q+=y32;F6q+=h1o;var n6q=P7E;n6q+=D4G;n6q+=v7E;that[n6q](xhr,err,thrown,errorCallback,submitParams,that[p32][F6q]);},submitParams);};Editor[e2o][d6q]=function(data,success,error,submitParams){var Y7E="taFn";var E7E="_fnGetOb";var u7E='individual';var G7E="jectD";var L7E='fields';var X5q=x0o;X5q+=H0G;H0LL.o64();var U5q=c5o;U5q+=K7E;U5q+=I4o;var h5q=E7E;h5q+=G7E;h5q+=A0o;h5q+=Y7E;var R5q=C4o;R5q+=r4o;R5q+=k7E;var z5q=I32;z5q+=Q4x;var Z6q=k4E;Z6q+=V4o;Z6q+=C4o;Z6q+=l32;var that=this;var action=data[Z6q];var out={data:[]};var idGet=DataTable[z5q][R5q][h5q](this[p32][U5q]);var idSet=DataTable[Z8o][k5o][e5o](this[p32][o6x]);if(action !== X5q){var t5q=F6o;t5q+=y32;t5q+=A0o;var D5q=I32;D5q+=A0o;D5q+=I4o;D5q+=d4o;var M5q=D8G;M5q+=b0o;var originalData=this[p32][j1o] === M5q?this[E4x](L7E,this[m6G]()):this[E4x](u7E,this[m6G]());$[D5q](data[t5q],function(key,vals){var e7E="dataTableExt";var E5q=g32;E5q+=y7o;E5q+=p32;E5q+=d4o;var K5q=m4E;K5q+=I32;var P5q=s0o;P5q+=q9o;P5q+=u0E;P5q+=e4o;var J5q=q9o;J5q+=l32;var toSave;var extender=$[J5q][e7E][k5o][P5q];if(action === k1x){var v5q=j4o;v5q+=A0o;v5q+=y32;v5q+=A0o;var rowData=originalData[key][v5q];toSave=extender({},rowData,Q8o);toSave=extender(toSave,vals,Q8o);}else {toSave=extender({},vals,Q8o);}var overrideId=idGet(toSave);if(action === K5q && overrideId === undefined){idSet(toSave,+new Date() + P8o + key);}else {idSet(toSave,overrideId);}out[G5o][E5q](toSave);});}success(out);};Editor[e2o][G5q]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var B7E="tSucc";var M9E="reRemov";var A7E="eceive";var I7E="postS";var a7E="ors";var n7E="eC";var y7E="modi";var Q7E="tDat";var Z7E="mi";var g7E="ataSour";var X9E="_dataSou";var c7E="ush";var D9E="_data";var d7E='postEdit';var r7E="ource";var H7E='<br>';var o7E="rea";H0LL.o64();var s7E="tCreate";var R9E="rce";var U9E="emov";var J9E="cti";var F7E="reEdit";var C7E='submitUnsuccessful';var z9E="_dataS";var T7E="mmit";var q7E="cessi";var h9E="tR";var W7E="taS";var p2q=s0o;p2q+=x2G;p2q+=I32;p2q+=Z2o;var q2q=M7E;q2q+=q7E;q2q+=O8o;var u5q=Y1o;u5q+=w0o;u5q+=p7E;u5q+=a7E;var L5q=I7E;L5q+=C8x;L5q+=b4o;L5q+=D4G;var k5q=Q32;k5q+=A7E;var Y5q=y7E;Y5q+=r9o;Y5q+=I32;Y5q+=Q32;var that=this;var setData;var fields=this[p32][d6G];var opts=this[p32][u5G];var modifier=this[p32][Y5q];this[c0E](k5q,action,json);this[S9x](L5q,[json,submitParams,action,xhr]);if(!json[R3o]){json[R3o]=H0LL[195232];}if(!json[b8x]){json[b8x]=[];}if(notGood || json[R3o] || json[u5q][B8o]){var B5q=s3o;B5q+=o6o;B5q+=I32;B5q+=Z2o;var C5q=r0x;C5q+=C4o;C5q+=V4o;C5q+=l32;var H5q=N8x;H5q+=g0o;var a5q=I32;a5q+=A0o;a5q+=I4o;a5q+=d4o;var e5q=Q4o;e5q+=B7o;e5q+=Q32;var globalError=[];if(json[e5q]){var p5q=I32;p5q+=p7E;p5q+=g0o;var q5q=g32;q5q+=c7E;globalError[q5q](json[p5q]);}$[a5q](json[b8x],function(i,err){var f7E="Unknown fie";var i7E="onFie";var m7E="onFieldError";var V7E="ldError";var l7E="onFieldEr";var x7E="ld:";var j7E="stat";var S7E="position";var b7E="pper";var y5q=C6G;y5q+=G8G;y5q+=I32;y5q+=j4o;var field=fields[err[E5o]];if(!field){var A5q=l32;A5q+=A0o;A5q+=b4o;A5q+=I32;var I5q=f7E;I5q+=x7E;I5q+=t7x;throw new Error(I5q + err[A5q]);}else if(field[y5q]()){var c5q=j7E;c5q+=P1o;field[R3o](err[c5q] || v7E);if(i === A22){var S5q=t2x;S5q+=h1o;var b5q=l7E;b5q+=s2o;var f5q=S0o;f5q+=I4o;f5q+=y7o;f5q+=p32;if(opts[m7E] === f5q){var m5q=S0o;m5q+=I4o;m5q+=P1o;var l5q=y32;l5q+=Z6o;var j5q=S1G;j5q+=b7E;var x5q=d6x;x5q+=U4o;that[M1G]($(that[F5o][x5q],that[p32][j5q]),{scrollTop:$(field[b6G]())[S7E]()[l5q]},U32);field[m5q]();}else if(typeof opts[b5q] === S5q){var i5q=i7E;i5q+=V7E;opts[i5q](that,err);}}}else {var O5q=w0o;O5q+=p7E;O5q+=C4o;O5q+=Q32;var V5q=O7E;V5q+=t7x;globalError[A8o](field[E5o]() + V5q + (err[V8x] || O5q));}});this[H5q](globalError[C5q](H7E));this[B5q](C7E,[json]);if(errorCallback){var N5q=E2o;N5q+=v7o;N5q+=v7o;errorCallback[N5q](that,json);}}else {var e2q=C3x;e2q+=B7E;e2q+=N7E;var u2q=R9x;u2q+=I32;u2q+=l32;u2q+=y32;var g5q=I4o;g5q+=x0o;g5q+=W8G;g5q+=I32;var T5q=j4o;T5q+=N4x;var store={};if(json[T5q] && (action === g5q || action === f9x)){var U2q=m4o;U2q+=T7E;var h2q=U9o;h2q+=g7E;h2q+=K0G;var W5q=C2G;W5q+=B2G;var Q5q=g32;Q5q+=Q32;Q5q+=I32;Q5q+=g32;this[E4x](Q5q,action,modifier,submitParamsLocal,json,store);for(var i=A22;i < json[G5o][W5q];i++){var s5q=p1G;s5q+=Q7E;s5q+=A0o;var w5q=o6G;w5q+=W7E;w5q+=r7E;var r5q=F6o;r5q+=N32;setData=json[r5q][i];var id=this[w5q](w7E,setData);this[S9x](s5q,[json,setData,action]);if(action === s3G){var z2q=A0x;z2q+=s7E;var Z5q=I4o;Z5q+=o7E;Z5q+=y32;Z5q+=I32;var d5q=R9x;d5q+=t0G;var F5q=I4o;F5q+=I5x;var n5q=l7o;n5q+=n7E;n5q+=I5x;var o5q=d7o;o5q+=Z2o;this[o5q](n5q,[json,setData,id]);this[E4x](F5q,fields,setData,store);this[d5q]([Z5q,z2q],[json,setData,id]);}else if(action === f9x){var R2q=g32;R2q+=F7E;this[S9x](R2q,[json,setData,id]);this[E4x](k1x,modifier,fields,setData,store);this[S9x]([k1x,d7E],[json,setData,id]);}}this[h2q](U2q,action,modifier,json[G5o],store);}else if(action === X1G){var E2q=I4o;E2q+=G3o;E2q+=Z7E;E2q+=y32;var K2q=z9E;K2q+=C4o;K2q+=y7o;K2q+=R9E;var v2q=V4o;v2q+=j4o;v2q+=p32;var P2q=A0x;P2q+=h9E;P2q+=U9E;P2q+=I32;var J2q=d7o;J2q+=l32;J2q+=y32;var t2q=X9E;t2q+=R9E;var D2q=g32;D2q+=M9E;D2q+=I32;var M2q=g32;M2q+=E0G;var X2q=D9E;X2q+=S4o;X2q+=t9E;X2q+=R9E;this[X2q](M2q,action,modifier,submitParamsLocal,json,store);this[S9x](D2q,[json,this[f4x]()]);this[t2q](P1x,modifier,fields,store);this[J2q]([P1x,P2q],[json,this[v2q]()]);this[K2q](E2q,action,modifier,json[G5o],store);}if(editCount === this[p32][o3x]){var k2q=q9o;k2q+=n8G;k2q+=J9E;k2q+=z0o;var G2q=E3G;G2q+=C7x;var action=this[p32][G2q];this[p32][f3G]=W5o;if(opts[R7E] === f4G && (hide === undefined || hide)){var Y2q=J6x;Y2q+=A0o;this[V2G](json[Y2q]?Q8o:N8o,action);}else if(typeof opts[R7E] === k2q){opts[R7E](this);}}if(successCallback){var L2q=I4o;L2q+=A0o;L2q+=v7o;L2q+=v7o;successCallback[L2q](that,json);}this[u2q](e2q,[json,setData,action]);}this[q2q](N8o);this[p2q](P9E,[json,setData,action]);};Editor[a2q][I2q]=function(xhr,err,thrown,errorCallback,submitParams,action){var K9E="_proc";var G9E="system";var v9E="event";var Y9E='submitError';var E9E='postSubmit';var c2q=s0o;c2q+=v9E;var A2q=K9E;A2q+=y8x;A2q+=O8o;this[S9x](E9E,[W5o,submitParams,action,xhr]);this[R3o](this[h5o][R3o][G9E]);this[A2q](N8o);if(errorCallback){var y2q=I4o;y2q+=D2o;y2q+=v7o;errorCallback[y2q](this,xhr,err,thrown);}this[c2q]([Y9E,P9E],[xhr,err,thrown,submitParams]);};Editor[f2q][K4x]=function(fn){var u9E="gs";var L9E="ettin";var k9E="oFe";var O2q=b0o;O2q+=p4G;O2q+=l32;O2q+=I32;var b2q=N32;b2q+=X0o;b2q+=v7o;b2q+=I32;var m2q=r4o;m2q+=g32;m2q+=V4o;var l2q=F6o;l2q+=N32;l2q+=r6x;var j2q=q9o;j2q+=l32;var x2q=N32;x2q+=X0o;x2q+=M0o;var that=this;var dt=this[p32][x2q]?new $[j2q][l2q][m2q](this[p32][b2q]):W5o;var ssp=N8o;if(dt){var i2q=k9E;i2q+=W8G;i2q+=y7o;i2q+=E6o;var S2q=p32;S2q+=L9E;S2q+=u9E;ssp=dt[S2q]()[A22][i2q][e9E];}if(this[p32][U0G]){var V2q=C4o;V2q+=l32;V2q+=I32;this[V2q](P9E,function(){H0LL.O64();var q9E='draw';if(ssp){dt[z9x](q9E,fn);}else {setTimeout(function(){fn();},b22);}});return Q8o;}else if(this[u1o]() === O2q || this[u1o]() === i5G){var N2q=X0o;N2q+=u3x;this[z9x](f4G,function(){H0LL.o64();if(!that[p32][U0G]){setTimeout(function(){if(that[p32]){fn();}},b22);}else {var H2q=C4o;H2q+=l32;H2q+=I32;that[H2q](P9E,function(e,json){var p9E="raw";H0LL.O64();if(ssp && json){var B2q=j4o;B2q+=p9E;var C2q=C4o;C2q+=l32;C2q+=I32;dt[C2q](B2q,fn);}else {setTimeout(function(){if(that[p32]){fn();}},b22);}});}})[N2q]();return Q8o;}return N8o;};Editor[e2o][O2x]=function(name,arr){var T2q=v7o;T2q+=I32;T2q+=l32;T2q+=B2G;for(var i=A22,ien=arr[T2q];i < ien;i++){if(name == arr[i]){return i;}}return -y22;};Editor[M5o]={"table":W5o,"ajaxUrl":W5o,"fields":[],"display":g2q,"ajax":W5o,"idSrc":Q2q,"events":{},"i18n":{"close":W2q,"create":{"button":r2q,"title":a9E,"submit":w2q},"edit":{"button":k0o,"title":I9E,"submit":s2q},"remove":{"button":A9E,"title":A9E,"submit":A9E,"confirm":{"_":y9E,"1":c9E}},"error":{"system":f9E},multi:{title:x9E,info:j9E,restore:l9E,noMulti:m9E},datetime:{previous:o2q,next:n2q,months:[b9E,F2q,d2q,S9E,i9E,V9E,Z2q,z3q,R3q,O9E,h3q,U3q],weekdays:[H9E,X3q,C9E,M3q,B9E,D3q,t3q],amPm:[J3q,N9E],hours:T9E,minutes:g9E,seconds:P3q,unknown:I9x}},formOptions:{bubble:$[v3q]({},Editor[K3q][E3q],{title:N8o,message:N8o,buttons:G3q,submit:Y3q}),inline:$[U5o]({},Editor[I4G][A4G],{buttons:N8o,submit:F4E}),main:$[k3q]({},Editor[I4G][L3q])},legacyAjax:N8o,actionName:Q9E};(function(){var s8E='keyless';var o9E="drawType";var T1E="cancelled";var V8E="[dat";var y8E='data-editor-value';var W9E="aTable";var p1E="attach";var s9E="oFeatures";var c4C=Z8G;c4C+=a3G;var n3q=F6o;n3q+=y32;n3q+=W9E;var __dataSources=Editor[F6x]={};var __dtIsSsp=function(dt,editor){H0LL.O64();var r9E="editOpt";var w9E="tting";var q3q=l32;q3q+=C4o;q3q+=l32;q3q+=I32;var e3q=r9E;e3q+=p32;var u3q=p1G;u3q+=w9E;u3q+=p32;return dt[u3q]()[A22][s9E][e9E] && editor[p32][e3q][o9E] !== q3q;};var __dtApi=function(table){var n9E="DataTab";var p3q=n9E;p3q+=v7o;p3q+=I32;return $(table)[p3q]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var F9E="highli";var a3q=F9E;a3q+=y9G;node[T7G](a3q);setTimeout(function(){var Z9E="noHi";var R1E='highlight';var z1E="ghl";var d9E="removeCla";var y3q=d9E;y3q+=q4G;var A3q=Z9E;A3q+=z1E;A3q+=G7o;A3q+=y32;var I3q=A2G;I3q+=P7o;I3q+=C6o;node[I3q](A3q)[y3q](R1E);setTimeout(function(){var h1E='noHighlight';node[Q2o](h1E);},X32);},U32);},C22);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var U1E="ndexe";var f3q=I32;f3q+=A0o;f3q+=I4o;f3q+=d4o;var c3q=V4o;c3q+=U1E;c3q+=p32;dt[g0x](identifier)[c3q]()[f3q](function(idx){var M1E="dentifier";var O22=14;var X1E="nable to find row i";var j3q=l32;j3q+=Z3x;var row=dt[H6G](idx);var data=row[G5o]();var idSrc=idFn(data);if(idSrc === undefined){var x3q=X7o;x3q+=X1E;x3q+=M1E;Editor[R3o](x3q,O22);}out[idSrc]={idSrc:idSrc,data:data,node:row[j3q](),fields:fields,type:n2x};});};var __dtFieldsFromIdx=function(dt,fields,idx){var E1E="Unab";var v1E="editField";H0LL.O64();var G1E="le to automatically determine field from source. Please specify the field name.";var t1E="editF";var D1E="isEmptyObj";var J1E="oC";var i3q=D1E;i3q+=C8o;i3q+=y32;var m3q=t1E;m3q+=V4o;m3q+=I32;m3q+=W9o;var l3q=A0o;l3q+=J1E;l3q+=P1E;var field;var col=dt[P5o]()[A22][l3q][idx];var dataSrc=col[v1E] !== undefined?col[m3q]:col[w4E];var resolvedFields={};var run=function(field,dataSrc){H0LL.O64();if(field[E5o]() === dataSrc){resolvedFields[field[E5o]()]=field;}};$[v2o](fields,function(name,fieldInst){var b3q=i2o;b3q+=K1E;b3q+=A0o;b3q+=n4o;if(Array[b3q](dataSrc)){var S3q=C2G;S3q+=B2G;for(var i=A22;i < dataSrc[S3q];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[i3q](resolvedFields)){var V3q=E1E;V3q+=G1E;Editor[R3o](V3q,S22);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var Y1E="cells";H0LL.O64();var O3q=D4x;O3q+=d4o;dt[Y1E](identifier)[k1E]()[O3q](function(idx){var a1E="fixedNode";var q1E="layFields";var u1E="column";var Q3q=s5o;Q3q+=j4o;Q3q+=I32;var g3q=A6G;g3q+=D1G;var T3q=Q32;T3q+=C4o;T3q+=J7o;var C3q=H8o;C3q+=I32;C3q+=I4o;C3q+=y32;var H3q=Q32;H3q+=l6G;var cell=dt[L1E](idx);var row=dt[H3q](idx[H6G]);var data=row[G5o]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[u1E]);var isNode=typeof identifier === C3q && identifier[e1E] || identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var N3q=C6G;N3q+=q1E;var B3q=A6G;B3q+=D1G;prevAttach=out[idSrc][B3q];prevDisplayFields=out[idSrc][N3q];}__dtRowSelector(out,dt,idx[T3q],allFields,idFn);H0LL.O64();out[idSrc][g3q]=prevAttach || [];out[idSrc][p1E][A8o](isNode?$(identifier)[m0G](A22):cell[a1E]?cell[a1E]():cell[Q3q]());out[idSrc][o4x]=prevDisplayFields || ({});$[U5o](out[idSrc][o4x],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var I1E="exes";var A1E="ell";var w3q=I32;w3q+=D1G;var r3q=s5x;r3q+=I1E;var W3q=I4o;W3q+=A1E;W3q+=p32;dt[W3q](W5o,identifier)[r3q]()[w3q](function(idx){H0LL.o64();__dtCellSelector(out,dt,idx,fields,idFn);});};H0LL.O64();var __dtjqId=function(id){var y1E='\\$1';var o3q=E0G;o3q+=Z4x;var s3q=X4G;s3q+=Q32;s3q+=R0G;return typeof id === s3q?x4x + id[o3q](/(:|\.|\[|\]|,)/g,y1E):x4x + id;};__dataSources[n3q]={id:function(data){var d3q=V4o;d3q+=j4o;d3q+=K7E;d3q+=I4o;var F3q=I32;F3q+=A32;F3q+=y32;H0LL.o64();var idFn=DataTable[F3q][k5o][u5o](this[p32][d3q]);return idFn(data);},individual:function(identifier,fieldNames){var c1E="dSr";var R0C=q9o;R0C+=V4o;R0C+=H0o;R0C+=w0G;var z0C=y32;z0C+=j7o;var Z3q=V4o;Z3q+=c1E;H0LL.o64();Z3q+=I4o;var idFn=DataTable[Z8o][k5o][u5o](this[p32][Z3q]);var dt=__dtApi(this[p32][z0C]);var fields=this[p32][R0C];var out={};var forceFields;var responsiveNode;if(fieldNames){if(!Array[Y3G](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[v2o](fieldNames,function(i,name){H0LL.O64();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var b1E="umns";var l1E="columns";var x1E="_fnGetObjectD";var m1E="col";var f1E="isPlai";var S1E="ows";var j1E="ataFn";var t0C=K0G;t0C+=v7o;t0C+=v7o;t0C+=p32;var D0C=Q32;D0C+=C4o;D0C+=J7o;D0C+=p32;var M0C=f1E;M0C+=l32;M0C+=f5G;var X0C=Q9o;X0C+=W9o;X0C+=p32;var U0C=x1E;U0C+=j1E;var h0C=C4o;h0C+=r4o;h0C+=k7E;var idFn=DataTable[Z8o][h0C][U0C](this[p32][o6x]);var dt=__dtApi(this[p32][x6G]);var fields=this[p32][X0C];var out={};if($[M0C](identifier) && (identifier[D0C] !== undefined || identifier[l1E] !== undefined || identifier[t0C] !== undefined)){var K0C=L1E;K0C+=p32;var v0C=m1E;v0C+=b1E;var J0C=H6G;J0C+=p32;if(identifier[J0C] !== undefined){var P0C=Q32;P0C+=S1E;__dtRowSelector(out,dt,identifier[P0C],fields,idFn);}if(identifier[v0C] !== undefined){__dtColumnSelector(out,dt,identifier[l1E],fields,idFn);}if(identifier[K0C] !== undefined){var E0C=I4o;E0C+=H0o;E0C+=A1o;__dtCellSelector(out,dt,identifier[E0C],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var G0C=N32;G0C+=X0o;H0LL.o64();G0C+=v7o;G0C+=I32;var dt=__dtApi(this[p32][G0C]);if(!__dtIsSsp(dt,this)){var Y0C=Q32;Y0C+=l6G;var row=dt[Y0C][A2G](data);__dtHighlight(row[b6G]());}},edit:function(identifier,fields,data,store){var C1E="inArra";var O1E="owId";var N1E="bleExt";var V1E="any";var B1E="aTa";var k0C=l32;k0C+=C4o;k0C+=l32;k0C+=I32;var that=this;var dt=__dtApi(this[p32][x6G]);if(!__dtIsSsp(dt,this) || this[p32][u5G][o9E] === k0C){var S0C=s5o;S0C+=n7o;var q0C=A0o;q0C+=l32;q0C+=n4o;var u0C=V4o;u0C+=j4o;var L0C=J6x;L0C+=A0o;L0C+=G5x;L0C+=c2o;var rowId=__dataSources[L0C][u0C][b3G](this,data);var row;try{var e0C=Q32;e0C+=l6G;row=dt[e0C](__dtjqId(rowId));}catch(e){row=dt;}if(!row[q0C]()){var p0C=Q32;p0C+=C4o;p0C+=J7o;row=dt[p0C](function(rowIdx,rowData,rowNode){var i1E="dataT";var a0C=i1E;a0C+=j7o;return rowId == __dataSources[a0C][c5o][b3G](that,rowData);});}if(row[V1E]()){var l0C=Q32;l0C+=O1E;l0C+=p32;var j0C=Q32;j0C+=l6G;j0C+=H1E;j0C+=p32;var x0C=C1E;x0C+=n4o;var f0C=j4o;f0C+=A0o;f0C+=y32;f0C+=A0o;var c0C=H5G;c0C+=u0E;c0C+=Q4x;c0C+=G9G;var y0C=C4o;y0C+=r4o;y0C+=k7E;var A0C=j4o;A0C+=W8G;A0C+=B1E;A0C+=N1E;var I0C=q9o;I0C+=l32;var extender=$[I0C][A0C][y0C][c0C];var toSave=extender({},row[f0C](),Q8o);toSave=extender(toSave,data,Q8o);row[G5o](toSave);var idx=$[x0C](rowId,store[j0C]);store[l0C][E5G](idx,y22);}else {var b0C=A0o;b0C+=j4o;b0C+=j4o;var m0C=Q32;m0C+=C4o;m0C+=J7o;row=dt[m0C][b0C](data);}__dtHighlight(row[S0C]());}},remove:function(identifier,fields,store){var g1E="every";var that=this;var dt=__dtApi(this[p32][x6G]);var cancelled=store[T1E];if(cancelled[B8o] === A22){var i0C=Q32;i0C+=l6G;i0C+=p32;dt[i0C](identifier)[X1G]();}else {var V0C=B7o;V0C+=J7o;V0C+=p32;var indexes=[];dt[V0C](identifier)[g1E](function(){var Q1E="Tab";var C0C=j4o;C0C+=A0o;C0C+=y32;C0C+=A0o;var H0C=I4o;H0C+=D2o;H0C+=v7o;var O0C=J6x;O0C+=A0o;O0C+=Q1E;O0C+=M0o;var id=__dataSources[O0C][c5o][H0C](that,this[C0C]());if($[r3o](id,cancelled) === -y22){var N0C=V4o;N0C+=l32;N0C+=j4o;N0C+=H8x;var B0C=g32;B0C+=P1o;B0C+=d4o;indexes[B0C](this[N0C]());}});dt[g0x](indexes)[X1G]();}},prep:function(action,identifier,submit,json,store){var w1E="elle";var r1E="canc";var W1E="owIds";var n1E="cancelle";if(action === k1x){var g0C=Q32;g0C+=W1E;var T0C=r1E;T0C+=w1E;T0C+=j4o;var cancelled=json[T0C] || [];store[g0C]=$[P4x](submit[G5o],function(val,key){var o1E="isEmptyObject";var s1E="inA";var W0C=s1E;W0C+=p7E;W0C+=Z3o;var Q0C=F6o;Q0C+=N32;H0LL.O64();return !$[o1E](submit[Q0C][key]) && $[W0C](key,cancelled) === -y22?key:undefined;});}else if(action === P1x){var r0C=n1E;r0C+=j4o;store[T1E]=json[r0C] || [];}},commit:function(action,identifier,data,store){var v8E="rebuildPane";var X8E="responsive";var J8E="searchPanes";var d1E="rowIds";var F1E="rawTy";var Z1E="wIds";var M8E="rec";var h8E="Side";var P8E="earchPanes";var R8E="Server";var z8E="Fea";var D8E="respo";var U8E="draw";var t8E="nsiv";var X4C=l32;X4C+=C4o;X4C+=l32;X4C+=I32;var U4C=j4o;U4C+=F1E;H0LL.o64();U4C+=I7o;var s0C=c0o;s0C+=V4o;s0C+=y32;var w0C=y32;w0C+=A0o;w0C+=X0o;w0C+=M0o;var that=this;var dt=__dtApi(this[p32][w0C]);if(!__dtIsSsp(dt,this) && action === s0C && store[d1E][B8o]){var F0C=v7o;F0C+=I32;F0C+=O8x;var o0C=B7o;o0C+=Z1E;var ids=store[o0C];var row;var compare=function(id){return function(rowIdx,rowData,rowNode){var n0C=J6x;H0LL.O64();n0C+=A0o;n0C+=r6x;return id == __dataSources[n0C][c5o][b3G](that,rowData);};};for(var i=A22,ien=ids[F0C];i < ien;i++){var h4C=C4o;h4C+=z8E;h4C+=k0E;h4C+=w7o;var R4C=p1G;R4C+=y32;R4C+=l0E;R4C+=p32;var z4C=A0o;z4C+=l32;z4C+=n4o;var d0C=n0G;d0C+=n4o;try{row=dt[H6G](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[d0C]()){var Z0C=Q32;Z0C+=C4o;Z0C+=J7o;row=dt[Z0C](compare(ids[i]));}if(row[z4C]() && !dt[R4C]()[A22][h4C][e9E]){row[X1G]();}}}var drawType=this[p32][u5G][U4C];if(drawType !== X4C){var t4C=X0o;t4C+=R8E;t4C+=h8E;dt[U8E](drawType);if(dt[X8E]){var D4C=M8E;D4C+=D2o;D4C+=I4o;var M4C=D8E;M4C+=t8E;M4C+=I32;dt[M4C][D4C]();}if(typeof dt[J8E] === H0LL[418273] && !dt[P5o]()[A22][s9E][t4C]){var J4C=p32;J4C+=P8E;dt[J4C][v8E](undefined,Q8o);}}}};function __html_id(identifier){var G8E="id=\"";var Y8E="Could not find an ";var k8E="eleme";var L8E="nt with `d";var K8E="[data-";var u8E="ata-editor-id` or `id` of: ";var P4C=E8G;P4C+=I32;P4C+=y8G;P4C+=N7E;var context=document;if(identifier !== P4C){var K4C=X6o;K4C+=H2x;var v4C=K8E;v4C+=i32;v4C+=E8E;v4C+=G8E;context=$(v4C + identifier + K4C);if(context[B8o] === A22){context=typeof identifier === y3G?$(__dtjqId(identifier)):$(identifier);}if(context[B8o] === A22){var E4C=Y8E;E4C+=k8E;E4C+=L8E;E4C+=u8E;throw E4C + identifier;}}return context;}function __html_el(identifier,name){var e8E="[data-editor-fiel";var Y4C=X6o;Y4C+=H2x;var G4C=e8E;G4C+=q8E;var context=__html_id(identifier);return $(G4C + name + Y4C,context);}function __html_els(identifier,names){var k4C=v7o;k4C+=I32;k4C+=l32;k4C+=B2G;var out=$();for(var i=A22,ien=names[k4C];i < ien;i++){out=out[A2G](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var I8E="ta-editor-value]";var p8E="tml";var a8E="[da";var e4C=d4o;e4C+=p8E;var u4C=A6G;u4C+=Q32;var L4C=a8E;L4C+=I8E;var el=__html_el(identifier,dataSrc);return el[A8E](L4C)[B8o]?el[u4C](y8E):el[e4C]();}function __html_set(identifier,fields,data){$[v2o](fields,function(name,field){var j8E="alue]";var c8E="alFromDa";var l8E="ataS";var f8E="[data-edit";var x8E="or-v";var q4C=o6o;q4C+=c8E;q4C+=y32;q4C+=A0o;var val=field[q4C](data);if(val !== undefined){var I4C=C2G;I4C+=p4o;I4C+=y32;I4C+=d4o;var a4C=f8E;a4C+=x8E;a4C+=j8E;var p4C=j4o;p4C+=l8E;p4C+=Q32;p4C+=I4o;var el=__html_el(identifier,field[p4C]());if(el[A8E](a4C)[I4C]){el[T0E](y8E,val);}else {var y4C=d4o;y4C+=y32;y4C+=b4o;y4C+=v7o;var A4C=I32;A4C+=D1G;el[A4C](function(){var m8E="childNodes";var S8E="firstChild";var b8E="removeChild";while(this[m8E][B8o]){this[b8E](this[S8E]);}})[y4C](val);}}});}__dataSources[c4C]={id:function(data){var f4C=H8x;f4C+=y32;var idFn=DataTable[f4C][k5o][u5o](this[p32][o6x]);return idFn(data);},initField:function(cfg){var H8E="-label=\"";var O8E="a-edito";var i8E="abe";var m4C=v7o;m4C+=I32;m4C+=O8o;m4C+=V8o;var l4C=v7o;l4C+=i8E;l4C+=v7o;var j4C=X6o;j4C+=H2x;var x4C=V8E;x4C+=O8E;x4C+=Q32;x4C+=H8E;var label=$(x4C + (cfg[G5o] || cfg[E5o]) + j4C);if(!cfg[l4C] && label[m4C]){var S4C=d4o;S4C+=y32;S4C+=b4o;S4C+=v7o;var b4C=v7o;b4C+=N2o;b4C+=I32;b4C+=v7o;cfg[b4C]=label[S4C]();}},individual:function(identifier,fieldNames){var r8E='data-editor-field';var n8E="omatically determine field name from data source";var o8E="Cannot aut";var N8E="a-edi";var T8E="tor-id";var w8E='addBack';var C8E="dito";var B8E="r-";var Q8E="dBa";var g8E="dSel";var W4C=I32;W4C+=A0o;W4C+=I4o;W4C+=d4o;var Q4C=q9o;Q4C+=l1o;Q4C+=W9o;Q4C+=p32;var T4C=M0o;T4C+=l32;T4C+=B2G;var i4C=l32;i4C+=Z3x;i4C+=b4E;var attachEl;if(identifier instanceof $ || identifier[i4C]){var N4C=I32;N4C+=C8E;N4C+=B8E;N4C+=c5o;var B4C=j4o;B4C+=N4x;var C4C=V8E;C4C+=N8E;C4C+=T8E;C4C+=H2x;var H4C=U4E;H4C+=l32;H4C+=h2o;var O4C=n0G;O4C+=g8E;O4C+=q9o;var V4C=F2o;V4C+=Q8E;V4C+=W8E;attachEl=identifier;if(!fieldNames){fieldNames=[$(identifier)[T0E](r8E)];}var back=$[E8o][V4C]?w8E:O4C;identifier=$(identifier)[H4C](C4C)[back]()[B4C](N4C);}if(!identifier){identifier=s8E;}if(fieldNames && !Array[Y3G](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[T4C] === A22){var g4C=o8E;g4C+=n8E;throw g4C;}var out=__dataSources[j3o][Q4C][b3G](this,identifier);var fields=this[p32][d6G];var forceFields={};$[W4C](fieldNames,function(i,name){H0LL.o64();forceFields[name]=fields[name];});$[v2o](out,function(id,set){var F8E="oArray";var d8E='cell';var r4C=y32;H0LL.O64();r4C+=F8E;set[r32]=d8E;set[p1E]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[r4C]();set[d6G]=fields;set[o4x]=forceFields;});return out;},fields:function(identifier){var Z4C=Q32;Z4C+=C4o;Z4C+=J7o;var n4C=e32;n4C+=j4o;n4C+=p32;var w4C=N6G;w4C+=W4E;var out={};var self=__dataSources[j3o];if(Array[w4C](identifier)){for(var i=A22,ien=identifier[B8o];i < ien;i++){var o4C=E2o;o4C+=G2o;var s4C=r9o;s4C+=M0x;var res=self[s4C][o4C](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[p32][n4C];if(!identifier){var F4C=Z8E;F4C+=v7o;F4C+=I32;F4C+=q4G;identifier=F4C;}$[v2o](fields,function(name,field){var z6E="aSr";var R6E="valToData";var d4C=F6o;d4C+=y32;H0LL.O64();d4C+=z6E;d4C+=I4o;var val=__html_get(identifier,field[d4C]());field[R6E](data,val === W5o?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:Z4C};return out;},create:function(fields,data){H0LL.o64();if(data){var id=__dataSources[j3o][c5o][b3G](this,data);try{var z7C=v7o;z7C+=l1G;z7C+=W2G;z7C+=d4o;if(__html_id(id)[z7C]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var R7C=Z8G;R7C+=b4o;R7C+=v7o;var id=__dataSources[R7C][c5o][b3G](this,data) || s8E;H0LL.o64();__html_set(id,fields,data);},remove:function(identifier,fields){__html_id(identifier)[X1G]();}};})();Editor[b2o]={"wrapper":h7C,"processing":{"indicator":h6E,"active":U0G},"header":{"wrapper":U7C,"content":X7C},"body":{"wrapper":M7C,"content":U6E},"footer":{"wrapper":D7C,"content":t7C},"form":{"wrapper":J7C,"content":X6E,"tag":H0LL[195232],"info":P7C,"error":v7C,"buttons":M6E,"button":K7C,"buttonInternal":E7C},"field":{"wrapper":B0o,"typePrefix":D6E,"namePrefix":t6E,"label":J6E,"input":G7C,"inputControl":P6E,"error":Y7C,"msg-label":v6E,"msg-error":K6E,"msg-message":E6E,"msg-info":k7C,"multiValue":L7C,"multiInfo":u7C,"multiRestore":e7C,"multiNoEdit":G6E,"disabled":q7C,"processing":p7C},"actions":{"create":a7C,"edit":I7C,"remove":A7C},"inline":{"wrapper":Y6E,"liner":y7C,"buttons":k6E},"bubble":{"wrapper":c7C,"liner":L6E,"table":f7C,"close":x7C,"pointer":j7C,"bg":u6E}};(function(){var I6E="ons-";var Y5E='selectedSingle';var c6E="lected";var S6E="formButtons";var t5E='rows';var a6E="ingle";var b6E="editor_create";var V6E="editor_remove";var j6E="selec";var p6E="tS";var d6E="formTitle";var m6E="editor_ed";var l6E="t_si";var W6E="emove";var k5E="removeSingle";var q6E="ngle";var f6E="buttons-cr";var x6E="lect";var e6E="Si";var y6E="buttons-e";var D5E="formMessage";var L1C=f9x;L1C+=e6E;L1C+=q6E;var k1C=I32;k1C+=j4o;k1C+=D4G;var Y1C=f1x;Y1C+=z5o;var G1C=I32;G1C+=L5o;G1C+=p6E;G1C+=a6E;var d9C=X0o;H0LL.O64();d9C+=Z9o;d9C+=I6E;d9C+=X1G;var w9C=A6E;w9C+=I6G;w9C+=I32;w9C+=j4o;var y9C=y6E;y9C+=L5o;y9C+=y32;var q9C=p1G;q9C+=c6E;var K9C=f6E;K9C+=R6o;var M9C=I32;M9C+=Q4x;M9C+=I32;M9C+=z5o;var X9C=X7x;X9C+=y32;X9C+=y4o;var U9C=I32;U9C+=Q4x;if(DataTable[X5x]){var g7C=p1G;g7C+=x6E;var B7C=j6E;B7C+=l6E;B7C+=q6E;var C7C=m6E;C7C+=D4G;var m7C=y32;m7C+=I32;m7C+=A32;m7C+=y32;var l7C=Z8o;l7C+=I32;l7C+=z5o;var ttButtons=DataTable[X5x][D5x];var ttButtonBase={sButtonText:W5o,editor:W5o,formTitle:W5o};ttButtons[b6E]=$[l7C](Q8o,ttButtons[m7C],ttButtonBase,{formButtons:[{label:W5o,fn:function(e){var b7C=p32;b7C+=C8x;b7C+=K3G;this[b7C]();}}],fnClick:function(button,config){var H7C=y32;H7C+=F5G;H7C+=I32;var O7C=W5x;O7C+=W8G;O7C+=I32;var i7C=W5x;i7C+=A0o;i7C+=u0o;var S7C=V4o;S7C+=i1o;S7C+=v1x;var editor=config[i32];var i18nCreate=editor[S7C][i7C];var buttons=config[S6E];if(!buttons[A22][A5o]){var V7C=e5G;V7C+=X0o;V7C+=b4o;V7C+=D4G;buttons[A22][A5o]=i18nCreate[V7C];}editor[O7C]({title:i18nCreate[H7C],buttons:buttons});}});ttButtons[C7C]=$[U5o](Q8o,ttButtons[B7C],ttButtonBase,{formButtons:[{label:W5o,fn:function(e){this[s0G]();}}],fnClick:function(button,config){var i6E="fnGetSelectedIndexes";var T7C=L4G;T7C+=c7G;var N7C=b1x;N7C+=v7o;var selected=this[i6E]();if(selected[B8o] !== y22){return;}var editor=config[i32];var i18nEdit=editor[h5o][f9x];var buttons=config[S6E];if(!buttons[A22][N7C]){buttons[A22][A5o]=i18nEdit[s0G];}editor[f9x](selected[A22],{title:i18nEdit[T7C],buttons:buttons});}});ttButtons[V6E]=$[U5o](Q8o,ttButtons[g7C],ttButtonBase,{question:W5o,formButtons:[{label:W5o,fn:function(e){var that=this;this[s0G](function(json){var O6E="fnSelec";var C6E="DataTabl";var T6E="stance";var B6E="fnG";var N6E="etIn";var H6E="tN";var o7C=O6E;o7C+=H6E;o7C+=z9x;var s7C=l32;s7C+=p1o;s7C+=I32;var w7C=y32;w7C+=A0o;w7C+=c2o;var r7C=C6E;r7C+=I32;var W7C=B6E;W7C+=N6E;W7C+=T6E;H0LL.o64();var Q7C=q9o;Q7C+=l32;var tt=$[Q7C][G8o][X5x][W7C]($(that[p32][x6G])[r7C]()[w7C]()[s7C]());tt[o7C]();});}}],fnClick:function(button,config){var w6E="dexe";var r6E="fnGetSelectedIn";var Q6E="irm";var g6E="onfir";var h9C=y32;h9C+=V4o;h9C+=y32;h9C+=M0o;var R9C=v7o;R9C+=l1G;R9C+=B2G;var z9C=I4o;z9C+=g6E;z9C+=b4o;var Z7C=C2G;Z7C+=p4o;Z7C+=y32;Z7C+=d4o;var d7C=I4o;d7C+=j4G;d7C+=Q6E;var F7C=Q32;F7C+=W6E;var n7C=r6E;n7C+=w6E;n7C+=p32;var rows=this[n7C]();if(rows[B8o] === A22){return;}var editor=config[i32];var i18nRemove=editor[h5o][F7C];var buttons=config[S6E];var question=typeof i18nRemove[K1x] === y3G?i18nRemove[d7C]:i18nRemove[K1x][rows[Z7C]]?i18nRemove[z9C][rows[R9C]]:i18nRemove[K1x][s0o];if(!buttons[A22][A5o]){buttons[A22][A5o]=i18nRemove[s0G];}editor[X1G](rows,{message:question[a0G](/%d/g,rows[B8o]),title:i18nRemove[h9C],buttons:buttons});}});}var _buttons=DataTable[U9C][X9C];$[M9C](_buttons,{create:{text:function(dt,node,config){var o6E=".create";var v9C=X7x;v9C+=s6E;var P9C=W5x;P9C+=A0o;P9C+=y32;P9C+=I32;var J9C=V4o;J9C+=i1o;J9C+=v1x;var t9C=X7x;t9C+=y32;t9C+=y4o;t9C+=o6E;var D9C=V4o;D9C+=i1o;D9C+=v1x;return dt[D9C](t9C,config[i32][J9C][P9C][v9C]);},className:K9C,editor:W5o,formButtons:{text:function(editor){var E9C=z6o;E9C+=I32;E9C+=D7o;return editor[h5o][E9C][s0G];},action:function(e){H0LL.O64();this[s0G]();}},formMessage:W5o,formTitle:W5o,action:function(e,dt,node,config){var n6E="essage";var e9C=V4o;e9C+=i1o;e9C+=v1x;var u9C=o32;u9C+=q4G;u9C+=Y2x;var L9C=S0o;L9C+=z4o;L9C+=H4o;L9C+=n6E;var Y9C=C4o;Y9C+=l32;Y9C+=I32;var G9C=c0o;G9C+=D4G;G9C+=g0o;var that=this;var editor=config[G9C];this[U0G](Q8o);editor[Y9C](u4E,function(){H0LL.o64();var F6E="rocessi";var k9C=g32;k9C+=F6E;k9C+=O8o;that[k9C](N8o);})[s3G]({buttons:config[S6E],message:config[L9C] || editor[h5o][s3G][u9C],title:config[d6E] || editor[e9C][s3G][a2G]});}},edit:{extend:q9C,text:function(dt,node,config){var Z6E='buttons.edit';var A9C=X7x;A9C+=s6E;var I9C=I32;I9C+=L5o;I9C+=y32;var a9C=V4o;a9C+=i1o;a9C+=j32;a9C+=l32;var p9C=V4o;p9C+=n5G;p9C+=l32;return dt[p9C](Z6E,config[i32][a9C][I9C][A9C]);},className:y9C,editor:W5o,formButtons:{text:function(editor){var z5E="ubmi";var x9C=p32;x9C+=z5E;x9C+=y32;var f9C=c0o;f9C+=V4o;f9C+=y32;var c9C=V4o;c9C+=i1o;c9C+=j32;c9C+=l32;return editor[c9C][f9C][x9C];},action:function(e){var j9C=p32;H0LL.o64();j9C+=H3x;this[j9C]();}},formMessage:W5o,formTitle:W5o,action:function(e,dt,node,config){var U5E="process";var M5E="xe";var R5E="formB";var h5E="reOp";var X5E="inde";var r9C=V4o;r9C+=i1o;r9C+=j32;r9C+=l32;var W9C=b4o;W9C+=H7o;W9C+=C7o;var Q9C=V4o;Q9C+=M5x;var g9C=R5E;g9C+=Z9o;g9C+=y4o;var T9C=c32;T9C+=y32;var N9C=g32;N9C+=h5E;N9C+=l1G;var B9C=C4o;B9C+=l32;B9C+=I32;var C9C=U5E;C9C+=R0G;var H9C=M0o;H9C+=O8x;var O9C=v7o;O9C+=l1G;O9C+=p4o;O9C+=V8o;var V9C=L1E;V9C+=p32;var i9C=s5x;i9C+=I32;i9C+=A32;i9C+=w7o;var S9C=I4o;S9C+=P1E;var b9C=X5E;b9C+=M5E;b9C+=p32;var m9C=Q32;m9C+=l6G;m9C+=p32;var l9C=c32;l9C+=y32;l9C+=C4o;l9C+=Q32;var that=this;var editor=config[l9C];var rows=dt[m9C]({selected:Q8o})[b9C]();var columns=dt[S9C]({selected:Q8o})[i9C]();var cells=dt[V9C]({selected:Q8o})[k1E]();var items=columns[O9C] || cells[H9C]?{rows:rows,columns:columns,cells:cells}:rows;this[C9C](Q8o);editor[B9C](N9C,function(){H0LL.o64();that[U0G](N8o);})[T9C](items,{buttons:config[g9C],message:config[D5E] || editor[Q9C][f9x][W9C],title:config[d6E] || editor[r9C][f9x][a2G]});}},remove:{extend:w9C,limitTo:[t5E],text:function(dt,node,config){var J5E=".remove";var F9C=M3G;F9C+=C4o;F9C+=o3o;var n9C=c32;n9C+=P5x;var o9C=I2G;o9C+=J5E;var s9C=x32;s9C+=v1x;return dt[s9C](o9C,config[n9C][h5o][F9C][j3G]);},className:d9C,editor:W5o,formButtons:{text:function(editor){H0LL.O64();var z1C=Q32;z1C+=W6E;var Z9C=V4o;Z9C+=i1o;Z9C+=j32;Z9C+=l32;return editor[Z9C][z1C][s0G];},action:function(e){this[s0G]();}},formMessage:function(editor,dt){var E5E="dexes";var v5E="strin";var K5E="onfi";var P5E="firm";var J1C=v7o;J1C+=I32;J1C+=m9x;J1C+=d4o;var t1C=I4o;t1C+=C4o;t1C+=l32;t1C+=P5E;var D1C=m4o;D1C+=l32;D1C+=P5E;var M1C=v5E;M1C+=p4o;var X1C=I4o;X1C+=K5E;X1C+=z4o;var U1C=V4o;U1C+=M5x;var h1C=b0o;h1C+=E5E;var R1C=B7o;R1C+=J7o;R1C+=p32;var rows=dt[R1C]({selected:Q8o})[h1C]();var i18n=editor[U1C][X1G];var question=typeof i18n[X1C] === M1C?i18n[D1C]:i18n[t1C][rows[J1C]]?i18n[K1x][rows[B8o]]:i18n[K1x][s0o];return question[a0G](/%d/g,rows[B8o]);},formTitle:W5o,action:function(e,dt,node,config){var E1C=M3G;E1C+=G5E;var K1C=B7o;K1C+=B0x;var v1C=Q32;v1C+=g4o;v1C+=G5E;var P1C=c0o;P1C+=V4o;P1C+=d9o;P1C+=Q32;var that=this;var editor=config[P1C];H0LL.O64();this[U0G](Q8o);editor[z9x](u4E,function(){H0LL.o64();that[U0G](N8o);})[v1C](dt[K1C]({selected:Q8o})[k1E](),{buttons:config[S6E],message:config[D5E],title:config[d6E] || editor[h5o][E1C][a2G]});}}});_buttons[G1C]=$[Y1C]({},_buttons[k1C]);_buttons[L1C][U5o]=Y5E;_buttons[k5E]=$[U5o]({},_buttons[X1G]);_buttons[k5E][U5o]=Y5E;})();Editor[v5o]={};Editor[L5E]=function(input,opts){var S5E="-year\"><";var v2E='-iconRight">';var i5E="/select>";var x5E="utes\"";var A2E=/[Hhm]|LT|LTS/;var G2E='<span></span>';var w5E="YYY-";var j5E="-ti";var C5E="<span></spa";var c5E="-seconds\"></div";var d5E="Editor datetime: Without momentjs only the format '";var m5E="-calendar\">";var A5E="-calen";var a2E=/[YMD]|L(?!T)|l/;var o5E="ssPrefi";var p5E="tc";var O5E="-label\"";var V5E="<select clas";var I2E="match";var T5E="</b";var I5E="ime-";var K2E='-label">';var a5E="editor-da";var p2E="_instance";var u2E='-title';var y5E="iv>";var t2E='<button>';var H5E="onth\"></select>";var y2E=/[haA]/;var r5E="Y";var Q5E="nex";var q2E='-error';var M2E='-title">';var Y2E='-hours"></div>';var s5E="MM-D";var u5E="_constru";var q5E="matc";var E2E='<select class="';var N5E=" c";var f5E="-m";var l5E="e\">";var D2E='-iconLeft">';var e5E="ctor";var L2E='-date';var W5E="div ";var Z5E="YYYY-MM-DD' can be used";var g5E="utton>";var X2E='-date">';var k2E='-error"></div>';var B5E="n>";var J2E="previous";var G8C=u5E;G8C+=e5E;var E8C=A0o;E8C+=u9G;var K8C=y32;K8C+=V4o;K8C+=y32;K8C+=M0o;var v8C=j4o;v8C+=C4o;v8C+=b4o;var P8C=j4o;P8C+=D7o;var J8C=W8o;J8C+=b4o;var t8C=A0o;t8C+=a1G;t8C+=I32;t8C+=z5o;var D8C=L4G;D8C+=b4o;D8C+=I32;var M8C=j4o;M8C+=A0o;M8C+=u0o;var X8C=Z9G;X8C+=z5o;var U8C=j4o;U8C+=C4o;H0LL.o64();U8C+=b4o;var h8C=q5E;h8C+=d4o;var R8C=c9x;R8C+=h2x;var z8C=V4o;z8C+=l32;z8C+=j4o;z8C+=o5x;var Z1C=J0x;Z1C+=W8G;var d1C=S0o;d1C+=Q32;d1C+=b4o;d1C+=W8G;var F1C=b4o;F1C+=A0o;F1C+=p5E;F1C+=d4o;var n1C=a5E;n1C+=u0o;n1C+=I5E;var o1C=q9o;o1C+=b0o;o1C+=j4o;var s1C=A5E;s1C+=F6o;s1C+=Q32;var w1C=q9o;w1C+=V4o;w1C+=l32;w1C+=j4o;var r1C=q9o;r1C+=V4o;r1C+=z5o;var W1C=v6o;W1C+=j4o;W1C+=y5E;var Q1C=c5E;Q1C+=M6o;var g1C=f5E;g1C+=b0o;g1C+=x5E;g1C+=U6x;var T1C=j5E;T1C+=b4o;T1C+=l5E;var N1C=Y6o;N1C+=i6o;N1C+=K6o;N1C+=M6o;var B1C=m5E;B1C+=L9G;var C1C=b5E;C1C+=V4o;C1C+=L6o;var H1C=S5E;H1C+=i5E;var O1C=V5E;O1C+=K7x;var V1C=O5E;V1C+=M6o;var i1C=Z5G;i1C+=X6o;var S1C=f5E;S1C+=H5E;var b1C=C5E;b1C+=B5E;var m1C=w5G;m1C+=N5E;m1C+=v7o;m1C+=k6x;var l1C=T5E;l1C+=g5E;var j1C=Q5E;j1C+=y32;var x1C=Y6o;x1C+=A7x;x1C+=B5E;var f1C=Y6o;f1C+=X7G;f1C+=s5G;f1C+=k6x;var c1C=Y6o;c1C+=W5E;c1C+=K1o;c1C+=k6x;var y1C=X6o;y1C+=M6o;var A1C=w5G;A1C+=z2G;var e1C=r5E;e1C+=w5E;e1C+=s5E;e1C+=n32;var u1C=I4o;u1C+=U9G;u1C+=o5E;u1C+=A32;this[I4o]=$[U5o](Q8o,{},Editor[L5E][M5o],opts);var classPrefix=this[I4o][u1C];var i18n=this[I4o][h5o];if(!window[n5E] && this[I4o][F5E] !== e1C){var q1C=d5E;q1C+=Z5E;throw q1C;}var timeBlock=function(type){var z2E="imeblock\">";var h2E="iv class=\"";var a1C=E8E;a1C+=y32;a1C+=z2E;var p1C=R2E;p1C+=h2E;return p1C + classPrefix + a1C + B5o;};var gap=function(){var U2E="span>:</span>";H0LL.o64();var I1C=Y6o;I1C+=U2E;return I1C;};var structure=$(A1C + classPrefix + y1C + q5o + classPrefix + X2E + c1C + classPrefix + M2E + f1C + classPrefix + D2E + t2E + i18n[J2E] + P2E + B5o + q5o + classPrefix + v2E + x1C + i18n[j1C] + l1C + B5o + m1C + classPrefix + K2E + b1C + E2E + classPrefix + S1C + B5o + i1C + classPrefix + V1C + G2E + O1C + classPrefix + H1C + B5o + C1C + q5o + classPrefix + B1C + N1C + q5o + classPrefix + T1C + q5o + classPrefix + Y2E + q5o + classPrefix + g1C + q5o + classPrefix + Q1C + B5o + q5o + classPrefix + k2E + W1C);this[F5o]={container:structure,date:structure[r1C](I7x + classPrefix + L2E),title:structure[a7x](I7x + classPrefix + u2E),calendar:structure[w1C](I7x + classPrefix + s1C),time:structure[o1C](I7x + classPrefix + e2E),error:structure[a7x](I7x + classPrefix + q2E),input:$(input)};this[p32]={d:W5o,display:W5o,minutesRange:W5o,secondsRange:W5o,namespace:n1C + Editor[L5E][p2E]++,parts:{date:this[I4o][F5E][F1C](a2E) !== W5o,time:this[I4o][d1C][I2E](A2E) !== W5o,seconds:this[I4o][Z1C][z8C](v8o) !== -y22,hours12:this[I4o][R8C][h8C](y2E) !== W5o}};this[U8C][r2o][X8C](this[F5o][M8C])[l3o](this[F5o][D8C])[t8C](this[J8C][R3o]);this[F5o][P8C][l3o](this[v8C][K8C])[E8C](this[F5o][c2E]);this[G8C]();};$[U5o](Editor[Y8C][k8C],{destroy:function(){var x2E="tor-datetime";var f2E=".edi";var e8C=f2E;e8C+=x2E;var u8C=C4o;u8C+=w0E;var L8C=s9x;L8C+=y32;L8C+=n4o;this[b1G]();this[F5o][r2o][C8G]()[L8C]();this[F5o][l5o][u8C](e8C);},errorMsg:function(msg){var error=this[F5o][R3o];if(msg){error[j3o](msg);}else {var q8C=I32;q8C+=j2E;q8C+=b7o;error[q8C]();}},hide:function(){var l2E="_hi";var p8C=l2E;p8C+=n7o;this[p8C]();},max:function(date){var b2E="nder";var m2E="_setCal";var i2E="ptionsTitle";var I8C=m2E;I8C+=A0o;I8C+=b2E;var a8C=S2E;a8C+=i2E;this[I4o][V2E]=date;this[a8C]();this[I8C]();},min:function(date){var O2E="etCalan";var H2E="Title";var y8C=s0o;y8C+=p32;y8C+=O2E;y8C+=Y4o;var A8C=S2E;A8C+=u7x;H0LL.O64();A8C+=H2E;this[I4o][C2E]=date;this[A8C]();this[y8C]();},owns:function(node){var B2E="engt";var j8C=v7o;j8C+=B2E;j8C+=d4o;var x8C=j1G;x8C+=z3o;var f8C=W8o;f8C+=b4o;H0LL.O64();var c8C=q9o;c8C+=p9o;c8C+=z6x;return $(node)[H2o]()[c8C](this[f8C][x8C])[j8C] > A22;},val:function(set,write){var o2E="cale";var d2E="tch";var F2E="toDate";var w2E="ntStrict";var Z2E=/(\d{4})\-(\d{2})\-(\d{2})/;var Q2E="-now";var R3E="_wri";var s2E="Lo";var X3E="toString";var N2E="_setT";var g2E="TCDa";var h3E="teOutput";var r2E="mom";var n2E="isValid";var T8C=N2E;T8C+=V4o;T8C+=c7G;var N8C=T2E;N8C+=g2E;N8C+=y32;N8C+=I32;var B8C=C6G;B8C+=G8G;var C8C=L5o;C8C+=h0G;C8C+=A0o;C8C+=n4o;var l8C=E8E;l8C+=Q2E;if(set === undefined){return this[p32][j4o];}if(set instanceof Date){this[p32][j4o]=this[W2E](set);}else if(set === W5o || set === P8o){this[p32][j4o]=W5o;}else if(set === l8C){this[p32][j4o]=new Date();}else if(typeof set === y3G){if(window[n5E]){var S8C=r2E;S8C+=I32;S8C+=w2E;var b8C=n5E;b8C+=s2E;b8C+=o2E;var m8C=y7o;m8C+=y32;m8C+=I4o;var m=window[n5E][m8C](set,this[I4o][F5E],this[I4o][b8C],this[I4o][S8C]);this[p32][j4o]=m[n2E]()?m[F2E]():W5o;}else {var i8C=D8G;i8C+=d2E;var match=set[i8C](Z2E);this[p32][j4o]=match?new Date(Date[z3E](match[y22],match[c22] - y22,match[f22])):W5o;}}if(write || write === undefined){if(this[p32][j4o]){var V8C=R3E;V8C+=h3E;this[V8C]();}else {var H8C=o6o;H8C+=A0o;H8C+=v7o;var O8C=V4o;O8C+=U3E;O8C+=G1o;this[F5o][O8C][H8C](set);}}if(!this[p32][j4o]){this[p32][j4o]=this[W2E](new Date());}this[p32][C8C]=new Date(this[p32][j4o][X3E]());this[p32][B8C][N8C](y22);this[T8C]();this[M3E]();this[D3E]();},_constructor:function(){var y3E="iv.";var x3E='focus.editor-datetime click.editor-datetime';var e3E="ispl";var f3E='off';var G3E="secon";var m3E='keyup.editor-datetime';var D0W="_writeO";var I3E="sec";var t0W="utput";var k3E="part";var A3E="ond";var p3E="time";var J3E="ang";var T3E="_setTitle";var P3E="au";var v3E="tocompl";var E3E="tionsT";var z0W="UTCHou";var a6C=t3E;a6C+=I32;a6C+=I6G;var p6C=I4o;p6C+=d4o;H0LL.O64();p6C+=J3E;p6C+=I32;var q6C=j2o;q6C+=y32;q6C+=o1x;q6C+=Q4o;var P6C=P3E;P6C+=v3E;P6C+=I32;P6C+=u0o;var J6C=A0o;J6C+=y32;J6C+=y32;J6C+=Q32;var t6C=W8o;t6C+=b4o;var D6C=K3E;D6C+=E3E;D6C+=J1x;var z6C=G3E;z6C+=w0G;var Z8C=Y3E;Z8C+=Q32;Z8C+=h2o;var n8C=y32;n8C+=V4o;n8C+=o32;var o8C=k3E;o8C+=p32;var r8C=F6o;r8C+=y32;r8C+=I32;var W8C=g32;W8C+=A0o;W8C+=Q32;W8C+=h2o;var that=this;var classPrefix=this[I4o][L3E];var onChange=function(){var u3E="onChange";var Q8C=o6o;H0LL.O64();Q8C+=A0o;Q8C+=v7o;var g8C=j4o;g8C+=C4o;g8C+=b4o;that[I4o][u3E][b3G](that,that[g8C][l5o][Q8C](),that[p32][j4o],that[F5o][l5o]);};if(!this[p32][W8C][r8C]){var s8C=s5o;s8C+=l32;s8C+=I32;var w8C=j4o;w8C+=e3E;w8C+=A0o;w8C+=n4o;this[F5o][q3E][o5o](w8C,s8C);}if(!this[p32][o8C][n8C]){var d8C=s5o;d8C+=l32;d8C+=I32;var F8C=j4o;F8C+=G3o;this[F8C][p3E][o5o](n5o,d8C);}if(!this[p32][Z8C][z6C]){var M6C=I32;M6C+=Q5G;var X6C=a3E;X6C+=I32;var U6C=E8E;U6C+=I3E;U6C+=A3E;U6C+=p32;var h6C=j4o;h6C+=y3E;var R6C=j4o;R6C+=C4o;R6C+=b4o;this[R6C][p3E][o4G](h6C + classPrefix + U6C)[X6C]();this[F5o][p3E][o4G](c3E)[M6C](y22)[X1G]();}this[D6C]();this[t6C][l5o][J6C](P6C,f3E)[z0o](x3E,function(){var l3E=":vis";var j3E=":dis";var k6C=o6o;k6C+=A0o;k6C+=v7o;var Y6C=W8o;Y6C+=b4o;var G6C=j3E;G6C+=N2o;G6C+=M0o;G6C+=j4o;var E6C=l3E;E6C+=V4o;E6C+=X0o;E6C+=M0o;var K6C=V4o;K6C+=p32;var v6C=j4o;v6C+=C4o;v6C+=b4o;if(that[v6C][r2o][K6C](E6C) || that[F5o][l5o][i2o](G6C)){return;}that[V3o](that[Y6C][l5o][k6C](),N8o);that[m1G]();})[z0o](m3E,function(){var b3E="visi";var L6C=O7E;L6C+=b3E;L6C+=c2o;if(that[F5o][r2o][i2o](L6C)){var e6C=i0o;e6C+=v7o;var u6C=j4o;u6C+=C4o;u6C+=b4o;that[V3o](that[u6C][l5o][e6C](),N8o);}});this[F5o][q6C][z0o](p6C,a6C,function(){var J0W="setS";H0LL.o64();var C3E="_setC";var U0W="riteOutput";var i3E="minute";var O3E="asCl";var v0W="_position";var g3E='-year';var X0W="_setTi";var P0W="econd";var d3E="iner";var w3E='-ampm';var h0W="_w";var Q3E="tUTCFullY";var V3E="hasCla";var r3E='-hours';var S3E="onds";var R0W="_writeOutput";var N3E="correctMonth";var B3E="alander";var T6C=E8E;T6C+=p1G;T6C+=I4o;T6C+=S3E;var N6C=h9G;N6C+=C6o;var H6C=E8E;H6C+=i3E;H6C+=p32;var x6C=V3E;x6C+=q4G;var c6C=d4o;c6C+=O3E;c6C+=A0o;c6C+=q4G;var I6C=E8E;I6C+=c4o;I6C+=H3E;var select=$(this);var val=select[V3o]();if(select[U2o](classPrefix + I6C)){var y6C=C3E;y6C+=B3E;var A6C=s0o;A6C+=N3E;that[A6C](that[p32][u1o],val);that[T3E]();that[y6C]();}else if(select[c6C](classPrefix + g3E)){var f6C=p1G;f6C+=Q3E;f6C+=I32;f6C+=W3E;that[p32][u1o][f6C](val);that[T3E]();that[M3E]();}else if(select[U2o](classPrefix + r3E) || select[x6C](classPrefix + w3E)){if(that[p32][s3E][o3E]){var V6C=n3E;V6C+=e9o;var i6C=o6o;i6C+=A0o;i6C+=v7o;var S6C=F3E;S6C+=j4o;var b6C=O2o;b6C+=d3E;var m6C=j4o;m6C+=C4o;m6C+=b4o;var l6C=I4o;l6C+=C4o;l6C+=Z3E;var j6C=j4o;j6C+=G3o;var hours=$(that[j6C][l6C])[a7x](I7x + classPrefix + r3E)[V3o]() * y22;var pm=$(that[m6C][b6C])[S6C](I7x + classPrefix + w3E)[i6C]() === N9E;that[p32][j4o][V6C](hours === i22 && !pm?A22:pm && hours !== i22?hours + i22:hours);}else {var O6C=b0G;O6C+=z0W;O6C+=e9o;that[p32][j4o][O6C](val);}that[D3E]();that[R0W](Q8o);onChange();}else if(select[U2o](classPrefix + H6C)){var B6C=h0W;B6C+=U0W;var C6C=X0W;C6C+=o32;that[p32][j4o][M0W](val);that[C6C]();that[B6C](Q8o);onChange();}else if(select[N6C](classPrefix + T6C)){var Q6C=D0W;Q6C+=t0W;var g6C=J0W;g6C+=P0W;g6C+=p32;that[p32][j4o][g6C](val);that[D3E]();that[Q6C](Q8o);onChange();}that[F5o][l5o][t2o]();that[v0W]();})[z0o](z2o,function(e){var j0W="tes";var W0W="urs";var N0W="etUTC";var a0W="etTit";var A0W="rectMo";var F0W="TCF";var x0W="UTCMinu";var Z0W="CD";var d0W="ullYear";var L0W='range';var Y0W="hasClas";var T0W="Hours";var B0W="dsRange";var p0W='-iconRight';var y0W="setTim";var C0W="secondsRange";var I0W="_cor";var E0W="parentNod";var H0W="setTime";var u0W='-iconLeft';var Q0W="Ho";var n0W="Date";var w0W="write";var K0W="toLowerCa";var o0W="tUTC";var c0W="tSeco";var s0W="Outpu";var e0W="TCMont";var h4W='day';var f0W="nds";var l0W="lu";var F6C=A7x;F6C+=l32;var n6C=p32;n6C+=I32;n6C+=M0o;n6C+=I6G;var o6C=K0W;o6C+=p1G;var s6C=N32;s6C+=Q32;s6C+=C7o;s6C+=y32;var w6C=E0W;w6C+=I32;var r6C=Q3G;r6C+=n0G;var W6C=N32;W6C+=Q32;W6C+=p4o;W6C+=u8G;var d=that[p32][j4o];var nodeName=e[W6C][e1E][E3x]();var target=nodeName === r6C?e[X9G][w6C]:e[s6C];nodeName=target[e1E][o6C]();H0LL.O64();if(nodeName === n6C){return;}e[G0W]();if(nodeName === F6C){var D5C=Y0W;D5C+=p32;var Z6C=d4o;Z6C+=w8G;var d6C=g32;d6C+=W3E;d6C+=I32;d6C+=Z2o;var button=$(target);var parent=button[d6C]();if(parent[U2o](k0W) && !parent[Z6C](L0W)){button[q5G]();return;}if(parent[U2o](classPrefix + u0W)){var M5C=q9o;M5C+=J1o;M5C+=y7o;M5C+=p32;var X5C=b0o;X5C+=g32;X5C+=G1o;var U5C=W8o;U5C+=b4o;var h5C=L5o;h5C+=p32;h5C+=g32;h5C+=G8G;var R5C=T2E;R5C+=e0W;R5C+=d4o;var z5C=j4o;z5C+=f3o;that[p32][z5C][R5C](that[p32][h5C][q0W]() - y22);that[T3E]();that[M3E]();that[U5C][X5C][M5C]();}else if(parent[D5C](classPrefix + p0W)){var v5C=V4o;v5C+=l32;v5C+=g32;v5C+=G1o;var P5C=j4o;P5C+=C4o;P5C+=b4o;var J5C=u7o;J5C+=a0W;J5C+=v7o;J5C+=I32;var t5C=I0W;t5C+=A0W;t5C+=Z2o;t5C+=d4o;that[t5C](that[p32][u1o],that[p32][u1o][q0W]() + y22);that[J5C]();that[M3E]();that[P5C][v5C][t2o]();}else if(button[H2o](I7x + classPrefix + e2E)[B8o]){var l5C=D0W;l5C+=t0W;var j5C=s0o;j5C+=y0W;j5C+=I32;var x5C=p1G;x5C+=c0W;x5C+=f0W;var f5C=p32;f5C+=u8G;f5C+=x0W;f5C+=j0W;var c5C=p1G;c5C+=y32;c5C+=z0W;c5C+=e9o;var A5C=g32;A5C+=b4o;var a5C=A0o;a5C+=b4o;var Y5C=n8G;Y5C+=V4o;Y5C+=y32;var G5C=j4o;G5C+=A0o;G5C+=N32;var E5C=o6o;E5C+=A0o;E5C+=l0W;E5C+=I32;var K5C=j4o;K5C+=A0o;K5C+=y32;K5C+=A0o;var val=button[K5C](E5C);var unit=button[G5C](Y5C);if(unit === m0W){var k5C=T6G;k5C+=l32;k5C+=C7o;if(parent[U2o](k0W) && parent[U2o](k5C)){that[p32][b0W]=val;that[D3E]();return;}else {that[p32][b0W]=W5o;}}if(unit === S0W){var e5C=Q32;e5C+=A0o;e5C+=O8o;e5C+=I32;var u5C=i0W;u5C+=V0W;var L5C=O0W;L5C+=t3o;L5C+=N6x;L5C+=p32;if(parent[L5C](u5C) && parent[U2o](e5C)){var q5C=s0o;q5C+=H0W;that[p32][C0W]=val;that[q5C]();return;}else {var p5C=G3E;p5C+=B0W;that[p32][p5C]=W5o;}}if(val === a5C){var I5C=p4o;I5C+=N0W;I5C+=T0W;if(d[I5C]() >= i22){val=d[g0W]() - i22;}else {return;}}else if(val === A5C){if(d[g0W]() < i22){var y5C=p4o;y5C+=N0W;y5C+=Q0W;y5C+=W0W;val=d[y5C]() + i22;}else {return;}}var set=unit === r0W?c5C:unit === m0W?f5C:x5C;d[set](val);that[j5C]();that[l5C](Q8o);onChange();}else {var C5C=g32;C5C+=W3E;C5C+=y32;C5C+=p32;var H5C=s0o;H5C+=w0W;H5C+=s0W;H5C+=y32;var O5C=j4o;O5C+=A0o;O5C+=N32;var V5C=p1G;V5C+=o0W;V5C+=n0W;var i5C=j4o;i5C+=A0o;i5C+=y32;i5C+=A0o;var S5C=n4o;S5C+=I32;S5C+=W3E;var b5C=T2E;b5C+=F0W;b5C+=d0W;var m5C=T2E;m5C+=k4o;m5C+=Z0W;m5C+=D7o;if(!d){d=that[W2E](new Date());}d[m5C](y22);d[b5C](button[G5o](S5C));d[z4W](button[i5C](R4W));d[V5C](button[O5C](h4W));that[H5C](Q8o);if(!that[p32][C5C][p3E]){setTimeout(function(){that[b1G]();},b22);}else {that[M3E]();}onChange();}}else {var N5C=V4o;N5C+=m6o;var B5C=j4o;B5C+=C4o;B5C+=b4o;that[B5C][N5C][t2o]();}});},_compareDates:function(a,b){var U4W="_dateToUtcString";return this[U4W](a) === this[U4W](b);},_correctMonth:function(date,month){var M4W="_daysI";var P4W="setUTCDate";H0LL.O64();var D4W="nMonth";var X4W="UTCMo";var g5C=p1G;g5C+=y32;g5C+=X4W;g5C+=H3E;var T5C=M4W;T5C+=D4W;var days=this[T5C](date[t4W](),month);var correctDays=date[J4W]() > days;date[g5C](month);if(correctDays){date[P4W](days);date[z4W](month);}},_daysInMonth:function(year,month){var w22=31;var Q22=28;var r22=30;H0LL.o64();var W22=29;var isLeap=year % x22 === A22 && (year % z32 !== A22 || year % h32 === A22);var months=[w22,isLeap?W22:Q22,w22,r22,w22,r22,w22,w22,r22,w22,r22,w22];return months[month];},_dateToUtc:function(s){var v4W="etHours";var Y4W="getMinutes";var K4W="etMont";var k4W="getSeconds";var W5C=p4o;W5C+=v4W;var Q5C=p4o;Q5C+=K4W;H0LL.O64();Q5C+=d4o;return new Date(Date[z3E](s[E4W](),s[Q5C](),s[G4W](),s[W5C](),s[Y4W](),s[k4W]()));},_dateToUtcString:function(d){var p4W="TCFullYear";var e4W="pad";var u4W="CMon";var s5C=C7o;s5C+=L4W;s5C+=u4W;s5C+=V8o;var w5C=s0o;w5C+=e4W;var r5C=q4W;r5C+=p4W;return d[r5C]() + I9x + this[w5C](d[s5C]() + y22) + I9x + this[a4W](d[J4W]());},_hide:function(){var l4W="eyd";var j4W="les_scrollBo";var x4W="div.dataTab";var f4W="oll.";var c4W="oll";var y4W="scr";var b4W="deta";var m4W="n.";var U2C=I4o;U2C+=v7o;U2C+=V4o;U2C+=I4W;var h2C=X0o;h2C+=A4W;var R2C=y4W;R2C+=c4W;R2C+=c7x;var z2C=y4W;z2C+=f4W;var Z5C=x4W;Z5C+=j4W;Z5C+=P4o;var d5C=E8G;d5C+=l4W;d5C+=l6G;d5C+=m4W;var F5C=Q9G;F5C+=q9o;var n5C=b4W;n5C+=w4x;var o5C=j4o;o5C+=C4o;o5C+=b4o;var namespace=this[p32][A1x];this[o5C][r2o][n5C]();$(window)[C8G](I7x + namespace);$(document)[F5C](d5C + namespace);$(Z5C)[C8G](z2C + namespace);$(V9G)[C8G](R2C + namespace);$(h2C)[C8G](U2C + namespace);},_hours24To12:function(val){return val === A22?i22:val > i22?val - i22:val;},_htmlDay:function(day){var U7W='data-year="';var s4W="elected";var R7W='now';var W4W="oin";var O4W="pan>";var r4W="<td data";var N4W="-b";var w4W="-day=\"";var H4W="\" ";var T4W="utto";var o4W="oda";var V4W="pan";var C4W="data-day=\"";var Q4W="on cl";var h7W='selected';var B4W="-day\" type=\"button";var n4W="ssPrefix";var z7W="y\"></td>";var M7W='" data-month="';var i4W="/button";var X7W="year";var D7W="day";var Z4W="d class=\"empt";var g4W="<butt";var F4W="selectab";var c2C=Y6o;c2C+=S4W;c2C+=j4o;c2C+=M6o;var y2C=Y6o;y2C+=i4W;y2C+=M6o;var A2C=v6o;A2C+=p32;A2C+=V4W;A2C+=M6o;var I2C=e6o;I2C+=O4W;var a2C=j4o;a2C+=A0o;a2C+=n4o;var p2C=H4W;p2C+=C4W;var q2C=c4o;q2C+=l32;q2C+=y32;q2C+=d4o;var e2C=B4W;e2C+=H4W;var u2C=N4W;u2C+=T4W;u2C+=l32;u2C+=t7x;var L2C=g4W;L2C+=Q4W;L2C+=k6x;var k2C=X6o;k2C+=M6o;var Y2C=r0x;Y2C+=W4W;var G2C=x6x;G2C+=v7o;G2C+=A0o;G2C+=P7x;var E2C=j4o;E2C+=A0o;E2C+=n4o;var K2C=r4W;K2C+=w4W;var P2C=p32;P2C+=s4W;var J2C=y32;J2C+=o4W;J2C+=n4o;var t2C=t4G;t2C+=n4W;var D2C=F4W;D2C+=M0o;var X2C=I32;X2C+=j2E;X2C+=y32;X2C+=n4o;if(day[X2C]){var M2C=d4W;M2C+=Z4W;M2C+=z7W;return M2C;}var classes=[D2C];var classPrefix=this[I4o][t2C];if(day[X2o]){classes[A8o](k0W);}if(day[J2C]){classes[A8o](R7W);}if(day[P2C]){var v2C=g32;v2C+=P1o;v2C+=d4o;classes[v2C](h7W);}return K2C + day[E2C] + G2C + classes[Y2C](p5o) + k2C + L2C + classPrefix + u2C + classPrefix + e2C + U7W + day[X7W] + M7W + day[q2C] + p2C + day[a2C] + f5o + I2C + day[D7W] + A2C + y2C + c2C;},_htmlMonth:function(year,month){var E7W="axDat";var V7W="Numb";var N7W=' weekNumber';var i7W="showWeek";var a7W="nute";var Q7W="-i";var w7W="_htmlMonthHead";var P7W=" class=";var y7W="_co";var r7W='<thead>';var v7W="Wee";var c7W="mpa";var e7W="Seconds";var q7W="setUT";var B22=23;var l7W="UT";var W7W="nRight";var b7W="getUTCDay";var K7W="kNumb";var I7W="setUTCHours";var g7W="Le";var Y7W="_daysIn";var T7W="-icon";var u7W="setSeconds";var t7W="thead>";var p7W="CMi";var k7W="Month";var f7W="eDates";var G7W="CDa";var j7W="Dates";var O7W="_htm";var S7W="_htmlDay";var J7W="<table";var m7W="disableDays";var H7W="lWeekOfYear";var n7W='</table>';var x7W="mpar";var R3C=v6o;R3C+=t7W;var z3C=J7W;z3C+=P7W;z3C+=X6o;var Q2C=d4G;Q2C+=v7W;Q2C+=K7W;Q2C+=Q4o;var g2C=E8E;g2C+=y32;g2C+=y6G;g2C+=I32;var j2C=b4o;j2C+=E7W;j2C+=I32;var x2C=C7o;x2C+=L4W;x2C+=G7W;x2C+=n4o;var f2C=Y7W;f2C+=k7W;var now=this[W2E](new Date()),days=this[f2C](year,month),before=new Date(Date[z3E](year,month,y22))[x2C](),data=[],row=[];if(this[I4o][L7W] > A22){before-=this[I4o][L7W];if(before < A22){before+=l22;}}var cells=days + before,after=cells;while(after > l22){after-=l22;}cells+=l22 - after;var minDate=this[I4o][C2E];var maxDate=this[I4o][j2C];if(minDate){var l2C=n3E;l2C+=e9o;minDate[l2C](A22);minDate[M0W](A22);minDate[u7W](A22);}if(maxDate){var b2C=b0G;b2C+=e7W;var m2C=q7W;m2C+=p7W;m2C+=a7W;m2C+=p32;maxDate[I7W](B22);maxDate[m2C](d22);maxDate[b2C](d22);}for(var i=A22,r=A22;i < cells;i++){var C2C=A7W;C2C+=p32;C2C+=d4o;var H2C=q9o;H2C+=p2o;H2C+=V4o;H2C+=z0o;var O2C=V4o;O2C+=d7x;var V2C=y7W;V2C+=c7W;V2C+=Q32;V2C+=f7W;var i2C=y7W;i2C+=x7W;i2C+=I32;i2C+=j7W;var S2C=l7W;S2C+=P7o;var day=new Date(Date[S2C](year,month,y22 + (i - before))),selected=this[p32][j4o]?this[i2C](day,this[p32][j4o]):N8o,today=this[V2C](day,now),empty=i < before || i >= days + before,disabled=minDate && day < minDate || maxDate && day > maxDate;var disableDays=this[I4o][m7W];if(Array[O2C](disableDays) && $[r3o](day[b7W](),disableDays) !== -y22){disabled=Q8o;}else if(typeof disableDays === H2C && disableDays(day) === Q8o){disabled=Q8o;}var dayConfig={day:y22 + (i - before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[C2C](this[S7W](dayConfig));if(++r === l22){var T2C=r0x;T2C+=C4o;T2C+=b0o;var B2C=i7W;B2C+=V7W;B2C+=Q4o;if(this[I4o][B2C]){var N2C=O7W;N2C+=H7W;row[k2o](this[N2C](i - before,month,year));}data[A8o](C7W + row[T2C](P8o) + B7W);row=[];r=A22;}}var classPrefix=this[I4o][L3E];var className=classPrefix + g2C;if(this[I4o][Q2C]){className+=N7W;}if(minDate){var n2C=d3G;n2C+=W8E;var o2C=L5o;o2C+=t1o;var s2C=T7W;s2C+=g7W;s2C+=g2G;var w2C=q9o;w2C+=V4o;w2C+=l32;w2C+=j4o;var r2C=y32;r2C+=V4o;r2C+=y32;r2C+=M0o;var W2C=l7W;W2C+=P7o;var underMin=minDate >= new Date(Date[W2C](year,month,y22,A22,A22,A22));this[F5o][r2C][w2C](Z9x + classPrefix + s2C)[o5o](o2C,underMin?B2o:n2C);}if(maxDate){var Z2C=X0o;Z2C+=v7o;Z2C+=F3o;var d2C=l32;d2C+=z9x;var F2C=Q7W;F2C+=I4o;F2C+=C4o;F2C+=W7W;var overMax=maxDate < new Date(Date[z3E](year,month + y22,y22,A22,A22,A22));this[F5o][a2G][a7x](Z9x + classPrefix + F2C)[o5o](n5o,overMax?d2C:Z2C);}return z3C + className + f5o + r7W + this[w7W]() + R3C + s7W + data[a9x](P8o) + o7W + n7W;},_htmlMonthHead:function(){var M9W='</th>';var U9W="th></";var z9W="mber";var F7W="sh";var X9W='<th>';var d7W="owW";var Z7W="eekNu";var D3C=r0x;D3C+=C4o;D3C+=V4o;D3C+=l32;var X3C=F7W;X3C+=d7W;X3C+=Z7W;X3C+=z9W;var h3C=x32;h3C+=j32;h3C+=l32;var a=[];var firstDay=this[I4o][L7W];var i18n=this[I4o][h3C];var dayName=function(day){var h9W="ays";var R9W="weekd";var U3C=R9W;U3C+=h9W;H0LL.O64();day+=firstDay;while(day >= l22){day-=l22;}return i18n[U3C][day];};if(this[I4o][X3C]){var M3C=Y6o;M3C+=U9W;M3C+=V8o;M3C+=M6o;a[A8o](M3C);}for(var i=A22;i < l22;i++){a[A8o](X9W + dayName(i) + M9W);}return a[D3C](P8o);},_htmlWeekOfYear:function(d,m,y){var D9W="</t";var v9W="setDate";var t9W="d>";var P9W="etDa";var P32=86400000;var K9W='<td class="';var E9W='-week">';var P3C=D9W;P3C+=t9W;var J3C=T6x;J3C+=J9W;var t3C=p4o;t3C+=P9W;t3C+=n4o;var date=new Date(y,m,d,A22,A22,A22,A22);date[v9W](date[G4W]() + x22 - (date[t3C]() || l22));var oneJan=new Date(y,A22,y22);var weekNum=Math[Q1o](((date - oneJan) / P32 + y22) / l22);return K9W + this[I4o][J3C] + E9W + weekNum + P3C;},_options:function(selector,values,labels){var G9W="<option";var k9W='</option>';var Y9W=" value";var E3C=I32;E3C+=j2E;E3C+=b7o;var K3C=t3E;K3C+=q1x;K3C+=c7x;var v3C=r9o;v3C+=l32;v3C+=j4o;if(!labels){labels=values;}var select=this[F5o][r2o][v3C](K3C + this[I4o][L3E] + I9x + selector);select[E3C]();for(var i=A22,ien=values[B8o];i < ien;i++){var Y3C=X6o;Y3C+=M6o;var G3C=G9W;G3C+=Y9W;G3C+=B6o;select[l3o](G3C + values[i] + Y3C + labels[i] + k9W);}},_optionSet:function(selector,val){var L9W="child";var u9W="ntain";var p9W="unknown";var e9W="parent";var a3C=V4o;a3C+=i1o;a3C+=v1x;var p3C=v7o;p3C+=l1x;var q3C=L9W;H0LL.o64();q3C+=F0G;var e3C=t4G;e3C+=q4G;e3C+=J9W;var u3C=A6E;u3C+=I4o;u3C+=y32;u3C+=c7x;var L3C=m4o;L3C+=u9W;L3C+=Q4o;var k3C=j4o;k3C+=G3o;var select=this[k3C][L3C][a7x](u3C + this[I4o][e3C] + I9x + selector);var span=select[e9W]()[q3C](c3E);select[V3o](val);var selected=select[a7x](q9W);span[j3o](selected[p3C] !== A22?selected[c3G]():this[I4o][a3C][p9W]);},_optionsTime:function(unit,count,val,allowed,range){var s9W="amPm";var I9W="ad>";var x9W="classPrefi";var y9W="<th colspan=\"";var o9W="r>";var T9W='am';var f9W="tab";var Z9W="floor";var d9W='</tbody></thead><table class="';var w9W="Pm";var n9W="-nospace\">";var r9W="tr>";var j22=6;var A9W="<thead><tr>";var F9W="dy>";var a9W="</th></tr></t";var c9W="<table class";var J02=v6o;J02+=e8x;J02+=I32;J02+=M6o;var t02=a9W;t02+=X6G;t02+=I9W;var D02=A9W;D02+=y9W;var M02=X6o;M02+=M6o;var X02=c9W;X02+=B6o;var U02=R9G;U02+=l1G;U02+=j4o;var h02=I32;h02+=j2E;h02+=b7o;var j3C=i8o;j3C+=V8o;var x3C=x32;x3C+=v1x;var f3C=E8E;f3C+=f9W;f3C+=M0o;var c3C=j4o;c3C+=V4o;c3C+=R7x;var y3C=m4o;y3C+=Z3E;var A3C=j4o;A3C+=C4o;A3C+=b4o;var I3C=x9W;I3C+=A32;var classPrefix=this[I4o][I3C];var container=this[A3C][y3C][a7x](c3C + classPrefix + I9x + unit);var i,j;var render=count === i22?function(i){return i;}:this[a4W];var classPrefix=this[I4o][L3E];var className=classPrefix + f3C;var i18n=this[I4o][x3C];if(!container[j3C]){return;}var a=P8o;var span=b22;var button=function(value,label,className){var O9W="d class=\"selectab";var N9W="um";var W9W='</td>';var C9W="nA";var j9W="span>";var l9W="\" dat";var b9W="-day\" type=\"button\" data-unit";var S9W="n ";var H9W="le ";var m9W="a-value=\"";var g9W=" disable";var g3C=Y6o;g3C+=j9W;var T3C=X6o;T3C+=M6o;var N3C=l9W;N3C+=m9W;var B3C=b9W;B3C+=B6o;var C3C=E8E;C3C+=d4x;C3C+=C4o;C3C+=S9W;var H3C=i9W;H3C+=V9W;var O3C=X6o;O3C+=M6o;var V3C=d4W;V3C+=O9W;V3C+=H9W;var S3C=V4o;S3C+=C9W;S3C+=p7E;S3C+=Z3o;var b3C=t3E;b3C+=C8o;b3C+=B9W;var m3C=g32;m3C+=b4o;var l3C=l32;l3C+=N9W;l3C+=X0o;l3C+=Q4o;if(count === i22 && typeof value === l3C){if(val >= i22){value+=i22;}if(value == i22){value=A22;}else if(value == N22){value=i22;}}var selected=val === value || value === T9W && val < i22 || value === m3C && val >= i22?b3C:P8o;if(allowed && $[S3C](value,allowed) === -y22){var i3C=g9W;i3C+=j4o;selected+=i3C;}if(className){selected+=p5o + className;}return V3C + selected + O3C + H3C + classPrefix + C3C + classPrefix + B3C + unit + N3C + value + T3C + g3C + label + Q9W + P2E + W9W;};if(count === i22){var s3C=g32;s3C+=b4o;var w3C=Y6o;w3C+=y32;w3C+=Q32;w3C+=M6o;var r3C=v6o;r3C+=r9W;var W3C=r7o;W3C+=w9W;var Q3C=Y6o;Q3C+=y32;Q3C+=Q32;Q3C+=M6o;a+=Q3C;for(i=y22;i <= j22;i++){a+=button(i,render(i));}a+=button(T9W,i18n[W3C][A22]);a+=r3C;a+=w3C;for(i=l22;i <= i22;i++){a+=button(i,render(i));}a+=button(s3C,i18n[s9W][y22]);a+=B7W;span=l22;}else if(count === N22){var c=A22;for(j=A22;j < x22;j++){var n3C=Y6o;n3C+=G1G;n3C+=J8x;n3C+=M6o;var o3C=Y6o;o3C+=y32;o3C+=Q32;o3C+=M6o;a+=o3C;for(i=A22;i < j22;i++){a+=button(c,render(c));c++;}a+=n3C;}span=j22;}else {var R02=Y6o;R02+=S4W;R02+=o9W;var z02=n9W;z02+=d4W;z02+=N7G;z02+=F9W;var Z3C=v6o;Z3C+=y32;Z3C+=Q32;Z3C+=M6o;var F3C=d4W;F3C+=Q32;F3C+=M6o;a+=F3C;for(j=A22;j < Z22;j+=b22){var d3C=Q32;d3C+=A0o;d3C+=O8o;d3C+=I32;a+=button(j,render(j),d3C);}a+=Z3C;a+=d9W + className + p5o + className + z02;var start=range !== W5o?range:Math[Z9W](val / b22) * b22;a+=C7W;for(j=start + y22;j < start + b22;j++){a+=button(j,render(j));}a+=R02;span=j22;}container[h02]()[U02](X02 + className + M02 + D02 + span + f5o + i18n[unit] + t02 + s7W + a + o7W + J02);},_optionsTitle:function(){var X1W="etFull";var U1W="Ye";var M1W="yearRange";var h1W="getFu";var z1W="tions";var e02=J7G;e02+=n0G;e02+=C7o;var u02=n4o;u02+=G4o;u02+=Q32;var L02=K3E;L02+=z1W;var k02=b4o;k02+=R1W;k02+=p32;var Y02=J7G;Y02+=n0G;Y02+=p4o;Y02+=I32;var G02=c4o;G02+=l32;G02+=V8o;var E02=S2E;E02+=g32;E02+=z1W;var K02=h1W;K02+=G2o;K02+=U1W;K02+=W3E;var v02=p4o;v02+=X1W;v02+=U1W;v02+=W3E;var P02=b4o;P02+=b0o;P02+=n32;P02+=D7o;var i18n=this[I4o][h5o];var min=this[I4o][P02];var max=this[I4o][V2E];var minYear=min?min[v02]():W5o;var maxYear=max?max[E4W]():W5o;var i=minYear !== W5o?minYear:new Date()[K02]() - this[I4o][M1W];var j=maxYear !== W5o?maxYear:new Date()[E4W]() + this[I4o][M1W];this[E02](G02,this[Y02](A22,S22),i18n[k02]);this[L02](u02,this[e02](i,j));},_pad:function(i){var D1W='0';return i < b22?D1W + i:i;},_position:function(){var L1W="tal";var k1W="rizon";var P1W="To";var t1W="eight";var J1W="scrol";var G1W="eft";var K1W="ig";var Y1W="terHeigh";var u1W='horizontal';var v1W="terHe";var E1W="ndT";var e1W="outerWidth";var V02=d4o;V02+=t1W;var i02=y32;i02+=Z6o;var S02=J1W;S02+=v7o;S02+=P1W;S02+=g32;var b02=t9E;b02+=v1W;b02+=K1W;b02+=Z8G;var m02=h4x;m02+=n4o;var l02=Z9G;l02+=E1W;l02+=C4o;var j02=v7o;j02+=G1W;var x02=d9o;x02+=g32;var f02=h7G;f02+=p32;var y02=J7o;y02+=E7x;y02+=d4o;var A02=y32;A02+=V4o;A02+=b4o;A02+=I32;var I02=g32;I02+=A0o;I02+=e9x;I02+=p32;var a02=C4o;a02+=y7o;a02+=Y1W;a02+=y32;var p02=j1G;p02+=o1x;p02+=I32;p02+=Q32;var q02=Q9G;q02+=N8G;q02+=u8G;var offset=this[F5o][l5o][q02]();var container=this[F5o][p02];var inputHeight=this[F5o][l5o][a02]();if(this[p32][s3E][q3E] && this[p32][I02][A02] && $(window)[y02]() > X32){var c02=i9o;c02+=k1W;c02+=L1W;container[T7G](c02);}else {container[Q2o](u1W);}container[f02]({top:offset[x02] + inputHeight,left:offset[j02]})[l02](m02);var calHeight=container[b02]();var calWidth=container[e1W]();var scrollTop=$(window)[S02]();if(offset[i02] + inputHeight + calHeight - scrollTop > $(window)[V02]()){var H02=I4o;H02+=p32;H02+=p32;var O02=y32;O02+=C4o;O02+=g32;var newTop=offset[O02] - calHeight;container[H02](U3G,newTop < A22?A22:newTop);}if(calWidth + offset[d2G] > $(window)[z3G]()){var C02=I4o;C02+=p32;C02+=p32;var newLeft=$(window)[z3G]() - calWidth;container[C02](P3G,newLeft < A22?A22:newLeft);}},_range:function(start,end,inc){H0LL.O64();var q1W="pus";var a=[];if(!inc){inc=y22;}for(var i=start;i <= end;i+=inc){var B02=q1W;B02+=d4o;a[B02](i);}return a;},_setCalander:function(){var y1W="tmlMon";var I1W="FullYear";H0LL.o64();var p1W="TCM";var A1W="_h";if(this[p32][u1o]){var W02=q4W;W02+=p1W;W02+=R1W;var Q02=a1W;Q02+=I1W;var g02=A1W;g02+=y1W;g02+=y32;g02+=d4o;var T02=s9x;T02+=b7o;var N02=j4o;N02+=G3o;this[N02][c2E][T02]()[l3o](this[g02](this[p32][u1o][Q02](),this[p32][u1o][W02]()));}},_setTitle:function(){var l1W='year';var f1W="Set";var j1W="ionSet";var x1W="_opt";var o02=I0o;o02+=g32;o02+=G8G;var s02=c1W;s02+=f1W;var w02=L5o;w02+=h0G;w02+=A0o;w02+=n4o;var r02=x1W;r02+=j1W;this[r02](R4W,this[p32][w02][q0W]());this[s02](l1W,this[p32][o02][t4W]());},_setTime:function(){var O1W="hoursA";var m1W="seco";var i1W="sTime";var C1W="nsTime";var H1W="ilable";var V1W="Minutes";var Q1W="_optionsTime";var b1W="ndsRa";var S1W="etSec";var U42=m1W;U42+=b1W;U42+=O8o;U42+=I32;var h42=p4o;h42+=S1W;h42+=z0o;h42+=w0G;var R42=c1W;R42+=i1W;var z42=a1W;z42+=V1W;var Z02=O1W;Z02+=i0o;Z02+=H1W;var d02=g32;d02+=A0o;d02+=e9x;d02+=p32;var F02=L5x;F02+=C1W;H0LL.O64();var that=this;var d=this[p32][j4o];var hours=d?d[g0W]():A22;var allowed=function(prop){var N1W='Available';var T1W="_range";var B1W="Avail";var g1W='Increment';H0LL.O64();var n02=B1W;n02+=j7o;return that[I4o][prop + N1W]?that[I4o][prop + n02]:that[T1W](A22,d22,that[I4o][prop + g1W]);};this[F02](r0W,this[p32][d02][o3E]?i22:N22,hours,this[I4o][Z02]);this[Q1W](m0W,Z22,d?d[z42]():A22,allowed(m0W),this[p32][b0W]);this[R42](S0W,Z22,d?d[h42]():A22,allowed(S0W),this[p32][U42]);},_show:function(){var n1W="esi";var Z1W='div.dataTables_scrollBody';var w1W="own.";var F1W="ze.";var s1W="div.DT";var r1W="yd";var W1W="ke";var d1W='scroll.';var o1W="E_Body_Con";var v42=W1W;v42+=r1W;v42+=w1W;var J42=C4o;J42+=l32;var t42=C4o;H0LL.o64();t42+=l32;var D42=s1W;D42+=o1W;D42+=Y6G;var M42=t7x;M42+=Q32;M42+=n1W;M42+=F1W;var X42=s0o;X42+=A0x;X42+=D4G;X42+=h1o;var that=this;var namespace=this[p32][A1x];this[X42]();$(window)[z0o](d1W + namespace + M42 + namespace,function(){that[b1G]();});$(D42)[t42](d1W + namespace,function(){that[b1G]();});$(Z1W)[J42](d1W + namespace,function(){var P42=s0o;H0LL.O64();P42+=d4o;P42+=c5o;P42+=I32;that[P42]();});$(document)[z0o](v42 + namespace,function(e){H0LL.o64();if(e[m3G] === m22 || e[m3G] === g22 || e[m3G] === V22){var K42=s0o;K42+=d4o;K42+=V4o;K42+=n7o;that[K42]();}});setTimeout(function(){var E42=I4o;E42+=v7o;E42+=V4o;E42+=I4W;$(C2o)[z0o](E42 + namespace,function(e){var h8W="rg";var z8W="fil";var u42=W8o;u42+=b4o;var L42=x0G;L42+=d4o;var k42=z8W;k42+=z6x;var Y42=Y3E;Y42+=R8W;var G42=y32;G42+=A0o;G42+=h8W;G42+=u8G;var parents=$(e[G42])[Y42]();if(!parents[k42](that[F5o][r2o])[L42] && e[X9G] !== that[u42][l5o][A22]){that[b1G]();}});},b22);},_writeOutput:function(focus){var U8W="cha";var M8W="lYear";var t8W="ict";var X8W="Fu";var D8W="omentStr";var y42=U8W;y42+=l32;y42+=p4o;y42+=I32;var A42=o6o;A42+=A0o;A42+=v7o;var I42=V4o;I42+=U3E;I42+=G1o;var a42=s0o;a42+=Y3E;a42+=j4o;var p42=a1W;p42+=X8W;p42+=v7o;p42+=M8W;var q42=b4o;q42+=D8W;q42+=t8W;var e42=y7o;e42+=y32;e42+=I4o;H0LL.o64();var date=this[p32][j4o];var out=window[n5E]?window[n5E][e42](date,undefined,this[I4o][J8W],this[I4o][q42])[F5E](this[I4o][F5E]):date[p42]() + I9x + this[a4W](date[q0W]() + y22) + I9x + this[a42](date[J4W]());this[F5o][I42][A42](out)[P8W](y42,{write:date});if(focus){this[F5o][l5o][t2o]();}}});Editor[L5E][c42]=A22;Editor[f42][M5o]={classPrefix:x42,disableDays:W5o,firstDay:y22,format:j42,hoursAvailable:W5o,i18n:Editor[M5o][l42][v8W],maxDate:W5o,minDate:W5o,minutesAvailable:W5o,minutesIncrement:y22,momentStrict:Q8o,momentLocale:K8W,onChange:function(){},secondsAvailable:W5o,secondsIncrement:y22,showWeekNumber:N8o,yearRange:T22};(function(){var Z6W="saf";var g6W="_v";var T6W="_val";var f5W="inp";var s6W="<inpu";var l3W="_pic";var N6W="prop";var V3W="wireFormat";var J6W="rop";var B6W="disabl";var A5W='change.dte';var v2W="_addOptions";var c2W="_va";var k2W='input:checked';var i6W='div.clearValue button';var P01="uploadMany";var L5W="pairs";var J2W="_inpu";var s5W="optio";var I5W="multiple";var N5W="sepa";var t01="abled";var r6W='text';var x3W="_picker";var n6W="password";var Q2W="_inp";var C6W="_i";var R5W="eId";var N2W="_preChecked";var V5W="separator";var k8W="fieldT";var q6W="uploa";var Z8W="_enabled";var l5W="_lastSet";var K3W="icker";var E8W="xtar";var X2W='_';var w5W="checkbox";var Y8W="hid";var y6W="enab";var A2W="radio";var F6W="_in";var U3W="datepicker";var B2W="npu";var G8W="adonly";var p8W="_input";var f6W='open';var a2W='input';var q3W="div.";var Y5W="_editor_val";var s62=I32;s62+=y5G;s62+=l32;s62+=j4o;var w62=X8x;w62+=C4o;w62+=A0o;w62+=j4o;var w12=Z8o;w12+=I32;w12+=z5o;var G92=t3E;G92+=C8o;G92+=y32;var M92=u0o;M92+=E8W;M92+=G4o;var r72=y32;r72+=H8x;r72+=y32;var T72=H8x;T72+=u0o;T72+=l32;T72+=j4o;var N72=x0o;N72+=G8W;var H72=Y8W;H72+=j4o;H72+=l1G;var b72=k8W;b72+=L7o;b72+=I32;var m72=I32;m72+=Q4x;m72+=I32;m72+=z5o;var fieldTypes=Editor[v5o];function _buttonText(conf,text){var q8W="Choose file...";var L8W="div.uplo";var e8W="uploadText";var u8W="ad button";var b42=L8W;b42+=u8W;var m42=F3E;m42+=j4o;if(text === W5o || text === undefined){text=conf[e8W] || q8W;}conf[p8W][m42](b42)[j3o](text);}function _commonUpload(editor,conf,dropCallback,multiple){var a8W="ut[";var F8W='<div class="drop"><span></span></div>';var X6W="dragl";var t6W="dragexit";var s8W='<div class="row">';var C8W="></";var f8W="iv class=\"rendered\"></div>";var r8W='<div class="editor_upload">';var T8W="ype=\"file\" ";var x8W="<div class=\"cell ";var b8W="button>";var B8W="input>";var n8W='multiple';var w8W='<div class="eu_table">';var D6W="e ";var o8W='"></button>';var I8W="type=file]";var G6W="dr";var z6W='input[type=file]';var H8W="lue\">";var W8W="buttonInternal";var R6W="input[t";var S8W="<but";var m8W="second\">";var d8W='<div class="cell">';var A6W='dragover';var S6W='div.rendered';var i8W=" clas";var j8W="limitHide\">";var l8W="class=\"row ";var b6W='noDrop';var V8W="<div class";var O8W="=\"cell clearVa";var g8W="<div class=\"cell up";var c8W="Fil";var k6W="iv.drop span";var Q8W=" limitHide\">";var N8W="<input t";var h6W="pe=fil";var M6W="eav";var E6W="o upload";var P6W="Drag ";var v6W="and drop a fil";var L6W='div.drop';var U6W="e]";var y8W="dragDro";var Y6W="agDropText";var K6W="e here t";var A8W="lic";var l72=V4o;l72+=l32;l72+=g32;l72+=G1o;var j72=C4o;j72+=l32;var x72=b0o;x72+=g32;x72+=a8W;H0LL.O64();x72+=I8W;var f72=F3E;f72+=j4o;var a72=I4o;a72+=A8W;a72+=E8G;var n42=y8W;n42+=g32;var o42=c8W;o42+=I32;o42+=Y0E;o42+=D6x;var r42=A0o;r42+=p3G;r42+=Q32;var W42=b5E;W42+=V4o;W42+=L6o;var Q42=R2E;Q42+=f8W;var g42=x8W;g42+=j8W;var T42=t6x;T42+=l8W;T42+=m8W;var N42=e6x;N42+=o6o;N42+=M6o;var B42=j6o;B42+=v6o;B42+=b8W;var C42=S8W;C42+=s6E;C42+=i8W;C42+=K7x;var H42=V8W;H42+=O8W;H42+=H8W;var O42=C8W;O42+=B8W;var V42=N8W;V42+=T8W;var i42=i9W;i42+=V9W;var S42=g8W;S42+=r1x;S42+=Q8W;var btnClass=editor[b2o][J0x][W8W];var container=$(r8W + w8W + s8W + S42 + i42 + btnClass + o8W + V42 + (multiple?n8W:P8o) + O42 + B5o + H42 + C42 + btnClass + B42 + N42 + B5o + T42 + g42 + F8W + B5o + d8W + Q42 + W42 + B5o + B5o + B5o);conf[p8W]=container;conf[Z8W]=Q8o;if(conf[c5o]){container[a7x](z6W)[T0E](w7E,Editor[y5o](conf[c5o]));}if(conf[r42]){var s42=W8G;s42+=y32;s42+=Q32;var w42=R6W;w42+=n4o;w42+=h6W;w42+=U6W;container[a7x](w42)[T0E](conf[s42]);}_buttonText(conf);if(window[o42] && conf[n42] !== N8o){var k72=G9o;k72+=p32;k72+=I32;var Y72=C4o;Y72+=l32;var K72=C4o;K72+=l32;var M72=X6W;M72+=M6W;M72+=D6W;M72+=t6W;var R72=j4o;R72+=J6W;var z72=q9o;z72+=V4o;z72+=l32;z72+=j4o;var Z42=P6W;Z42+=v6W;Z42+=K6W;Z42+=E6W;var d42=G6W;d42+=Y6W;var F42=j4o;F42+=k6W;container[a7x](F42)[c3G](conf[d42] || Z42);var dragDrop=container[z72](L6W);dragDrop[z0o](R72,function(e){var p6W="originalEvent";var a6W='over';var u6W="ile";var e6W="ransfer";H0LL.o64();if(conf[Z8W]){var X72=q9o;X72+=u6W;X72+=p32;var U72=j4o;U72+=W8G;U72+=S1o;U72+=e6W;var h72=q6W;h72+=j4o;Editor[h72](editor,conf,e[p6W][U72][X72],_buttonText,dropCallback);dragDrop[Q2o](a6W);}return N8o;})[z0o](M72,function(e){var I6W="_ena";var D72=I6W;D72+=V0W;if(conf[D72]){var t72=G5E;t72+=Q32;dragDrop[Q2o](t72);}H0LL.o64();return N8o;})[z0o](A6W,function(e){var c6W="addCla";var J72=s0o;J72+=y6W;J72+=M0o;J72+=j4o;if(conf[J72]){var v72=C4o;v72+=o6o;v72+=Q4o;var P72=c6W;P72+=q4G;dragDrop[P72](v72);}return N8o;});editor[K72](f6W,function(){var x6W='dragover.DTE_Upload drop.DTE_Upload';var G72=C4o;G72+=l32;var E72=X0o;E72+=A4W;$(E72)[G72](x6W,function(e){H0LL.o64();return N8o;});})[Y72](k72,function(){var m6W="DTE_Uploa";var l6W="TE_Upload drop.";var j6W="dragover.D";var e72=j6W;e72+=l6W;e72+=m6W;e72+=j4o;var u72=C4o;u72+=w0E;var L72=X0o;L72+=C4o;L72+=j4o;L72+=n4o;$(L72)[u72](e72);});}else {var p72=q9o;p72+=b0o;p72+=j4o;var q72=A0o;q72+=g32;q72+=I7o;q72+=z5o;container[T7G](b6W);container[q72](container[p72](S6W));}container[a7x](i6W)[z0o](a72,function(e){var O6W="Types";var V6W="reventDefaul";H0LL.O64();var I72=g32;I72+=V6W;I72+=y32;e[I72]();if(conf[Z8W]){var c72=p32;c72+=I32;c72+=y32;var y72=L3G;y72+=v7o;y72+=C4o;y72+=F2o;var A72=Y1o;A72+=O6W;Editor[A72][y72][c72][b3G](editor,conf,P8o);}});container[f72](x72)[j72](l72,function(){H0LL.O64();Editor[i1x](editor,conf,this[l8o],_buttonText,function(ids){H0LL.o64();dropCallback[b3G](editor,ids);container[a7x](z6W)[A22][S1x]=W5o;});});return container;}function _triggerChange(input){setTimeout(function(){H0LL.O64();var H6W='change';input[P8W](H6W,{editor:Q8o,editorSet:Q8o});;},A22);}var baseFieldType=$[m72](Q8o,{},Editor[I4G][b72],{get:function(conf){var S72=o6o;S72+=A0o;S72+=v7o;return conf[p8W][S72]();},set:function(conf,val){var i72=C6W;i72+=l32;i72+=A7W;i72+=y32;conf[p8W][V3o](val);_triggerChange(conf[i72]);},enable:function(conf){var V72=B6W;V72+=c0o;H0LL.o64();conf[p8W][N6W](V72,N8o);},disable:function(conf){var O72=g32;O72+=J6W;conf[p8W][O72](k0W,Q8o);},canReturnSubmit:function(conf,node){H0LL.O64();return Q8o;}});fieldTypes[H72]={create:function(conf){conf[T6W]=conf[S1x];return W5o;},get:function(conf){var C72=s0o;C72+=V3o;return conf[C72];},set:function(conf,val){var B72=g6W;B72+=A0o;B72+=v7o;H0LL.o64();conf[B72]=val;}};fieldTypes[N72]=$[T72](Q8o,{},baseFieldType,{create:function(conf){var W6W="put/>";var Q6W="eado";var W72=Q32;W72+=Q6W;W72+=C4x;W72+=n4o;var Q72=I32;Q72+=A32;Q72+=y32;H0LL.o64();Q72+=G9G;var g72=Y6o;g72+=b0o;g72+=W6W;conf[p8W]=$(g72)[T0E]($[Q72]({id:Editor[y5o](conf[c5o]),type:r6W,readonly:W72},conf[T0E] || ({})));return conf[p8W][A22];}});fieldTypes[r72]=$[U5o](Q8o,{},baseFieldType,{create:function(conf){var w6W="tex";var o6W="t/";var d72=A0o;d72+=y32;d72+=y32;d72+=Q32;var F72=w6W;F72+=y32;var n72=V4o;n72+=j4o;var o72=W8G;o72+=J8x;var s72=s6W;s72+=o6W;s72+=M6o;var w72=C6W;w72+=l32;w72+=g32;w72+=G1o;conf[w72]=$(s72)[o72]($[U5o]({id:Editor[y5o](conf[n72]),type:F72},conf[d72] || ({})));H0LL.o64();return conf[p8W][A22];}});fieldTypes[n6W]=$[U5o](Q8o,{},baseFieldType,{create:function(conf){var d6W="passwor";var z5W='<input/>';var X92=F6W;X92+=g32;X92+=y7o;X92+=y32;var U92=d6W;U92+=j4o;var h92=Z6W;h92+=I32;h92+=H1E;var R92=x4o;R92+=j4o;var z92=W8G;z92+=y32;z92+=Q32;var Z72=s0o;Z72+=V4o;Z72+=m6o;conf[Z72]=$(z5W)[z92]($[R92]({id:Editor[h92](conf[c5o]),type:U92},conf[T0E] || ({})));return conf[X92][A22];}});fieldTypes[M92]=$[U5o](Q8o,{},baseFieldType,{create:function(conf){var X5W="textarea>";var U5W="xtarea></";var h5W="<te";var E92=C6W;E92+=m6o;var K92=A0o;K92+=y32;K92+=y32;K92+=Q32;var v92=Z6W;v92+=R5W;var P92=H8x;H0LL.o64();P92+=L1G;var J92=W8G;J92+=J8x;var t92=h5W;t92+=U5W;t92+=X5W;var D92=s0o;D92+=l5o;conf[D92]=$(t92)[J92]($[P92]({id:Editor[v92](conf[c5o])},conf[K92] || ({})));return conf[E92][A22];},canReturnSubmit:function(conf,node){return N8o;}});fieldTypes[G92]=$[U5o](Q8o,{},baseFieldType,{_addOptions:function(conf,opts,append){var E5W="placeholderValue";var M5W="placeho";var D5W="lder";var P5W="derDisabled";var K5W="ceholderVal";var v5W="laceh";var k5W="onsPair";var t5W="disable";var G5W="placeholderDisabled";var J5W="hol";var elOpts=conf[p8W][A22][S0E];var countOffset=A22;if(!append){var Y92=M5W;Y92+=D5W;elOpts[B8o]=A22;if(conf[Y92] !== undefined){var q92=t5W;q92+=j4o;var e92=d4o;e92+=V4o;e92+=l9G;e92+=l1G;var u92=g32;u92+=Z4x;u92+=J5W;u92+=P5W;var L92=g32;L92+=v5W;L92+=C4o;L92+=D5W;var k92=V2o;k92+=K5W;k92+=o8o;var placeholderValue=conf[k92] !== undefined?conf[E5W]:P8o;countOffset+=y22;elOpts[A22]=new Option(conf[L92],placeholderValue);var disabled=conf[u92] !== undefined?conf[G5W]:Q8o;elOpts[A22][e92]=disabled;elOpts[A22][q92]=disabled;elOpts[A22][Y5W]=placeholderValue;}}else {countOffset=elOpts[B8o];}if(opts){var p92=C4o;p92+=g32;p92+=L4G;p92+=k5W;Editor[L5W](opts,conf[p92],function(val,label,i,attr){H0LL.o64();var u5W="_editor_";var a92=u5W;a92+=i0o;a92+=v7o;var option=new Option(label,val);option[a92]=val;if(attr){var I92=A0o;I92+=y32;I92+=y32;I92+=Q32;$(option)[I92](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var a5W='<select></select>';var p5W="_addO";var e5W="pO";var q5W="opt";var O92=s0o;O92+=l5o;var V92=V4o;V92+=e5W;V92+=H9x;var i92=q5W;i92+=u4o;var S92=p5W;S92+=u7x;var b92=p1G;b92+=M0o;b92+=I4o;b92+=y32;var f92=V4o;f92+=j4o;var c92=H8x;c92+=u0o;c92+=z5o;var y92=A6G;y92+=Q32;var A92=s0o;A92+=l5o;conf[A92]=$(a5W)[y92]($[c92]({id:Editor[y5o](conf[f92]),multiple:conf[I5W] === Q8o},conf[T0E] || ({})))[z0o](A5W,function(e,d){var y5W="lec";var c5W="stS";var x92=c32;x92+=P5x;if(!d || !d[x92]){var m92=p4o;m92+=I32;m92+=y32;var l92=p32;l92+=I32;l92+=y5W;l92+=y32;var j92=Q8x;j92+=A0o;j92+=c5W;j92+=u8G;conf[j92]=fieldTypes[l92][m92](conf);}});fieldTypes[b92][S92](conf,conf[i92] || conf[V92]);return conf[O92][A22];},update:function(conf,options,append){var j5W="select";var x5W="_addOp";var B92=s0o;B92+=f5W;B92+=y7o;H0LL.o64();B92+=y32;var H92=x5W;H92+=C7x;H92+=p32;fieldTypes[j5W][H92](conf,options,append);var lastSet=conf[l5W];if(lastSet !== undefined){var C92=t3E;C92+=I32;C92+=I4o;C92+=y32;fieldTypes[C92][b0G](conf,lastSet,Q8o);}_triggerChange(conf[B92]);},get:function(conf){var i5W="parator";var S5W="oi";var b5W="toArray";var Q92=B3o;Q92+=h4G;Q92+=F5x;var T92=b4o;T92+=A0o;T92+=g32;var N92=q9o;N92+=b0o;N92+=j4o;var val=conf[p8W][N92](q9W)[T92](function(){H0LL.O64();var m5W="_editor_va";var g92=m5W;g92+=v7o;return this[g92];})[b5W]();if(conf[Q92]){var r92=r0x;r92+=S5W;r92+=l32;var W92=p1G;W92+=i5W;return conf[W92]?val[r92](conf[V5W]):val;}return val[B8o]?val[A22]:W5o;},set:function(conf,val,localUpdate){var B5W="ray";var O5W="iple";var T5W="rat";var C5W="sAr";var r5W="selected";var g5W='option';var H5W="eholder";var U12=v7o;U12+=I32;U12+=l32;U12+=B2G;var h12=B3o;h12+=U3x;h12+=O5W;var R12=d3o;R12+=E3G;R12+=H5W;var d92=Z6o;d92+=L4G;d92+=z0o;var F92=s0o;F92+=V4o;F92+=l32;F92+=r0o;var n92=N6G;n92+=Q32;n92+=Q32;n92+=Z3o;var s92=V4o;s92+=C5W;s92+=B5W;var w92=N5W;w92+=T5W;w92+=g0o;if(!localUpdate){conf[l5W]=val;}if(conf[I5W] && conf[w92] && !Array[s92](val)){var o92=o9o;o92+=V4o;o92+=O8o;val=typeof val === o92?val[r5x](conf[V5W]):[];}else if(!Array[n92](val)){val=[val];}var i,len=val[B8o],found,allFound=N8o;var options=conf[F92][a7x](d92);conf[p8W][a7x](g5W)[v2o](function(){var Q5W="elec";var W5W="editor_";var z12=p32;z12+=Q5W;z12+=B9W;found=N8o;for(i=A22;i < len;i++){var Z92=s0o;Z92+=W5W;Z92+=V3o;if(this[Z92] == val[i]){found=Q8o;allFound=Q8o;break;}}this[z12]=found;});if(conf[R12] && !allFound && !conf[h12] && options[U12]){options[A22][r5W]=Q8o;}if(!localUpdate){var X12=s0o;X12+=b0o;X12+=A7W;X12+=y32;_triggerChange(conf[X12]);}return allFound;},destroy:function(conf){var D12=C4o;D12+=q9o;D12+=q9o;var M12=C6W;M12+=l32;M12+=A7W;M12+=y32;conf[M12][D12](A5W);}});fieldTypes[w5W]=$[U5o](Q8o,{},baseFieldType,{_addOptions:function(conf,opts,append){var o5W="Pa";var n5W="ir";var t12=s0o;t12+=V4o;t12+=l32;t12+=r0o;var val,label;var jqInput=conf[t12];var offset=A22;H0LL.o64();if(!append){jqInput[k3G]();}else {var P12=v7o;P12+=I32;P12+=l32;P12+=B2G;var J12=V4o;J12+=l32;J12+=A7W;J12+=y32;offset=$(J12,jqInput)[P12];}if(opts){var K12=s5W;K12+=y7x;K12+=o5W;K12+=n5W;var v12=Y3E;v12+=V4o;v12+=e9o;Editor[v12](opts,conf[K12],function(val,label,i,attr){var M2W='" type="checkbox" />';var z2W="bel>";var U2W=" i";var Z5W="</la";var F5W="_ed";var h2W="r=\"";var D2W='input:last';var R2W="<label fo";var d5W="itor_va";var p12=F5W;p12+=d5W;p12+=v7o;var q12=o6o;q12+=Q0G;var e12=Z5W;e12+=z2W;var u12=V4o;u12+=j4o;var L12=Z6W;L12+=R5W;var k12=R2W;H0LL.O64();k12+=h2W;var Y12=V4o;Y12+=j4o;var G12=s6W;G12+=y32;G12+=U2W;G12+=q8E;var E12=Y6o;E12+=X7G;E12+=M6o;jqInput[l3o](E12 + G12 + Editor[y5o](conf[Y12]) + X2W + (i + offset) + M2W + k12 + Editor[L12](conf[u12]) + X2W + (i + offset) + f5o + label + e12 + B5o);$(D2W,jqInput)[T0E](q12,val)[A22][p12]=val;if(attr){var a12=A0o;a12+=m1x;$(D2W,jqInput)[a12](attr);}});}},create:function(conf){var P2W='<div></div>';var t2W="heckbo";var K2W="ipOpts";var y12=i0E;y12+=y4o;var A12=I4o;A12+=t2W;A12+=A32;var I12=J2W;I12+=y32;conf[I12]=$(P2W);fieldTypes[A12][v2W](conf,conf[y12] || conf[K2W]);return conf[p8W][A22];},get:function(conf){var L2W="ectedValue";var G2W="unselecte";var Y2W="dValue";var E2W="eparator";var i12=r0x;i12+=C4o;i12+=b0o;var S12=p32;S12+=E2W;var l12=G2W;l12+=Y2W;var f12=v7o;f12+=l1G;f12+=B2G;var c12=F6W;c12+=r0o;var out=[];var selected=conf[c12][a7x](k2W);if(selected[f12]){var x12=D4x;x12+=d4o;selected[x12](function(){var j12=A7W;H0LL.o64();j12+=p32;j12+=d4o;out[j12](this[Y5W]);});}else if(conf[l12] !== undefined){var b12=n8G;b12+=p32;b12+=H0o;b12+=L2W;var m12=g32;m12+=P1o;m12+=d4o;out[m12](conf[b12]);}return conf[V5W] === undefined || conf[S12] === W5o?out:out[i12](conf[V5W]);},set:function(conf,val){var u2W='|';var H12=i2o;H12+=K1E;H12+=A0o;H12+=n4o;var V12=f5W;V12+=G1o;var jqInputs=conf[p8W][a7x](V12);if(!Array[Y3G](val) && typeof val === y3G){var O12=N5W;O12+=T6G;O12+=y32;O12+=g0o;val=val[r5x](conf[O12] || u2W);}else if(!Array[H12](val)){val=[val];}var i,len=val[B8o],found;jqInputs[v2o](function(){var e2W="che";var p2W="r_val";var q2W="_edito";var B12=e2W;B12+=W8E;B12+=I32;B12+=j4o;found=N8o;for(i=A22;i < len;i++){var C12=q2W;C12+=p2W;if(this[C12] == val[i]){found=Q8o;break;}}this[B12]=found;});_triggerChange(jqInputs);},enable:function(conf){var T12=r9o;T12+=z5o;var N12=s0o;N12+=b0o;N12+=A7W;N12+=y32;conf[N12][T12](a2W)[N6W](k0W,N8o);},disable:function(conf){var Q12=B6W;Q12+=c0o;var g12=r9o;g12+=z5o;conf[p8W][g12](a2W)[N6W](Q12,Q8o);},update:function(conf,options,append){var I2W="heck";var r12=p32;r12+=u8G;var W12=I4o;W12+=I2W;W12+=N7G;W12+=A32;var checkbox=fieldTypes[W12];var currVal=checkbox[m0G](conf);checkbox[v2W](conf,options,append);checkbox[r12](conf,currVal);}});fieldTypes[A2W]=$[w12](Q8o,{},baseFieldType,{_addOptions:function(conf,opts,append){var y2W="sPair";var val,label;var jqInput=conf[p8W];var offset=A22;if(!append){jqInput[k3G]();}else {var o12=M0o;o12+=l32;o12+=p4o;o12+=V8o;var s12=f5W;s12+=y7o;s12+=y32;offset=$(s12,jqInput)[o12];}if(opts){var n12=s5W;n12+=l32;n12+=y2W;Editor[L5W](opts,conf[n12],function(val,label,i,attr){var b2W="safe";var x2W="el>";var V2W='<label for="';var l2W="io\" na";var S2W='<div>';var O2W="nput:last";var f2W="input:";var j2W="\" type=\"rad";var i2W='<input id="';var m2W="me=\"";var D82=Y5x;D82+=P5x;D82+=c2W;D82+=v7o;var M82=A6G;M82+=Q32;var X82=f2W;X82+=U9G;X82+=p32;X82+=y32;var U82=v6o;U82+=v7o;U82+=N2o;U82+=x2W;var h82=u9o;h82+=j4o;var R82=X6o;R82+=t7x;R82+=G1G;R82+=M6o;var z82=j2W;z82+=l2W;z82+=m2W;var Z12=V4o;Z12+=j4o;var d12=b2W;d12+=F0o;d12+=j4o;var F12=z6G;F12+=I7o;F12+=z5o;jqInput[F12](S2W + i2W + Editor[d12](conf[Z12]) + X2W + (i + offset) + z82 + conf[E5o] + R82 + V2W + Editor[h82](conf[c5o]) + X2W + (i + offset) + f5o + label + U82 + B5o);$(X82,jqInput)[M82](j1x,val)[A22][D82]=val;if(attr){var t82=V4o;t82+=O2W;$(t82,jqInput)[T0E](attr);}});}},create:function(conf){var H2W="ipOp";var C2W='<div />';var Y82=C6W;Y82+=U3E;Y82+=G1o;var v82=H2W;v82+=h2o;var P82=Z6o;P82+=H0x;P82+=l32;P82+=p32;var J82=T6G;J82+=j4o;J82+=V4o;J82+=C4o;conf[p8W]=$(C2W);fieldTypes[J82][v2W](conf,conf[P82] || conf[v82]);this[z0o](f6W,function(){var E82=G4o;E82+=I4o;E82+=d4o;var K82=C6W;K82+=B2W;K82+=y32;conf[K82][a7x](a2W)[E82](function(){var T2W="ked";if(this[N2W]){var G82=w4x;G82+=C8o;G82+=T2W;this[G82]=Q8o;}});});return conf[Y82][A22];},get:function(conf){var g2W="_editor_v";var L82=g2W;L82+=A0o;L82+=v7o;var k82=M0o;k82+=l32;k82+=W2G;k82+=d4o;var el=conf[p8W][a7x](k2W);return el[k82]?el[A22][L82]:undefined;},set:function(conf,val){var c82=q9o;H0LL.o64();c82+=V4o;c82+=l32;c82+=j4o;var y82=Q2W;y82+=y7o;y82+=y32;var q82=I32;q82+=D1G;var e82=V4o;e82+=m6o;var u82=J2W;u82+=y32;var that=this;conf[u82][a7x](e82)[q82](function(){var r2W="reCh";var w2W="ecked";var F2W="checked";var o2W="eCh";var W2W="or_val";var s2W="cked";var n2W="eck";var p82=S5G;p82+=W2W;H0LL.O64();this[N2W]=N8o;if(this[p82] == val){var I82=S7o;I82+=r2W;I82+=w2W;var a82=I4o;a82+=d4o;a82+=I32;a82+=s2W;this[a82]=Q8o;this[I82]=Q8o;}else {var A82=t2G;A82+=o2W;A82+=n2W;A82+=c0o;this[F2W]=N8o;this[A82]=N8o;}});_triggerChange(conf[y82][c82](k2W));},enable:function(conf){var j82=g32;j82+=B7o;j82+=g32;var x82=V4o;H0LL.o64();x82+=B2W;x82+=y32;var f82=C6W;f82+=l32;f82+=A7W;f82+=y32;conf[f82][a7x](x82)[j82](k0W,N8o);},disable:function(conf){var l82=C6W;H0LL.O64();l82+=B2W;l82+=y32;conf[l82][a7x](a2W)[N6W](k0W,Q8o);},update:function(conf,options,append){var z3W='[value="';var Z2W="adi";var d2W="valu";var C82=d2W;C82+=I32;var H82=W8G;H82+=y32;H82+=Q32;var O82=I32;O82+=Q5G;var V82=p32;V82+=u8G;var i82=f5W;i82+=G1o;var S82=s0o;S82+=l5o;var b82=C7o;b82+=y32;var m82=Q32;m82+=Z2W;m82+=C4o;var radio=fieldTypes[m82];var currVal=radio[b82](conf);radio[v2W](conf,options,append);var inputs=conf[S82][a7x](i82);radio[V82](conf,inputs[A8E](z3W + currVal + I8o)[B8o]?currVal:inputs[O82](A22)[H82](C82));}});fieldTypes[q3E]=$[U5o](Q8o,{},baseFieldType,{create:function(conf){var M3W="dateFormat";var D3W="RFC_2822";var P3W='date';var X3W='jqueryui';var R3W="feId";var h3W="t /";var g82=y32;g82+=I32;g82+=A32;g82+=y32;var T82=V4o;T82+=j4o;var N82=A3x;N82+=R3W;var B82=s6W;B82+=h3W;B82+=M6o;conf[p8W]=$(B82)[T0E]($[U5o]({id:Editor[N82](conf[T82]),type:g82},conf[T0E]));if($[U3W]){conf[p8W][T7G](X3W);if(!conf[M3W]){conf[M3W]=$[U3W][D3W];}setTimeout(function(){var t3W="#ui-datepicker-";var J3W="dateImage";var o82=l32;o82+=z9x;var s82=I4o;s82+=p32;s82+=p32;H0LL.O64();var w82=t3W;w82+=X7G;var r82=Z6o;r82+=y32;r82+=p32;var W82=I32;W82+=Q4x;W82+=l1G;W82+=j4o;var Q82=s0o;Q82+=f5W;Q82+=y7o;Q82+=y32;$(conf[Q82])[U3W]($[W82]({dateFormat:conf[M3W],buttonImage:conf[J3W],buttonImageOnly:Q8o,onSelect:function(){conf[p8W][t2o]()[i2G]();}},conf[r82]));$(w82)[s82](n5o,o82);},b22);}else {var F82=w9o;F82+=I32;var n82=C6W;n82+=l32;n82+=g32;n82+=G1o;conf[n82][T0E](F82,P3W);}return conf[p8W][A22];},set:function(conf,val){var Y3W="change";var G3W="etDat";var E3W="sClass";var v3W="hasD";var Z82=v3W;Z82+=D7o;Z82+=g32;Z82+=K3W;var d82=O0W;d82+=E3W;if($[U3W] && conf[p8W][d82](Z82)){var R62=p32;R62+=G3W;R62+=I32;var z62=C6W;z62+=l32;z62+=A7W;z62+=y32;conf[z62][U3W](R62,val)[Y3W]();}else {var h62=o6o;h62+=D2o;$(conf[p8W])[h62](val);}},enable:function(conf){H0LL.O64();var k3W="tepicker";if($[U3W]){var X62=y6W;X62+=v7o;X62+=I32;var U62=F6o;U62+=k3W;conf[p8W][U62](X62);}else {var M62=B6W;M62+=c0o;$(conf[p8W])[N6W](M62,N8o);}},disable:function(conf){var u3W="disab";var e3W="led";var L3W="datepicke";var D62=L3W;H0LL.O64();D62+=Q32;if($[D62]){var J62=i0W;J62+=c2o;var t62=s0o;t62+=V4o;t62+=m6o;conf[t62][U3W](J62);}else {var P62=u3W;P62+=e3W;$(conf[p8W])[N6W](P62,Q8o);}},owns:function(conf,node){var a3W='div.ui-datepicker-header';var p3W="i-datep";var Y62=v7o;Y62+=E4G;Y62+=y32;Y62+=d4o;var G62=Y3E;G62+=Q32;G62+=t0G;G62+=p32;var E62=M0o;E62+=O8o;E62+=y32;E62+=d4o;var K62=q3W;K62+=y7o;K62+=p3W;K62+=K3W;var v62=g32;v62+=A0o;v62+=R8W;return $(node)[v62](K62)[E62] || $(node)[G62](a3W)[Y62]?Q8o:N8o;}});fieldTypes[v8W]=$[U5o](Q8o,{},baseFieldType,{create:function(conf){var c3W="<input ";var A3W="ten";H0LL.O64();var S3W="keyInput";var y3W="afeI";var f3W="/>";var I3W="eFn";var j3W="displayFormat";var i3W="wn";var l62=D9o;l62+=v7o;l62+=K7o;l62+=I3W;var c62=s0o;c62+=f7G;c62+=I3W;var y62=C4o;y62+=g32;y62+=h2o;var A62=S0o;A62+=Q32;A62+=D8G;A62+=y32;var I62=H8x;I62+=A3W;I62+=j4o;var a62=A0o;a62+=m1x;var p62=V4o;p62+=j4o;var q62=p32;q62+=y3W;q62+=j4o;var e62=I32;e62+=e4o;var u62=A0o;u62+=y32;u62+=y32;u62+=Q32;var L62=c3W;L62+=f3W;var k62=s0o;k62+=l5o;conf[k62]=$(L62)[u62]($[e62](Q8o,{id:Editor[q62](conf[p62]),type:r6W},conf[a62]));conf[x3W]=new Editor[L5E](conf[p8W],$[I62]({format:conf[j3W] || conf[A62],i18n:this[h5o][v8W]},conf[y62]));conf[c62]=function(){var b3W="hide";var m3W="ker";var f62=l3W;f62+=m3W;conf[f62][b3W]();};if(conf[S3W] === N8o){var j62=Z8E;j62+=j4o;j62+=C4o;j62+=i3W;var x62=s0o;x62+=b0o;x62+=r0o;conf[x62][z0o](j62,function(e){e[L0E]();});}this[z0o](f4G,conf[l62]);return conf[p8W][A22];},get:function(conf){var O3W="momentStrict";var S62=c9x;S62+=b4o;S62+=W8G;var b62=i0o;b62+=v7o;var m62=Q2W;m62+=G1o;var val=conf[m62][b62]();var inst=conf[x3W][I4o];return val && conf[V3W] && moment?moment(val,inst[S62],inst[J8W],inst[O3W])[F5E](conf[V3W]):val;},set:function(conf,val){var H3W="Strict";var C62=C6W;H0LL.O64();C62+=m6o;var H62=q9o;H62+=A3G;H62+=A0o;H62+=y32;var O62=n5E;O62+=H3W;var V62=o6o;V62+=A0o;V62+=v7o;var i62=l3W;i62+=E8G;i62+=I32;i62+=Q32;var inst=conf[x3W][I4o];conf[i62][V62](val && conf[V3W] && moment?moment(val,conf[V3W],inst[J8W],inst[O62])[H62](inst[F5E]):val);_triggerChange(conf[C62]);},owns:function(conf,node){H0LL.o64();var B62=F4G;B62+=p32;return conf[x3W][B62](node);},errorMessage:function(conf,msg){var C3W="errorMsg";H0LL.o64();conf[x3W][C3W](msg);},destroy:function(conf){var B3W="_pick";var T3W="destroy";var N3W="loseF";H0LL.O64();var W62=B3W;W62+=Q4o;var Q62=Q2W;Q62+=G1o;var g62=D9o;g62+=N3W;g62+=l32;var T62=f7G;T62+=I32;var N62=C4o;N62+=q9o;N62+=q9o;this[N62](T62,conf[g62]);conf[Q62][C8G](y0E);conf[W62][T3W]();},minDate:function(conf,min){var r62=b4o;r62+=V4o;H0LL.O64();r62+=l32;conf[x3W][r62](min);},maxDate:function(conf,max){H0LL.o64();var g3W="max";conf[x3W][g3W](max);}});fieldTypes[w62]=$[s62](Q8o,{},baseFieldType,{create:function(conf){var editor=this;H0LL.o64();var container=_commonUpload(editor,conf,function(val){var Q3W="postU";var W3W="eve";var z52=l32;z52+=B8x;var Z62=Q3W;Z62+=m8x;var d62=s0o;d62+=W3W;d62+=Z2o;var F62=E2o;F62+=G2o;var n62=p32;n62+=u8G;var o62=L3G;o62+=v7o;o62+=C4o;o62+=F2o;Editor[v5o][o62][n62][F62](editor,conf,val[A22]);editor[d62](Z62,[conf[z52],val[A22]]);});return container;},get:function(conf){H0LL.O64();var R52=s0o;R52+=o6o;R52+=A0o;R52+=v7o;return conf[R52];},set:function(conf,val){var n3W="rendered";var d3W="oFileT";var w3W="trigge";var U01="clearText";var D01="ddClass";var Z3W="spa";var R01="pty";var o3W="arTe";var M01="noCl";var h01='No file';var z01="pen";var s3W="rHandle";var F3W="tm";var X01='noClear';var r3W="upload.e";var e52=c2W;e52+=v7o;var u52=r3W;u52+=L5o;u52+=P5x;var L52=w3W;L52+=s3W;L52+=Q32;var k52=C6W;k52+=U3E;k52+=G1o;var E52=I4o;E52+=M0o;E52+=o3W;E52+=Q4x;var K52=F3E;K52+=j4o;var h52=g6W;h52+=A0o;h52+=v7o;conf[h52]=val;var container=conf[p8W];if(conf[u1o]){var X52=s0o;X52+=V3o;var U52=q3W;U52+=n3W;var rendered=container[a7x](U52);if(conf[X52]){var D52=s0o;D52+=o6o;D52+=A0o;D52+=v7o;var M52=d4o;M52+=F3W;M52+=v7o;rendered[M52](conf[u1o](conf[D52]));}else {var v52=l32;v52+=d3W;v52+=Z8o;var P52=Y6o;P52+=Z3W;P52+=l32;P52+=M6o;var J52=z6G;J52+=z01;J52+=j4o;var t52=g4o;t52+=R01;rendered[t52]()[J52](P52 + (conf[v52] || h01) + Q9W);}}var button=container[K52](i6W);if(val && conf[E52]){button[j3o](conf[U01]);container[Q2o](X01);}else {var Y52=M01;Y52+=I32;Y52+=A0o;Y52+=Q32;var G52=A0o;G52+=D01;container[G52](Y52);}conf[k52][a7x](a2W)[L52](u52,[conf[e52]]);},enable:function(conf){H0LL.o64();var a52=L5o;a52+=p32;a52+=t01;var p52=r9o;p52+=z5o;var q52=Q2W;q52+=G1o;conf[q52][p52](a2W)[N6W](a52,N8o);conf[Z8W]=Q8o;},disable:function(conf){var J01="nabl";var A52=s0o;A52+=I32;A52+=J01;A52+=c0o;var I52=g32;I52+=Q32;I52+=C4o;I52+=g32;conf[p8W][a7x](a2W)[I52](k0W,Q8o);conf[A52]=N8o;},canReturnSubmit:function(conf,node){return N8o;}});H0LL.O64();fieldTypes[P01]=$[U5o](Q8o,{},baseFieldType,{_showHide:function(conf){var E01="limi";var v01=".l";var G01="limit";var K01="imitHide";var S52=M0o;S52+=l32;S52+=W2G;S52+=d4o;var b52=y0o;b52+=J1o;b52+=E8G;var m52=s5o;m52+=l32;m52+=I32;var l52=v7o;l52+=V4o;l52+=K3G;var j52=j4o;j52+=f3o;var x52=I4o;x52+=p32;x52+=p32;var f52=X7G;f52+=v01;f52+=K01;var c52=s0o;c52+=O2o;c52+=V4o;c52+=m2o;var y52=E01;y52+=y32;if(!conf[y52]){return;}conf[c52][a7x](f52)[x52](j52,conf[T6W][B8o] >= conf[l52]?m52:b52);conf[g8x]=conf[G01] - conf[T6W][S52];},create:function(conf){var Y01="button.";var a01="_container";var e01='multi';var k01="addC";var Q52=Y01;Q52+=a3E;Q52+=I32;var g52=C4o;g52+=l32;var T52=k01;T52+=v7o;H0LL.o64();T52+=B9x;var editor=this;var container=_commonUpload(editor,conf,function(val){var u01='postUpload';var L01="dMany";var N52=s0o;N52+=o6o;N52+=A0o;N52+=v7o;var B52=l32;B52+=B8x;var C52=s0o;C52+=x2G;C52+=l1G;C52+=y32;var H52=E2o;H0LL.O64();H52+=G2o;var O52=p1G;O52+=y32;var V52=q6W;V52+=L01;var i52=s0o;i52+=i0o;i52+=v7o;conf[T6W]=conf[i52][K2G](val);Editor[v5o][V52][O52][H52](editor,conf,conf[T6W]);editor[C52](u01,[conf[B52],conf[N52]]);},Q8o);container[T52](e01)[g52](z2o,Q52,function(e){var p01='idx';var q01="uploadM";e[G0W]();H0LL.O64();if(conf[Z8W]){var w52=q01;w52+=n0G;w52+=n4o;var r52=s0o;r52+=i0o;r52+=v7o;var W52=F6o;W52+=N32;var idx=$(this)[W52](p01);conf[r52][E5G](idx,y22);Editor[v5o][w52][b0G][b3G](editor,conf,conf[T6W]);}});conf[a01]=container;return container;},get:function(conf){return conf[T6W];},set:function(conf,val){var m01="<u";var x01="ay as a value";var g01='No files';var f01=" collections must have an arr";var y01="dM";var c01="Upload";var T01="noFileText";var j01="v.re";var S01="</ul>";var b01="l>";var A01="ide";var Q01='upload.editor';var l01="ndered";var I01="H";var K22=s0o;K22+=o6o;K22+=A0o;K22+=v7o;var v22=F3E;v22+=j4o;var P22=F6W;P22+=r0o;var J22=m1G;J22+=I01;J22+=A01;var t22=q6W;t22+=y01;t22+=n0G;t22+=n4o;var n52=L5o;n52+=t1o;var s52=N6G;s52+=Q32;s52+=T6G;s52+=n4o;if(!val){val=[];}if(!Array[s52](val)){var o52=c01;o52+=f01;o52+=x01;throw o52;}conf[T6W]=val;var that=this;var container=conf[p8W];if(conf[n52]){var F52=L5o;F52+=j01;F52+=l01;var rendered=container[a7x](F52)[k3G]();if(val[B8o]){var d52=m01;d52+=b01;d52+=S01;var list=$(d52)[B3G](rendered);$[v2o](val,function(i,file){var V01="\">&times;";var N01=' remove" data-idx="';var O01="</button>";var C01='<li>';var H01="asses";var i01="i>";var B01=' <button class="';var X22=Y6o;X22+=G1G;X22+=v7o;X22+=i01;var U22=V01;U22+=O01;var h22=X0o;h22+=G1o;h22+=s6E;var R22=q9o;R22+=A3G;var z22=K1o;z22+=H01;var Z52=R9G;Z52+=l1G;Z52+=j4o;list[Z52](C01 + conf[u1o](file,i) + B01 + that[z22][R22][h22] + N01 + i + U22 + X22);});}else {var D22=Y6o;D22+=Q3G;D22+=n0G;D22+=M6o;var M22=z6G;M22+=g5G;rendered[M22](D22 + (conf[T01] || g01) + Q9W);}}Editor[v5o][t22][J22](conf);conf[P22][v22](a2W)[D3x](Q01,[conf[K22]]);},enable:function(conf){var E22=s0o;E22+=l5o;conf[E22][a7x](a2W)[N6W](k0W,N8o);conf[Z8W]=Q8o;},disable:function(conf){var k22=s0o;k22+=l1G;k22+=t01;var Y22=F3E;Y22+=j4o;var G22=C6W;G22+=U3E;H0LL.O64();G22+=y7o;G22+=y32;conf[G22][Y22](a2W)[N6W](k0W,Q8o);conf[k22]=N8o;},canReturnSubmit:function(conf,node){H0LL.o64();return N8o;}});})();if(DataTable[L22][u22]){var q22=c0o;q22+=W01;var e22=I32;e22+=A32;e22+=y32;$[U5o](Editor[v5o],DataTable[e22][q22]);}DataTable[p22][a22]=Editor[I22];Editor[l8o]={};Editor[e2o][r01]=p8o;Editor[w01]=s01;return Editor;});

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


/*! Select for DataTables 1.3.1
 * 2015-2019 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.3.1
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2019 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
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


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.3.1';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var toggleable = true;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}
		
		if ( opts.toggleable !== undefined ) {
			toggleable = opts.toggleable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}
		else {
			style = 'os';
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.toggleable( toggleable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string       - Can be `rows`, `columns` or `cells`. Defines what item 
	                     will be selected if the user is allowed to activate row
	                     selection using the mouse.
	style:string       - Can be `none`, `single`, `multi` or `os`. Defines the
	                     interaction style when selecting items
	blurable:boolean   - If row selection can be cleared by clicking outside of
	                     the table
	toggleable:boolean - If row selection can be cancelled by repeated clicking
	                     on the row
	info:boolean       - If the selection summary should be shown in the table
	                     information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + _safeId(dt.table().node()) );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;
	var matchSelection;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}

			if ( window.getSelection ) {
				matchSelection = window.getSelection();
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( matchSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( selection !== matchSelection ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];
			var wrapperClass = $.trim(dt.settings()[0].oClasses.sWrapper).replace(/ +/g, '.');

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.'+wrapperClass)[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + _safeId(dt.table().node()), function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var toggleable = dt.select.toggleable();
	var isSelected = dt[type]( idx, { selected: true } ).any();
	
	if ( isSelected && ! toggleable ) {
		return;
	}

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}

function _safeId( node ) {
	return node.id.replace(/[^a-zA-Z0-9\-\_]/g, '-');
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.toggleable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.toggleable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.toggleable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


