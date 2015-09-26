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

function MakeDecision(input : BudgetBearInput) : Decision {
    var result = new Decision();

    result.PrimaryGoal = input.Goals[0];

    if (input.OtherSavings < 1000) {
        result.PrimaryGoal = Goal.EmergencyFund; // You need $1000 in savings before doing anything. Arbitrary number.
    }

	return result;
}