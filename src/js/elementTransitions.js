/*
 * elementTransitions.js
 * */
 var PageTransitions = (function($) {
  var each = function(query, callback) {
    return Array.prototype.slice.call(document.querySelectorAll(query), 0).map(callback);
  };
  String.prototype.bool = function() {
    return (/^true$/i).test(this);
  };
  var startElement = 0,
  animEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  };

  function getTransitionPrefix() {
    var b = document.body || document.documentElement;
    var s = b.style;
    var p = 'animation';
    if(typeof s[p] == 'string'){
      return 'animation';
    }

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
    each(".et-page", function(elem) {
      elem.setAttribute('originalClassList', elem.className);
    });
    each(".et-wrapper", function(elem) {
      elem.setAttribute('current', 0);
      elem.setAttribute('isAnimating', false);
      elem.querySelectorAll(".et-page")[startElement].classList.add('et-page-current');
    });
    each(".et-rotate", function(elem) {
      elem.addEventListener('click', function() {
        animate(this);
      });
    });
  }

  function animate(block, callback) {
    nextPage(block, block.getAttribute('et-out'), block.getAttribute('et-in'), callback);
  }

  function nextPage(block, outClass, inClass, callback) {
    if (block.classList.contains('et-rotate') && !block.classList.contains('et-wrapper')) {
      block = block.parentNode;
      if (!block.classList.contains('et-wrapper')) {
        block = block.parentNode;
      }
    }
    inClass = formatClass(inClass);
    outClass = formatClass(outClass);
    var current = parseInt(block.getAttribute('current'), 10),
    $pages = block.querySelectorAll('.et-page'),
    pagesCount = $pages.length,
    endCurrPage = false,
    endNextPage = false;

    if(block.getAttribute('isAnimating') && block.getAttribute('isAnimating').bool()) {
      return false;
    }

    block.setAttribute('isAnimating', true);
    var $currPage = $pages[current];
    if(current < pagesCount - 1) {
      current++;
    } else {
      current = 0;
    }

    block.setAttribute('current', current);

    var $nextPage = $pages[current];

    outClass.forEach(function(c) {
      $currPage.classList.add(c);
    });

    $currPage.addEventListener(animEndEventName, function handlecurr() {
      this.removeEventListener(animEndEventName, handlecurr);
      endCurrPage = true;
      if(endNextPage) {
        if(typeof(callback) === "function") {
          callback(block, $nextPage, this);
        }
        onEndAnimation(this, $nextPage, block);
      }
    });

    inClass.forEach(function(c) {
      $nextPage.classList.add(c);
    });
    $nextPage.classList.add('et-page-current');
    $nextPage.addEventListener(animEndEventName, function handlenext() {
      this.removeEventListener(animEndEventName, handlenext);
      endNextPage = true;
      if(endCurrPage) {
        onEndAnimation($currPage, this, block);
      }
    });
  }

  function onEndAnimation($outpage, $inpage, block) {
    resetPage($outpage, $inpage);
    block.setAttribute('isAnimating', false);
  }

  function resetPage($outpage, $inpage) {
    $inpage.className = $inpage.getAttribute('originalClassList') + ' et-page-current';
    $outpage.className = $outpage.getAttribute('originalClassList');
  }

  function formatClass(str) {
    var classes = str.split(" ");
    var output = [];
    for(var n = 0; n < classes.length; n++){
      output.push("pt-page-" + classes[n]);
    }
    return output;
  }

  return {
    init : init,
    nextPage: nextPage,
    animate: animate
  };
})(jQuery);

document.addEventListener('DOMContentLoaded', function(){
  PageTransitions.init();
});