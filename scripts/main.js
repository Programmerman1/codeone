var load = function () {
    console.log('hi folks');
    $('.toggleMortgage').hide();
    $('.toggleCar').hide();
    $('.toggleCollege').hide();
    $('.toggleLoans').hide();
    $('#results').hide();
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

    $('#primaryRecommendation').removeClass().addClass(getRecommendationClass(decide.PrimaryGoal));

    $('#lblPrimaryGoal').text(prettyGoal(decide.PrimaryGoal));
    $('#lblPrimaryGoalExplanation').empty().append(getExplanation(decide).PrimaryGoalExplanation);

    $('#secondRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[1]));
    $('#lblSecondaryGoal').text(prettyGoal(decide.GoalOrder[1]));
    $('#lblSecondaryGoalExplanation').empty().append(getExplanation(decide).SecondaryGoalExplanation);

    $('#thirdRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[2]));
    $('#fourthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[3]));
    $('#fifthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[4]));
    $('#sixthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[5]));

    $('#resultGoalHome').removeClass('active');
    $('#resultGoalCar').removeClass('active');
    $('#resultGoalCollege').removeClass('active');
    $('#resultGoalVacation').removeClass('active');
    $('#resultGoalRetirement').removeClass('active');
    if (decide.OriginalInput.Goals.indexOf(Goal.Home) > -1)
        $('#resultGoalHome').addClass('active');
    if (decide.OriginalInput.Goals.indexOf(Goal.Car) > -1)
        $('#resultGoalCar').addClass('active');
    if (decide.OriginalInput.Goals.indexOf(Goal.College) > -1)
        $('#resultGoalCollege').addClass('active');
    if (decide.OriginalInput.Goals.indexOf(Goal.Vacation) > -1)
        $('#resultGoalVacation').addClass('active');
    if (decide.OriginalInput.Goals.indexOf(Goal.Retirement) > -1)
        $('#resultGoalRetirement').addClass('active');
    $('#resultAnnual').text('$' + decide.AnnualIncome);
    $('#resultMonthly').text('$' + decide.MonthlyIncome);
    $('#resultRetirement').text('$' + decide.OriginalInput.RetirementSavings);
    $('#resultSavings').text('$' + decide.OriginalInput.OtherSavings);
    $('#resultHomeMonth').text('$' + decide.OriginalInput.Home.Payment + ' / ' + (decide.OriginalInput.Home.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
    $('#resultHomeTotal').text((decide.OriginalInput.Home.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.Home.TotalOwed : 'N/A');
    if (decide.OriginalInput.Car.IsOwned) {
        $('#resultCarMonth').text('$' + decide.OriginalInput.Car.Payment + ' / ' + (decide.OriginalInput.Car.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultCarTotal').text((decide.OriginalInput.Car.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.Car.TotalOwed : 'N/A');
    }
    else {
        $('#resultCarMonth').text('N/A');
        $('#resultCarTotal').text('N/A');
    }
    if (decide.OriginalInput.College.IsOwned) {
        $('#resultCollegeMonth').text('$' + decide.OriginalInput.College.Payment + ' / ' + (decide.OriginalInput.College.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultCollegeTotal').text((decide.OriginalInput.College.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.College.TotalOwed : 'N/A');
    }
    else {
        $('#resultCollegeMonth').text('N/A');
        $('#resultCollegeTotal').text('N/A');
    }
    if (decide.OriginalInput.OtherDebts.IsOwned) {
        $('#resultLoansMonth').text('$' + decide.OriginalInput.OtherDebts.Payment + ' / ' + (decide.OriginalInput.OtherDebts.Payment / decide.MonthlyIncome * 100.0).toFixed(2) + '%');
        $('#resultLoansTotal').text((decide.OriginalInput.OtherDebts.TotalOwed || 0.0) > 0 ? '$' + decide.OriginalInput.OtherDebts.TotalOwed : 'N/A');
    }
    else {
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

    $('#introduction').hide();
    $('#goals').hide();
    $('#survey').hide();
    $('#results').show();

    document.getElementById('tweetLink').href = getTweetLink('Budget Bear looked at my budget and thinks I should focus on my ' + prettyGoal(decide.PrimaryGoal) + '. http://budgetbear.azurewebsites.net/');

    location.hash = "#results";
    return false;
};

function getTweetLink(message) {
    return "https://twitter.com/intent/tweet?text=" + encodeURI(message);
}

var prettyGoal = function (goal) {
    switch (goal)
    {
        case Goal.EmergencyFund:
            return "Emergency Fund";
        case Goal.Other:
            return "Other Expenses";
        default:
            return Goal[goal];
    }
}

$('#btnBack').click(function () {
    $('#introduction').show();
    $('#goals').show();
    $('#survey').show();
    $('#results').hide();
    location.hash = "#goals";
    return false;
});

$('#btnPrint').click(function () {
    window.print();
});

$('input[type="radio"]').click(function () {
    var controlClass = this.dataset.toggle;
    if (controlClass != null) {
        if ($(this).val() == "true")
            $('.' + controlClass).show("slow");
        else
            $('.' + controlClass).hide("slow");
    }
});
