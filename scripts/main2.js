jQuery('document').ready(function($){
    /* Toggle active state on goals */
    var $goalIcons = $('#goals .bb');
    
    $goalIcons.click(function() {
        $(this).parents('.column-inner').toggleClass('active');
    });
    
    /* Fixed position calculating bear */
    var $window = $(window),
        $survey = $('#survey'),
        $calculatingBear = $('.calculating-bear');
    
    var fixTheBear = function() {
        var bearOriginalTop = $survey.offset().top,
            scrollTop = $window.scrollTop();
            
        if (scrollTop > bearOriginalTop && !$calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.addClass('fixed-bear');
        } else if (scrollTop <= bearOriginalTop && $calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.removeClass('fixed-bear');
        }
    };
    
    fixTheBear();
    $window.scroll(fixTheBear);
});