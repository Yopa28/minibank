const transactionService = require("../services/transaction.service");

async function deposit(req, res, next) {
  try {
    const accountId = Number(req.params.id);
    const { amount } = req.body;

    const updatedAccount = transactionService.deposit(accountId, amount);

    res.status(200).json({
      message: "Deposit successful",
      balance: updatedAccount.balance
    });
  } catch (error) {
    next(error);
  }
}

async function withdraw (req, res, next){
    try {
        const accountId = Number (req.params.id);
        const {amount} = req.body;

    const updateAccount = transactionService.withdraw(accountId, amount);

    res.status(200).json({
        message : " Withdraw Succesfull",
        balance : updateAccount.balance
    });
    } catch (error){
        next (error);
    }
}

async function transfer(req, res, next){
    try{
        const {fromAccountId, toAccountId, amount} = req.body;

        const result = transactionService.transfer(
        Number(fromAccountId),
        Number(toAccountId),
        Number(amount)
        );


        res.status(200).json(result);
        } catch (error){
            next (error);
        }
    }


async function getTransactions(req, res, next){
    try {
        const accountId = Number(req.params.id);

    const transactions = 
        transactionService.getTranscationsByAccount(accountId);

    res.status(200).json(transactions);   
    } catch (error){
        next (error);
    }
}


module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactions
};
