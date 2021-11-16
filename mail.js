const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
    }
})

const sendMail = ({ subject, text, html, to, when }) => {
    const option = {
        from: process.env.MAIL_ID,
        to,
        subject,
        html,
    }

    transporter.sendMail(option, function (err, info) {
        if (err) {
            console.log(err)
        }
        console.log("sent", info.response)
    })
}

module.exports = sendMail
