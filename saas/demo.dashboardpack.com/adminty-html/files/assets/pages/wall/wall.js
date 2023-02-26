'use strict';$(document).ready(function(){$('#post-new').hide();$('#post-message').keyup(function(){if(($(this).val()!="")){$('#post-new').show();}else
$('#post-new').hide();});});