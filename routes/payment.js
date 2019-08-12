exports.pay = (paypal) => (req, res) => {
    const {
        price,
        currency,
    } = req.body;
    if (currency !== 'USD' && currency !== 'EUR' && currency !== 'PLN' && currency !== 'BTC') {
        return res.json('wrong currency')
    }
    const orderNumber = Math.floor(Math.random() * 100000)
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://ph-store.herokuapp.com/",
            "cancel_url": "https://ph-store.herokuapp.com/cart"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Ph-store purcharse",
                    "sku": orderNumber,
                    "price": price,
                    "currency": currency,
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": currency,
                "total": price
            },
            "description": `Order number ${orderNumber}`
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {

                    res.json(payment.links[i].href)

                }
            }
        }
    });

}


exports.successPay = (paypal) => (req, res, next) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            res.send('Success');
        }
    });
}

exports.cancelledPay = () => (req, res) => res.send('Cancelled')