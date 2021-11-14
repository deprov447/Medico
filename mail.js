const mailjet = require('node-mailjet')
    .connect(process.env.MAIL_API_KEY, process.env.MAIL_SECRET_KEY)

const sendMail = ({ subject, text, html, to, when }) => {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .action("schedule")
        .request({
            "Date": when,
            "Messages": [
                {
                    "From": {
                        "Email": "medi-lysis@deprov447.tech",
                        "Name": "Medi-lysis"
                    },
                    "To": [
                        {
                            "Email": to.email,
                            "Name": to.name
                        }
                    ],
                    "Subject": subject,
                    "TextPart": text,
                    "HTMLPart": html,
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    request
        .then((result) => {
            console.log("Mail sent", result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
}

module.exports = sendMail