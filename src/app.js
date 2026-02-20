const express = require("express");
const accountRoutes = require("./routes/account.routes");
const errorHandler = require("./middlewares/error.middleware");
const transactionRoutes = require("./routes/transaction.routes");



const app = express();

app.use(express.json());

app.use(accountRoutes);

app.use(transactionRoutes);

app.use(errorHandler);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
