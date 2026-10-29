const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email, like you@example.com.";
  }
  return "";
};

// Same strong password rule as the backend (validator.isStrongPassword)
const validateNewPassword = (password) => {
  if (!password) return "Password is required.";
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return "Use 8+ characters with an uppercase letter, a lowercase letter, a number and a symbol.";
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

  const passwordError = validateNewPassword(password);
  if (passwordError) errors.password = passwordError;

  if (!gender) {
    errors.gender = "Please select your gender.";
  }

  return errors;
};

export const validateResetPassword = ({ newPassword, confirmPassword }) => {
  const errors = {};

  const passwordError = validateNewPassword(newPassword);
  if (passwordError) errors.newPassword = passwordError;

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
};
