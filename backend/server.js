const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(`mongodb+srv://hello:hello123@restaurant.8j8yw.mongodb.net/libraryManagement`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.use("/api/auth", require("./routes/authRoutes"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
