/**
 * @module popup
 * */
define(['jquery', 'global'], function($, g){
	g.$body.on({
		showDialog: function(){
			this.className = this.className.replace('hidden', '');
		}
		, closeDialog: function(){
			this.className += ' hidden';
		}
	}, '.module-popup').on('click', '.module-popup .module_close', function(){
		$(this).parents('.module-popup').addClass('hidden');
	});
});