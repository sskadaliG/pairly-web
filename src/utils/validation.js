const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email, like you@example.com.";
  }
  return "";
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateForgotPassword = ({ email }) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return errors;
};

// Same rules as the backend's validateSignUpData
export const validateSignup = ({
  firstName,
  lastName,
  email,
  password,
  gender,
}) => {
  const errors = {};

  if (!firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }

  if (!lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = "Password is required.";
  } else if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    errors.password =
      "Use 8+ characters with an uppercase letter, a lowercase letter, a number and a symbol.";
  }

  if (!gender) {
    errors.gender = "Please select your gender.";
  }

  return errors;
};
