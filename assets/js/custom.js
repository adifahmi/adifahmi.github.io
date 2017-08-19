//Extra Log :P
console.log("%cHi! there, what are you doing here?", "background: black; color: cyan; font-size: 50pt");

//NProgress progress bar
NProgress.start();
NProgress.inc(0.2);
 $(window).load(function() {
    // Animate loader off screen
    // $(".se-pre-con").fadeOut("slow");
    NProgress.done();
});

(function($) {
// prettyPhoto
	jQuery(document).ready(function(){
		jQuery('a[data-gal]').each(function() {
			jQuery(this).attr('rel', jQuery(this).data('gal'));
		});  	
		jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({animationSpeed:'slow',theme:'light_square',slideshow:false,overlay_gallery: false,social_tools:false,deeplinking:false});
	}); 
})(jQuery);

// show scroll to top button
$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 400) {
    $('.scroll-top').removeClass('hidden');
  } else {
    $('.scroll-top').addClass('hidden');
  }
});

// jQuery CONTACT form Validation
// Wait for the DOM to be ready
(function($) {
  // Initialize form validation on the registration form.
  $("form[name='contact_form']").validate({
    // Disable autofocus on valid input
    focusInvalid: false,
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

      // disable the button then submit the form
      // $("#submit-button").attr("disabled", true);
      // form.submit();
      $.ajax({
          url: '//formspree.io/adifahmi379@gmail.com',
          method: 'POST',
          data: $(form).serialize(),
          dataType: 'json',
          beforeSend: function() {
            $("#submit-button").attr("disabled", true).val('Sending message…');
          },
          success: function(data) {
            console.log(data);
            $("#submit-button").val('Message sent!');
            $(form).trigger("reset");
            $("#contact_div").addClass('hidden');
            $("#success_div").removeClass('hidden');
          },
          error: function(err) {
            console.log(err);
            $("#submit-button").val('Ops, there was an error.');
            setTimeout(function() {
              $("#submit-button").attr('disabled', false).val('Send again');
            }, 5000);
          }
      });
      return false;
    }
  });
})(jQuery);

// jQuery SEARCH form Validation
// Wait for the DOM to be ready
(function($) {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='search_form']").validate({
    // Disable autofocus on valid input
    focusInvalid: false,
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      query: "required"
    },
    // Specify validation error messages
    messages: {
      query: "This field is required."
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
})(jQuery);
