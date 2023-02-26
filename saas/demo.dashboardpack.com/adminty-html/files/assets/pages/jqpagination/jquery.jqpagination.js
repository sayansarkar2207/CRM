/*!
* jqPagination, a jQuery pagination plugin (obviously)
* Version: 1.4 (26th July 2013)
*
* Copyright (C) 2013 Ben Everard
*
* http://beneverard.github.com/jqPagination
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*
*/(function($){"use strict";$.jqPagination=function(el,options){var base=this;base.$el=$(el);base.el=el;base.$input=base.$el.find('input');base.$el.data("jqPagination",base);base.init=function(){base.options=$.extend({},$.jqPagination.defaultOptions,options);if(base.options.max_page===null){if(base.$input.data('max-page')!==undefined){base.options.max_page=base.$input.data('max-page');}else{base.options.max_page=1;}}
if(base.$input.data('current-page')!==undefined&&base.isNumber(base.$input.data('current-page'))){base.options.current_page=base.$input.data('current-page');}
base.$input.removeAttr('readonly');base.updateInput(true);base.$input.on('focus.jqPagination mouseup.jqPagination',function(event){if(event.type==='focus'){var current_page=parseInt(base.options.current_page,10);$(this).val(current_page).select();}
if(event.type==='mouseup'){return false;}});base.$input.on('blur.jqPagination keydown.jqPagination',function(event){var $self=$(this),current_page=parseInt(base.options.current_page,10);if(event.keyCode===27){$self.val(current_page);$self.blur();}
if(event.keyCode===13){$self.blur();}
if(event.type==='blur'){base.setPage($self.val());}});base.$el.on('click.jqPagination','a',function(event){var $self=$(this);if($self.hasClass('disabled')){return false;}
if(!event.metaKey&&!event.ctrlKey){event.preventDefault();base.setPage($self.data('action'));}});};base.setPage=function(page,prevent_paged){if(page===undefined){return base.options.current_page;}
var current_page=parseInt(base.options.current_page,10),max_page=parseInt(base.options.max_page,10);if(isNaN(parseInt(page,10))){switch(page){case 'first':page=1;break;case 'prev':case 'previous':page=current_page-1;break;case 'next':page=current_page+1;break;case 'last':page=max_page;break;}}
page=parseInt(page,10);if(isNaN(page)||page<1||page>max_page){base.setInputValue(current_page);return false;}
base.options.current_page=page;base.$input.data('current-page',page);base.updateInput(prevent_paged);};base.setMaxPage=function(max_page,prevent_paged){if(max_page===undefined){return base.options.max_page;}
if(!base.isNumber(max_page)){console.error('jqPagination: max_page is not a number');return false;}
if(max_page<base.options.current_page){console.error('jqPagination: max_page lower than current_page');return false;}
base.options.max_page=max_page;base.$input.data('max-page',max_page);base.updateInput(prevent_paged);};base.updateInput=function(prevent_paged){var current_page=parseInt(base.options.current_page,10);base.setInputValue(current_page);base.setLinks(current_page);if(prevent_paged!==true){base.options.paged(current_page);}};base.setInputValue=function(page){var page_string=base.options.page_string,max_page=base.options.max_page;page_string=page_string.replace("{current_page}",page).replace("{max_page}",max_page);base.$input.val(page_string);};base.isNumber=function(n){return!isNaN(parseFloat(n))&&isFinite(n);};base.setLinks=function(page){var link_string=base.options.link_string,current_page=parseInt(base.options.current_page,10),max_page=parseInt(base.options.max_page,10);if(link_string!==''){var previous=current_page-1;if(previous<1){previous=1;}
var next=current_page+1;if(next>max_page){next=max_page;}
base.$el.find('a.first').attr('href',link_string.replace('{page_number}','1'));base.$el.find('a.prev, a.previous').attr('href',link_string.replace('{page_number}',previous));base.$el.find('a.next').attr('href',link_string.replace('{page_number}',next));base.$el.find('a.last').attr('href',link_string.replace('{page_number}',max_page));}
base.$el.find('a').removeClass('disabled');if(current_page===max_page){base.$el.find('.next, .last').addClass('disabled');}
if(current_page===1){base.$el.find('.previous, .first').addClass('disabled');}};base.callMethod=function(method,key,value){switch(method.toLowerCase()){case 'option':if(value===undefined&&typeof key!=="object"){return base.options[key];}
var options={'trigger':true},result=false;if($.isPlainObject(key)&&!value){$.extend(options,key)}
else{options[key]=value;}
var prevent_paged=(options.trigger===false);if(options.current_page!==undefined){result=base.setPage(options.current_page,prevent_paged);}
if(options.max_page!==undefined){result=base.setMaxPage(options.max_page,prevent_paged);}
if(result===false)console.error('jqPagination: cannot get / set option '+key);return result;break;case 'destroy':base.$el.off('.jqPagination').find('*').off('.jqPagination');break;default:console.error('jqPagination: method "'+method+'" does not exist');return false;}};base.init();};$.jqPagination.defaultOptions={current_page:1,link_string:'',max_page:null,page_string:'Page {current_page} of {max_page}',paged:function(){}};$.fn.jqPagination=function(){var self=this,$self=$(self),args=Array.prototype.slice.call(arguments),result=false;if(typeof args[0]==='string'){if(args[2]===undefined){result=$self.first().data('jqPagination').callMethod(args[0],args[1]);}else{$self.each(function(){result=$(this).data('jqPagination').callMethod(args[0],args[1],args[2]);});}
return result;}
self.each(function(){(new $.jqPagination(this,args[0]));});};})(jQuery);if(!console){var console={},func=function(){return false;};console.log=func;console.info=func;console.warn=func;console.error=func;}