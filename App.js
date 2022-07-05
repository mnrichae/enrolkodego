const express = require('express');
const app = express();
const port = 3006;
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cookieParser());

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


app.set('view engine', 'hbs');
app.use('/auth', require('./routes/auth'));

app.use('/', require('./routes/accountRoutes'))

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})