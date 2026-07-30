function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };
}

module.exports = asyncHandler;
