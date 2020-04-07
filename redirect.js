// ==UserScript==
// @name         Aliexpress redirector
// @namespace    pt.aliexpress.utils
// @downloadURL  https://raw.githubusercontent.com/lfilipe/aliexpress_ru_pt/master/redirect.js
// @version      0.2
// @description  Redirect from ru to pt aliexpress local website
// @author       lfilipe
// @match        https://*.aliexpress.ru/*
// @grant        none
// ==/UserScript==

(function() {
'use strict';

var targethost = "www.aliexpress.ru";

//alert("URL => "+window.location.host);
//alert('aep_usuc_f => ['+readCookie('aep_usuc_f')+'] intl_locale => ['+readCookie('intl_locale')+'] xman_us_f => ['+readCookie('xman_us_f')+']');

if(window.location.host!==targethost) {
    //alert("yes");
    setCookie('aep_usuc_f','site=bra&region=PT&b_locale=pt_BR&c_tp=EUR',100);
    setCookie('intl_locale','pt_PT',100);
    setCookie('xman_us_f','x_l=0&x_locale=pt_BR',100);
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    var newhref =  window.location.href;
    newhref = newhref.replace("aliexpress.ru", "aliexpress.com");
    window.location.href = newhref;

    alert("NOVO => "+window.location.href);
    }

var qs = parseQueryParameters(window.location.search.substr(1).split('&'));
var prohibitedParams = ['aff_platform', 'sk', 'cpt', 'aff_trace_key', 'af', 'cn', 'cv', 'afref', 'ws_test'];
var contains = false;
prohibitedParams.forEach(function(element){
    if(qs[element]!==undefined){
        console.log("qs[element] - " + qs[element]);
        contains = true;
        delete qs[element];
    }
});


if(contains){
    eraseCookie ("aeu_cid");
    var newQuery='?';
    Object.keys(qs).forEach(function (element){
        newQuery = newQuery + element + '=' + qs[element]+'&';
    });
    newQuery = newQuery.substring(0, newQuery.length - 1);
    window.location.search=newQuery;
}

function parseQueryParameters(a) {
    if (a === "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = p[1].replace(/\+/g, " ");
    }
    return b;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//copied from http://stackoverflow.com/questions/2194473/can-greasemonkey-delete-cookies-from-a-given-domain
function eraseCookie (cookieName) {
    //--- ONE-TIME INITS:
    //--- Set possible domains. Omits some rare edge cases.?.
    var domain      = document.domain;
    var domain2     = document.domain.replace (/^www\./, "");
    var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2");
    var pathStr;

    //--- Get possible paths for the current page:
    var pathNodes   = location.pathname.split ("/").map ( function (pathWord) {
        return '/' + pathWord;
    } );
    var cookPaths   = [""].concat (pathNodes.map ( function (pathNode) {
        if (window.pathStr) {
            window.pathStr += pathNode;
        }
        else {
            window.pathStr = "; path=";
            return (window.pathStr + pathNode);
        }
        return (window.pathStr);
    } ) );

    ( eraseCookie = function (cookieName) {
        //--- For each path, attempt to delete the cookie.
        cookPaths.forEach ( function (pathStr) {
            //--- To delete a cookie, set its expiration date to a past value.
            var diagStr     = cookieName + "=" + pathStr + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = diagStr;

            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain  + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain2 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain3 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        } );
    } ) (cookieName);
}

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
      //document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        document.cookie = cname + "=" + cvalue + "; domain=aliexpress.com;"  + expires + ";path=/";
        //ocument.cookie = cookieName + "=" + pathStr + "; domain=" + domain  + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
    }
})();
