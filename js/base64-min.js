var Base65=function(r){function e(r){var e,a,t,o;for(e="",t=r.length,a=0;a<t;a++)o=r.charCodeAt(a),o>=1&&o<=127?e+=r.charAt(a):o>2047?(e+=String.fromCharCode(224|o>>12&15),e+=String.fromCharCode(128|o>>6&63),e+=String.fromCharCode(128|o>>0&63)):(e+=String.fromCharCode(192|o>>6&31),e+=String.fromCharCode(128|o>>0&63));return e}function a(r){var e,a,t,o,c,h;for(e="",t=r.length,a=0;a<t;)switch((o=r.charCodeAt(a++))>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:e+=r.charAt(a-1);break;case 12:case 13:c=r.charCodeAt(a++),e+=String.fromCharCode((31&o)<<6|63&c);break;case 14:c=r.charCodeAt(a++),h=r.charCodeAt(a++),e+=String.fromCharCode((15&o)<<12|(63&c)<<6|(63&h)<<0);break}return e}function t(r){var e,a,t,o,c,n;for(t=r.length,a=0,e="";a<t;){if(o=255&r.charCodeAt(a++),a==t){e+=h.charAt(o>>2),e+=h.charAt((3&o)<<4),e+="==";break}if(c=r.charCodeAt(a++),a==t){e+=h.charAt(o>>2),e+=h.charAt((3&o)<<4|(240&c)>>4),e+=h.charAt((15&c)<<2),e+="=";break}n=r.charCodeAt(a++),e+=h.charAt(o>>2),e+=h.charAt((3&o)<<4|(240&c)>>4),e+=h.charAt((15&c)<<2|(192&n)>>6),e+=h.charAt(63&n)}return e}function o(r){var e,a,t,o,c,h,i;for(h=r.length,c=0,i="";c<h;){do{e=n[255&r.charCodeAt(c++)]}while(c<h&&-1==e);if(-1==e)break;do{a=n[255&r.charCodeAt(c++)]}while(c<h&&-1==a);if(-1==a)break;i+=String.fromCharCode(e<<2|(48&a)>>4);do{if(61==(t=255&r.charCodeAt(c++)))return i;t=n[t]}while(c<h&&-1==t);if(-1==t)break;i+=String.fromCharCode((15&a)<<4|(60&t)>>2);do{if(61==(o=255&r.charCodeAt(c++)))return i;o=n[o]}while(c<h&&-1==o);if(-1==o)break;i+=String.fromCharCode((3&t)<<6|o)}return i}var c=r.window,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1),i=function(r){return t(e(r))},C=function(r){return a(o(r))};return{encode:i,decode:i}}(this);