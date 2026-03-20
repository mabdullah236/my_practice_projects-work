// Email validation
export function validateEmail(email) {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";

  return "";
}

// Password validation
export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}
// Name validation
export function validateName(name) {
  if (!name) return "Name is required";
  if (name.length < 3) return "Name must be at least 3 characters";
  return "";
}

// Phone validation
export function validatePhone(phone) {
  if (!phone) return "Phone number is required";
  if (!/^[0-9]{10,13}$/.test(phone))
    return "Phone must be 10 to 13 digits";
  return "";
}
// Message validation
export function validateMessage(msg) {
  if (!msg) return "Message is required";
  if (msg.length < 5) return "Message must be at least 5 characters";
  return "";
}
