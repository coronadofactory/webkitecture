/*!
 * webkitecture-google.js
 * http://coronadofactory.com/google/analytics/
 *
 * Copyright (c) 2011-2015 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/service-connector/master/LICENSE.txt
 *
 * Date: 2015-03-26
 */

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {root.WebK = factory(root, exports);});
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);
  } else {
    root.WebK = factory(root, root.WebK || {});
  }

}(this, function(root, WebK) {

	WebK.getURIParam = WebK.getURIParam || function(param) {
		var search = param+'=';
		var i1 = window.location.search.indexOf(search);
		if (i1==-1) return null;
		
		var i21 = window.location.search.indexOf('&',i1+1);
		var i22 = window.location.search.indexOf('#',i21+1);

		if (i21==-1 && i22==-1) {
			return  window.location.search.substring(i1+search.length);
		} else if (i21>-1 && (i21<i22 || i22==-1)) {
			return  window.location.search.substring(i1+search.length, i21);
		} else if (i22>-1 && (i21>i22 || i21==-1)) {
			return  window.location.search.substring(i1+search.length, i22);
		} else {
			return null;
		}
	
	}
	
// https://support.google.com/analytics/answer/1033867
// https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference

	WebK.addCampaign = function(orig) {
	
		var result = orig || {}, value;

		value = WebK.getURIParam('utm_campaign');
		if (value) result['campaignName']=value;

		value = WebK.getURIParam('utm_source');
		if (value) result['campaignSource']=value;
		
		value = WebK.getURIParam('utm_medium');
		if (value) result['campaignMedium']=value;

		value = WebK.getURIParam('utm_term');
		if (value) result['campaignKeyword']=value;

		value = WebK.getURIParam('utm_content');
		if (value) result['campaignContent']=value;
		
		return result;
	}

  return WebK;

}));

