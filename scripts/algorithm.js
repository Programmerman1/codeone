var Goal;
(function (Goal) {
    Goal[Goal["Home"] = 0] = "Home";
    Goal[Goal["Car"] = 1] = "Car";
    Goal[Goal["Retirement"] = 2] = "Retirement";
    Goal[Goal["Vacation"] = 3] = "Vacation";
    Goal[Goal["College"] = 4] = "College";
    Goal[Goal["EmergencyFund"] = 5] = "EmergencyFund";
    Goal[Goal["Other"] = 6] = "Other";
    Goal[Goal["Income"] = 7] = "Income";
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
}());
function GetGoalMatrix() {
    var matrix = [];
    matrix["Home"] = { Goal: Goal.Home, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Home"]);
    matrix["Car"] = { Goal: Goal.Car, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Car"]);
    matrix["Retirement"] = { Goal: Goal.Retirement, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Retirement"]);
    matrix["Vacation"] = { Goal: Goal.Vacation, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Vacation"]);
    matrix["College"] = { Goal: Goal.College, Happy: true, Weight: 1.0 };
    matrix.push(matrix["College"]);
    matrix["EmergencyFund"] = { Goal: Goal.EmergencyFund, Happy: true, Weight: 1.0 };
    matrix.push(matrix["EmergencyFund"]);
    matrix["Other"] = { Goal: Goal.Other, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Other"]);
    matrix["Income"] = { Goal: Goal.Income, Happy: true, Weight: 1.0 };
    matrix.push(matrix["Income"]);
    return matrix;
}
function MakeDecision(input) {
    var result = new Decision();
    var finalGoals = GetGoalMatrix();
    result.EverythingHappy = true;
    //The things you want are the things you want. They get more weight than the things you don't care about.
    input.Goals.map(function (inGoal) {
        finalGoals[Goal[inGoal]].Weight *= 1.5;
    });
    var monthlyIncome = input.PayAmount;
    var annualIncome;
    //Budgeting around the two extra paychecks a year isn't really reliable since they come at weird times.
    //If getting paid biweekly, act on a twice-a-month plan; if weekly, four-times-a-month.
    if (input.PayFrequency == Frequency.TwiceAMonth || input.PayFrequency == Frequency.Biweekly)
        monthlyIncome = monthlyIncome * 2.;
    if (input.PayFrequency == Frequency.Weekly)
        monthlyIncome = monthlyIncome * 4;
    //But you do get an extra month's pay, functionally.
    if (input.PayFrequency == Frequency.Weekly || input.PayFrequency == Frequency.Biweekly) {
        annualIncome = monthlyIncome * 13;
    }
    else {
        annualIncome = monthlyIncome * 12;
    }
    result.MonthlyIncome = monthlyIncome;
    result.AnnualIncome = annualIncome;
    //If you spend more than you make, you need to fix that first.
    var monthlyExpenses = input.Home.Payment + input.Car.Payment + input.College.Payment + input.OtherDebts.Payment + input.MandatoryExpenses + input.OtherExpenses;
    if (monthlyExpenses > monthlyIncome) {
        finalGoals["Income"].Weight *= 100;
        finalGoals["Income"].Happy = false;
        result.EverythingHappy = false;
    }
    result.MonthlyExpenses = monthlyExpenses;
    //If you have 0 "liquid savings," you need some liquid savings.
    // $1000 is a good starting point. Don't go into debt when you have to call a plumber or a car repair place.
    if (input.OtherSavings < 1000) {
        result.PrimaryGoal = Goal.EmergencyFund;
        finalGoals["EmergencyFund"].Weight *= 20;
        finalGoals["EmergencyFund"].Happy = false;
        result.EverythingHappy = false;
    }
    ///#region Car Logic
    //If you don't pay on a car and you don't want to save toward a car, don't let car be a goal.
    if (input.Car.Payment == 0 && finalGoals["Car"].Weight == 1.0) {
        finalGoals["Car"].Weight = 0;
    }
    // If you pay more than 10% of your takehome on your car, you should pay that off.
    // The further away from that you are, the more you should weight it (11% isn't panic, 33% is).
    // Why is it *9? Because we're trying to figure out how much off what you should pay you are.
    if (input.Car.Payment * 10 > monthlyIncome) {
        finalGoals["Car"].Weight *= (input.Car.Payment * 9 / monthlyIncome);
        finalGoals["Car"].Happy = false;
        result.EverythingHappy = false;
    }
    ///#endregion Car Logic
    ///#region House Logic
    //We're using 33% for the "ideal" home payment. It's enough to start.
    //This one shouldn't shift up quite as steeply as the car did. Paying 20% of your income for a car is
    //substantially worse for your situation than paying 10%. Paying 50% for your home isn't nearly as bad
    //as the car scenario. Let's log-base-2-index it. it's probably wrong but eh.
    if (input.Home.Payment * 3 > monthlyIncome) {
        finalGoals["Home"].Weight *= Math.log((input.Home.Payment - (monthlyIncome / 3))) / Math.log(2);
        finalGoals["Home"].Happy = false;
        result.EverythingHappy = false;
    }
    ///#endregion House
    ///#region College
    //Income-based repayment can lower you payment to 15% but if you're paying, say, 20%, that's fine too.
    //This is like the car - you don't want it to get bigger. If this ends up being your goal, you can 
    //refinance.
    if (input.College.Payment * 5 > monthlyIncome) {
        finalGoals["College"].Weight *= (input.College.Payment * 7 / monthlyIncome);
        finalGoals["College"].Happy = false;
        result.EverythingHappy = false;
    }
    ///#endregion College
    //Your other debt expenses probably shouldn't go over 10%. Like car.
    if (input.OtherDebts.Payment * 10 > monthlyIncome) {
        finalGoals["Other"].Weight *= (input.OtherDebts.Payment * 9 / monthlyIncome);
        finalGoals["Other"].Happy = false;
        result.EverythingHappy = false;
    }
    //Mandatory expenses 15%. But like house. But goes to "Other."
    if (input.MandatoryExpenses * (20 / 3) > monthlyIncome) {
        finalGoals["Other"].Weight *= Math.log(input.MandatoryExpenses - (monthlyIncome / 10)) / Math.log(2);
        finalGoals["Other"].Happy = false;
        result.EverythingHappy = false;
    }
    //Other expenses 10%. But like car. But goes to "Other."
    if (input.OtherExpenses * 10 > monthlyIncome) {
        finalGoals["Other"].Weight *= (input.OtherExpenses * 9 / monthlyIncome);
        finalGoals["Other"].Happy = false;
        result.EverythingHappy = false;
    }
    //Things are going well! You don't need to reduce the expenses, what do you need to save toward?
    if (result.EverythingHappy) {
        //A three-month emergency fund is pretty essential. Weight it by how far off from that you are.
        if (input.OtherSavings < monthlyIncome * 3) {
            finalGoals["EmergencyFund"].Weight *= ((monthlyIncome * 3) - input.OtherSavings) / monthlyIncome;
        }
        //If you have less than a year's salary in retirement, you probably aren't trying hard enough on retirement.
        //Unlike the other goals, this one won't really phase out. You're either doing enough or you're not.
        //By the time you're saving enough, you're auto-piloting your retirement anyway.
        //If retirement is #1: "Increase your retirement savings. If you contribute a percentage of your paycheck
        //through work, increase it. You've got the room to work it into your budget, you'll barely notice it."
        if (input.RetirementSavings < annualIncome) {
            finalGoals["Retirement"].Weight *= 1.6;
        }
    }
    result.GoalOrder = finalGoals
        .sort(function (left, right) { return right.Weight - left.Weight; })
        .map(function (g) { return g.Goal; });
    result.PrimaryGoal = result.GoalOrder[0];
    result.PrimaryGoalHappy = finalGoals[Goal[result.PrimaryGoal]].Happy;
    result.SecondaryGoal = result.GoalOrder[1];
    result.SecondaryGoalHappy = finalGoals[Goal[result.SecondaryGoal]].Happy;
    result.OriginalInput = input;
    result.GoalMatrix = finalGoals;
    return result;
}
function GatherInput() {
    var form = document.forms[0];
    var result = {
        Goals: [],
        PayAmount: form.PayAmount.value * 1.0,
        PayFrequency: Frequency[form.Frequency.value],
        RetirementSavings: form.RetirementSavings.value * 1.0,
        OtherSavings: form.OtherSavings.value * 1.0,
        Home: {
            Payment: form.HomePayment.value * 1.0,
            IsOwned: $('input[name="HomeIsOwned"]:checked').val() == "true"
        },
        Car: { IsOwned: $('input[name="CarIsOwned"]:checked').val() == "true" },
        College: { IsOwned: $('input[name="CollegeIsOwned"]:checked').val() == "true" },
        OtherDebts: { IsOwned: $('input[name="OtherLoansIsOwned"]:checked').val() == "true" },
        MandatoryExpenses: (form.Utilities.value * 1.0 + form.Internet.value * 1.0 + form.TV.value * 1.0 + form.Phone.value * 1.0 + form.Insurance.value * 1.0),
        OtherExpenses: form.OtherStuff.value * 1.0
    };
    if (form.Home.checked)
        result.Goals.push(Goal.Home);
    if (form.Car.checked)
        result.Goals.push(Goal.Car);
    if (form.College.checked)
        result.Goals.push(Goal.College);
    if (form.Vacation.checked)
        result.Goals.push(Goal.Vacation);
    if (form.Retirement.checked)
        result.Goals.push(Goal.Retirement);
    result.Home.TotalOwed = result.Home.IsOwned ? form.HomeTotalOwed.value * 1.0 : 0.0;
    result.Car.Payment = result.Car.IsOwned ? form.CarPayment.value * 1.0 : 0.0;
    result.Car.TotalOwed = result.Car.IsOwned ? form.CarTotalOwed.value * 1.0 : 0.0;
    result.College.Payment = result.College.IsOwned ? form.CollegePayment.value * 1.0 : 0.0;
    result.College.TotalOwed = result.College.IsOwned ? form.CollegeTotalOwed.value * 1.0 : 0.0;
    result.OtherDebts.Payment = result.OtherDebts.IsOwned ? form.OtherLoansPayment.value * 1.0 : 0.0;
    result.OtherDebts.TotalOwed = result.OtherDebts.IsOwned ? form.OtherLoansTotalOwed.value * 1.0 : 0.0;
    return result;
}
var getRecommendationClass = function (goal) {
    switch (goal) {
        case Goal.Home:
            return 'bb bb-house';
            break;
        case Goal.Car:
            return 'bb bb-car';
            break;
        case Goal.Retirement:
            return 'bb bb-palm-tree';
            break;
        case Goal.Vacation:
            return 'bb bb-suitcase';
            break;
        case Goal.College:
            return 'bb bb-graduation-cap';
            break;
        case Goal.EmergencyFund:
            return 'bb bb-piggy-bank';
            break;
        case Goal.Other:
            return 'bb bb-credit-cards';
            break;
        case Goal.Income:
            return 'bb bb-dollar';
            break;
    }
};
