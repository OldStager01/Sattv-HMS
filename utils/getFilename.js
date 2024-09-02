const path = require("path");
const getDate = require("../utils/getDate");
const getFilename = async (file) => {
  const date = (await getDate()).date.getTime();
  const cleanedFilename = `${file.originalname
    .trim()
    .replace(/[^\w\-_.]/g, "")}`;
  const filename = `${path.basename(
    cleanedFilename,
    path.extname(cleanedFilename)
  )}-${date}${path.extname(cleanedFilename)}`;
  return filename;
};
module.exports = getFilename;
