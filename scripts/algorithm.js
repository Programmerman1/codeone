var Goal;
(function (Goal) {
    Goal[Goal["Home"] = 0] = "Home";
    Goal[Goal["Car"] = 1] = "Car";
    Goal[Goal["Retirement"] = 2] = "Retirement";
    Goal[Goal["Vacation"] = 3] = "Vacation";
    Goal[Goal["College"] = 4] = "College";
    Goal[Goal["EmergencyFund"] = 5] = "EmergencyFund";
    Goal[Goal["Other"] = 6] = "Other";
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
    result.PrimaryGoal = input.Goals[0];
    if (input.OtherSavings < 1000) {
        result.PrimaryGoal = Goal.EmergencyFund; // You need $1000 in savings before doing anything. Arbitrary number.
    }
    return result;
}
