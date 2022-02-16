const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db Connected");
  } catch (err) {
    console.log(err.message, "err in dbConnect");
    throw new Error();
  }
};

module.exports = dbConnect;
