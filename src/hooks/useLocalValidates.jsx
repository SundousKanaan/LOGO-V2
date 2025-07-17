export const validateLoginLocally = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  if (!password || password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return Object.keys(errors).length ? errors : null;
};
