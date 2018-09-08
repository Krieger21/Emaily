const express = require('express');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require("passport")
require("./models/user.js")
require("./services/passport.js");
const keys = require('./config/keys')

const app = express();

app.use(
    cookieSession({
        maxAge: 4 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(keys.mongoURI)

const PORT = process.env.PORT || 5000

require("./routes/authRoutes.js")(app)

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
})