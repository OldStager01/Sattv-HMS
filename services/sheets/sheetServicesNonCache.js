//Import Goodgle SpreadSheet
const { GoogleSpreadsheet } = require("google-spreadsheet");

//Import Node Cache
const NodeCache = require("node-cache");

//Import OAuth2Client
const { getOAuth2Client } = require("../../config/googleServiceAuth");

const cache = new NodeCache({ stdTTL: 3600 });

//Function to get the document
const getDoc = async (docId) => {
  let doc;
  try {
    doc = new GoogleSpreadsheet(docId, getOAuth2Client());
    await doc.loadInfo();
    cache.set(docId, doc);
  } catch (error) {
    console.error("Sheet Services :: getDoc :: error :: ", error);
    throw error;
  }
  return doc;
};

//Function to create a new document
const createDoc = async (docTitle) => {
  try {
    if (!docTitle) throw new Error("docTitle is required");
    const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(
      getOAuth2Client(),
      {
        title: docTitle,
      }
    );
    return doc.spreadsheetId;
  } catch (error) {
    console.error("Sheet Services :: createDoc :: error :: ", error);
    throw error;
  }
};

//Function to add a sheet to the document
const addSheetToBook = async (docId, sheetTitle, headerValues = []) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");

    const doc = await getDoc(docId);
    const props = { title: sheetTitle };
    if (headerValues.length > 0) props.headerValues = headerValues;
    const sheet = await doc.addSheet(props);
    return sheet.sheetId;
  } catch (error) {
    console.error("Sheet Services :: addSheetToBook :: error :: ", error);
    throw error;
  }
};

//Function to get the sheet by title from the document
const getSheet = async (docId, sheetTitle) => {
  try {
    const doc = await getDoc(docId);
    const sheet = doc.sheetsByTitle[sheetTitle];
    return sheet;
  } catch (error) {
    console.error("Sheet Services :: getSheet :: error :: ", error);
    throw error;
  }
};

//Function to get the data from the sheet
const getSheetData = async (docId, sheetTitle) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");
    const sheet = await getSheet(docId, sheetTitle);
    const rows = await sheet.getRows();
    const rowData = rows.map((row) => {
      return row.toObject();
    });
    return rowData;
  } catch (error) {
    console.error("Sheet Services :: displaySheet :: error :: ", error);
    throw error;
  }
};

//Function to set the header row of the sheet
const setSheetHeaderRow = async (docId, sheetTitle, headerRow) => {
  try {
    if (!docId || !sheetTitle || !headerRow)
      throw new Error("docId, sheetTitle and headerRow are required");
    const sheet = await getSheet(docId, sheetTitle);
    await sheet.setHeaderRow(headerRow);
  } catch (error) {
    console.error("Sheet Services :: setSheetHeaderRow :: error :: ", error);
    throw error;
  }
};

//Function to load the header row of the sheet
const loadSheetHeaderRow = async (docId, sheetTitle) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");

    const sheet = await getSheet(docId, sheetTitle);
    await sheet.loadHeaderRow();
    return sheet.headerValues;
  } catch (error) {
    console.error("Sheet Services :: loadSheetHeaderRow :: error :: ", error);
    throw error;
  }
};

//Function to add a row to the sheet
const addSheetRow = async (docId, sheetTitle, data) => {
  try {
    if (!docId || !sheetTitle || !data)
      throw new Error("docId, sheetTitle and data are required");
    const sheet = await getSheet(docId, sheetTitle);
    await sheet.addRow(data);
  } catch (error) {
    console.error("Sheet Services :: addRow :: error :: ", error);
    throw error;
  }
};

//Function to update a row by id
const updateRowById = async (docId, sheetTitle, id, data) => {
  try {
    if (!docId || !sheetTitle || !id || !data)
      throw new Error("docId, sheetTitle, id and data are required");
    const sheet = await getSheet(docId, sheetTitle);
    const rows = await sheet.getRows();
    const rowIndex = rows.findIndex((row) => row._rawData.includes(id));
    if (rowIndex === -1) throw new Error("Row not found");
    const row = rows[rowIndex];
    for (let key in data) {
      if (row._worksheet.headerValues.includes(key)) {
        row.set(key, data[key]);
      }
    }
    await row.save();
    return row.toObject();
  } catch (error) {
    console.error("Sheet Services :: updateRowById :: error :: ", error);
    throw error;
  }
};

//Function to delete a sheet
const deleteSheet = async (docId, sheetTitle) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");
    const sheet = await getSheet(docId, sheetTitle);
    await sheet.delete();
  } catch (error) {
    console.error("Sheet Services :: deleteSheet :: error :: ", error);
    throw error;
  }
};

module.exports = {
  getSheetData,
  createDoc,
  addSheetRow,
  setSheetHeaderRow,
  addSheetToBook,
  loadSheetHeaderRow,
  deleteSheet,
  updateRowById,
};
