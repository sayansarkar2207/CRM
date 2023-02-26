/*!
* stroll.js 1.2 - CSS scroll effects
* http://lab.hakim.se/scroll-effects
* MIT licensed
*
* Copyright (C) 2012 Hakim El Hattab, http://hakim.se
*/(function(){"use strict";var LIVE_INTERVAL=500;var IS_TOUCH_DEVICE=!!('ontouchstart'in window);var lists=[];var active=false;function refresh(){if(active){requestAnimFrame(refresh);for(var i=0,len=lists.length;i<len;i++){lists[i].update();}}}
function add(element,options){if(!element.nodeName||/^(ul|ol)$/i.test(element.nodeName)===false){return false;}
else if(contains(element)){remove(element);}
var list=IS_TOUCH_DEVICE?new TouchList(element):new List(element);if(options&&options.live){list.syncInterval=setInterval(function(){list.sync.call(list);},LIVE_INTERVAL);}
list.sync();lists.push(list);if(lists.length===1){active=true;refresh();}}
function remove(element){for(var i=0;i<lists.length;i++){var list=lists[i];if(list.element==element){list.destroy();lists.splice(i,1);i--;}}
if(lists.length===0){active=false;}}
function contains(element){for(var i=0,len=lists.length;i<len;i++){if(lists[i].element==element){return true;}}
return false;}
function batch(target,method,options){var i,len;if(typeof target==='string'){var targets=document.querySelectorAll(target);for(i=0,len=targets.length;i<len;i++){method.call(null,targets[i],options);}}
else if(typeof target==='object'&&typeof target.length==='number'){for(i=0,len=target.length;i<len;i++){method.call(null,target[i],options);}}
else if(target.nodeName){method.call(null,target,options);}
else{throw 'Stroll target was of unexpected type.';}}
function isCapable(){return!!document.body.classList;}
function List(element){this.element=element;}
List.prototype.sync=function(){this.items=Array.prototype.slice.apply(this.element.children);this.listHeight=this.element.offsetHeight;for(var i=0,len=this.items.length;i<len;i++){var item=this.items[i];item._offsetHeight=item.offsetHeight;item._offsetTop=item.offsetTop;item._offsetBottom=item._offsetTop+item._offsetHeight;item._state='';}
this.update(true);}
List.prototype.update=function(force){var scrollTop=this.element.pageYOffset||this.element.scrollTop,scrollBottom=scrollTop+this.listHeight;if(scrollTop!==this.lastTop||force){this.lastTop=scrollTop;for(var i=0,len=this.items.length;i<len;i++){var item=this.items[i];if(item._offsetBottom<scrollTop){if(item._state!=='past'){item._state='past';item.classList.add('past');item.classList.remove('future');}}
else if(item._offsetTop>scrollBottom){if(item._state!=='future'){item._state='future';item.classList.add('future');item.classList.remove('past');}}
else if(item._state){if(item._state==='past')item.classList.remove('past');if(item._state==='future')item.classList.remove('future');item._state='';}}}}
List.prototype.destroy=function(){clearInterval(this.syncInterval);for(var j=0,len=this.items.length;j<len;j++){var item=this.items[j];item.classList.remove('past');item.classList.remove('future');}}
function TouchList(element){this.element=element;this.element.style.overflow='hidden';this.top={value:0,natural:0};this.touch={value:0,offset:0,start:0,previous:0,lastMove:Date.now(),accellerateTimeout:-1,isAccellerating:false,isActive:false};this.velocity=0;}
TouchList.prototype=new List();TouchList.prototype.sync=function(){this.items=Array.prototype.slice.apply(this.element.children);this.listHeight=this.element.offsetHeight;var item;for(var i=0,len=this.items.length;i<len;i++){item=this.items[i];item._offsetHeight=item.offsetHeight;item._offsetTop=item.offsetTop;item._offsetBottom=item._offsetTop+item._offsetHeight;item._state='';item.style.opacity=1;}
this.top.natural=this.element.scrollTop;this.top.value=this.top.natural;this.top.max=item._offsetBottom-this.listHeight;this.update(true);this.bind();}
TouchList.prototype.bind=function(){var scope=this;this.touchStartDelegate=function(event){scope.onTouchStart(event);};this.touchMoveDelegate=function(event){scope.onTouchMove(event);};this.touchEndDelegate=function(event){scope.onTouchEnd(event);};this.element.addEventListener('touchstart',this.touchStartDelegate,false);this.element.addEventListener('touchmove',this.touchMoveDelegate,false);this.element.addEventListener('touchend',this.touchEndDelegate,false);}
TouchList.prototype.onTouchStart=function(event){event.preventDefault();if(event.touches.length===1){this.touch.isActive=true;this.touch.start=event.touches[0].clientY;this.touch.previous=this.touch.start;this.touch.value=this.touch.start;this.touch.offset=0;if(this.velocity){this.touch.isAccellerating=true;var scope=this;this.touch.accellerateTimeout=setTimeout(function(){scope.touch.isAccellerating=false;scope.velocity=0;},500);}
else{this.velocity=0;}}}
TouchList.prototype.onTouchMove=function(event){if(event.touches.length===1){var previous=this.touch.value;this.touch.value=event.touches[0].clientY;this.touch.lastMove=Date.now();var sameDirection=(this.touch.value>this.touch.previous&&this.velocity<0)||(this.touch.value<this.touch.previous&&this.velocity>0);if(this.touch.isAccellerating&&sameDirection){clearInterval(this.touch.accellerateTimeout);this.velocity+=(this.touch.previous-this.touch.value)/10;}
else{this.velocity=0;this.touch.isAccellerating=false;this.touch.offset=Math.round(this.touch.start-this.touch.value);}
this.touch.previous=previous;}}
TouchList.prototype.onTouchEnd=function(event){var distanceMoved=this.touch.start-this.touch.value;if(!this.touch.isAccellerating){this.velocity=(this.touch.start-this.touch.value)/10;}
if(Date.now()-this.touch.lastMove>200||Math.abs(this.touch.previous-this.touch.value)<5){this.velocity=0;}
this.top.value+=this.touch.offset;this.touch.offset=0;this.touch.start=0;this.touch.value=0;this.touch.isActive=false;this.touch.isAccellerating=false;clearInterval(this.touch.accellerateTimeout);if(Math.abs(this.velocity)>4||Math.abs(distanceMoved)>10){event.preventDefault();}};TouchList.prototype.update=function(force){var scrollTop=this.top.value+this.velocity+this.touch.offset;if(this.velocity||this.touch.offset){this.element.scrollTop=scrollTop;scrollTop=Math.max(0,Math.min(this.element.scrollTop,this.top.max));this.top.value=scrollTop-this.touch.offset;}
if(!this.touch.isActive||this.touch.isAccellerating){this.velocity*=0.95;}
if(Math.abs(this.velocity)<0.15){this.velocity=0;}
if(scrollTop!==this.top.natural||force){this.top.natural=scrollTop;this.top.value=scrollTop-this.touch.offset;var scrollBottom=scrollTop+this.listHeight;for(var i=0,len=this.items.length;i<len;i++){var item=this.items[i];if(item._offsetBottom<scrollTop){if(this.velocity<=0&&item._state!=='past'){item.classList.add('past');item._state='past';}}
else if(item._offsetTop>scrollBottom){if(this.velocity>=0&&item._state!=='future'){item.classList.add('future');item._state='future';}}
else if(item._state){if(item._state==='past')item.classList.remove('past');if(item._state==='future')item.classList.remove('future');item._state='';}}}};TouchList.prototype.destroy=function(){List.prototype.destroy.apply(this);this.element.removeEventListener('touchstart',this.touchStartDelegate,false);this.element.removeEventListener('touchmove',this.touchMoveDelegate,false);this.element.removeEventListener('touchend',this.touchEndDelegate,false);}
window.stroll={bind:function(target,options){if(isCapable()){batch(target,add,options);}},unbind:function(target){if(isCapable()){batch(target,remove);}}}
window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})()})();