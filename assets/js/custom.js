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

// jQuery for page scrolling feature
$('a[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
})(jQuery);

//jQuery form Validation
// Wait for the DOM to be ready
$(function() {
  // Initialize form validation on the registration form.
  $("form[name='contact_form']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      name: "required",
      email: {
        required: true,
        email: true
      },
      subject: "required",
      message: "required"
    },
    // Specify validation error messages
    messages: {
      name: "This field is required.",
      subject: "This field is required.",
      subject: "This field is required.",
      email: {
        required: "This field is required.",
        email: "Please enter a valid email address."
      }
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
});
