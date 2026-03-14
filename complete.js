const netIncome = parseFloat(localStorage.getItem("monthlyNet"));
const expenses = JSON.parse(localStorage.getItem("userExpenses")) || [];
const totalExpenses = parseFloat(localStorage.getItem("totalExpenseAmount"));
const remainder = (netIncome - totalExpenses).toFixed(2);

// 1. Update the UI Text
document.getElementById("remainder-h2").innerText = `You have a remainder of exactly $${parseFloat(remainder).toLocaleString()}.`;
if (remainder < 0) {
    document.getElementById("outcome-h2").innerText = "Your Monthly balance is Negative!";
    document.getElementById("outcome-h2").style.color = "red";
}

// 2. Update the Table Rows
const results = document.querySelectorAll(".result");
expenses.forEach((val, index) => {
    if(results[index]) results[index].innerText = `$${val.toLocaleString()}`;
});

// 3. Create the Chart.js Pie Chart
const ctx = document.getElementById('budgetChart').getContext('2d');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Rent', 'Vehicle', 'Food', 'Clothes', 'Utilities', 'Debt', 'Media', 'Ent.', 'Other', 'Savings'],
        datasets: [{
            data: [...expenses, remainder > 0 ? remainder : 0],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
                '#FF9F40', '#C9CBCF', '#455A64', '#FF5722', '#4CAF50'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});