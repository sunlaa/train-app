const maskEmail = (email: string) => {
  const emailParts = email.split('@');
  const domain = emailParts[1];
  let name = emailParts[0];
  if (name.length > 2) {
    name = `${name[0]}*****${name[name.length - 1]}`;
  }
  return `${name}@${domain}`;
};

export default maskEmail;
