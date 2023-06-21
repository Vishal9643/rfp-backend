const mongoose = require("mongoose");

// Establishing database connection
const dbConnection = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(`error: ${err}`);
  });

// Event handlers for database connection status
mongoose.connection.on("connected", () => {
  console.log(`mongoose is connected to the database`);
});

mongoose.connection.on("error", (err) => {
  console.log(`error occurred: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log(`mongoose is disconnected from the database`);
});

// Gracefully close the database connection on SIGINT signal
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = dbConnection;
