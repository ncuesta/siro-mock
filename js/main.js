jQuery(function($) {
  // Add `.with-navbar` to the body if the top navbar is present
  if ($('body > .navbar-fixed-top').length > 0) {
    $('body').addClass('with-navbar');
  }
});