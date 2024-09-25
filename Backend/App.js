const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
const connectDB = require("./config/dbconfig");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser()); // Add this line to parse cookies
app.use("/uploads", express.static("uploads"));

// Use the new route files
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Starting the server and database
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is listening at http://localhost:${port}`);
});