var negativeExplanations = function(goalFocus, decision) {
    switch (goalFocus) {
        case "Home":
            var housePaymentPercent = decision.OriginalInput.Home.Payment / decision.MonthlyIncome * 100;
            
            return "<p>Budget Bear is concerned about how much you spend on your living situation. Your rent or mortgage should only be <strong>30&ndash;40%</strong> of your income at the most (20% would be fantastic), and your rent is " + housePaymentPercent + "% of your income" + (housePaymentPercent <= 40 ? ', which is on the high end' : '') + ". Budget Bear suggests that you consider moving to a location more within your means, having roommates and dividing rent, or perhaps refinance your home if you are going to be there for a while. You may also want to look for a secondary source of income or a higher paying job.</p>";
            break;
        case "Car":
            var carPaymentPercent = decision.OriginalInput.Car.Payment / decision.MonthlyIncome * 100;
            
            var output = "<p>Budget Bear is worried about the cost of your car. You should aim for your car payments being <strong>10% or less</strong> of your income, and yours is " + carPaymentPercent + "% of your income. Try to pay off your car as soon as you can so you can free up those funds for other things.";
            
            if (decision.OriginalInput.OtherExpenses > 100) {
                output += " It looks like you have $" + decision.OriginalInput.OtherExpenses + " in other expenses. If any of those expenses aren't mandatory, consider putting that towards your car payments.";
            }
            
            if (decision.OriginalInput.Car.TotalOwed > 8000) {
                output += " If you're starting to discover that your car is simply further beyond your means than you thought when you first purchased it, consider talking to a banker or financial advisor about options such as negotiating lower payments and interest rates. You could also consider selling your car and purchasing a more affordable one or even researching your area's public transportation options.";
            }
            
            output += '</p>';
            
            return output;
            break;
        case "Retirement":
            return "<p>Budget Bear highly recommends that you prepare for retirement. Retirement is a long-term goal and the sooner you start, the better shape you'll be in. Having a percent or two set aside automatically will get you started and you'll hardly notice it. Ask your workplace about retirement savings options such as a 401k.</p>";
            break;
        case "Vacation":
            return "<p>Budget Bear approves of saving for that vacation. Afraid you'll tap into the funds for other expenses? Open a savings account just for your vacation fund and have your employer deposit a portion of your check straight into that account. You'll get your vacation funded in no time!</p>";
            break;
        case "College":
            var collegePaymentPercent = decision.OriginalInput.College.Payment / decision.MonthlyIncome * 100;
            
            return "<p>Budget Bear is worried about your college loans. Budget Bear knows that college loans can be intimidating and wants to help. You should aim for your monthly payments being around <strong>15% or less</strong> of your income, but it looks like yours is " + collegePaymentPercent + "%. You may be well-served talking to your loan servicer about more affordable repayment options. While you'll pay longer and probably more over the long run, you'll pay less every month. That will give you room enough in your budget to get other things in order.</p>";
            break;
        case "EmergencyFund":
            var idealSavingsAmount = decision.MonthlyIncome * 3;
            
            var output = "<p>Uh oh! It looks like your savings account is very low. Budget Bear highly recommends that you have <strong>3 months of paychecks</strong> stowed away for emergencies. In your case, that would be <strong>$" + idealSavingsAmount + "</strong>, but you only have <strong>$" + decision.OriginalInput.OtherSavings + "</strong>.</p><p>Budget Bear is worried about your livelihood and wants you to be safe if you ever have an emergency that threatens your job, health, car, home, or anything else important to you. He wants you to not have to rely on your credit cards or loans if something happens. You can start by looking at your expenses and seeing what you can cut. Do your best to put <strong>10&ndash;15%</strong> of every paycheck into savings.";
            
            if (decision.OriginalInput.OtherExpenses > 100) {
                output += " It looks like you have $" + decision.OriginalInput.OtherExpenses + " in other expenses. If any of those expenses aren't mandatory, consider putting that money in savings instead.";
            }
            
            output += '</p>';
            
            return output;
            break;
        case "Other":
            return "<p>Budget Bear is worried about your expenses in general. It seems as though expenses such as monthly bills and miscellaneous debt are particularly overwhelming. Focus on paying off debts, cut up credit cards, cut services you don't use (Netflix and Hulu are a lot cheaper than cable and you probably don't really use all of those), and you'll open up funds to focus on other goals.</p>";
            break;
        case "Income":
            var monthlyExpensesPercent = decision.MonthlyExpenses / decision.MonthlyIncome * 100 - 100;
            
            var output = "<p>Budget Bear is very worried about you!";
            
            if (decision.MonthlyIncome > 0) {
                output += " Your cost of living is " + monthlyExpensesPercent + "% higher than your income, and that's not sustainable. Consider looking for secondary income, looking for a better paying job, or if you really love your work, ask for a raise. Work to reduce your expenses.";
            } else {
                output += " You don't have any income to support yourself. Hopefully you are looking for a source of income.";
            }
            
            output += "</p><p>";
            
            if (decision.OriginalInput.OtherExpenses > 50) {
                output += "It looks like you have $" + decision.OriginalInput.OtherExpenses + " in other expenses. If any of those expenses aren't mandatory, cut them.";
            }
            
            output += " Cut services that you don't use, or look for more affordable alternatives such as Netflix or Hulu instead of cable TV. Look for more affordable housing.";
            
            if (decision.OriginalInput.Car.IsOwned) {
                output += " If things are drastic, consider selling your car and researching your area's public transportation system.";
            }
            
            output += "</p><p>If everything feels scary and overwhelming, and you're having trouble figuring out how to make ends meet, ask a financial counselor for advice and talk about your options. Please focus on reducing your expenses overall before pursuing your other goals.</p>";
            
            return output;
            break;
    }
};

