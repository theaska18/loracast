"use strict";
var version = 'v1::',
	urlsToCache = ['','./'];
self.addEventListener('install', function(event) {event.waitUntil(
	caches.open(version + 'fundamentals').then(function(cache) {return cache.addAll(urlsToCache);}).then(function() {})
);});
var offlinePage = '<html><head><title>Uh oh, you appear to be offline!</title><style>.offline{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:100%;padding:2rem;}.offline__container{box-sizing:border-box;width:auto;text-align:center;}h2{font-family:Helvetica,Arial,sans-serif;}</style></head><body><section class="offline"><div class="offline__container"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI4MHB4IiBoZWlnaHQ9IjYwcHgiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgODAgNjAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBmaWxsPSIjQ0QxQjM4IiBwb2ludHM9IjIwLjUyNiwwLjQ1IDEsMTkuOTc3IDQwLjA1Myw1OS4wMjggNzkuMTA1LDE5Ljk3NyA1OS41NzgsMC40NSA0MC4wNTMsMTkuOTc3ICIvPgo8cG9seWdvbiBmaWxsPSIjOEYxMzI5IiBwb2ludHM9IjQwLjA1MywyMCA1OS41NzgsMzkuNTI2IDc5LjEwNSwyMCAiLz4KPC9zdmc+Cg==" alt="madewithlove logo" /><h2>Uh oh, you appear to be offline!</h2></div></section></body></html>';
self.addEventListener("fetch", function(event) {
	if (event.request.method !== 'GET' ){return;}
	event.respondWith(caches.match(event.request).then(function(cached) {
        var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
        return cached || networked;
        function fetchedFromNetwork(response) {
			var cacheCopy = response.clone();
			if(cacheCopy.type !='opaque'){
				if(cacheCopy.url.indexOf('session') <=0 && cacheCopy.url.indexOf('page/') <=0){
					caches.open(version + 'pages').then(function add(cache) {cache.put(event.request, cacheCopy);
					}).then(function(){});
				}
			}
			return response;
        }
        function unableToResolve () {
			return new Response(offlinePage, {
				status: 503,
				statusText: 'Service Unavailable',
				headers: new Headers({'Content-Type': 'text/html'})
			});
        }
	}));
});
self.addEventListener("activate", function(event) {
	event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key){return !key.startsWith(version);}).map(function (key) {
			return caches.delete(key);
		}));
	}).then(function(){}));
});
self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	var url=event.currentTarget.location.href.substring(0,event.currentTarget.location.href.length-6);
    event.waitUntil(clients.matchAll({type: 'window'}).then(function(clientList) {
        for ( var i = 0; i < clientList.length; i++ ) {
            var client = clientList[i];
            if ( client.url.indexOf(url) >=0 && 'focus' in client ) {return client.focus();}
        }
        if ( clients.openWindow ){return clients.openWindow('admin');}
    }));
});