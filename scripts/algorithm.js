var Goal;
(function (Goal) {
    Goal[Goal["Home"] = 0] = "Home";
    Goal[Goal["Car"] = 1] = "Car";
    Goal[Goal["Retirement"] = 2] = "Retirement";
    Goal[Goal["Vacation"] = 3] = "Vacation";
    Goal[Goal["College"] = 4] = "College";
    Goal[Goal["Other"] = 5] = "Other";
})(Goal || (Goal = {}));
var Frequency;
(function (Frequency) {
    Frequency[Frequency["Weekly"] = 0] = "Weekly";
    Frequency[Frequency["Biweekly"] = 1] = "Biweekly";
    Frequency[Frequency["TwiceAMonth"] = 2] = "TwiceAMonth";
    Frequency[Frequency["Monthly"] = 3] = "Monthly";
})(Frequency || (Frequency = {}));
var Decision = (function () {
    function Decision() {
    }
    return Decision;
})();
function MakeDecision(input) {
    var result = new Decision();
    result.PrimaryGoal = input.Goal[0];
    return result;
}
