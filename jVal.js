/*
 * jVal - dynamic jquery form field validation framework
 *	version 0.1.4
 * Author: Jim Palmer
 * Released under MIT license.
 */
(function($) {
	this.showWarning = function (elements, message, autoHide, styleType) {
		var par = $(elements).eq(0).parent();
		$(par).jValClean().append('<div class="jValRelWrap" style="display:none;"></div>').find('.jValRelWrap').append( $(elements).clone() );
		$(elements).css({marginTop:'',position:'',borderColor:'red'});
		var fieldWidth = $(par).find('.jValRelWrap').width(), fieldHeight = $(par).find('.jValRelWrap').height();
		$(par).find('.jValRelWrap').css({'width':fieldWidth,'height':fieldHeight}).empty();
		var paddedHeight = (fieldHeight + ($.fn.jVal.defaultPadding * 2)),
			absoluteLeft = $(elements).eq(0).position().left,
			absoluteTop = $(elements).eq(0).position().top;
		$(elements).each(
			function () {
				absoluteLeft = Math.min( $(this).position().left, absoluteLeft );
				absoluteTop = Math.min( $(this).position().top, absoluteTop );
			}
		);
		$(elements).eq(0).before(
			'<div class="jfVal' + ( styleType ? ' jfVal' + styleType : '' ) + '" style="left:' + (absoluteLeft - $.fn.jVal.defaultPadding - $.fn.jVal.defaultBorderWidth) + 'px; ' +
				'top:' + (absoluteTop - $.fn.jVal.defaultPadding - $.fn.jVal.defaultBorderWidth + $.fn.jVal.IETopNudge) + 'px;">' +
				( (styleType == 'pod') ? '<div class="spacerBorder" style="height:' + paddedHeight + 'px;">' : '' ) + 
					'<div class="spacer' +  ( styleType ? ' spacer' + styleType : '' ) + '" style="height:' + paddedHeight + 'px;"></div>' +
				( (styleType == 'pod') ? '</div>' : '' ) + 
				'<div class="icon' + ( styleType ? ' icon' + styleType : '' ) + '" style="height:' + paddedHeight + 'px;"><div class="iconbg"></div></div>' +
				'<div class="content' + ( styleType ? ' content' + styleType : '' ) + '" style="height:' + paddedHeight + 'px; line-height:' + paddedHeight + 'px;">' + message + '</div>' +
			'</div>');
		var spacerWidth = fieldWidth + ($.fn.jVal.defaultPadding * 2) + 8;
		$(par).find(styleType == 'pod' ? '.spacerBorder' : '.jfVal').css('padding', parseInt($.fn.jVal.defaultBorderWidth) + 'px').corner("round tr br 3px");
		$(par).find('.jfVal').width( spacerWidth + $(par).find('.icon').width() + $(par).find('.content').width() + $.fn.jVal.defaultPadding + $.fn.jVal.defaultBorderWidth);
		if ( autoHide ) {
			$(par).find('.spacer').width( spacerWidth ).animate({'opacity':0.95}, 2000).animate({'width':0}, 200);
			$(par).find('.jfVal').css({'opacity':0.93,'borderWidth':0}).animate({'borderWidth':0}, 2000).animate({'opacity':0}, 200, function() { $(this).remove(); });
			$(elements).stop().animate({'opacity':0.95}, 2000, function() { $(this).css('borderColor', ''); });
		} else {
			$(par).find('.spacer').width( 0 ).animate({'width':spacerWidth}, 200);
			$(par).find('.jfVal').css('opacity', 0).animate({'opacity':0.95}, 400);
		}
		$(elements).each(
			function () {
				$(this).css( $(this).position() );
			}
		);
		$(elements).css(($.browser.msie) ? {'margin-top':1,'position':'absolute'} : {'position':'absolute'}).removeClass('jfValContentZ').addClass('jfValContentZ');
		$(par).find('.jValRelWrap').css('display', 'block');
	};
	function valKey (keyRE, e, cF, cA) {
		if ( !(keyRE instanceof RegExp) ) return false;
		if ( /^13$/.test(String(e.keyCode || e.charCode)) ) {
			try { (this[cF]) ? this[cF](cA) : eval(cF); } catch(e) { return true; }
			return -1;
		} else if (	( typeof(e.keyCode) != 'undefined' && e.keyCode > 0 && keyRE.test(String.fromCharCode(e.keyCode)) ) || 
					( typeof(e.charCode) != 'undefined' && e.charCode > 0 && String.fromCharCode(e.charCode).search(keyRE) != (-1) ) ||
					( typeof(e.charCode) != 'undefined' && e.charCode != e.keyCode && typeof(e.keyCode) != 'undefined' && e.keyCode.toString().search(/^(8|9|45|46|35|36|37|39)$/) != (-1) ) ||
					( typeof(e.charCode) != 'undefined' && e.charCode == e.keyCode && typeof(e.keyCode) != 'undefined' && e.keyCode.toString().search(/^(8|9)$/) != (-1) ) ) {
			return 1;
		} else {
			return 0;
		}
	};
	$.fn.jVal = function () {
		$(this).stop().find('.jfVal').stop().remove();
		var passVal = true;
		$(this).find('[jVal]:not(:disabled):visible').each(
			function () {
				eval( 'var cmd = ' + $(this).attr('jVal') + ';' );
				$(this).jValClean(cmd.target || this);
				if ( cmd instanceof Object && cmd.valid instanceof RegExp && !cmd.valid.test($(this).val()) ) {
					showWarning(cmd.target || this, cmd.message || $.fn.jVal.defaultMessage, cmd.autoHide || false, cmd.styleType || $.fn.jVal.defaultStylye);
					passVal = false;
				} else if ( cmd instanceof Object && cmd.valid instanceof Function ) {
					var testFRet = cmd.valid( $(this).val(), this );
					if ( testFRet === false || testFRet.length > 0 ) {
						showWarning(cmd.target || this, testFRet || cmd.message || $.fn.jVal.defaultMessage, cmd.autoHide || false, cmd.styleType || $.fn.jVal.defaultStylye);
						passVal = false;
					}
				} else if ( ( cmd instanceof RegExp && !cmd.test($(this).val()) ) || ( cmd instanceof Function && !cmd($(this).val()) ) ) {
					showWarning(cmd.target || this, $.fn.jVal.defaultMessage);
					passVal = false;
				}
			}
		);
		return passVal;
	};
	$.fn.jValClean = function (target) {
		$(this).find('.jfVal').stop().remove();
		$(target || $(this).find('[jVal]')).css({position:'',borderColor:'',left:'0px',top:'0px'}).parent().find('.jValRelWrap').remove();
		return this; // chainable
	};
	$.fn.jVal.init = function () {
		$('input[jVal]:not(:disabled)').unbind("blur").bind("blur", function (e) {
				$(this).parent().jVal();
			});
		$('input[jValKey]').unbind("keypress").bind("keypress", function (e) {
				eval( 'var cmd = ' + $(this).attr('jValKey') + ';' );
				var keyTest = valKey( ( (cmd instanceof Object) ? cmd.valid : cmd ), e, (cmd instanceof Object) ? cmd.cFunc : null, (cmd instanceof Object) ? cmd.cArgs : null );
				if ( keyTest == 0 ) {
					showWarning(cmd.target || this, (( cmd instanceof Object && cmd.message) || $.fn.jVal.defaultKeyMessage).replace('%c', String.fromCharCode(e.keyCode || e.charCode)), true, cmd.styleType || $.fn.jVal.defaultStylye);
					return false;
				} else if ( keyTest == -1 ) return false;
				else $(this).css('borderColor', '').parent().find('.jfVal').remove();
				return true;
			});
	};

	$(document).ready( $.fn.jVal.init );
	
	$.fn.jVal.defaultMessage = 'Invalid entry';
	$.fn.jVal.defaultStylye = 'pod';
	$.fn.jVal.defaultKeyMessage = '"%c" Invalid character';
	$.fn.jVal.defaultPadding = 3;
	$.fn.jVal.defaultBorderWidth = 1;
	$.fn.jVal.IETopNudge = $.browser.msie ? -1 : 0;
})(jQuery);