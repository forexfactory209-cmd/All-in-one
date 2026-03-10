const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_USER || 'admin',
        pass: process.env.SMTP_PASS || 'password'
    }
});

async function sendEmail(to, subject, htmlContent) {
    if (!to) {
        console.log('No email address provided');
        return;
    }

    try {
        console.log(`[EmailService] Sending email to ${to} - Subject: ${subject}`);

        // Mocking the success
        // const info = await transporter.sendMail({
        //     from: '"SomStay Notifications" <no-reply@somstay.com>',
        //     to,
        //     subject,
        //     html: htmlContent
        // });
        // console.log(`[EmailService] Email sent successfully: ${info.messageId}`);
        console.log(`[EmailService] Email simulated successfully sent!`);
    } catch (error) {
        console.error(`[EmailService] Error sending email:`, error);
        throw error;
    }
}

module.exports = {
    sendEmail
};
