
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";



const pages = document.querySelectorAll(".page");
const menuItems = document.querySelectorAll(".menu li");

function showPage(pageId, menuItem) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    if (menuItem) {
        menuItem.classList.add("active");
    }
}



const loanButton = document.getElementById("checkLoan");

if (loanButton) {

    loanButton.addEventListener("click", () => {

        const name = document.getElementById("name").value.trim();

        const salary = Number(document.getElementById("salary").value);

        const creditScore = Number(document.getElementById("score").value);

        const existingEmi = Number(document.getElementById("existingEmi").value);

        const age = Number(document.getElementById("age").value);

        const result = document.getElementById("loanResult");

        if (
            name === "" ||
            salary <= 0 ||
            creditScore <= 0 ||
            existingEmi < 0 ||
            age <= 0
        ) {

            result.innerHTML = `
                <h3 class="danger">Please fill all fields correctly.</h3>
            `;

            return;
        }

        let reasons = [];

        if (salary < 30000)
            reasons.push("Monthly salary should be above ₹30,000.");

        if (creditScore < 700)
            reasons.push("Credit score should be at least 700.");

        if (existingEmi >= 20000)
            reasons.push("Existing EMI should be below ₹20,000.");

        if (age < 21)
            reasons.push("Minimum age should be 21 years.");

        let status = "";

        if (reasons.length === 0) {

            status = "Approved";

            const eligibleLoan = salary * 20;

            result.innerHTML = `
                <h3 class="success">
                    ✅ Loan Approved
                </h3>

                <p><b>Name:</b> ${name}</p>

                <p><b>Eligible Loan:</b>
                ₹${eligibleLoan.toLocaleString()}</p>

                <p><b>Risk Level:</b> Low</p>

                <p>
                Congratulations! You satisfy all eligibility conditions.
                </p>
            `;

        } else {

            status = "Rejected";

            let html = `
                <h3 class="danger">
                    ❌ Loan Rejected
                </h3>

                <p><b>Reasons:</b></p>

                <ul>
            `;

            reasons.forEach(reason => {

                html += `<li>${reason}</li>`;

            });

            html += `
                </ul>

                <p>
                Please improve the above conditions and apply again.
                </p>
            `;

            result.innerHTML = html;
        }

       

        if (GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_SCRIPT_URL") {

            fetch(GOOGLE_SCRIPT_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name,

                    salary,

                    creditScore,

                    existingEmi,

                    age,

                    status

                })

            })
            .then(() => {

                console.log("Saved to Google Sheets");

            })
            .catch(error => {

                console.error(error);

            });

        }

    });

}


const creditButton = document.getElementById("analyzeCredit");

if (creditButton) {

    creditButton.addEventListener("click", () => {

        const score = Number(document.getElementById("creditScore").value);

        const result = document.getElementById("creditResult");

        if (score < 300 || score > 900) {

            result.innerHTML = `
                <h3 class="danger">
                    Invalid Credit Score
                </h3>

                <p>
                    Please enter a score between
                    <b>300</b> and <b>900</b>.
                </p>
            `;

            return;
        }

        if (score >= 750) {

            result.innerHTML = `
                <h3 class="success">
                    ⭐ Excellent Credit Score
                </h3>

                <p><b>Risk Level:</b> Low</p>

                <p>
                    Your credit profile is excellent.
                    Banks are highly likely to approve
                    your loan applications.
                </p>
            `;

        }

        else if (score >= 650) {

            result.innerHTML = `
                <h3 class="warning">
                    👍 Good Credit Score
                </h3>

                <p><b>Risk Level:</b> Medium</p>

                <p>
                    Pay EMIs on time and maintain
                    low credit utilization to
                    improve your score.
                </p>
            `;

        }

        else {

            result.innerHTML = `
                <h3 class="danger">
                    Poor Credit Score
                </h3>

                <p><b>Risk Level:</b> High</p>

                <ul>
                    <li>Pay all EMIs on time.</li>
                    <li>Reduce credit card usage.</li>
                    <li>Avoid multiple loan applications.</li>
                    <li>Clear outstanding debts.</li>
                </ul>
            `;

        }

    });

}


const emiButton = document.getElementById("calculateEMI");

if (emiButton) {

    emiButton.addEventListener("click", () => {

        const principal = Number(document.getElementById("loanAmount").value);

        const annualRate = Number(document.getElementById("interest").value);

        const months = Number(document.getElementById("months").value);

        const result = document.getElementById("emiResult");

        if (
            principal <= 0 ||
            annualRate <= 0 ||
            months <= 0
        ) {

            result.innerHTML = `
                <h3 class="danger">
                    Please enter valid values.
                </h3>
            `;

            return;

        }

        const monthlyRate = annualRate / 12 / 100;

        const emi =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        const totalPayment = emi * months;

        const totalInterest = totalPayment - principal;

        result.innerHTML = `

            <h3 class="success">
                EMI Calculation
            </h3>

            <p>
                <b>Monthly EMI:</b>
                ₹${emi.toFixed(2)}
            </p>

            <p>
                <b>Total Interest:</b>
                ₹${totalInterest.toFixed(2)}
            </p>

            <p>
                <b>Total Amount Payable:</b>
                ₹${totalPayment.toFixed(2)}
            </p>

        `;

    });

}





const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual Gemini API key

const aiButton = document.getElementById("askAI");

aiButton.addEventListener("click", async () => {

    const question = document.getElementById("question").value.trim();
    const result = document.getElementById("aiResult");

    if(question===""){
        result.innerHTML="<h3>Please enter a question.</h3>";
        return;
    }

    result.innerHTML="<h3>Thinking...</h3>";

    try{

        const response=await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                contents:[
                    {
                        parts:[
                            {
                                text:`You are a financial advisor. Answer simply.

Question:
${question}`
                            }
                        ]
                    }
                ]
            })
        });

        const data=await response.json();

        console.log(data);

        if(data.error){
            throw new Error(data.error.message);
        }

        const answer=data.candidates[0].content.parts[0].text;

        result.innerHTML=`
            <h3>AI Financial Advice</h3>
            <p>${answer.replace(/\n/g,"<br>")}</p>
        `;

    }
    catch(error){

        result.innerHTML=`
            <h3>Error</h3>
            <p>${error.message}</p>
        `;

        console.error(error);

    }

});