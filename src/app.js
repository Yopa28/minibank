const express = require("express");
const cors = require("cors");
const accountRoutes = require("./routes/account.routes");
const errorHandler = require("./middlewares/error.middleware");
const transactionRoutes = require("./routes/transaction.routes");
const auditRoutes = require("./routes/audit.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const rateLimit = require("./middlewares/rateLimit.middleware");
const logger = require("./middlewares/logger.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authMiddleware);

app.use(rateLimit({ windowMs: 60000, max: 1000 }));


app.use(logger);

app.use(accountRoutes);
app.use(transactionRoutes);
app.use(auditRoutes);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
