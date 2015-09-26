enum Goal {
	Home,
	Car,
	Retirement,
	Vacation,
    College,
    EmergencyFund,
	Other
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
	GoalOrder : Goal[];
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
    return matrix;
}

function MakeDecision(input : BudgetBearInput) : Decision {
    var result = new Decision();
    var finalGoals = GetGoalMatrix();

    input.Goals.map(function (inGoal) {
        finalGoals[Goal[inGoal]].Weight *= 1.5;
    });

    if (input.OtherSavings < 1000) {
        result.PrimaryGoal = Goal.EmergencyFund; // You need $1000 in savings before doing anything. Arbitrary number.
        finalGoals["EmergencyFund"].Weight *= 20;
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