export const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: 'Weak', color: 'bg-gray-200 dark:bg-gray-700' };
  
    // Criteria checks
    const hasLength = password.length >= 7;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
    // Scoring
    if (hasLength) score++;
    if (hasLower && hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
  
    // Results based on score
    switch (score) {
      case 0:
      case 1:
        return { score, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score, label: 'Fair', color: 'bg-yellow-500' };
      case 3:
        return { score, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score, label: 'Strong', color: 'bg-green-500' };
      default:
        return { score: 0, label: 'Weak', color: 'bg-gray-200 dark:bg-gray-700' };
    }
  };