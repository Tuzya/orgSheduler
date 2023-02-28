const { google } = require('googleapis');
const { googleClient } = require('../googleServiceAuth');

const getGoogleSheet = async () =>
  google.sheets({
    version: 'v4',
    auth: await googleClient
  });

const getSheetData = async (range) => {
  const sheet = await getGoogleSheet();

  return sheet.spreadsheets.values.get({
    spreadsheetId: process.env.BONUSPOINTS_SHEET_ID,
    range
  });
};

const duplicateSheet = async ({ name, phase }) => {
  const sheet = await getGoogleSheet();

  return sheet.spreadsheets.batchUpdate({
    spreadsheetId: process.env.EXAM_SHEET_ID,
    requestBody: {
      requests: {
        duplicateSheet: {
          newSheetName: `${name}-phase-${phase}`,
          sourceSheetId: process.env.EXAM_TEMPLATE_GID
        }
      }
    }
  });
};

// some shady selector, look into lodash
const selectSheetProperties = (response) => response?.data?.replies[0].duplicateSheet.properties;

const appendDataToSheet = async (title, students) => {
  const sheet = await getGoogleSheet();

  return sheet.spreadsheets.values.append({
    spreadsheetId: process.env.EXAM_SHEET_ID,
    range: title + '!A2',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: new Array(students.length).fill('').map((_, i) => {
        const arr = new Array(7);
        arr[0] = i + 1;
        arr[1] = students[i].name;
        arr[4] = students[i].github;
        return arr;
      })
    }
  });
};

module.exports = { getSheetData, duplicateSheet, selectSheetProperties, appendDataToSheet };
