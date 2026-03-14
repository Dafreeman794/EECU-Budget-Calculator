// Display the net income we saved from page 1
const displayNet = document.getElementById("displayNet");
const monthlyNet = localStorage.getItem("monthlyNet") || 0;
displayNet.innerText = `$${parseFloat(monthlyNet).toLocaleString()}`;

// Handle the "Done" button
document.querySelector(".Btn").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".expense-input");
    let expenseData = [];
    let totalExpenseAmount = 0;

    inputs.forEach(input => {
        const val = parseFloat(input.value) || 0;
        expenseData.push(val);
        totalExpenseAmount += val;
    });

    localStorage.setItem("userExpenses", JSON.stringify(expenseData));
    localStorage.setItem("totalExpenseAmount", totalExpenseAmount);
});