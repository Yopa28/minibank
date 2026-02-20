function validateAmount(amount) {
  if (amount === undefined) {
    throw { statusCode: 400, message: "Amount is required" };
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    throw { statusCode: 400, message: "Amount must be a number" };
  }

  if (amount <= 0) {
    throw { statusCode: 400, message: "Amount must be greater than 0" };
  }
}

function validateTransfer (fromAccountId, toAccountId, amount){
    if (!fromAccountId || ! toAccountId){
        throw {statusCode: 400, message: " Both account IDs are required"};
    }

    if (fromAccountId === toAccountId) {
        throw {statusCode: 400, message : " Cannot transfer to the same account"};
    }
}


module.exports = {
  validateAmount,
  validateTransfer
};
