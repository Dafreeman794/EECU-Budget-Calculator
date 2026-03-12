let choice = {
    Occupation: "",
    Salary: 0
};
let monthlyNetSalary = 0;

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
        option.textContent = `${career.Occupation}: $${career.Salary.toLocaleString()}`;
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

    // Reset the UI for the new selection
    incomeInfo.innerHTML = `<h2 class="grey">Gross Income: $${salary.toLocaleString()}</h2>`;
    taxesDiv.innerHTML = `<button id="nextTaxesButton">Calculate Taxes</button>`;

    // Add listener to the newly created button
    document.getElementById("nextTaxesButton").addEventListener("click", () => {
        const medicareDeduction = salary * 0.0145;
        const socialSecurityDeduction = salary * 0.062;
        const stateTaxDeduction = salary * 0.04;
        const federalTaxDeduction = fedTax(salary);
        
        const netSalary = salary - medicareDeduction - socialSecurityDeduction - stateTaxDeduction - federalTaxDeduction;
        monthlyNetSalary = (netSalary / 12).toFixed(2);

        taxesDiv.innerHTML = `
            <h3 class="grey">Before we show you how much you have for spending, we must first pay good ol' Uncle Sam!</h3>
            <p class="greybox">Medicare (1.45%): -$${medicareDeduction.toFixed(2)}</p>
            <p class="greybox">Social Security (6.2%): -$${socialSecurityDeduction.toFixed(2)}</p>
            <p class="greybox">State Tax (4%): -$${stateTaxDeduction.toFixed(2)}</p>
            <p class="greybox">Federal Tax: -$${federalTaxDeduction.toFixed(2)}</p>
            <hr>
            <p class="greybox" id="netSalary"><strong>Annual Net Salary: $${netSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></p>
            <p class="grey" id="monthlyNetSalary">Your Monthly Net Salary: $${parseFloat(monthlyNetSalary).toLocaleString()}</p>
            <a href="expenses.html" class="next-link" style="display:block; margin-top:20px;">Continue to Expenses</a>
        `;
    });
}

// Kick off the process
getCareers();