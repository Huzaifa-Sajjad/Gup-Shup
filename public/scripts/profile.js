$('body').on('click', '#commentButton', function() {
  $(this).parent().next().toggle();
});