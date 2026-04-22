const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Create app
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/locallink", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const businessRoutes = require("./routes/business");
app.use("/api/business", businessRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Local Link API is running...");
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});