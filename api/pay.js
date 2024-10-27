// api/pay.js
const { APIContracts, APIControllers } = require('authorizenet');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { amount, cardNumber, expDate, cvv } = req.body;

    // Basic backend validation
    if (!amount || !cardNumber || !expDate || !cvv) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // Set up Authorize.net payment processing
    const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.AUTHORIZE_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);

    const creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber(cardNumber);
    creditCard.setExpirationDate(expDate);
    creditCard.setCardCode(cvv);

    const paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    const transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setAmount(amount);
    transactionRequestType.setPayment(paymentType);

    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
    
    return new Promise((resolve) => {
        ctrl.execute(() => {
            const apiResponse = ctrl.getResponse();
            const response = new APIContracts.CreateTransactionResponse(apiResponse);

            if (response != null && response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                res.status(200).json({ success: true, message: 'Payment successful!' });
            } else {
                res.status(500).json({ success: false, message: 'Payment failed!' });
            }
            resolve();
        });
    });
};
