export const validateLoginLocally = (email, password) => {
  const errors = {};

  if (!email || !email) {
    errors.email = "Email is required.";
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return Object.keys(errors).length ? errors : null;
};

export const validateUserDataLocally = (user) => {
  // console.log(user);

  const errors = {};
  if (!user.first_name) {
    errors.first_name = "First name is required.";
  }

  if (!user.last_name) {
    errors.last_name = "Last name is required.";
  }

  if (!user.email) {
    errors.email = "Email is required.";
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(user.email)) {
    errors.email = "Invalid email format.";
  }

  if (user.phone != "" && !/^\+\d{1,3}\d{6,14}$/.test(user.phone)) {
    errors.phone =
      "Phone number must be in international format, e.g. +123456789.";
  }

  if (!user.birthday) {
    errors.birthday = "Birthday is required.";
  } else {
    const birthday = new Date(user.birthday);
    const now = new Date();
    const age = (now - birthday) / (1000 * 60 * 60 * 24 * 365.25);
    if (birthday > now) {
      errors.birthday = "Birthday cannot be in the future.";
    } else if (age < 18) {
      errors.birthday = "User must be at least 18 years old.";
    }
  }

  if (!user.password) {
    errors.password = "Password is required.";
  } else if (user.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (user.password != user.confirmPassword) {
    errors.confirmPassword = "Password and confirm password must be the same";
  }

  return Object.keys(errors).length ? errors : null;
};
