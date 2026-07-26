import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config/index";
let server: Server;

async function main() {
  try {
    const mongoUri = config.database_url;
    if (!mongoUri) {
      throw new Error("Missing DATABASE_URL in environment configuration.");
    }

    await mongoose.connect(mongoUri);

    // await seedSuperAdmin();
    server = app.listen(5000, () => {
      console.log(`app is listening on port ${5000}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
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
