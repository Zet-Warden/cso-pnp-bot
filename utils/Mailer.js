const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs').promises;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
    },
});

async function readHTMLFile(path) {
    const html = await fs.readFile(path, { encoding: 'utf-8' });
    return html;
}

async function sendHTMLEmail(data = {}) {
    const html = await readHTMLFile(__dirname + '/email.html');
    var template = handlebars.compile(html);
    var htmlToSend = template(data);

    var mailOptions = {
        from: process.env.EMAIL,
        to: data['Email Address'],
        subject: `[47th PNP] ${data['Requesting Organization']} Online Publicity Approval Status`,
        html: htmlToSend,
    };

    transporter.sendMail(mailOptions);
}

module.exports = {
    sendHTMLEmail,
};
