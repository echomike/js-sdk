/*
 *  jQuery autoResize (textarea auto-resizer)
 *  @copyright James Padolsey http://james.padolsey.com
 *  @version 1.04
 */

(function(a){a.fn.autoResize=function(j){var b=a.extend({onResize:function(){},animate:true,animateDuration:150,animateCallback:function(){},extraSpace:20,limit:1000},j);this.filter('textarea').each(function(){var c=a(this).css({resize:'none','overflow-y':'hidden'}),k=c.height(),f=(function(){var l=['height','width','lineHeight','textDecoration','letterSpacing'],h={};a.each(l,function(d,e){h[e]=c.css(e)});return c.clone().removeAttr('id').removeAttr('name').css({position:'absolute',top:0,left:-9999}).css(h).attr('tabIndex','-1').insertBefore(c)})(),i=null,g=function(){f.height(0).val(a(this).val()).scrollTop(10000);var d=Math.max(f.scrollTop(),k)+b.extraSpace,e=a(this).add(f);if(i===d){return}i=d;if(d>=b.limit){a(this).css('overflow-y','');return}b.onResize.call(this);b.animate&&c.css('display')==='block'?e.stop().animate({height:d},b.animateDuration,b.animateCallback):e.height(d)};c.unbind('.dynSiz').bind('keyup.dynSiz',g).bind('keydown.dynSiz',g).bind('change.dynSiz',g)});return this}})(jQuery);

var plugin = Echo.Plugin.manifest("SubmitTextareaAutoResize", "Echo.StreamServer.Controls.Submit");

plugin.init = function() {
	var self = this;
	var component = this.component;
	component.addPostValidator(function() {
		var valid = true;
		$.each(["text"], function (i, field) {
			valid = !self._highlightMandatory(component.view.get(field));
			return valid;
		});
		return valid;
	});
};

plugin.component.renderers.postButton = function(element) {
	return this.parentRenderer("postButton", arguments).addClass(this.cssPrefix + "btn btn btn-small");
};

plugin.component.renderers.body = function(element) {
	return this.parentRenderer("body", arguments).addClass(this.cssPrefix + "content");
};

plugin.methods._highlightMandatory = function(element) {
	var component = this.component;
	var result = component.highlightMandatory(element);
	if (result) {
		var css = this.cssPrefix + "mandatory";
		element.addClass(css)
			.one("focus", function() {
				element.removeClass(css);
			});
	}
	return result;
};

plugin.component.renderers.text = function(element) {
	if (this.config.get("mode") != "compact") {
		element.one({
			"focus" : function() {
				$(this).autoResize( { extraSpace: 0 } );
			}
		});
	}
	return this.parentRenderer("text", arguments).addClass(this.cssPrefix + "border");
};

plugin.css =
	'.{plugin.class:border} { border: 1px solid #CCCCCC; padding: 4px; }' +
	'.{plugin.class:btn} div.echo-label { font-size: 12px; }' +
	'.{plugin.class:content} .{class:content} { background-color: transparent; }' +
	'.{plugin.class:content} .{class:border} { border: none; }' +
	'.{plugin.class:mandatory} { border-color: #ff5050; }';

Echo.Plugin.create(plugin);

