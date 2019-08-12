const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const feedback = require('./routes/feedback');
const products = require('./routes/products');
const payment = require('./routes/payment');
const credentials = require('./credentials');

const db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});
// const db = require('knex')({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'password',
//         database: 'shoppingApp'
//     }
// });

paypal.configure({
    'mode': 'sandbox',
    'client_id': credentials.clientId,
    'client_secret': credentials.clientSecret
});

app.use(cors());
app.use(bodyParser.json());
app.set('x-powered-by', false);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/', (req, res, next) => {
    res.send('App is running')
});
app.get('/products', products.getProducts(db));
app.post('/addproduct', products.addProduct(db));
app.post('/addfeedback', feedback.insertFeedback(db));
app.get('/feedback', feedback.getFeedbacks(db));
app.post('/pay', payment.pay(paypal));
app.get('/success', payment.successPay(paypal));
app.get('/cancel', payment.cancelledPay());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})