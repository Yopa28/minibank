function authMiddleware(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: x-user-id header required"
    });
  }

  // Simulasi user login
  req.user = {
    id: userId,
    role: userId === "admin" ? "admin" : "user"
  };

  next();
}

module.exports = authMiddleware;