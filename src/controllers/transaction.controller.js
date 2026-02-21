const transactionService = require("../services/transaction.service");

async function deposit(req, res, next) {
  try {
    const accountId = Number(req.params.id);
    const { amount } = req.body;
    const performedBy = req.user.id;

    const updatedAccount = await transactionService.deposit(
      accountId,
      Number(amount),
      performedBy
    );

    res.status(200).json({
      message: "Deposit successful",
      balance: updatedAccount.balance
    });
  } catch (error) {
    next(error);
  }
}

async function withdraw(req, res, next) {
  try {
    const accountId = Number(req.params.id);
    const { amount } = req.body;
    const performedBy = req.user.id;

    const updatedAccount = await transactionService.withdraw(
      accountId,
      Number(amount),
      performedBy
    );

    res.status(200).json({
      message: "Withdraw successful",
      balance: updatedAccount.balance
    });
  } catch (error) {
    next(error);
  }
}

async function transfer(req, res, next) {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;
    const performedBy = req.user.id;

    const result = await transactionService.transfer(
      Number(fromAccountId),
      Number(toAccountId),
      Number(amount),
      performedBy
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getTransactions(req, res, next) {
  try {
    const accountId = Number(req.params.id);

    const transactions =
      await transactionService.getTransactionsByAccount(accountId);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactions
};