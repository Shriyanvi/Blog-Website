const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' });
app.use("/uploads" , express.static(path.join(__dirname , 'uploads')));


const session = require('express-session')
app.use(express.static('views/images'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'secret',
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true }
}))


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'hbs');
const port = 3334;

app.use('/', require("./routes/blog"));

mongoose.connect('mongodb+srv://aditi2003goyal:B9lhyzL1OnbrKqAF@cluster0.s5wioyl.mongodb.net/Blog').then(() => {

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    })
})
