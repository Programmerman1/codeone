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

    $('#primaryRecommendation').addClass(getRecommendationClass(decide.PrimaryGoal));
    $('#lblPrimaryGoal').text(Goal[decide.PrimaryGoal]);
    $('#lblPrimaryGoalExplanation').text(Goal[decide.PrimaryGoal]);
    $('#secondRecommendation').addClass(getRecommendationClass(decide.GoalOrder[1]));
    $('#lblSecondaryGoalExplanation').text(Goal[decide.GoalOrder[1]]);
    $('#thirdRecommendation').addClass(getRecommendationClass(decide.GoalOrder[2]));
    $('#fourthRecommendation').addClass(getRecommendationClass(decide.GoalOrder[3]));
    $('#fifthRecommendation').addClass(getRecommendationClass(decide.GoalOrder[4]));
    $('#sixthRecommendation').addClass(getRecommendationClass(decide.GoalOrder[5]));
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
