"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, html, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not found. Skipping email send.");
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== "false",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Friends Goal Society'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]+>/g, ''), // Fallback plain text is critical for spam filters
        replyTo: process.env.EMAIL_USER,
        headers: {
            "X-Entity-Ref-ID": new Date().getTime().toString(),
            "List-Unsubscribe": `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
        },
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map