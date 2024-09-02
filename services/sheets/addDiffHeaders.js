//Sheet Imports
const { loadSheetHeaderRow, setSheetHeaderRow } = require("./sheetServices");

//*Function to add headers to a sheet if they are not present
const addDiffHeaders = async (sheetId, sheetTitle, headers) => {
  const dest = await loadSheetHeaderRow(sheetId, sheetTitle);
  const allPresent = [...headers].every((field) => dest.includes(field));
  if (!allPresent) {
    const remainingFields = [...headers].filter(
      (field) => !dest.includes(field)
    );
    dest.push(...remainingFields);
    //Set Header Row of index sheet
    await setSheetHeaderRow(sheetId, sheetTitle, dest);
  }
};

module.exports = addDiffHeaders;
