function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      user: req.user?.id || "anonymous",
      role: req.user?.role || "unknown",
      status: res.statusCode,
      duration: `${duration}ms`
    };

    console.log(JSON.stringify(log));
  });

  next();
}

module.exports = logger;