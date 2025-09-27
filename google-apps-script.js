/**
 * Google Apps Script Code
 * This file should be copied to your Google Apps Script project
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Save the project with name "Data Entry Form Handler"
 * 5. Deploy as web app (Instructions below)
 * 6. Copy the web app URL to your main.js file
 */

// Configuration - Updated with your spreadsheet ID
const SPREADSHEET_ID = '1nATvrEfrTrS22K5AjZ9Q0hL_XHRJHCMVaRAqItYtlE0';
const SHEET_NAME = 'Form Responses';

// Define CORS headers for reuse
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main function to handle POST requests from the web form
 */
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received POST request:', e);
    console.log('Form data:', e.parameter);
    
    // Get the form data
    const formData = e.parameter;
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.streetAddress || !formData.city || !formData.postcode) {
      console.error('Missing required fields:', formData);
      return createErrorResponse('Missing required fields. Please fill in all required fields.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error('Invalid email format:', formData.email);
      return createErrorResponse('Invalid email format');
    }
    
    // Add data to spreadsheet
    const result = addToSpreadsheet(formData);
    
    if (result.success) {
      console.log('Data added successfully to row:', result.rowNumber);
      return createSuccessResponse('Data submitted successfully! Thank you for your information.', result.rowNumber);
    } else {
      console.error('Failed to add data to spreadsheet:', result.error);
      return createErrorResponse(result.error);
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createErrorResponse('Internal server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  const response = {
    status: 'success',
    message: 'Google Apps Script is working correctly!',
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME
  };
  
  output.setContent(JSON.stringify(response));
  return output;
}

/**
 * Add form data to Google Spreadsheet
 */
function addToSpreadsheet(formData) {
  try {
    console.log('Attempting to open spreadsheet with ID:', SPREADSHEET_ID);
    
    // Open the spreadsheet by ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('Sheet not found, creating new sheet:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      initializeSheetHeaders(sheet);
    }
    
    // Check if headers exist (in case sheet was created manually)
    const lastRow = sheet.getLastRow();
    console.log('Current last row:', lastRow);
    
    if (lastRow === 0) {
      console.log('No headers found, initializing...');
      initializeSheetHeaders(sheet);
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    
    const rowData = [
      formattedTimestamp,
      formData.fullName || '',
      formData.email || '',
      formData.phone || '',
      formData.streetAddress || '',
      formData.city || '',
      formData.postcode || '',
      formData.comments || ''
    ];
    
    console.log('Prepared row data:', rowData);
    
    // Add the data to the sheet
    const newRowNumber = sheet.getLastRow() + 1;
    console.log('Adding data to row:', newRowNumber);
    
    const range = sheet.getRange(newRowNumber, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    // Format the new row
    formatDataRow(sheet, newRowNumber, rowData.length);
    
    // Auto-resize columns if needed
    if (newRowNumber === 2) { // First data row
      sheet.autoResizeColumns(1, rowData.length);
    }
    
    // Log success
    console.log('Data added successfully to row:', newRowNumber);
    
    // Send email notification (optional)
    try {
      sendNotificationEmail(formData, newRowNumber);
    } catch (emailError) {
      console.warn('Email notification failed:', emailError);
      // Don't fail the whole operation if email fails
    }
    
    return {
      success: true,
      rowNumber: newRowNumber,
      timestamp: timestamp,
      data: rowData
    };
    
  } catch (error) {
    console.error('Error adding to spreadsheet:', error);
    console.error('Error details:', error.toString());
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: 'Failed to save data: ' + error.toString()
    };
  }
}

/**
 * Initialize sheet with headers and formatting
 */
function initializeSheetHeaders(sheet) {
  const headers = [
    'Submission Date',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Street Address',
    'City',
    'Postcode',
    'Additional Comments'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2563eb');
  headerRange.setFontColor('white');
  headerRange.setFontSize(11);
  headerRange.setBorder(true, true, true, true, true, true, 'white', SpreadsheetApp.BorderStyle.SOLID);
  
  // Set column widths
  sheet.setColumnWidth(1, 140); // Timestamp
  sheet.setColumnWidth(2, 150); // Full Name
  sheet.setColumnWidth(3, 220); // Email
  sheet.setColumnWidth(4, 130); // Phone
  sheet.setColumnWidth(5, 200); // Street Address
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 100); // Postcode
  sheet.setColumnWidth(8, 250); // Comments
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('Sheet headers initialized');
}

/**
 * Format data rows for better readability
 */
function formatDataRow(sheet, rowNumber, columnCount) {
  const dataRange = sheet.getRange(rowNumber, 1, 1, columnCount);
  
  // Alternate row colours
  if (rowNumber % 2 === 0) {
    dataRange.setBackground('#f8fafc');
  } else {
    dataRange.setBackground('#ffffff');
  }
  
  // Add borders
  dataRange.setBorder(true, true, true, true, true, true, '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID);
  
  // Format email as link
  const emailCell = sheet.getRange(rowNumber, 3);
  const emailValue = emailCell.getValue();
  if (emailValue) {
    emailCell.setFormula(`=HYPERLINK("mailto:${emailValue}","${emailValue}")`);
  }
}

/**
 * Send email notification when new data is submitted (optional)
 */
function sendNotificationEmail(formData, rowNumber) {
  try {
    // Configuration - update with your email
    const NOTIFICATION_EMAIL = 'your-email@example.com';
    
    if (!NOTIFICATION_EMAIL || NOTIFICATION_EMAIL === 'your-email@example.com') {
      console.log('Email notification skipped - no email configured');
      return;
    }
    
    const subject = `New Form Submission #${rowNumber} - Data Entry Form`;
    const htmlBody = `
    <h2>New Form Submission Received</h2>
    <p><strong>Submission #:</strong> ${rowNumber}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-GB')}</p>
    
    <h3>Contact Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${formData.fullName}</li>
      <li><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></li>
      <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
    </ul>
    
    <h3>Address:</h3>
    <ul>
      <li><strong>Street:</strong> ${formData.streetAddress}</li>
      <li><strong>City:</strong> ${formData.city}</li>
      <li><strong>Postcode:</strong> ${formData.postcode}</li>
    </ul>
    
    ${formData.comments ? `<h3>Comments:</h3><p>${formData.comments}</p>` : ''}
    
    <p><a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}" target="_blank">View in Google Sheets</a></p>
    `;
    
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
    
    console.log('Notification email sent to:', NOTIFICATION_EMAIL);
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't fail the whole operation if email fails
  }
}

/**
 * Create success response
 */
function createSuccessResponse(message, rowNumber) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  const response = {
    status: 'success',
    message: message,
    rowNumber: rowNumber,
    timestamp: new Date().toISOString()
  };
  
  output.setContent(JSON.stringify(response));
  // Use withHeaders for Apps Script responses
  return output.withHeaders(CORS_HEADERS);
}

/**
 * Create error response
 */
function createErrorResponse(errorMessage) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  const response = {
    status: 'error',
    message: errorMessage,
    timestamp: new Date().toISOString()
  };
  
  output.setContent(JSON.stringify(response));
  // Use withHeaders for Apps Script responses
  return output.withHeaders(CORS_HEADERS);
}

/**
 * Test function to verify the script works
 */
function testScript() {
  console.log('Starting test...');
  
  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '+44 7700 900123',
    streetAddress: '123 Test Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    comments: 'This is a test submission to verify the integration works correctly.'
  };
  
  const result = addToSpreadsheet(testData);
  console.log('Test result:', result);
  
  return result;
}

/**
 * Manual function to initialize the spreadsheet with proper formatting
 */
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('Created new sheet:', SHEET_NAME);
    } else {
      console.log('Sheet already exists:', SHEET_NAME);
    }
    
    // Clear existing content and reinitialize
    sheet.clear();
    initializeSheetHeaders(sheet);
    
    // Rename the spreadsheet if it's still "Untitled"
    if (spreadsheet.getName() === 'Untitled spreadsheet') {
      spreadsheet.rename('Data Entry Form Responses');
    }
    
    console.log('Spreadsheet setup completed successfully');
    console.log('Spreadsheet URL:', `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
    
    return { 
      success: true, 
      message: 'Spreadsheet initialized successfully',
      url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
    };
    
  } catch (error) {
    console.error('Error setting up spreadsheet:', error);
    return { success: false, error: error.toString() };
  }
}
