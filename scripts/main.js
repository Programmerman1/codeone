var load = function () {
    console.log('hi folks');
    adviceLink = '';
}();
var adjustAmount = function (event, targetFieldId) {
    event = event || window.event;
    var field = document.getElementById(targetFieldId);
    //get button value
    var amount = parseInt((event.target || event.srcElement).dataset.amount);
    field.value = (parseInt(field.value) || 0) + amount;
    if (field.value < 0) field.value = 0;
    event.stopPropagation();
};

var submitSurvey = function () {
    console.log('submit to the budget bear. SUBMIT!');
    var input = GatherInput();
    var decide = MakeDecision(input);
    console.log('budget bear picked for you the berry (bear-y) best pick');
    console.log('decision time! ' + JSON.stringify(decide));
    
    // Add icons
    for (var i = 0; i < decide.GoalOrder.length; i++) {
        $('.recommendation' + (i+1)).removeClass(function(index, css) {
            return (css.match (/bb\-[\w\-]+/g) || []).join(' ');
        }).addClass(getRecommendationClass(decide.GoalOrder[i]));
    }
    
    // Add primary goal headline and details
    $('#lblPrimaryGoal').text(prettyGoal(decide.PrimaryGoal));
    $('#lblPrimaryGoalExplanation').html(getExplanation(decide).PrimaryGoalExplanation);
    
    // Add secondary goal headline and details
    $('#lblSecondaryGoal').text(prettyGoal(decide.SecondaryGoal));
    $('#lblSecondaryGoalExplanation').html(getExplanation(decide).SecondaryGoalExplanation);
    
    // Highlight goals in results table
    $('.result-table-icon').removeClass('active');
    
    for (var i = 0; i < decide.OriginalInput.Goals.length; i++) {
        $('.result-table-icon-' + Goal[decide.OriginalInput.Goals[i]].toLowerCase()).addClass('active');
    }
    
    // Fill in table
    $('#resultAnnual').text('$' + decide.AnnualIncome);
    $('#resultMonthly').text('$' + decide.MonthlyIncome);
    $('#resultRetirement').text('$' + decide.OriginalInput.RetirementSavings);
    $('#resultSavings').text('$' + decide.OriginalInput.OtherSavings);
    $('#resultHomeMonth').text('$' + decide.OriginalInput.Home.Payment + ' / ' + (decide.OriginalInput.Home.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
    $('#resultHomeTotal').text((decide.OriginalInput.Home.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.Home.TotalOwed : 'N/A');
    
    if (decide.OriginalInput.Car.IsOwned) {
        $('#resultCarMonth').text('$' + decide.OriginalInput.Car.Payment + ' / ' + (decide.OriginalInput.Car.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultCarTotal').text((decide.OriginalInput.Car.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.Car.TotalOwed : 'N/A');
    } else {
        $('#resultCarMonth').text('N/A');
        $('#resultCarTotal').text('N/A');
    }
    
    if (decide.OriginalInput.College.IsOwned) {
        $('#resultCollegeMonth').text('$' + decide.OriginalInput.College.Payment + ' / ' + (decide.OriginalInput.College.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultCollegeTotal').text((decide.OriginalInput.College.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.College.TotalOwed : 'N/A');
    } else {
        $('#resultCollegeMonth').text('N/A');
        $('#resultCollegeTotal').text('N/A');
    }
    
    if (decide.OriginalInput.OtherDebts.IsOwned) {
        $('#resultLoansMonth').text('$' + decide.OriginalInput.OtherDebts.Payment + ' / ' + (decide.OriginalInput.OtherDebts.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultLoansTotal').text((decide.OriginalInput.OtherDebts.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.OtherDebts.TotalOwed : 'N/A');
    } else {
        $('#resultLoansMonth').text('N/A');
        $('#resultLoansTotal').text('N/A');
    }
    
    $('#resultMonthExp').text('$' + decide.MonthlyExpenses + ' / ' + ((decide.MonthlyExpenses / decide.MonthlyIncome) * 100.0).toFixed(2) + '%');

    $('#resultUtilityMonth').text('$' + $('#numUtilities').val());
    $('#resultPhoneMonth').text('$' + $('#numPhone').val());
    $('#resultInternetMonth').text('$' + $('#numInternet').val());
    $('#resultTVMonth').text('$' + $('#numTV').val());
    $('#resultInsuranceMonth').text('$' + $('#numInsurance').val());
    $('#resultMiscMonth').text('$' + $('#numMisc').val());
    
    // Add class to body to show/hide appropriate sections
    $('body').addClass('results');
    window.scrollTo(0,0);
    
    // Set Twitter link
    adviceLink = getTweetLink('Budget Bear looked at my budget and thinks I should focus on my ' + prettyGoal(decide.PrimaryGoal) + '.', 'http://budgetbear.azurewebsites.net/', 'CodeOneOmaha,DontArgueWithTheBear');
    
    return false;
};

function getTweetLink(message, url, hashtags) {
    return "https://twitter.com/intent/tweet?text=" + encodeURI(message) + "&url=" + encodeURI(url) + "&hashtags=" + encodeURI(hashtags);
}

$('#btnBack').click(function () {
    $('body').removeClass('results');
    location.hash = "#goals";
    return false;
});

$('#btnPrint').click(function () {
    window.print();
});

$('#btnTweet').click(function () {
    window.open(adviceLink, '_blank');
    return false;
})

$('input[type="radio"]').click(function () {
    var controlClass = this.dataset.toggle;
    if (controlClass != null) {
        if ($(this).val() == "true")
            $('.' + controlClass).show("slow");
        else
            $('.' + controlClass).hide("slow");
    }
});

/* Toggle active state on goals */
var $goalIcons = $('#goals .bb');

$goalIcons.click(function() {
    $(this).parents('.column-inner').toggleClass('active');
});

jQuery('document').ready(function($) {
    /* Fixed position calculating bear */
    var $window = $(window),
        $survey = $('#survey'),
        $calculatingBear = $('.calculating-bear');
    
    var fixTheBear = function() {
        var surveyTop = $survey.offset().top + parseInt($survey.css('padding-top')),
            bearHeight = $('.calculating-bear').outerHeight(),
            surveyBottom = $survey.offset().top + $survey.height() + parseInt($survey.css('padding-bottom')),
            scrollTop = $window.scrollTop(),
            bearScrollBottom = scrollTop + bearHeight;
        
        // If the user has scrolled past the top of the survey, fix the bear so
        // he scrolls with the user. Else, let him stay where he usually is.
        if (scrollTop > surveyTop && !$calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.addClass('fixed-bear');
        } else if (scrollTop <= surveyTop && $calculatingBear.hasClass('fixed-bear')) {
            $calculatingBear.removeClass('fixed-bear');
        }
        
        // If the user scrolls past the bottom of the survey, make sure the
        // bear stops at the bottom of the survey and doesn't, say, keep going
        // into the footer.
        if (bearScrollBottom >= surveyBottom && !$calculatingBear.hasClass('end-bear')) {
            $calculatingBear.addClass('end-bear');
        } else if (bearScrollBottom < surveyBottom && $calculatingBear.hasClass('end-bear')) {
            $calculatingBear.removeClass('end-bear');
        }
    };
    
    fixTheBear();
    $window.on('scroll resize', fixTheBear);
});
