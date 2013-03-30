jQuery(function($) {
  'use strict';

  var $gravatar = $('#gravatar'),
    $context = $('body'),
    size = (function(s) { return s ? 's=' + s : null })($gravatar.data('gravatar-size')),
    options = '?d=retro' + (size ? '&' + size : ''),
    GRAVATAR_URL = 'http://gravatar.com/avatar/';

  $context.on('change.gravatar', ':input[data-gravatar]', function() {
    var $this = $(this),
      hash = md5($this.val());

    $gravatar.attr('src', GRAVATAR_URL + hash + options);
  });

  $(':input[data-gravatar]').trigger('change');
});