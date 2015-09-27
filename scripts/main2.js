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
            bearHeight = $calculatingBear.find('.calculating-bear-inner-inner').height(),
            surveyBottom = bearOriginalTop + $survey.outerHeight(),
            scrollTop = $window.scrollTop(),
            threshold = scrollTop + bearHeight + 60;
            
        if (scrollTop > bearOriginalTop && !$calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.addClass('fixed-bear');
        } else if (scrollTop <= bearOriginalTop && $calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.removeClass('fixed-bear');
        }
        
        if (threshold > surveyBottom) {
            $calculatingBear.css({
                'position': 'absolute',
                'bottom': bearHeight,
                'top': 'auto'
            });
        } else {
            $calculatingBear.removeAttr('style');
        }
    };
    
    fixTheBear();
    $window.scroll(fixTheBear);
});