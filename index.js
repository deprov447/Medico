const express = require("express")
const csv = require('csvtojson')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 4444
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

const authToken = (req) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return 401
    return jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return 403
        return user
    })
}

const appLogic = (jsonData) => {
    app.get("/", (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("notlogged in", user)
            res.render("home.ejs")
        }
        else {
            console.log("logged in", user)
            // Find all details of user from mongoose and pass it to following ejs
            res.render("home-logged-in.ejs", { user: user })
        }
    })

    app.get("/how-it-works", (req, res) => {
        res.render("how-it-works.ejs")
    })

    app.get("/about", (req, res) => {
        res.render("about.ejs", { data: jsonData })
    })

    app.get("/login-signup", (req, res) => {
        res.render("login-signup.ejs")
    })

    app.post("/login-signup", (req, res) => {
        const username = req.body.username;
        // Authorize

        const user = {
            name: username
            // should be id from mongoose
        }
        const accessToken = jwt.sign(user, process.env.SECRET)
        res.json({ accessToken })
    })

    app.listen(port, () => {
        console.log(`Medi-lytics app running on port ${port}`)
    })
}

csv().fromFile("./result.csv")
    .then(data => appLogic(data))