const express = require('express')
const app = express()


const red = {hi: "There"}

app.get("/", (req, res) => {
    res.send(red.hi)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
})