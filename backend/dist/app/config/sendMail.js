"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, html, subject) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'junayetshiblu0@gmail.com',
            pass: 'noyj xebx ehmu daqz',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mailOptions = {
        from: '"EduSync EMS" <junayetshiblu0@gmail.com>', // ✅ Sender email ঠিক করো
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendMail.js.map