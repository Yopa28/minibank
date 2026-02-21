async function validateCreateAccount(name) {
  if (!name) {
    throw { statusCode: 400, message: "Name is required" };
  }

  if (typeof name !== "string") {
    throw { statusCode: 400, message: "Name must be a string" };
  }

  if (name.trim() === "") {
    throw { statusCode: 400, message: "Name cannot be empty" };
  }
}

module.exports = {
  validateCreateAccount
};
