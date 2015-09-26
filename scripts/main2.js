jQuery('document').ready(function($){
    /* Toggle active state on goals */
    var $goalIcons = $('#goals .bb');
    
    $goalIcons.click(function() {
        $(this).parents('.column-inner').toggleClass('active');
    });
});