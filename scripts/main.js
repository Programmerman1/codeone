var load = function () {
    console.log('hi folks');
}();
var adjustAmount = function (targetFieldId) {
    var field = document.getElementById(targetFieldId);
    var amount = parseInt((event.target || event.srcElement).dataset.amount);
    field.value = (parseInt(field.value) || 0) + amount;
    if (field.value < 0) field.value = 0;
    event.stopPropagation();
};

var submitSurvey = function () {
    console.log('submit to the budget bear. SUBMIT!');
    GatherInput();
    return false;
};