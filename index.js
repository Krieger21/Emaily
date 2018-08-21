const express = require('express')
const app = express()


const red = {
    hi: "There",
    hello: "no",
}

app.get("/", (req, res) => {
    res.send(red.hello)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
})