// public/app.js
document.getElementById('submitAmount').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const amountError = document.getElementById('amountError');

    if (!amount || amount <= 0) {
        amountError.textContent = 'Please enter a valid amount.';
    } else {
        amountError.textContent = '';
        document.getElementById('paymentForm').style.display = 'block';
    }
});

// Format card number input
document.getElementById('cardNumber').addEventListener('input', function(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits

    input.value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Group in sets of 4
});

// Payment form submission
document.getElementById('payButton').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, ''); // Remove spaces for submission
    const expDate = document.getElementById('expDate').value;
    const cvv = document.getElementById('cvv').value;

    // if(!validateCardNumber(cardNumber)){
    //     document.getElementById('successMessage').textContent = 'Invalid Card number';
    //     return;
    // }
    if (!validateExpDate(expDate)){
        document.getElementById('successMessage').textContent = 'Invalid Expiration Date';
        return;
    }
    if (!validateCVV(cvv)){
        document.getElementById('successMessage').textContent = 'Invalid CVV';
        return;
    }


    // Simple client-side validation
    // if (!validateCardNumber(cardNumber) || !validateExpDate(expDate) || !validateCVV(cvv)) {
    //     document.getElementById('successMessage').textContent = 'PLEASE ENTER VALID DETAILS';
    //     return;
    // }

    // Send data to the server
    fetch('/api/pay', {
//for localhost        fetch('/pay', {    
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, cardNumber, expDate, cvv })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log(data.ress);
        console.log('the request was:');
        console.log(data.req);
        if (data.success) {
            document.getElementById('successMessage').textContent = 'Payment successful!';
        } else {
            document.getElementById('successMessage').textContent = 'Payment failed!';
        }
    })
    .catch(err => {
        console.error('Error:', err);
        document.getElementById('successMessage').textContent = 'Error processing payment.';
    });
});

// Client-side validation functions
function validateCardNumber(cardNumber) {
    return cardNumber.length === 16 && /^\d+$/.test(cardNumber);
}

function validateExpDate(expDate) {
    return /^\d{4}$/.test(expDate); // MMYY format check
}

function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv); // 3 or 4 digits
}
