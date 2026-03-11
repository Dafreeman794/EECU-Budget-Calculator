let choice = {
    Occupation: "",
    Salary: 0
};
let monthlyNetSalary = 0;


const medicare = document.getElementById("medicare");
const socialSecurity = document.getElementById("SS");
const federalTax = document.getElementById("federal");
const stateTax = document.getElementById("state");
const careerInfo = document.getElementById("career");
const dropdown = document.getElementById("careers");
const incomeInfo = document.getElementById("income");
const fedTaxDiv = document.getElementById("fedTaxes");
const taxesDiv = document.getElementById("taxes");
const welcomeScreen = document.getElementById("welcome-screen");

async function getCareers() { // Fetch the careers data from the server
    const url = "https://eecu-data-server.vercel.app/data";
    try {
        const response = await fetch(url);
        const jobs = await response.json();
        createOptions(jobs);
        return jobs;
    } catch (error) {
        console.error("Error fetching careers data:", error);
        return [];
    }
}

function createOptions(careers) { // Get the dropdown element
    const dropdown = document.getElementById("careers");

    // Create the options
    careers.forEach((career, index) => {
        const option = document.createElement("option");
        option.innerHTML = `${career.Occupation}: $${career.Salary}`;
        option.value = index; // Store the array index as the value
        option.classList.add("option");
        dropdown.appendChild(option);
    });

    // Listen for the dropdown value to change
    dropdown.addEventListener("change", (event) => {
        const selectedIndex = event.target.value;
        
        // Update the choice object using the selected index
        choice.Occupation = careers[selectedIndex].Occupation;
        choice.Salary = careers[selectedIndex].Salary;
        
        saveChoice(choice);
        displayCareerInfo();
        console.log(choice);
    });
}
getCareers();

function calculateDeductions() { // Calculate the deductions based on the salary
    
}

function saveChoice(choice) { // Save the choice to localStorage
    let savedChoice = JSON.stringify(choice);
    localStorage.setItem("choices", savedChoice);
    console.log("Choice saved:", choice);
}

function loadChoice() { // Load the choice from localStorage
    let savedChoices = JSON.parse(localStorage.getItem("choices")) || {};
    choice = savedChoices;
    if (choice) {
        displayCareerInfo();
        console.log("Choice loaded:", choice);
    }
}

function displayCareerInfo() {
    salary = choice.Salary;
    if (salary) {
        incomeInfo.innerHTML = `<h2 class="grey">Gross Income Entered`;
        taxesDiv.innerHTML = `<button id="nextTaxesButton">Next</button>`;
        nextTaxes.addEventListener("click", () => {
            const medicareDeduction = salary * 0.0145;
            const socialSecurityDeduction = salary * 0.062;
            const stateTaxDeduction = salary * 0.04; // Assuming a flat tax rate of 4%
            function fedTax() {
                let fedTax = 0;
                if (salary > 50400) {
                    fedTax = 1240 + 4560 + ((salary - 50400) * 0.22);
                }
                else if (salary > 12400) {
                    fedTax = 1240 + ((salary - 12400) * 0.12);
                }
                else {
                    fedTax = salary * 0.1;
                }
                return fedTax;
                }
            const federalTaxDeduction = fedTax();
            let netSalary = salary - medicareDeduction - socialSecurityDeduction - stateTaxDeduction - federalTaxDeduction;
            monthlyNetSalary = (netSalary / 12).toFixed(2);

            taxesDiv.innerHTML = `
            <h3 class="grey">Before we show you how much you have for spending, we must first pay good ol' Uncle Same! We must account for:</h3>
            <p class="greybox" id="medicare>Medicare: 1.45% = ${socialSecurityDeduction}</p>
            <p class="greybox" id="SS">Social Security: 6.2% = ${medicareDeduction}</p>
            <p class="greybox" id="state">State Tax: 4% = ${stateTaxDeduction}</p>
            `

            taxesDiv.innerHTML += `<p class="greybox" id="federal12">Federal Tax ($0 to $12,400): 10% = ${federalTaxDeduction}</p>`;
            if (salary > 12400) {
                taxesDiv.innerHTML += `<p class="greybox" id="federal12400">Federal Tax ($12,400 to $50,400): 12% = ${federalTaxDeduction}</p>`;
            }
            if (salary > 50400) {
                taxesDiv.innerHTML += `<p class="greybox" id="federal50400">Federal Tax ($50,400 and above): 22% = ${federalTaxDeduction}</p>`;
            }
            taxesDiv.innerHTML += '<p class=greybox id="netSalary">Your New Net Salary: ' + netSalary.toFixed(2) + '</p>';
            taxesDiv.innerHTML += `<p class=grey id=monthlyNetSalary> Your Monthly Net Salary: ${monthlyNetSalary}</p>`;
            welcomeScreen.innerHTML += `<a href="expenses.html" id="nextButton">Next</a>`;
})}


// Initialize the application
// this isnt full y finshed it needs to be linked up correct for the fetch to actually work.