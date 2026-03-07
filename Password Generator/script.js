
const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('length'); // 'lengtSlider' xatosi tuzatildi
const lengthDisplay = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateButton = document.getElementById('generate-btn');
const copyButton = document.getElementById('copy-btn');
const strengthBar = document.querySelector('.strength-bar'); // Nuqta (.) qo'shildi
const strengthLabel = document.getElementById('strength-value'); // HTML dagi ID ga moslandi

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

lengthSlider.addEventListener('input', () => {
    lengthDisplay.textContent = lengthSlider.value;
});

function generatePassword() {
    const length = Number(lengthSlider.value);
    const hasUpper = uppercaseCheckbox.checked;
    const hasLower = lowercaseCheckbox.checked;
    const hasNumber = numbersCheckbox.checked;
    const hasSymbol = symbolsCheckbox.checked;

    if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
        alert('Iltimos, kamida bitta turdagi belgini tanlang!');
        return;
    }

    let allCharacters = "";
    if (hasUpper) allCharacters += uppercaseChars;
    if (hasLower) allCharacters += lowercaseChars;
    if (hasNumber) allCharacters += numberChars;
    if (hasSymbol) allCharacters += symbolChars;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }

    passwordInput.value = password;
    updateStrengthMeter(password);
}

function updateStrengthMeter(password) {
    let strengthScore = 0;
    const length = password.length;

    if (/[A-Z]/.test(password)) strengthScore += 20;
    if (/[a-z]/.test(password)) strengthScore += 20;
    if (/[0-9]/.test(password)) strengthScore += 20;
    if (/[^A-Za-z0-9]/.test(password)) strengthScore += 20;
    if (length > 10) strengthScore += 20;

    strengthBar.style.width = strengthScore + '%';

    let labelText = "";
    let barColor = "";

    if (strengthScore <= 40) {
        barColor = "#fc8181"; 
        labelText = "Weak";
    } else if (strengthScore <= 70) {
        barColor = "#fbd38d"; 
        labelText = "Medium";
    } else {
        barColor = "#68d391"; 
        labelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = labelText;
}

generateButton.addEventListener('click', generatePassword);

copyButton.addEventListener('click', () => {
    const pass = passwordInput.value;
    if (!pass) return;

    navigator.clipboard.writeText(pass).then(() => {
        showCopySuccess();
    });
});

function showCopySuccess() {
    copyButton.className = "fas fa-check";
    copyButton.style.color = "#48bb78";
    
    setTimeout(() => {
        copyButton.className = "fas fa-copy";
        copyButton.style.color = "";
    }, 1500);
}

window.addEventListener("DOMContentLoaded", generatePassword);