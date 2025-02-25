// Phishing Game
// List of emails. Either phishing emails or legitimate emails.
// Each email is represented with a variable 'isPhishing' which is set to true or false.
const emails = [
    {
        text: "Dear user, your account has been compromised! click this link to reset your password",
        isPhishing: true
    },
    {
        text: "Hello, your recent order at gymshark was successful! click here to view your order",
        isPhishing: false,
    },
    {
        text: "Dear Customer, please verify your gitlab account by clicking this link and following the steps",
        isPhishing: true,
    },
    {
        text: "Your Amazon order has been dispatched! click here to track your order",
        isPhishing: false,
    }
];

let currentEmailIndex = 0; //tracking all emails
let score = 0; //tracking score

//displaying the email
function displayEmail() {
    const emailText = emails[currentEmailIndex].text;
    document.getElementById("email-text").textContent = emailText;
    document.getElementById("feedback").textContent = ""; //to clear the previous feedback
}

//checking users decision
function checkAnswer(isPhishingChosen) {
    const correctAnswer = emails[currentEmailIndex].isPhishing;
    if (isPhishingChosen === correctAnswer) {
        score++;
        document.getElementById("feedback").textContent = "Correct!";
    } else {
        document.getElementById("feedback").textContent = "Incorrect!, Thank you for your secret details";
    }

    //displaying the next email after x amount of time
    setTimeout(() => {
        currentEmailIndex++;

        if (currentEmailIndex < emails.length) {
            displayEmail(); //next email
        } else {
            document.getElementById("email-text").textContent = "Game Over! Your score is " + score;
            document.getElementById("feedback").textContent = "";
            document.getElementById("safe-button").disabled = true;
            document.getElementById("phishing-button").disabled = true;
        }
    }, 1000);
}

//event listeners for the buttons the user can choose
document.getElementById("safe-button").addEventListener("click", () => {
    checkAnswer(false); //if user selects the safe button
});

document.getElementById("phishing-button").addEventListener("click", () => {
    checkAnswer(true); //if user selects the phishing button
});

//The start of the game when user sees the first email
displayEmail();
