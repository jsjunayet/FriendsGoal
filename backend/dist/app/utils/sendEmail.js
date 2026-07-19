"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = __importDefault(require("../config/index"));
const sendEmail = async (to, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com.',
        port: 587,
        secure: index_1.default.NODE_ENV === 'production',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: 'mezbaul@programming-hero.com',
            pass: 'xfqj dshz wdui ymtb',
        },
    });
    await transporter.sendMail({
        from: 'mezbaul@programming-hero.com', // sender address
        to, // list of receivers
        subject: 'Reset your password within ten mins!', // Subject line
        text: '', // plain text body
        html, // html body
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map