var nodemailer = require('nodemailer');

exports = module.exports = SmtpMailer;
var self = null;

function SmtpMailer() {
    console.log("constructor - SmtpMailer");
    self = this;
}

//config
var config = require('./config');

SmtpMailer.prototype.sendMail = function (subject, message) {
    console.log("SMTP-....");
    // create reusable transporter object using the default SMTP transport
	var url = "smtps://" + config.smtpUser + "%40gmail.com:" + config.smtpPwd + "@smtp.gmail.com";
    var transporter = nodemailer.createTransport(url);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"smartStone" <stone.lathe.biosas@gmail.com>', // sender address
        to: 'stone.lathe.biosas@gmail.com', // list of receivers
        subject: subject, // Subject line
        text: '', // plaintext body
        html: message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

