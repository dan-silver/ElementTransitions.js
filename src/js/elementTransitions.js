
/*
  elementTransitions.js
*/
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
    v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
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
      animate($(this), 0);
    });

    $(".et-back").click(function () {
        animate($(this), 1);
    });
  }

  function animate(block, direction, callback) {
      if (direction === 0) {
          nextPage($(block).closest('.et-wrapper'), $(block).attr('et-out'), $(block).attr('et-in'), callback);
      }
      else {
          prevtPage($(block).closest('.et-wrapper'), $(block).attr('et-out'), $(block).attr('et-in'), callback);
      }
  }

  function prevtPage(block, outClass, inClass, callback) {
      block = $(block);
      inClass = formatClass(inClass);
      outClass = formatClass(outClass);
      var current = block.data('current'),
          $pages = block.children('.et-page'),
          pagesCount = $pages.length,
          endCurrPage = false,
          endNextPage = false;

      if (block.data('isAnimating')) {
          return false;
      }

      block.data('isAnimating', true);

      var $currPage = $pages.eq(current);
      if (current > 0) {
          current--;
      }
      else {
          current = pagesCount;
      }
      block.data('current', current);

      var $prevPage = $pages.eq(current).addClass('et-page-current');

      $currPage.addClass(outClass).on(animEndEventName, function () {
          $currPage.off(animEndEventName);
          endCurrPage = true;
          if (endNextPage) {
              if (jQuery.isFunction(callback)) {
                  callback(block, $prevPage, $currPage);
              }
              onEndAnimation($currPage, $prevPage, block);
          }
      });

      $prevPage.addClass(inClass).on(animEndEventName, function () {
          $prevPage.off(animEndEventName);
          endNextPage = true;
          if (endCurrPage) {
              onEndAnimation($currPage, $prevPage, block);
          }
      });
  }

  function nextPage(block, outClass, inClass, callback) {
    block = $(block);
    inClass = formatClass(inClass);
    outClass = formatClass(outClass);
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
    if(current < pagesCount - 1) {
      current++;
    }
    else {
      current = 0;
    }
    block.data('current', current);

    var $nextPage = $pages.eq(current).addClass('et-page-current');

    $currPage.addClass(outClass).on(animEndEventName, function() {
      $currPage.off(animEndEventName);
      endCurrPage = true;
      if(endNextPage) {
        if(jQuery.isFunction(callback)) {
          callback(block, $nextPage, $currPage);
        }
        onEndAnimation($currPage, $nextPage, block);
      }
    });

    $nextPage.addClass(inClass).on(animEndEventName, function() {
      $nextPage.off(animEndEventName);
      endNextPage = true;
      if(endCurrPage) {
        onEndAnimation($currPage, $nextPage, block);
      }
    });
  }

  function onEndAnimation($outpage, $inpage, block) {
    resetPage($outpage, $inpage);
    block.data('isAnimating', false);
  }

  function resetPage($outpage, $inpage) {
    $outpage.attr('class', $outpage.data( 'originalClassList'));
    $inpage.attr('class', $inpage.data( 'originalClassList') + ' et-page-current');
  }

  function formatClass(str) {
    classes = str.split(" ");
    output = "";
    for(var n=0; n<classes.length; n++){
      output += " pt-page-" + classes[n];
    }
    return output;
  }
  return {
    init : init,
    nextPage: nextPage,
    animate: animate
  };
})(jQuery);

jQuery(function($) {
  PageTransitions.init();
});
