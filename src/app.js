const express = require('express');
const cors = require('cors');
const path = require('path');
require('../db/db');
const productRouter = require('../router/product');
const userRouter = require('../router/user');
const favorityRouter = require('../router/favority');
const orderRouter = require('../router/orders');
const chosenRouter = require('../router/chosen');
const categoryRouter = require('../router/category');
const oAuthGoogle = require('../oAuth/googleStrategy');

const app = express();
const urlPublic = path.join(__dirname,'../public');

app.use(cors({
  origin: ['http://localhost:4173','https://commerce12s.netlify.app','https://www.commerce12s.netlify.app','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true
}));

app.use(express.json());

app.use(userRouter);
app.use(favorityRouter);
app.use(orderRouter);
app.use(chosenRouter);
app.use(productRouter);
app.use(categoryRouter);

app.use(express.static(urlPublic));

app.use(oAuthGoogle)










const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}/productapi`);
    console.log(`http://localhost:${port}/category`);
});
