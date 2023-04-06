const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();

const errorController = require("./controllers/error")
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById('642aaf1369ffe453273909cb')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodblink')
    .then(() => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        username: 'dummy',
                        email: 'dummy@gmail.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            })
        app.listen(3000)
    })
    .catch(err => console.log(err))

