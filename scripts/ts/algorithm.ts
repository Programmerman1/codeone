enum Goal {
	Home,
	Car,
	Retirement,
	Vacation,
	College,
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
	Goal : Goal;
	PayAmount : number;
	PayFrequency : Frequency;
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
	var result  = new Decision();
	result.PrimaryGoal = input.Goal;
	return result;
}