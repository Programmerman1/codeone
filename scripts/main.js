var load = function () {
    console.log('hi folks');
    $('.toggleMortgage').hide();
    $('.toggleCar').hide();
    $('.toggleCollege').hide();
    $('.toggleLoans').hide();
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
    if (decide.EverythingHappy)
        $('#primaryRecommendation')

    $('#primaryRecommendation').removeClass().addClass(getRecommendationClass(decide.PrimaryGoal));
    $('#lblPrimaryGoal').text(Goal[decide.PrimaryGoal]);
    $('#lblPrimaryGoalExplanation').text(getExplanation(decide).PrimaryGoalExplanation);

    $('#secondRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[1]));
    $('#lblSecondaryGoalExplanation').text(getExplanation(decide).SecondaryGoalExplanation);

    $('#thirdRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[2]));
    $('#fourthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[3]));
    $('#fifthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[4]));
    $('#sixthRecommendation').removeClass().addClass(getRecommendationClass(decide.GoalOrder[5]));
    return false;
};



$('input[type="radio"]').click(function () {
    var controlClass = this.dataset.toggle;
    if (controlClass != null) {
        if ($(this).val() == "true")
            $('.' + controlClass).show("slow");
        else
            $('.' + controlClass).hide("slow");
    }
});
