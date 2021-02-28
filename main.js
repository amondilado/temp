$(function () {
  // # Quick links sticky navigation
  const _doc = document;
  const quickLinks = _doc.getElementById('quickLinks');
  if (!quickLinks) return;

  const ql_thresholdOffset = quickLinks.offsetHeight;
  const ql_scrollOffset = ql_thresholdOffset + 32; // Set average sections bottom spacing
  const ql_threshold = ql_thresholdOffset + quickLinks.offsetTop;
  const ql_anchors = Array.prototype.slice.call(_doc.querySelectorAll('a[data-anchor]'));
  const ql_targets = [];
  let currentNode = null
  let lastKnownScrollPosition = 0;
  let ticking = false;

  // Lazy loading images
  var lazyLoadInstance = new LazyLoad();

  // Smooth scroll to target "polyfill"
  const supportsSmoothScrolling = getComputedStyle(_doc.body).scrollBehavior === 'smooth';

  function anchorsClickHandler(e) {
    e.preventDefault();
    const hash = e.target.hash.substr(1);

    if (!hash) return;

    const elem = $('#'+hash);
    elem.length > 0 && $('html, body').animate({scrollTop: elem.offset().top - ql_scrollOffset}, 1600);
  }

  // Get anchor's target nodes
  ql_anchors.map(function(anchor) {
    const hash = anchor.hash.substr(1);
    const node = hash && _doc.getElementById(hash);
    node && ql_targets.push(node);

    // Add event listeners
    !supportsSmoothScrolling && anchor.addEventListener('click', anchorsClickHandler);
  });

  // Scroll handler
  function ql_scrollHandler(pos) {
    const isSticky = quickLinks.classList.contains('_sticky');

    // Set sticky state to quickLinks nav
    if (pos < ql_threshold - ql_thresholdOffset) {
      if (isSticky) {
        quickLinks.classList.remove('_sticky');
        currentNode && currentNode.classList.remove('active')
        currentNode = null;
      }

    } else {
      !isSticky && quickLinks.classList.add('_sticky');
    }

    // Set active state to links
    ql_targets.map(function(node) {
      if (ql_threshold < pos && pos > (node.offsetTop + node.offsetHeight)) {
        const cur = ql_anchors.filter(function(anchor) {
          return anchor.href.indexOf(node.id) !== -1
        });

        const current = cur.length > 0 && cur[cur.length - 1];

        if (!current || currentNode === current) {
          return;
        }

        currentNode && currentNode.classList.remove('active');
        currentNode = current;
        currentNode.classList.add('active');
      }
    });
  }

  // Add scroll handler in raf, use jQuery to avoid conflicts
  $(window).scroll(function() {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        ql_scrollHandler(lastKnownScrollPosition);
        ticking = false;
      });

      ticking = true;
    }
  });
});