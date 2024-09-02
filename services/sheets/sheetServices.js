const { GoogleSpreadsheet } = require("google-spreadsheet");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });
const { getOAuth2Client } = require("../../config/googleServiceAuth");

// Function to get the document with caching
const getDoc = async (docId) => {
  const cacheKey = `doc-${docId}`;
  if (cache.has(cacheKey)) {
    console.log(`Using cached document ${docId}`);
    return cache.get(cacheKey);
  }
  try {
    const doc = new GoogleSpreadsheet(docId, getOAuth2Client());
    await doc.loadInfo();
    cache.set(cacheKey, doc);
    console.log(`Loaded and cached document ${docId}`);
    return doc;
  } catch (error) {
    console.error("Sheet Services :: getDoc :: error :: ", error);
    throw error;
  }
};

// Function to get the sheet with caching
const getSheet = async (docId, sheetTitle) => {
  const cacheKey = `sheet-${docId}-${sheetTitle}`;
  if (cache.has(cacheKey)) {
    console.log(`Using cached sheet ${sheetTitle} from document ${docId}`);
    return cache.get(cacheKey);
  }
  try {
    const doc = await getDoc(docId);
    const sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) throw new Error("Sheet not found");
    cache.set(cacheKey, sheet);
    console.log(`Loaded and cached sheet ${sheetTitle} from document ${docId}`);
    return sheet;
  } catch (error) {
    console.error("Sheet Services :: getSheet :: error :: ", error);
    throw error;
  }
};

// Function to clear cache for a specific sheet
const invalidateSheetCache = (docId, sheetTitle) => {
  const cacheKey = `sheet-${docId}-${sheetTitle}`;
  cache.del(cacheKey);
  console.log(`Invalidated cache for ${cacheKey}`);
};

// Function to clear cache for a specific document
const invalidateDocCache = (docId) => {
  const cacheKey = `doc-${docId}`;
  cache.del(cacheKey);
  console.log(`Invalidated cache for ${cacheKey}`);
};

const createDoc = async (docTitle) => {
  try {
    if (!docTitle) throw new Error("docTitle is required");
    const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(
      getOAuth2Client(),
      { title: docTitle }
    );
    return doc.spreadsheetId;
  } catch (error) {
    console.error("Sheet Services :: createDoc :: error :: ", error);
    throw error;
  }
};

const addSheetToBook = async (docId, sheetTitle, headerValues = []) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");

    const doc = await getDoc(docId);
    const props = { title: sheetTitle };
    if (headerValues.length > 0) props.headerValues = headerValues;
    const sheet = await doc.addSheet(props);

    // Invalidate cache for this document to refresh sheets list
    invalidateDocCache(docId);
    return sheet.sheetId;
  } catch (error) {
    console.error("Sheet Services :: addSheetToBook :: error :: ", error);
    throw error;
  }
};

const getSheetData = async (docId, sheetTitle) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");

    const sheet = await getSheet(docId, sheetTitle);
    const rows = await sheet.getRows();
    const rowData = rows.map((row) => row.toObject());
    return rowData;
  } catch (error) {
    console.error("Sheet Services :: getSheetData :: error :: ", error);
    throw error;
  }
};

const setSheetHeaderRow = async (docId, sheetTitle, headerRow) => {
  try {
    if (!docId || !sheetTitle || !headerRow)
      throw new Error("docId, sheetTitle and headerRow are required");

    const sheet = await getSheet(docId, sheetTitle);
    await sheet.setHeaderRow(headerRow);

    // Invalidate cache for this sheet
    invalidateSheetCache(docId, sheetTitle);
  } catch (error) {
    console.error("Sheet Services :: setSheetHeaderRow :: error :: ", error);
    throw error;
  }
};

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

const addSheetRow = async (docId, sheetTitle, data) => {
  try {
    if (!docId || !sheetTitle || !data)
      throw new Error("docId, sheetTitle and data are required");

    const sheet = await getSheet(docId, sheetTitle);
    await sheet.addRow(data);

    // Invalidate cache for this sheet
    invalidateSheetCache(docId, sheetTitle);
  } catch (error) {
    console.error("Sheet Services :: addSheetRow :: error :: ", error);
    throw error;
  }
};

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

    // Invalidate cache for this sheet
    invalidateSheetCache(docId, sheetTitle);
    return row.toObject();
  } catch (error) {
    console.error("Sheet Services :: updateRowById :: error :: ", error);
    throw error;
  }
};

const deleteSheet = async (docId, sheetTitle) => {
  try {
    if (!docId || !sheetTitle)
      throw new Error("docId and sheetTitle are required");

    const sheet = await getSheet(docId, sheetTitle);
    await sheet.delete();

    // Invalidate cache for this sheet
    invalidateSheetCache(docId, sheetTitle);
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
