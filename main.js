$(function () {
  // # Smooth scroll to target
  $('a[data-anchor]').click(function(e) {
    e.preventDefault();
    const _target = this.href;
    if (!_target) return;

    // fix me!
    $('#quickLinks').addClass("_sticky");

    $('html, body').animate({scrollTop: $(_target.substring(_target. indexOf('#'))).offset().top}, 1600);
  });
});