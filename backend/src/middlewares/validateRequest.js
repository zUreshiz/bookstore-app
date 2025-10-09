export const validateRequest = (validator) => (req, res, next) => {
  const errors = validator(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Invalid input", errors });
  }
  next();
};
