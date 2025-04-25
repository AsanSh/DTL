const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// Initialize Google Sheets API
const initializeGoogleSheets = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw error;
  }
};

// Export requests to Google Sheets
router.post('/export-to-sheets', auth, async (req, res) => {
  try {
    // Get all requests
    const requests = await Request.find({}).populate('created_by', 'name email');

    // Format data for Google Sheets
    const data = requests.map(request => [
      request._id.toString(),
      request.created_by.name,
      request.created_by.email,
      request.logistics_company,
      request.cargo_type,
      request.loading_location,
      request.unloading_location,
      new Date(request.loading_date).toLocaleDateString(),
      new Date(request.unloading_date).toLocaleDateString(),
      request.status,
      new Date(request.createdAt).toLocaleDateString(),
      new Date(request.updatedAt).toLocaleDateString()
    ]);

    // Add headers
    const headers = [
      'ID',
      'Created By Name',
      'Created By Email',
      'Logistics Company',
      'Cargo Type',
      'Loading Location',
      'Unloading Location',
      'Loading Date',
      'Unloading Date',
      'Status',
      'Created At',
      'Updated At'
    ];
    data.unshift(headers);

    // Initialize Google Sheets
    const sheets = initializeGoogleSheets();

    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Requests Export ${new Date().toLocaleDateString()}`
        }
      }
    });

    // Write data to the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet.data.spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource: {
        values: data
      }
    });

    // Make the spreadsheet publicly readable
    await sheets.permissions.create({
      fileId: spreadsheet.data.spreadsheetId,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    });

    res.json({
      success: true,
      message: 'Data exported successfully',
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}`
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error exporting data',
      error: error.message 
    });
  }
});

module.exports = router; 