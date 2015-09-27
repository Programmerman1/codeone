var negativeExplanations = {
    "Home": "You pay a lot more on your home than you probably should. You should do something about that. Move to a cheaper place, take on a roommate, maybe refinance if you're going to be there a while. You can also reduce the relative cost of your home by earning more money. How do you feel about making coffee for people on the weekends?",
    "Car": "Your car is important to you. That's clear because it's burning your wallet like it burns rubber. Try to pay off your car as soon as you can so that you can free up those funds for other things.",
    "Retirement": "You really should be doing something to save for retirement. Retirement is a long-term goal and the sooner you start, the better shape you'll be in. Having a percent or two set aside automatically will get you started and you'll hardly notice it.",
    "Vacation": "Go ahead and save for that vacation. Afraid you'll tap into the funds for other expenses? Open a savings account just for your vacation fund and have your employer deposit a portion of your check straight into that account. You'll get your vacation funded in no time!",
    "College": "You pay a lot on your loans. So much that you may be well-served talking to your loan servicer about more affordable repayment options. While you'll pay longer and probably more over the long run, you'll pay less every month. That will give you room enough in your budget to get other things in order.",
    "EmergencyFund": "You have like no savings. Your savings account looks like the liquor cabinet after a party: it's still there but it ain't serving much. If you can save $1000, you won't need to grab a credit card if you have to call a plumber or mechanic.",
    "Other": "Your other expenses are weighing you down. While you may feel like your home or car payments are a burden, your wallet is feeling the death of a thousand bills. Pay off something, cut service you don't use (Netflix is a lot cheaper than cable and you probably don't really use both), and you'll open up some funds to work on other stuff.",
    "Income": "You need more money. Your expenses are more than your paycheck. Ask for a raise and prove to your boss that you deserve it. Get a side job delivering pizzas or walking dogs. Or work to reduce your expenses. But right now you can't afford what you do, like at all."
};

var positiveExplanations = {
    "Home": "You pay a lot more on your home than you probably should. You should do something about that. Move to a cheaper place, take on a roommate, maybe refinance if you're going to be there a while. You can also reduce the relative cost of your home by earning more money. How do you feel about making coffee for people on the weekends?",
    "Car": "Your car is important to you. That's clear because it's burning your wallet like it burns rubber. Try to pay off your car as soon as you can so that you can free up those funds for other things.",
    "Retirement": "You have things generally in order. You aren't falling behind, your expenses are in check. Your retirement savings are a little low though. It's better to start early and save often so that you have as much time for the power of compound interest to do its magic. If you have a retirement plan at work, increase your contribution by 1 percentage point. You'll hardly notice it. Once you've done that, think about your next focus.",
    "Vacation": "Go ahead and save for that vacation. Afraid you'll tap into the funds for other expenses? Open a savings account just for your vacation fund and have your employer deposit a portion of your check straight into that account. You'll get your vacation funded in no time!",
    "College": "You pay a lot on your loans. So much that you may be well-served talking to your loan servicer about more affordable repayment options. While you'll pay longer and probably more over the long run, you'll pay less every month. That will give you room enough in your budget to get other things in order.",
    "EmergencyFund": "You have like no savings. Your savings account looks like the liquor cabinet after a party: it's still there but it ain't serving much. If you can save $1000, you won't need to grab a credit card if you have to call a plumber or mechanic.",
    "Other": "Your other expenses are weighing you down. While you may feel like your home or car payments are a burden, your wallet is feeling the death of a thousand bills. Pay off something, cut service you don't use (Netflix is a lot cheaper than cable and you probably don't really use both), and you'll open up some funds to work on other stuff.",
    "Income": "You need more money. Your expenses are more than your paycheck. Ask for a raise and prove to your boss that you deserve it. Get a side job delivering pizzas or walking dogs. Or work to reduce your expenses. But right now you can't afford what you do, like at all."
};

function getExplanation(decision) { //results: Decision
    /*
    var primaryGoal = decision.PrimaryGoal; // If Home, then primaryGoal = 0;
    var primaryGoalString = Goal[decision.PrimaryGoal]; // If Home, then primaryGoalString = "Home";
    var originalFirstGoalString = Goal[decision.OriginalInput.Goals[0]];
    var housePayment = decision.OriginalInput.Home.Payment;
    */

    if (decision.EverythingHappy) {
        return {
            PrimaryGoalExplanation: positiveExplanations[Goal[decision.PrimaryGoal]],
            SecondaryGoalExplanation: positiveExplanations[Goal[decision.GoalOrder[1]]]
        };
    } else {
        return {
            PrimaryGoalExplanation: negativeExplanations[Goal[decision.PrimaryGoal]],
            SecondaryGoalExplanation: negativeExplanations[Goal[decision.GoalOrder[1]]]
        };
    }
}