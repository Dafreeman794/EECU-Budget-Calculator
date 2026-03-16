document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Data from LocalStorage
    const netIncome = parseFloat(localStorage.getItem("monthlyNet")) || 0;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    const totalExpenses = parseFloat(localStorage.getItem("totalExpenses")) || 0;
    const remainder = parseFloat(localStorage.getItem("remainder")) || 0;
    
    // Determine if the balance is positive or negative
    const isPositive = remainder >= 0;

    // 2. Setup Dynamic Colors and Text
    const greenPalette = [
        '#4CAF50', '#81C784', '#A5D6A7', '#66BB6A', 
        '#43A047', '#2E7D32', '#1B5E20', '#C8E6C9', '#E8F5E9'
    ];

    const magentaPalette = [
        '#C2185B', '#E91E63', '#F06292', '#D81B60', 
        '#AD1457', '#880E4F', '#F48FB1', '#F8BBD0', '#CE93D8'
    ];

    const selectedPalette = isPositive ? greenPalette : magentaPalette;
    const themeColor = isPositive ? "#2E7D32" : "#C2185B";

    // 3. Update Headers and Text
    const outcomeH1 = document.getElementById("outcome-h1");
    const outcomeH2 = document.getElementById("outcome-h2");
    const remainderH2 = document.getElementById("remainder-h2");
    const netIncomeHeader = document.querySelector("#rows h2");

    if (isPositive) {
        outcomeH1.textContent = "Congratulations!";
        outcomeH1.style.color = "#4CAF50";
        outcomeH2.textContent = "Your Monthly balance is Positive!";
        outcomeH2.style.color = "green";
        remainderH2.textContent = `Pocket Cash: $${remainder.toLocaleString()}`;
    } else {
        outcomeH1.textContent = "Oops!";
        outcomeH1.style.color = "red";
        outcomeH2.textContent = "Your Monthly balance is Negative!";
        outcomeH2.style.color = "#FF5722";
        remainderH2.textContent = "Pocket Cash Exceeded";
    }
    remainderH2.style.color = themeColor;
    
    if (netIncomeHeader) {
        netIncomeHeader.textContent = `Original Net Income: $${netIncome.toLocaleString()}`;
    }

    // 4. Update the individual expense rows
    const expenseKeys = ["rent", "vehicle", "food", "cloths", "Utils", "debts", "media", "Entertainment", "other"];
    const resultRows = document.querySelectorAll(".resultRow");

    resultRows.forEach((row, index) => {
        const resultP = row.querySelector(".result");
        if (resultP) {
            const expenseValue = expenses[expenseKeys[index]] || 0;
            resultP.textContent = `$${expenseValue.toLocaleString()}`;
            resultP.style.color = themeColor; // Changes row numbers to match theme
        }
    });

    // 5. Create the Pie Chart
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const expenseValues = expenseKeys.map(key => expenses[key] || 0);

    // If you want to show the 'Remaining' money as a slice in the green chart:
    const chartLabels = [...expenseKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1))];
    const chartData = [...expenseValues];

    // Only add the 'Remaining' slice if they have money left
    if (isPositive && remainder > 0) {
        chartLabels.push("Remaining");
        chartData.push(remainder);
    }

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: selectedPalette,
                borderWidth: 1,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Monthly Expense Breakdown',
                    color: themeColor,
                    font: { size: 16 }
                }
            }
        }
    });
});