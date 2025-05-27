const express = require("express");
const app = express();
const cors = require("cors");
const authenticateToken = require("./middlewares/Authentication");
const { configDotenv } = require("dotenv");
configDotenv();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
const AuthRouter = require("./routes/authRoutes");
const journalRouter = require("./routes/journalRoutes");

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
app.use("/api/auth", AuthRouter);
app.use("/api/journal", journalRouter);

app.listen(3000, () => {
  console.log("Backend server is running on http://localhost:3000");
});
