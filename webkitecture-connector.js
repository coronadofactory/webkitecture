/*!
 * webkitecture-connector.js
 * http://coronadofactory.com/webkitecture/
 *
 * Copyright (c) 2011-2015 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/webkitecture/master/LICENSE.txt
 *
 * Date: 2014-12-25
 */

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {root.WebK = factory(root, exports, $);});
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);
  } else {
    root.WebK = factory(root, {}, root.jQuery);
  }

}(this, function(root, WebK, $) {

	WebK.Query = function(parms) {

		var contentType, dataType, data;
		
		if (parms.datatype) {
			contentType = 'application/'+parms.datatype+';charset=utf8';
			dataType    = parms.datatype;
			data        = (parms.request)?parms.request:'';
		} else {
			contentType = 'application/json;charset=utf8';
			dataType    = 'json';
			data        = (parms.request)?JSON.stringify(parms.request):'{}';
		}

		var then = function(datadfd) {
		
			var data = datadfd[0];
		
			if (dataType=='json') {
				if (!data.status || data.status.toUpperCase()=='OK' || data.status.toUpperCase()=='SUCCESS') {
					if (parms.callback) {
						parms.callback(data)
					} else {
						if (parms.panel && parms.panel.message) parms.panel.message(data.status, data.message);
					}
				} else {
					if (parms.panel && parms.panel.message) parms.panel.message(data.status, data.message);
				}
			} else if (dataType=='xml') {
			    if (window.ActiveXObject){
					parms.callback(data.xml);
				}  else{
					parms.callback((new XMLSerializer()).serializeToString(data));
				}
			}

		}

		var loader = function(value) {
		
			var f1 = (parms.action && parms.action.loader)?parms.action.loader:null;
			var f2 = (parms.panel && parms.panel.loader)?parms.panel.loader:null;

			var dfd = $.Deferred();
			var resolve = function(){ dfd.resolve()};


			var first, second;
			if (value) {
				first = f1; second = f2;
			} else {
				first = f2; second = f1
			}
			if (first) {
				first(value, function(){if(second) second(value, function(){resolve()}); else resolve();});
			} else if (second) {
				if(second) second(value, function(){resolve()}); else resolve();
			} else {
				resolve();
			}
					
			if (value && parms.panel && parms.panel.waiting) {
				alert('obsolete');
			}

			if (!value && parms.panel && parms.panel.always) {	// From always event
				alert('obsolete');
				parms.panel.always();
			}
			
			return dfd.promise();
	
		}
		
		var always = function() {return loader(false)};

		var fail = function(XMLHttpRequest, textStatus, errorThrown) {
		
	   		if (parms.panel && parms.panel.fail) {
	   			
	   			if (XMLHttpRequest.status=='400' || XMLHttpRequest.status=='404' || XMLHttpRequest.status=='405') {
					parms.panel.fail('NOMETHOD', XMLHttpRequest.statusText, parms.service.url);
				} else if (XMLHttpRequest.status=='500') {
					parms.panel.fail('SERVERERROR', XMLHttpRequest.statusText, parms.service.url);
				} else if (XMLHttpRequest.status=='502' || XMLHttpRequest.status=='503') {
					parms.panel.fail('NOAVAILABLE', null, parms.service.url);
				} else {
					parms.panel.fail('UNKNOWN', '[' + XMLHttpRequest.status + ']', parms.service.url);
				}
	   		
    		} else {
	    		if (window.console) console.error(XMLHttpRequest.status);
    		}
    		
		}	
				
		$.when($.ajax({
		    contentType: contentType, data: data,
			dataType: dataType,
			url: (parms.service.url + (parms.posturl?('/'+parms.posturl):'')), type: parms.service.method,
			xhrFields: {withCredentials: true}
		}),loader(true)).then(then).always(always).fail(fail);
		
	};
	
	WebK.Form = function(parms) {

		
		var submit = function(request) {
			new WebK.Query({
				service: parms.service, posturl: parms.posturl,
				request: request, datatype: parms.datatype,
				callback: parms.callback,
				panel:parms.panel,
				action:parms.action
			});
		}

		if (parms.action) {
			parms.action.on('submit', function() {
				submit(serializer(parms.form));
			});
		}
		
	};

	var serializer = function($el) {
	
		var bean = {};
	
		$el.find('input[data-property], select[data-property]').each(function() {
			var inp = $(this);
			var property = inp.attr('data-property');

			if (inp.attr('type')=='checkbox') {
				bean[property]=inp.is(':checked');
			} else {
				bean[property]=inp.val();
			}
			
		});
	
		$el.find('*[data-property-parent]').each(function() {
			var parent = $(this);
			var property = parent.attr('data-property-parent');
	
			var values = [];
			bean[property]=values;
			
			parent.find('.data-property-row').each(function() {
				var row = $(this);
				
				var item={};
				values.push(item);
				
				row.find('input[data-property-child], select[data-property-child]').each(function() {
					var inp = $(this);
					
					var property = inp.attr('data-property-child');
					var value = inp.val();
					
					item[property]=value;
				});
				
			});
			
		});
		
		$el.find('*[data-property-checks]').each(function() {
			
			var parent = $(this);
			var property = parent.attr('data-property-checks');
			
			var values = [];
			bean[property]=values;
		
			parent.find('input[type=checkbox]').each(function() {
				var checkbox = $(this);
				var property2 = checkbox.attr('data-property-child');
				if (checkbox.is(':checked')) {
					var value = {};
					value[property2]=checkbox.val();
					values.push(value);
				}
			});
			
		});
			
		return bean;
	
	};

	WebK.Modal = function(parms) {

		parms.open.action.on('submit', parms.open.effect);
		
	};
	
  return WebK;

}));
