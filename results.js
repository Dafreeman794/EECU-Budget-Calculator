// Load and display results
document.addEventListener("DOMContentLoaded", () => {
    const netIncome = parseFloat(localStorage.getItem("monthlyNet"));
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    const totalExpenses = parseFloat(localStorage.getItem("totalExpenses"));
    const remainder = parseFloat(localStorage.getItem("remainder"));

    // Update the remainder text
    document.getElementById("remainder-h2").textContent = `You have a remainder of exactly $${remainder.toLocaleString()}.`;

    // Update the outcome based on remainder
    if (remainder >= 0) {
        document.getElementById("outcome-h1").textContent = "Congratulations!";
        document.getElementById("outcome-h1").style.color = "#4CAF50"; 
        document.getElementById("outcome-h2").textContent = "Your Monthly balance is Positive!";
        document.getElementById("outcome-h2").style.color = "green";
    } else {
        document.getElementById("outcome-h1").textContent = "Oops!";
        document.getElementById("outcome-h1").style.color = "red";
        document.getElementById("outcome-h2").textContent = "Your Monthly balance is Negative!";
        document.getElementById("outcome-h2").style.color = "#FF5722"; 
    }
    //remember to ask Fast about how to make it one style command.

    // Update original net income
    const netIncomeHeader = document.querySelector("#rows h2");
    netIncomeHeader.textContent = `Original Net Income: $${netIncome.toLocaleString()}`;

    // Update expense results
    const resultRows = document.querySelectorAll(".resultRow");
    const expenseKeys = ["rent", "vehicle", "food", "cloths", "Utils", "debts", "media", "Entertainment", "other"];

    resultRows.forEach((row, index) => {
        const resultP = row.querySelector(".result");
        const expenseValue = expenses[expenseKeys[index]] || 0;
        resultP.textContent = `$${expenseValue.toLocaleString()}`;
    });

    // TODO: Implement chart if needed
});