class Validator {
  validateUsername(text) {
    text = text.replace(/\s/g, '').toLowerCase();
    return /^[A-Za-z0-9]{4,100}$/.test(text) ? text : false;
  }

  validateFullName(text) {
    text = text
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/\b[a-z]/g, match => match.toUpperCase());
    return /^[A-Za-z ]{4,100}$/.test(text) ? text : false;
  }

  validateEmail(text) {
    text = text.replace(/\s/g, '').toLowerCase();
    return /^[A-Za-z0-9 ]+@[A-Za-z0-9 ]+\.[A-Za-z ]+$/.test(text)
      ? text
      : false;
  }

  validiatePhoneNumber(text) {
    text = text.replace(/\s/g, '');
    return /^[+][0-9]{12}$/.test(text) ? text : false;
  }

  validatePassword(text) {
    text = text.replace(/\s/g, '');
    return text.length >= 6 && text.length <= 256 ? text : false;
  }

  validateMealAttribute(text) {
    text = text.replace(/\s+/g, ' ');
    return text.length >= 4 && text.length <= 100 ? text : false;
  }

  validateDescription(text) {
    text = text.replace(/\s+/g, ' ').trim();
    return text.length >= 10 && text.length <= 500 ? text : false;
  }
}

export default new Validator();
