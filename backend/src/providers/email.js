const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");
const dotenv = require("dotenv");
dotenv.config();

class EmailServiceImpl {
  static instance;
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_TLS === "true",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  static getInstance() {
    if (!EmailServiceImpl.instance) {
      EmailServiceImpl.instance = new EmailServiceImpl();
    }

    return EmailServiceImpl.instance;
  }

  async sendEmail(receiprents, subject, message) {
    try {
      return await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: receiprents,
        subject: subject,
        text: message,
      });
    } catch (err) {
      console.log(err);
      throw new ApiError(500, "Unable to send email. Please try again later.");
    }
  }
}

const EmailService = EmailServiceImpl.getInstance();

module.exports = EmailService;
