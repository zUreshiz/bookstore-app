export const validateUserInput = (data, isUpdate = false) => {
  const errors = [];
  const { name, email, phoneNumber, password } = data;

  // Missing field
  if (!isUpdate) {
    if (!name) errors.push("name");
    if (!email) errors.push("email");
    if (!phoneNumber) errors.push("phoneNumber");
    if (!password) errors.push("password");

    if (missingFields.length)
      errors.push(`Missing required field(s): ${missingFields.join(", ")}`);
  }

  // Email
  if (email && !validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  // Phone
  if (phoneNumber && !validator.isMobilePhone(phoneNumber, "vi-VN")) {
    errors.push("Invalid phone number");
  }

  // Password
  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return errors;
};
