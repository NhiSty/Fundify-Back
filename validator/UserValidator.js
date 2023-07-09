module.exports = {
  validateEmail: (email) => {
    if (!email || email === '') {
      return false;
    }
    return /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(email);
  },
  validatePassword: (password) => {
    if (!password || password === '') {
      return false;
    }
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(password);
  },
};
