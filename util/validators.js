module.exports.validateRegisterInputs = (
  username,
  password,
  confirmpassword,
  email,
  userType
) => {
  const errors = {}
  if (username.trim() === "") {
    errors.username = "username must not be empty"
  }
  if (email.trim() === "") {
    errors.email = "email must not be empty"
  } else {
    const RegEx = '/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/';
    if (email.match(RegEx)) {
      errors.email = "Email must be a valid adress"
    }
  }
  if (password === "") {
    errors.password = "password must not be empty"
  }
  if (password !== confirmpassword) {
    errors.password = "Password must match"
  }
  if (confirmpassword === "") {
    errors.confirmpassword = "Confirm Password must not be empty"
  }

  if (userType.trim() === "") {
    errors.userType = "User Type must not be empty"
  }

  return {
    errors,
    valid: Object.keys(errors).length
  }
}

module.exports.validateLogin = (email, password) => {
  const errors = {}
  if (email.trim() === "") {
    errors.email = "email must not be empty"
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty"
  }

  return {
    errors,
    valid: Object.keys(errors).length
  }
}

