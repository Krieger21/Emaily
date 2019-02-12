const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require("passport");
const keys = require('./config/keys');
const bodyParser = require('body-parser');
require("./models/user.js");
require("./services/passport.js");

const app = express();

app.use(bodyParser.json());
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

require("./routes/authRoutes.js")(app);
require("./routes/billingRoutes.js")(app);

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
})