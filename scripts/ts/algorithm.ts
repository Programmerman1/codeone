enum Goal {
	Home,
	Car,
	Retirement,
	Vacation,
    College,
    EmergencyFund,
    Other,
    Income
}
enum Frequency {
	Weekly,
	Biweekly,
	TwiceAMonth,
	Monthly
}
interface Loan {
	Payment : number;
	TotalOwed : number;
	IsOwned : boolean;
}
interface BudgetBearInput {
	Goals : Goal[];
	PayAmount : number;
    PayFrequency: Frequency;
    RetirementSavings: number;
    OtherSavings: number;
	Home : Loan;
	Car : Loan;
	College : Loan;
	OtherDebts : Loan;
	MandatoryExpenses : number;
	OtherExpenses : number;
}
class Decision {
	PrimaryGoal : Goal;
    GoalOrder: Goal[];
    EverythingHappy: boolean;
}

function GetGoalMatrix() : any[] {
    var matrix = [];
    matrix["Home"] = { Goal: Goal.Home, Weight: 1.0 };
    matrix.push(matrix["Home"]);
    matrix["Car"] = { Goal: Goal.Car, Weight: 1.0 };
    matrix.push(matrix["Car"]);
    matrix["Retirement"] = { Goal: Goal.Retirement, Weight: 1.0 };
    matrix.push(matrix["Retirement"]);
    matrix["Vacation"] = { Goal: Goal.Vacation, Weight: 1.0 };
    matrix.push(matrix["Vacation"]);
    matrix["College"] = { Goal: Goal.College, Weight: 1.0 };
    matrix.push(matrix["College"]);
    matrix["EmergencyFund"] = { Goal: Goal.EmergencyFund, Weight: 1.0 };
    matrix.push(matrix["EmergencyFund"]);
    matrix["Other"] = { Goal: Goal.Other, Weight: 1.0 };
    matrix.push(matrix["Other"]);
    matrix["Income"] = { Goal: Goal.Income, Weight: 1.0 };
    matrix.push(matrix["Income"]);
    return matrix;
}

function MakeDecision(input : BudgetBearInput) : Decision {
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
    if (input.PayFrequency == Frequency.TwiceAMonth || input.PayFrequency == Frequency.Biweekly) monthlyIncome = monthlyIncome * 2.;
    if (input.PayFrequency == Frequency.Weekly) monthlyIncome = monthlyIncome * 4;

    //But you do get an extra month's pay, functionally.
    if (input.PayFrequency == Frequency.Weekly || input.PayFrequency == Frequency.Biweekly) {
        annualIncome = monthlyIncome * 13;
    } else {
        annualIncome = monthlyIncome * 12;
    }

    //If you spend more than you make, you need to fix that first.
    var monthlyExpenses = input.Home.Payment + input.Car.Payment + input.College.Payment + input.OtherDebts.Payment + input.MandatoryExpenses + input.OtherExpenses;
    if (monthlyExpenses > monthlyIncome) {
        finalGoals["Income"].Weight *= 100;
        result.EverythingHappy = false;
    }

    //If you have 0 "liquid savings," you need some liquid savings.
    // $1000 is a good starting point. Don't go into debt when you have to call a plumber or a car repair place.
    if (input.OtherSavings < 1000) {
        result.PrimaryGoal = Goal.EmergencyFund;
        finalGoals["EmergencyFund"].Weight *= 20;
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
        result.EverythingHappy = false;
    }
    ///#endregion House

    ///#region College
    //Income-based repayment can lower you payment to 15% but if you're paying, say, 20%, that's fine too.
    //This is like the car - you don't want it to get bigger. If this ends up being your goal, you can 
    //refinance.
    if (input.College.Payment * 5 > monthlyIncome) {
        finalGoals["College"].Weight *= (input.Car.Payment * 4 / monthlyIncome);
        result.EverythingHappy = false;
    }
    ///#endregion College

    //Your other debt expenses probably shouldn't go over 10%. Like car.
    if (input.OtherDebts.Payment * 10 > monthlyIncome) {
        finalGoals["Other"].Weight *= (input.OtherDebts.Payment * 9 / monthlyIncome);
        result.EverythingHappy = false;
    }

    //Mandatory expenses 10%. But like house. But goes to "Other."
    if (input.MandatoryExpenses * 10 > monthlyIncome) {
        finalGoals["Other"].Weight *= Math.log(input.MandatoryExpenses - (monthlyIncome / 10)) / Math.log(2);
        result.EverythingHappy = false;
    }

    //Other expenses 10%. But like car. But goes to "Other."
    if (input.OtherExpenses * 10 > monthlyIncome) {
        finalGoals["Other"].Weight *= (input.OtherExpenses * 9 / monthlyIncome);
        result.EverythingHappy = false;
    }

    result.GoalOrder = finalGoals
        .sort(function (left, right) { return right.Weight - left.Weight })
        .map(function (g) { return g.Goal });
    
    result.PrimaryGoal = result.GoalOrder[0];

	return result;
}

function SampleInput(): BudgetBearInput {
    var result = {
        Goals: [Goal.Home],
        PayAmount: 1600,
        PayFrequency: Frequency.Biweekly,
        RetirementSavings: 10000,
        OtherSavings: 100,
        Home: {
            Payment: 900,
            TotalOwed: 90000,
            IsOwned: true
        },
        Car: {
            Payment: 500,
            TotalOwed: 5000,
            IsOwned: true
        },
        College: {
            Payment: 0,
            TotalOwed: 0,
            IsOwned: false
        },
        OtherDebts: {
            Payment: 100,
            TotalOwed: 1500,
            IsOwned: false
        },
        MandatoryExpenses: 1000,
        OtherExpenses: 500
    };
    return result;
}

function GatherInput() {
    var result = {
        Goals: [Goal.Home],
        PayAmount: 1000,
        PayFrequency: Frequency.Biweekly,
        RetirementSavings: 10000,
        OtherSavings: 100,
        Home: {
            Payment: 900,
            TotalOwed: 90000,
            IsOwned: true
        },
        Car: {
            Payment: 500,
            TotalOwed: 5000,
            IsOwned: true
        },
        College: {
            Payment: 0,
            TotalOwed: 0,
            IsOwned: false
        },
        OtherDebts: {
            Payment: 100,
            TotalOwed: 1500,
            IsOwned: false
        },
        MandatoryExpenses: 1000,
        OtherExpenses: 500
    };
    return result;
};

(function () {
    var decision = MakeDecision(SampleInput());
    if (decision.PrimaryGoal != Goal.EmergencyFund) {
        console.log('fail, primary goal in sample should be emergency fund.');
    } else if (decision.PrimaryGoal == Goal.EmergencyFund) {
        console.log('goal chosen correctly');
    }
} ());