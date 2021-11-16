const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");

const Doctor = require("./model/doctor-model");
const Patient = require("./model/patient-model");
const sendMail = require("./mail");

const port = process.env.PORT || 4444;

const authToken = (req) => {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return 401;
    return jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return 403;
        return user;
    });
};

const appLogic = (app, jsonData) => {
    app.get("/", async (req, res) => {
        const user = authToken(req);
        if (user == 401 || user == 403) {
            console.log("Home notlogged in", user);
            res.render("home.ejs");
        } else {
            console.log("Home logged in", user);
            const patientData = await Patient.findById(user);
            if (patientData == null) {
                console.log("doctor login", user);
                const doctorData = await Doctor.findById(user);
                if (doctorData !== null) {
                    const allPatientData = await Patient.find({});
                    res.render("doctor.ejs", { userData: doctorData, allPatientData: allPatientData });
                }
                else
                    res.sendStatus(403);
            }
            else
                res.render("home-logged-in.ejs", { userData: patientData });
        }
    });

    app.get("/how-it-works", (req, res) => {
        res.render("how-it-works.ejs");
    });

    app.get("/about", (req, res) => {
        res.render("about.ejs", { data: jsonData });
    });

    app.get("/login-signup", (req, res) => {
        res.render("login-signup.ejs");
    });

    app.post("/login-signup", async (req, res) => {
        if (req.body.reqType === "login") {
            const data = {
                name: req.body.name,
                password: req.body.password, // TODO: password should be salted
            };
            let accessToken;
            console.log(req.body)
            if (req.body.usertype === "doctor") {
                const returnData = await Doctor.findOne(data);
                if (returnData == null) res.sendStatus(403);
                accessToken = jwt.sign(returnData._id.toString(), process.env.SECRET);
            } else {
                const returnData = await Patient.findOne(data);
                if (returnData == null) res.sendStatus(403);
                console.log(returnData);
                accessToken = jwt.sign(returnData._id.toString(), process.env.SECRET);
            }
            res.json({ accessToken: accessToken });

        } else {
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password, // TODO: password should be salted
                imageURL: req.body.imageURL,
            };
            let accessToken;
            if (req.body.usertype === "doctor") {
                let newDoctor = new Doctor(data);
                const savedData = await newDoctor.save();
                accessToken = jwt.sign(savedData._id.toString(), process.env.SECRET);
            } else {
                let newPatient = new Patient(data);
                const savedData = await newPatient.save();
                accessToken = jwt.sign(savedData._id.toString(), process.env.SECRET);
            }
            res.json({ accessToken: accessToken });
        }
    });

    app.post("/increaseCredit", async (req, res) => {
        console.log("REQBODY", req.body);
        const user = authToken(req);
        if (user == 401 || user == 403) {
            console.log("Unauthed credit attempt", user);
            res.sendStatus(user);
        } else {
            console.log("Credit attempt", user);
            // const userData = await Doctor.findById(user);
            // if (userData == null) {
            //     res.sendStatus(403);
            // }
            const patient = await Patient.findById(req.body.patientId);
            console.log(req.body)
            if (patient == null) {
                res.sendStatus(404);
            }
            await patient.updateOne({
                credit: patient.credit + req.body.increaseCreditBy,
            });
            res.redirect("/");
        }
    });

    app.post("/addAppointment", async (req, res) => {
        const user = authToken(req);
        if (user == 401 || user == 403) {
            console.log("unauthed appointment attempt", user);
            res.sendStatus(user);
        } else {
            console.log("appointment attempt", user);
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403);
            }
            let patient = await Patient.findById(req.body.patientId);
            if (patient == null) {
                res.sendStatus(404);
            }
            patient.appointments.push({
                doctor: user,
                date: req.body.appointmentDate,
            });


            sendMail({
                subject: "Appointment Scheduled",
                html: `<h3>An appointment has been scheduled with Dr. ${userData.name} at ${DateTime.fromISO(req.body.appointmentDate).toLocaleString(DateTime.DATETIME_MED)}</h3>
                <h3>Kindly add that to your calendar</h3>
                - Team ${process.env.NAME}
            `,
                to: patient.email,
                when: DateTime.now().toISO(),
            });
            await patient.save();
            res.redirect("/");
        }
    });

    app.post("/addMedicine", async (req, res) => {
        const user = authToken(req);
        if (user == 401 || user == 403) {
            console.log("unauthed presc attempt", user);
            res.sendStatus(user);
        } else {
            console.log("presc attempt", user);
            const userData = await Doctor.findById(user);
            if (userData == null) {
                res.sendStatus(403);
            }
            console.log(req.body)
            let patient = await Patient.findById(req.body.patientId);
            if (patient == null) {
                res.sendStatus(404);
            }
            patient.medSchedule.push({
                med: req.body.med,
                quantity: req.body.quantity,
                period: req.body.period,
            });
            await patient.save();
            res.redirect("/");
        }
    });

    app.listen(port, () => {
        console.log(`${process.env.NAME} app running on port ${port}`);
    });
};

module.exports = { appLogic };
