const requestMap = new Map();

function rateLimit({ windowMs, max }) {
  return function (req, res, next) {
    const userId = req.user?.id || "anonymous";
    const now = Date.now();

    if (!requestMap.has(userId)) {
      requestMap.set(userId, []);
    }

    const timestamps = requestMap.get(userId);

    // Hapus request lama di luar window
    const filtered = timestamps.filter(
      ts => now - ts < windowMs
    );

    filtered.push(now);
    requestMap.set(userId, filtered);

    if (filtered.length > max) {
      return res.status(429).json({
        status: "error",
        message: "Too many requests. Please try again later."
      });
    }

    next();
  };
}

module.exports = rateLimit;