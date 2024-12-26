const validateRequest = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    const parsedSchema = schema.validate(req, options);
    if (parsedSchema?.error) {
      return res.status(400).json({
        message:
          "Validation Error: " +
          parsedSchema.error.details
            .map((x) =>
              x.message
                .replace("body.", "")
                .replace("params.", "")
                .replace("query.", "")
            )
            .join(", "),
      });
    } else {
      req = parsedSchema.value;
      next();
    }
  };
};

module.exports = { validateRequest };
