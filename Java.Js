let choice = {
    Occupation: "",
    Salary: 0
};

let monthlyNetSalary = 0;
let taxesButtonListenerAdded = false;

// Element Selectors
const dropdown = document.getElementById("careers");
const incomeInfo = document.getElementById("income");
const taxesDiv = document.getElementById("taxes");
const welcomeScreen = document.getElementById("welcome-screen");

async function getCareers() {
    const url = "https://eecu-data-server.vercel.app/data";
    try {
        const response = await fetch(url);
        const jobs = await response.json();
        createOptions(jobs);
        // After fetching, check if we have a saved choice to display
        loadChoice(); 
        return jobs;
    } catch (error) {
        console.error("Error fetching careers data:", error);
        return [];
    }
}

function createOptions(careers) {
    careers.forEach((career, index) => {
        const option = document.createElement("option");
        // Using toLocaleString for prettier numbers
        option.textContent = `${career.Occupation}`;
        option.value = index; 
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
        const selectedIndex = event.target.value;
        choice.Occupation = careers[selectedIndex].Occupation;
        choice.Salary = careers[selectedIndex].Salary;
        
        saveChoice(choice);
        displayCareerInfo();
    });
}

function saveChoice(choice) {
    localStorage.setItem("choices", JSON.stringify(choice));
}

function loadChoice() {
    const savedChoices = JSON.parse(localStorage.getItem("choices"));
    if (savedChoices && savedChoices.Salary) {
        choice = savedChoices;
        displayCareerInfo();
    }
}

function fedTax(salary) {
    let tax = 0;
    if (salary > 50400) {
        tax = 1240 + 4560 + ((salary - 50400) * 0.22);
    } else if (salary > 12400) {
        tax = 1240 + ((salary - 12400) * 0.12);
    } else {
        tax = salary * 0.1;
    }
    return tax;
}

function displayCareerInfo() {
    const salary = choice.Salary;
    if (!salary) return;

    // Update gross income
    document.getElementById("grossIncomeAmount").textContent = `$${salary.toLocaleString()}`;

    // Reset UI state
    document.getElementById("nextTaxesButton").style.display = "block";
    document.getElementById("taxBreakdown").style.display = "none";
    document.getElementById("nextToExpenses").style.display = "none";

    // Add listener to the button if not already added
    if (!taxesButtonListenerAdded) {
        document.getElementById("nextTaxesButton").addEventListener("click", () => {
            const medicareDeduction = salary * 0.0145;
            const socialSecurityDeduction = salary * 0.062;
            const stateTaxDeduction = salary * 0.04;
            const federalTaxDeduction = fedTax(salary);
            
            const netSalary = salary - medicareDeduction - socialSecurityDeduction - stateTaxDeduction - federalTaxDeduction;
            monthlyNetSalary = (netSalary / 12).toFixed(2);

            // Update the spans
            document.getElementById("medicareAmount").textContent = `$${medicareDeduction.toFixed(2)}`;
            document.getElementById("socialSecurityAmount").textContent = `$${socialSecurityDeduction.toFixed(2)}`;
            document.getElementById("stateTaxAmount").textContent = `$${stateTaxDeduction.toFixed(2)}`;
            document.getElementById("federalTaxAmount").textContent = `$${federalTaxDeduction.toFixed(2)}`;
            document.getElementById("annualNetAmount").textContent = `$${netSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            document.getElementById("monthlyNetAmount").textContent = `$${parseFloat(monthlyNetSalary).toLocaleString()}`;

            // Hide the button and show the tax breakdown + next link
            document.getElementById("nextTaxesButton").style.display = "none";
            document.getElementById("taxBreakdown").style.display = "block";
            document.getElementById("nextToExpenses").style.display = "block";

            // Add listener to the next link for saving
            document.getElementById("nextToExpenses").addEventListener("click", () => {
                localStorage.setItem("monthlyNet", monthlyNetSalary);
                localStorage.setItem("totalTaxes", (salary / 12 - monthlyNetSalary).toFixed(2));
            });
        });
        taxesButtonListenerAdded = true;
    }
}

// Kick off the process
getCareers();