var positiveExplanations = function(goalFocus, decision) {
    switch (goalFocus) {
        case "Home":
            return "<p>Budget Bear sees that you are in a good financial place to save for or pay off a home. Generally a good price point when you look into purchasing a home is twice your annual income, in your case, <strong>$" + (decision.AnnualIncome * 2) + "</strong>. Depending on the cost of living and interests rates on mortgages where you live, you may be able to go as high as three times your annual income. Try to have <strong>20% for down payment</strong>, and you should be all set. Good luck!</p>";
            break;
        case "Car":
            return "<p>Budget Bear thinks that you are financially secure enough to purchase a car. If you want to be economical, try to pay for the entire amount of a used car and avoid car loans.</p><p>Budget Bear recommends against brand new cars because they depreciate rapidly, and car loans come with interest which means you will pay much more for your car by the time you're done. New cars average a 10&ndash;20% loss in value immediately after you drive them off the car lot, and a 65% loss after 5 years, so be careful!</p>";
            break;
        case "Retirement":
            return "<p>Budget Bear believes your financial situation is generally in order. You aren't falling behind, and your expenses are in check. You can always put more into your retirement savings though. If you have at least an <strong>entire annual salary in your retirement savings</strong>, in your case, <strong>$" + decision.AnnualIncome + "</strong>, what you're doing is probably working. If you're not at this point yet, don't be too stressed, especially if you're young. But don't completely ignore preparing for retirement, either.</p><p>It's better to start early and save often so that you have time for compound interest to do its magic. If you have a retirement plan at work, increase your contribution by 1 percentage point. You'll hardly notice it. Once you've done that, think about your next focus.</p>";
            break;
        case "Vacation":
            return "<p>Go ahead and save for that vacation. Afraid you'll tap into the funds for other expenses? Open a savings account just for your vacation fund and have your employer deposit a portion of your check straight into that account. You'll get your vacation funded in no time!</p>";
            break;
        case "College":
            return "<p>Budget Bear encourages you to pursue your college dreams! If you need ideas, Budget Bear really enjoyed his business and finance double major. ;)</p><p>But in all seriousness, consider your major and college carefully. Not all degrees have the same earning potential, and while that shouldn't discourage you from pursuing your dream job, remember that college is an investment and it will be tough to pay off large loans depending on your career. No matter what, look for ways to cut costs and try not to start your post-college life bogged down in debt. Look into scholarships and grants that you qualify for. If you think you'll enjoy community college, on average they cost less than half of four-year universities. Also consider night, weekend, and online classes if you can't afford to or don't have time to be a full-time student.</p>";
            break;
        case "EmergencyFund":
            var idealSavingsAmount = decision.MonthlyIncome * 3;
            
            return "<p>Budget Bear believes your financial situation is generally in order, but thinks you should have more money in savings. Budget Bear is worried about your livelihood and wants you to be safe if you ever have an emergency that threatens your job, health, car, home, or anything else important to you. He wants you to not have to rely on your credit cards or loans if something happens. Budget Bear highly recommends that you have <strong>3 months of paychecks</strong> stowed away for emergencies. In your case, that would be <strong>$" + idealSavingsAmount + "</strong>, and you currently have <strong>$" + decision.OriginalInput.OtherSavings + "</strong>. Do your best to put <strong>10&ndash;15%</strong> of every paycheck into savings.</p>";
            break;
        case "Other": // I don't know if this is possible either?
            return "";
            break;
        case "Income": // I really doubt this will happen, too.
            return "";
            break;
    }
};

function getExplanation(decision) { //results: Decision
    var housePaymentPercentage = decision.OriginalInput.Home.Payment / decision.MonthlyIncome

    if (decision.EverythingHappy) {
        return {
            PrimaryGoalExplanation: positiveExplanations(Goal[decision.PrimaryGoal], decision),
            SecondaryGoalExplanation: positiveExplanations(Goal[decision.GoalOrder[1]], decision)
        };
    } else {
        return {
            PrimaryGoalExplanation: negativeExplanations(Goal[decision.PrimaryGoal], decision),
            SecondaryGoalExplanation: negativeExplanations(Goal[decision.GoalOrder[1]], decision)
        };
    }
}