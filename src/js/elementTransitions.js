var PageTransitions = (function($) {
  var startElement = 0,
  animEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  }

  function getTransitionPrefix() {
    var b = document.body || document.documentElement;
    var s = b.style;
    var p = 'animation';
    if(typeof s[p] == 'string')
      return 'animation';

    // Tests for vendor specific prop
    var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
    p = p.charAt(0).toUpperCase() + p.substr(1);
    for( var i=0; i<v.length; i++ ) {
      if(typeof s[v[i] + p] == 'string')
        return v[i] + p;
    }
    return false;
  }
  // animation end event name
  animEndEventName = animEndEventNames[getTransitionPrefix()];

  function init() {
    $(".et-page").each(function() {
      $(this).data('originalClassList', $(this).attr('class'));
    });
    $(".et-wrapper").each(function() {
      $(this).data('current', 0);
      $(this).data('isAnimating', false);
      $(this).children(".et-page").eq(startElement).addClass('et-page-current');
    });

    $(".et-rotate").click(function() {
      animate($(this));
    });
  }

  function animate(block, callback) {
    PageTransitions.animate(block, undefined, undefined, undefined, callback);
  }

  function animate(block, outClass, inClass, step, callback) {
    if (outClass === undefined)
      outClass = formatClass($(block).attr('et-out'));
    else
      outClass = formatClass(outClass);
    if (inClass === undefined)
      inClass  = formatClass($(block).attr('et-in'));
    else
      inClass = formatClass(inClass);

    if (step === undefined) 
      step = $(block).attr('et-step')
    
    var block    = $(block).closest('.et-wrapper')

    if (step === undefined)
      step = 1;

    block = $(block);
    var current = block.data('current'),
        $pages = block.children('.et-page'),
        pagesCount = $pages.length,
        endCurrPage = false,
        endNextPage = false;

    if(block.data('isAnimating')) {
      return false;
    }

    block.data('isAnimating', true);

    var $currPage = $pages.eq(current);
    current = current*1 + step*1;
    if (current >= pagesCount) {
      current=0;
    }

    block.data('current', current);

    var $nextPage = $pages.eq(current);

    outClass.forEach(function(c) {
      $currPage.addClass(c);
    });

    $currPage.on(animEndEventName, function() {
      $currPage.off(animEndEventName);
      endCurrPage = true;
      if(endNextPage) {
        if(jQuery.isFunction(callback)) {
          callback(block, $nextPage, $currPage);
        }
        onEndAnimation($currPage, $nextPage, block);
      }
    });

    inClass.forEach(function(c) {
      $nextPage.addClass(c);
    });
    $nextPage.addClass("et-page-current");

    $nextPage.on(animEndEventName, function() {
      $nextPage.off(animEndEventName);
      endNextPage = true;
      if(endCurrPage) {
        onEndAnimation($currPage, $nextPage, block);
      }
    });
  }

  function onEndAnimation($outpage, $inpage, block) {
    resetPage($outpage, $inpage);
    $outpage.trigger("animation.out.complete");
    $inpage.trigger("animation.in.complete");
    block.data('isAnimating', false);
  }

  function resetPage($outpage, $inpage) {
    $outpage.attr('class', $outpage.data( 'originalClassList'));
    $inpage.attr('class', $inpage.data( 'originalClassList') + ' et-page-current');
  }

  function formatClass(str) {
    var classes = str.split(" ");
    var output = [];
    for(var i=0; i<classes.length; i++){
      output.push("pt-page-" + classes[i]);
    }
    return output;
  }
  return {
    init : init,
    animate: animate
  };
})(jQuery);

jQuery(function($) {
  PageTransitions.init();
});