const express = require("express")
const csv = require('csvtojson');

const port = process.env.PORT || 4444
const app = express()

app.use(express.static('public'))

const appLogic = (jsonData) => {
    app.get("/", (req, res) => {
        res.render("home.ejs", { data: jsonData })
    })

    app.listen(port, () => {
        console.log(`Medi-lytics app running on port ${port}`)
    })
}

csv().fromFile("./result.csv")
    .then(data => appLogic(data))