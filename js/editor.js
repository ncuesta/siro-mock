jQuery(function($) {
  'use strict';

  // Calculate and return the height to be set to the $container.
  function calculateHeight(parent, siblings) {
    var height = 0;

    $.each(siblings, function() { height += $(this).outerHeight(); });

    return parent.outerHeight() - height;
  }

  // Resizing plugin that keeps an element as tall as its parent (or the window).
  function heighten(selector, relativeToWindow) {
    var $element = $(selector),
      parent     = $element.parent(),
      siblings   = parent.children(':not(' + selector + ', script)'),
      $window    = $(window),
      referent   = relativeToWindow ? $window : parent,
      setHeight;

    if ($element.is('canvas')) {
      setHeight = function() {
        $element.get(0).height = calculateHeight(referent, siblings);
      };
    } else {
      setHeight = function() {
        $element.height(calculateHeight(referent, siblings));
      };
    }

    // Register the event listener for the window resize
    $window.on('resize', setHeight);

    // Initially set the height of the container element
    setHeight();
  }

  // Resizing plugin that keeps an element as wide as its parent (or the window).
  function widen(selector, referent) {
    var $element = $(selector),
      $window    = $(window),
      setWidth;

    if ($element.is('canvas')) {
      setWidth = function() {
        $element.get(0).width = referent.width();
      };
    } else {
      setWidth = function() {
        $element.width(referent.width());
      };
    }

    // Register the event listener for the window resize
    $window.on('resize', setWidth);

    // Initially set the height of the container element
    setWidth();
  }

  var $w = $(window);

  // Set an initial height for the simulator to avoid miscalculations
  document.getElementById('simulator').height = $w.height() / 2;

  heighten('#editor-container', true);
  widen('#simulator', $w);
  heighten('#simulator', true);

  // Initialize CodeMirror
  CodeMirror.fromTextArea(document.getElementById('editor-code'), {
    theme: 'monokai',
    tabSize: 2,
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
  });

  // Fiddle on the simulator (will be a separate thing)
  (function() {
    var canvas = document.getElementById('simulator');

    var r  = 20,
      x    = 100,  // x coordinate from circle
      incx = 10,   // x increments by
      y    = 100,  // y coordinate from circle
      incy = 10,   // y increments by
      int  = 20,   // Interval (in ms)
      cfs  = true, // Whether a new fillStyle should be generated
      fs;

    function genFillStyle() {
      return 'rgba('
        + Math.ceil(Math.random() * 255)
        + ', '
        + Math.ceil(Math.random() * 255)
        + ', '
        + Math.ceil(Math.random() * 255)
        + ', 1)';
    }

    function draw(){
      var ctx = canvas.getContext('2d');

      fs  = cfs ? genFillStyle() : fs;
      cfs = false;

      ctx.fillStyle = fs;
      ctx.strokeStyle = '#000';

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the ball
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.fill();

      // Increases ball coordinates
      x += incx;
      y += incy;

      // Check limits to make bounce
      if ((x > canvas.width - r) && (incx > 0)) {
        incx = -10;
        cfs = true;
      }
      if ((y > canvas.height - r) && (incy > 0)) {
        incy = -10;
        cfs = true;
      }
      if ((x < r) && (incx < 0)) {
        incx = 10;
        cfs = true;
      }
      if ((y < r) && (incy < 0)) {
        incy = 10;
        cfs = true;
      }
    }

    setInterval(draw, int);
  })();
});