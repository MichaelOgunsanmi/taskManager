const sgMail = require('@sendgrid/mail');
const config = require('config')

sgMail.setApiKey(config.get('SENDGRID_API_KEY'));


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ogunsanmimichael@gmail.com',
        subject: 'Welcome to Task Manager!',
        text: `Hi ${name}, \nWelcome to the Task Manager App.\nLet me know how you get along with the app`,
    });
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ogunsanmimichael@gmail.com',
        subject: 'Account Deleted Successfully | Task Manager',
        text: `Goodbye ${name}, \nWe are sorry to let you go!.\nCan you tell us how to improve and serve our other clients better?`,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};
