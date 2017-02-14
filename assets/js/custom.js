(function($) {

// prettyPhoto
	jQuery(document).ready(function(){
		jQuery('a[data-gal]').each(function() {
			jQuery(this).attr('rel', jQuery(this).data('gal'));
		});  	
		jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({animationSpeed:'slow',theme:'light_square',slideshow:false,overlay_gallery: false,social_tools:false,deeplinking:false});
	}); 

		
})(jQuery);
// Pre loader script
//paste this code under head tag or in a seperate js file.
// Wait for window load
$(window).load(function() {
	// Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});