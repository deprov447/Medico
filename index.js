const express = require("express")
const csv = require('csvtojson')
const mongoose = require('mongoose')
const dotenv = require("dotenv")

const app = express()

app.use(express.static('public'))
app.use(express.json())
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
    console.log(`Connected to Online DB at ${process.env.MONGO_URL}`);
});

csv().fromFile("./result.csv")
    .then(data => {
        console.log("Generate parsed CSV file")
        require("./routes").appLogic(app, data)
    })
