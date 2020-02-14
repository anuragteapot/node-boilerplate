const HOST = process.env.MONGO_HOST || "localhost";
const PORT = process.env.MONGO_PORT || 27017;
const DATABASE = process.env.APP_MONGO_DB || "dummy";
const USER = process.env.APP_MONGO_USER || "root";
const PASSWORD = process.env.APP_MONGO_PASS || "";

let MONGO_URI = "mongodb://127.0.0.1:27017/";

if(USER && PASSWORD) {
   MONGO_URI = `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/`;
}

module.exports = {
  development: {
    db: {
      name: DATABASE || "dev_db",
      uri: MONGO_URI || "mongodb://127.0.0.1:27017/"
    }
  },
  production: {
    db: {
      name: DATABASE || "prod_db",
      uri: MONGO_URI || "mongodb://127.0.0.1:27017/"
    }
  },
  staging: {
    db: {
      name: DATABASE || "staging_db",
      uri: MONGO_URI || "mongodb://127.0.0.1:27017/"
    }
  }
};
