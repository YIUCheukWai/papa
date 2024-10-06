const express = require("express");
const mongoose = require("mongoose");
const membersRouter = require("./db/routes/members"); // Import the members routes
const cors = require("cors");
const Member = require("./db/models/member"); // Adjust the path if needed

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON requests

// Enable Mongoose debug mode
mongoose.set("debug", true);

const ATLAS_URI =
  "mongodb+srv://admin:admin@cluster28277.a2m05.mongodb.net/memberDB?retryWrites=true&w=majority&appName=Cluster28277";

// Function to start the server after MongoDB connection
const startServer = async () => {
  try {
    // Use async/await to wait for the connection to be established
    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");

    // Start the server after MongoDB is connected
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if the connection fails
  }
};

// Use members routes
app.use("/api/members", membersRouter);

// Call the function to start the server
startServer();
