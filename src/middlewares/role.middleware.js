function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: insufficient role"
      });
    }

    next();
  };
}

module.exports = requireRole;