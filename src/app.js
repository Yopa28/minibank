const express = require("express");
const cors = require("cors");
require("dotenv").config();

const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");
const auditRoutes = require("./routes/audit.routes");
const authRoutes = require("./routes/auth.routes");

const authMiddleware = require("./middlewares/auth.middleware");
const rateLimit = require("./middlewares/rateLimit.middleware");
const logger = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(rateLimit({ windowMs: 60000, max: 1000 }));

// 
app.use("/api/auth", authRoutes);

// Protected API routes
app.use("/api", authMiddleware);
app.use("/api", accountRoutes);
app.use("/api", transactionRoutes);
app.use("/api", auditRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;