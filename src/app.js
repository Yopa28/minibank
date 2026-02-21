const express = require("express");
const accountRoutes = require("./routes/account.routes");
const errorHandler = require("./middlewares/error.middleware");
const transactionRoutes = require("./routes/transaction.routes");
const auditRoutes = require("./routes/audit.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const rateLimit = require("./middlewares/rateLimit.middleware");
const logger = require("./middlewares/logger.middleware");

const app = express();

app.use(express.json());

app.use(authMiddleware);

app.use(rateLimit({ windowMs: 60000, max: 10 }));

app.use(logger);

app.use(accountRoutes);

app.use(transactionRoutes);

app.use(errorHandler);

app.use(auditRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
