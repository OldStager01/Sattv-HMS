const { google } = require("googleapis");
const { getOAuth2Client } = require("../../config/googleServiceAuth");
const fs = require("fs");

// Create a new folder
const createFolder = async (folderName, folderParent) => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });
  const folderMetadata = {
    name: folderName,
    parents: folderParent ? [folderParent] : [],
    mimeType: "application/vnd.google-apps.folder",
  };
  try {
    if (!folderName) {
      throw new Error("Folder Name is required");
    }
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });
    return folder.data.id;
  } catch (error) {
    console.error("Drive Service :: createFolder :: Error :: ", error);
    throw error;
  }
};

// Upload a file to a folder
const uploadFile = async (
  folderId,
  fileName,
  filepath,
  mimeType = "text/plain",
  readOnly = false
) => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
    contentRestrictions: readOnly ? [{ readOnly: true }] : [],
  };
  const media = {
    mimeType,
    body: fs.createReadStream(filepath),
  };
  try {
    if (!folderId || !fileName || !filepath) {
      throw new Error("Folder Id, File Name and File Path are required");
    }
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    return file.data.id;
  } catch (error) {
    console.error("Drive Service :: uploadFile :: Error :: ", error);
    throw error;
  }
};

// List all files in a folder
const listFiles = async (folderId) => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });
  try {
    if (!folderId) {
      throw new Error("Folder Id is required");
    }
    const file = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        "files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, webContentLink, thumbnailLink)",
    });
    return file.data.files;
  } catch (error) {
    console.error("Drive Service :: listFiles :: Error :: ", error);
    throw error;
  }
};

//list folders in a folder
const listFolders = async (folderId, name = "") => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });
  try {
    if (!folderId) {
      throw new Error("Folder Id is required");
    }
    let query = `mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents and trashed=false`;
    if (name) {
      query += ` and name='${name}'`;
    }
    const folders = await drive.files.list({
      q: query,
      fields: "files(id, name, mimeType)",
    });
    return folders.data.files;
  } catch (error) {
    console.error("Drive Service :: listFolders :: Error :: ", error);
    throw error;
  }
};

// Trash a file
const trashFile = async (fileId) => {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });
  try {
    if (!fileId) {
      throw new Error("File Id is required");
    }
    await drive.files.update({
      fileId: fileId,
      requestBody: {
        trashed: true,
      },
    });
  } catch (error) {
    console.error("Drive Service :: trashFile :: Error :: ", error);
    throw error;
  }
};

// Move a file to a folder
const moveFile = async (fileId, folderId) => {
  try {
    if (!fileId || !folderId) {
      console.error("File Id and Folder Id are required");
      throw new Error("File Id and Folder Id are required");
    }
    const auth = getOAuth2Client();
    const drive = google.drive({ version: "v3", auth });
    const file = await drive.files.get({
      fileId: fileId,
      fields: "parents",
    });
    const previousParents = file.data.parents.join(",");
    await drive.files.update({
      fileId: fileId,
      addParents: folderId,
      removeParents: previousParents,
      fields: "id, parents",
    });
  } catch (error) {}
};

// Add description to a file
const addDescription = async (fileId, description) => {
  try {
    if (!fileId || !description) {
      throw new Error("File Id and Properties are required");
    }
    const auth = getOAuth2Client();
    const drive = google.drive({ version: "v3", auth });
    await drive.files.update({
      fileId: fileId,
      resource: {
        description: description,
      },
      fields: "id, appProperties",
    });
  } catch (error) {
    console.error("Drive Service :: addProperties :: Error :: ", error);
    throw error;
  }
};

module.exports = {
  createFolder,
  uploadFile,
  listFiles,
  listFolders,
  trashFile,
  moveFile,
  addDescription,
};
