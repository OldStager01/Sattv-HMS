//File Services Imports
const fs = require("fs");

//Utils Imports
const { getFilename } = require("../../utils");

//Drive Imports
const { uploadFile } = require("./crudDrive");

//*Function to upload files
const uploadFiles = async (files, folderId) => {
  if (files.length > 0) {
    const uploadPromise = files.map(async (file) => {
      const filename = await getFilename(file);
      return uploadFile(folderId, filename, file.path, file.mimetype, true);
    });
    //Upload files
    const fileIds = await Promise.all(uploadPromise);
    //Delete files from temp folder
    files.map((file) => {
      fs.unlinkSync(file.path);
    });
    return fileIds;
  }
};
module.exports = uploadFiles;
