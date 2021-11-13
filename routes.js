const jwt = require('jsonwebtoken');

const Doctor = require('./model/doctor-model');
const Patient = require('./model/patient-model');

const port = process.env.PORT || 4444

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

const appLogic = (app, jsonData) => {
    app.get("/", async (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("notlogged in", user)
            res.render("home.ejs")
        }
        else {
            console.log("logged in", user)
            const userData = await Patient.findById(user);
            if (userData == null) {
                res.sendStatus(403)
            }
            res.render("home-logged-in.ejs", { userData })
        }
    })

    app.get("/doctor", async (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("doctor notlogged in", user)
            res.sendStatus(user)
        }
        else {
            console.log("doctor logged in", user)
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403)
            }
            res.render("doctor.ejs", { userData })
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

    app.post("/login-signup", async (req, res) => {
        if (req.body.reqType === "login") {
            const username = req.body.username;
            // Authorize

            const user = {                                  // should be id from mongoose
                name: username
            }
            const accessToken = jwt.sign(user, process.env.SECRET)
            res.json({ accessToken })
        }
        else {
            const data = {
                name: req.body.name,
                password: req.body.password,                // TODO: password should be salted
                imageURL: req.body.imageURL,
            }
            let accessToken
            if (req.body.usertype === 'doctor') {
                let newDoctor = new Doctor(data)
                const savedData = await newDoctor.save()
                accessToken = jwt.sign(savedData._id.toString(), process.env.SECRET)
            }
            else {
                let newPatient = new Patient(data)
                const savedData = await newPatient.save()
                accessToken = jwt.sign(savedData._id.toString(), process.env.SECRET)
            }
            res.json({ accessToken: accessToken })
        }
    })

    app.post("/increaseCredit", async (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("unauthed credit attempt", user)
            res.sendStatus(user)
        }
        else {
            console.log("credit attempt", user)
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403)
            }
            const patient = await Patient.findById(req.body.patientId);
            if (patient == null) {
                res.sendStatus(404)
            }
            await patient.updateOne({ credit: patient.credit + req.body.increaseCreditBy })
            res.redirect("/doctor")
        }
    })

    app.post("/addAppointment", async (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("unauthed appointment attempt", user)
            res.sendStatus(user)
        }
        else {
            console.log("appointment attempt", user)
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403)
            }
            let patient = await Patient.findById(req.body.patientId);
            if (patient == null) {
                res.sendStatus(404)
            }
            patient.appointments.push({
                doctor: user,
                date: req.body.appointmentDate
            })
            await patient.save()
            res.redirect("/doctor")
        }
    })

    app.post("/addMedicine", async (req, res) => {
        const user = authToken(req)
        if (user == 401 || user == 403) {
            console.log("unauthed presc attempt", user)
            res.sendStatus(user)
        }
        else {
            console.log("presc attempt", user)
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403)
            }
            let patient = await Patient.findById(req.body.patientId);
            if (patient == null) {
                res.sendStatus(404)
            }
            patient.medSchedule.push({
                med: req.body.med,
                quantity: req.body.quantity,
                period: req.body.period
            })
            await patient.save()
            res.redirect("/doctor")
        }
    })

    app.listen(port, () => {
        console.log(`Medi-lytics app running on port ${port}`)
    })
}

module.exports = { appLogic };