const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.sendReceipt = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"Donation Platform" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Email send failed:', error);
    }
};
