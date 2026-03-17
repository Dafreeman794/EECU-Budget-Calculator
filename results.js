/*
 * results.js
 *
 * Consolidated logic from complete.js + original results.js.
 * Keeps legacy storage support (userExpenses + totalExpenseAmount)
 * while supporting the newer expenses/remainder storage format.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Only initialize on pages that use the results UI.
    const outcomeH1 = document.getElementById("outcome-h1");
    const outcomeH2 = document.getElementById("outcome-h2");
    const remainderH2 = document.getElementById("remainder-h2");
    const netIncomeHeader = document.querySelector("#rows h2");
    const chartCanvas = document.getElementById('budgetChart');

    if (!outcomeH1 || !outcomeH2 || !remainderH2 || !chartCanvas) return;

    const netIncome = parseFloat(localStorage.getItem("monthlyNet")) || 0;

    const hasNewStorage = localStorage.getItem("expenses") !== null && localStorage.getItem("remainder") !== null;
    const hasLegacyStorage = localStorage.getItem("userExpenses") !== null && localStorage.getItem("totalExpenseAmount") !== null;

    if (!hasNewStorage && !hasLegacyStorage) return;

    let expenses = {};
    let remainder = 0;

    if (hasNewStorage) {
        expenses = JSON.parse(localStorage.getItem("expenses")) || {};
        remainder = parseFloat(localStorage.getItem("remainder")) || 0;
    } else {
        const expenseArray = JSON.parse(localStorage.getItem("userExpenses")) || [];
        const totalExpenses = parseFloat(localStorage.getItem("totalExpenseAmount")) || 0;
        remainder = netIncome - totalExpenses;

        const legacyKeys = ["rent", "vehicle", "food", "cloths", "Utils", "debts", "media", "Entertainment", "other"];
        legacyKeys.forEach((key, idx) => {
            expenses[key] = expenseArray[idx] || 0;
        });
    }

    const isPositive = remainder >= 0;

    const greenPalette = ['#4CAF50', '#81C784', '#A5D6A7', '#66BB6A', '#43A047', '#2E7D32', '#1B5E20', '#C8E6C9', '#E8F5E9'];
    const magentaPalette = ['#C2185B', '#E91E63', '#F06292', '#D81B60', '#AD1457', '#880E4F', '#F48FB1', '#F8BBD0', '#CE93D8'];

    const selectedPalette = isPositive ? greenPalette : magentaPalette;
    const themeColor = isPositive ? "#2E7D32" : "#C2185B";

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

    const expenseKeys = ["rent", "vehicle", "food", "cloths", "Utils", "debts", "media", "Entertainment", "other"];
    const resultRows = document.querySelectorAll(".resultRow");

    resultRows.forEach((row, index) => {
        const resultP = row.querySelector(".result");
        if (resultP) {
            const expenseValue = expenses[expenseKeys[index]] || 0;
            resultP.textContent = `$${expenseValue.toLocaleString()}`;
            resultP.style.color = themeColor;
        }
    });

    const ctx = chartCanvas.getContext('2d');
    const expenseValues = expenseKeys.map(key => expenses[key] || 0);

    const chartLabels = expenseKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1));
    const chartData = [...expenseValues];

    if (isPositive && remainder > 0) {
        chartLabels.push("Remaining");
        chartData.push(remainder);
    }

    // If the datalabels plugin is available, register it so we can draw labels with callouts.
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
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
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Monthly Expense Breakdown',
                    color: themeColor,
                    font: { size: 16 },
                    padding: { top: 10, bottom: 30 }
                },
                datalabels: {
                    color: '#ffffff',
                    formatter: (value, ctx) => {
                        const label = ctx.chart.data.labels[ctx.dataIndex] || '';
                        const formattedValue = value ? `$${value.toLocaleString()}` : '$0';
                        return `${label}: ${formattedValue}`;
                    },
                    anchor: 'end',
                    align: 'end',
                    offset: 10,
                    clamp: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: 4,
                    padding: 4,
                    font: { weight: 'bold', size: 12 }
                }
            }
        }
    });
});
