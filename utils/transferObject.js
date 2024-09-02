const transferObject = (src, destFields) => {
  const srcFields = Object.keys(src);
  const commonFields = srcFields.filter((field) => destFields.includes(field));
  const obj = {};
  commonFields.forEach((field) => {
    obj[field] = src[field];
  });
  return obj;
};
module.exports = transferObject;
