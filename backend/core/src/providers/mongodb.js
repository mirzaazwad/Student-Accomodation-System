const mongoose = require("mongoose");
const { log } = require("./logger");

class MongoDBClient {
  static instance;

  static getInstance() {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }

    return MongoDBClient.instance;
  }

  registerEvents() {
    mongoose.set("strictQuery", true);
    mongoose.set("debug", false);
    mongoose.set("toJSON", {
      virtuals: true,
    });

    mongoose.connection.on("connected", () => {
      log("info", "✅ Mongoose connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      log("error", "⛔️ Mongoose connection error: " + err);
    });

    mongoose.connection.on("disconnected", () => {
      log("error", "🟠 Mongoose connection disconnected");
    });

    process.on("SIGINT", () => {
      log("warn", "\n");
      log(
        "warn",
        "🟠 Mongoose connection disconnected through app termination"
      );
      mongoose.connection.close();
      process.exit(0);
    });
  }

  getMongoURL() {
    const mongoUrl = process.env.MONGO_URI;
    if (mongoUrl) {
      return mongoUrl;
    } else {
      log("error", "⛔️ MONGO_URI is not defined in .env file");
      process.exit(1);
    }
  }

  async connect(onSuccess) {
    const options = {
      autoIndex: true,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 300000,
      maxPoolSize: 5,
      minPoolSize: 2,
    };

    this.registerEvents();

    try {
      await mongoose.connect(this.getMongoURL(), options);
      onSuccess?.();
    } catch (error) {
      log("error", "⛔️ Mongoose database failed: " + JSON.stringify(error));
    }
  }
}

module.exports = {
  MongoDBClient,
};
