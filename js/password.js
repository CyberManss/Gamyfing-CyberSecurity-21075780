//PASSWORD GAME:

function checkPasswordStrength(password) {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /[0-9]/.test(password);
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);


    //Analysing the strength of the password and how robust it is
    if (lengthCriteria && numberCriteria && upperCaseCriteria && lowerCaseCriteria && specialCharacterCriteria) {
        return "strong";
    } else if (lengthCriteria && (numberCriteria || upperCaseCriteria || lowerCaseCriteria)) {
        return "medium";
    }else {
        return "Weak";
    }
}

//event listener for passwod check when button is clicked by the user
document.addEventListener('DOMContentLoaded', function() {
    //strength of password game logic password.hmtl
    if (document.getElementById('submit-button')) {
        document.getElementById('submit-button').addEventListener('click', function() {
            const password = document.getElementById('password-input').value;
            const strength = checkPasswordStrength(password);
            const feedbackElement = document.getElementById('feedback');

            //if and else if functions for ranking of password
            if (strength === "strong") {
                feedbackElement.textContent = "Well done!, Your password is safe and robust";
                feedbackElement.style.color = "green";
            } else if (strength === "medium") {
                feedbackElement.textContent = "Your password is medium strong. Try adding more character/special character";
                feedbackElement.style.color = "orange";
            } else {
                feedbackElement.textContent = "Your password is very weak, add more numbers, upper cases/lower cases, and some special character for security";
                feedbackElement.style.color = "red";
            }
        });
    }
});