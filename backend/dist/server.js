"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./app/DB/index"));
let server;
async function main() {
    try {
        await mongoose_1.default.connect("mongodb+srv://edusync:WIo7u9TShcTespwN@cluster0.l4anbhy.mongodb.net/edusyncBD?retryWrites=true&w=majority&appName=Cluster0");
        (0, index_1.default)();
        server = app_1.default.listen(5000, () => {
            console.log(`app is listening on port ${5000}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}
main();
process.on("unhandledRejection", (err) => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
//# sourceMappingURL=server.js.map