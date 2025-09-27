/**
 * 🚀 Google Apps Script - Form Handler (READY TO DEPLOY)
 * 
 * ✅ CONFIGURED WITH YOUR SPREADSHEET ID: 1mmDRze-8_-bdztvkVqpum6vxGPVkmYFbosIbp4mFdKo
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Copy this ENTIRE script to your Google Apps Script project
 * 2. Save the project (Ctrl+S)
 * 3. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL and update your main.js
 */

// 📝 CONFIGURATION - CONFIGURED WITH YOUR SPREADSHEET
const SPREADSHEET_ID = '1mmDRze-8_-bdztvkVqpum6vxGPVkmYFbosIbp4mFdKo'; // Your spreadsheet ID
const SHEET_NAME = 'Form Responses';
const NOTIFICATION_EMAIL = ''; // Optional: your-email@example.com

/**
 * 🔄 Handle OPTIONS requests (CORS preflight)
 * Google Apps Script automatically handles CORS when deployed as web app
 */
function doOptions() {
    return ContentService
        .createTextOutput('OK')
        .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 📥 Handle GET requests (for testing)
 * Google Apps Script automatically handles CORS for deployed web apps
 */
function doGet() {
    const response = {
        status: 'success',
        message: 'Google Apps Script is working correctly!',
        timestamp: new Date().toISOString(),
        corsEnabled: true,
        spreadsheetId: SPREADSHEET_ID,
        note: 'CORS is automatically handled by Google Apps Script when deployed as web app'
    };

    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 📤 Handle POST requests (form submissions)
 * Google Apps Script automatically handles CORS for deployed web apps
 */
function doPost(e) {
    try {
        // Parse form data
        const formData = JSON.parse(e.postData.contents);
        console.log('📝 Received form data:', formData);

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'streetAddress', 'city', 'postcode'];
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Invalid email format');
        }

        // Save to spreadsheet
        const result = saveToSpreadsheet(formData);

        if (result.success) {
            // Send notification email if configured
            if (NOTIFICATION_EMAIL) {
                sendNotification(formData, result.rowNumber);
            }

            return createResponse('success', `Data saved successfully! Row #${result.rowNumber}`, result.rowNumber);
        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        console.error('❌ Error in doPost:', error);
        return createResponse('error', error.toString());
    }
}

/**
 * 💾 Save form data to Google Spreadsheet
 */
function saveToSpreadsheet(formData) {
    try {
        // Open spreadsheet
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
        let sheet = spreadsheet.getSheetByName(SHEET_NAME);

        // Create sheet if it doesn't exist
        if (!sheet) {
            sheet = spreadsheet.insertSheet(SHEET_NAME);
            setupSheetHeaders(sheet);
        }

        // Initialize headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            setupSheetHeaders(sheet);
        }

        // Prepare row data
        const timestamp = new Date();
        const ukTimestamp = Utilities.formatDate(timestamp, 'Europe/London', 'dd/MM/yyyy HH:mm:ss');

        const rowData = [
            ukTimestamp,
            formData.fullName || '',
            formData.email || '',
            formData.phone || '',
            formData.streetAddress || '',
            formData.city || '',
            formData.postcode || '',
            formData.comments || ''
        ];

        // Add data to sheet
        const newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

        // Format the new row
        formatRow(sheet, newRow);

        console.log('✅ Data saved to row:', newRow);

        return {
            success: true,
            rowNumber: newRow,
            timestamp: timestamp
        };

    } catch (error) {
        console.error('❌ Error saving to spreadsheet:', error);
        return {
            success: false,
            error: error.toString()
        };
    }
}

/**
 * 📊 Setup spreadsheet headers
 */
function setupSheetHeaders(sheet) {
    const headers = [
        'Submission Date',
        'Full Name',
        'Email Address',
        'Phone Number',
        'Street Address',
        'City',
        'Postcode',
        'Comments'
    ];

    // Add headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);

    // Style headers
    headerRange
        .setFontWeight('bold')
        .setBackground('#4285f4')
        .setFontColor('white')
        .setFontSize(11);

    // Set column widths
    sheet.setColumnWidth(1, 150); // Date
    sheet.setColumnWidth(2, 150); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 130); // Phone
    sheet.setColumnWidth(5, 200); // Address
    sheet.setColumnWidth(6, 120); // City
    sheet.setColumnWidth(7, 100); // Postcode
    sheet.setColumnWidth(8, 250); // Comments

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('📊 Headers setup complete');
}

/**
 * 🎨 Format data row
 */
function formatRow(sheet, rowNumber) {
    const range = sheet.getRange(rowNumber, 1, 1, 8);

    // Alternate row colors
    const bgColor = rowNumber % 2 === 0 ? '#f8f9fa' : '#ffffff';
    range.setBackground(bgColor);

    // Make email clickable
    const emailCell = sheet.getRange(rowNumber, 3);
    const email = emailCell.getValue();
    if (email) {
        emailCell.setFormula(`=HYPERLINK("mailto:${email}","${email}")`);
    }
}

/**
 * 📧 Send notification email (optional)
 */
function sendNotification(formData, rowNumber) {
    if (!NOTIFICATION_EMAIL) return;

    try {
        const subject = `New Form Submission #${rowNumber}`;
        const body = `
New form submission received:

📝 Submission #${rowNumber}
📅 Date: ${new Date().toLocaleString('en-GB')}

👤 Contact Information:
• Name: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

🏠 Address:
• Street: ${formData.streetAddress}
• City: ${formData.city}
• Postcode: ${formData.postcode}

💬 Comments: ${formData.comments || 'None'}

View spreadsheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
    `;

        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
        console.log('📧 Notification sent to:', NOTIFICATION_EMAIL);

    } catch (error) {
        console.warn('⚠️ Email notification failed:', error);
    }
}

/**
 * 📤 Create API response
 * Google Apps Script automatically handles CORS for deployed web apps
 */
function createResponse(status, message, rowNumber = null) {
    const response = {
        status: status,
        message: message,
        timestamp: new Date().toISOString()
    };

    if (rowNumber) {
        response.rowNumber = rowNumber;
    }

    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🧪 Test function - Run this to verify everything works
 */
function testFormSubmission() {
    const testData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+44 7700 900123',
        streetAddress: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        comments: 'This is a test submission to verify the setup works correctly.'
    };

    console.log('🧪 Running test submission...');
    const result = saveToSpreadsheet(testData);
    console.log('🧪 Test result:', result);

    return result;
}

/**
 * 🔧 Setup function - Run this once to initialize everything
 */
function initializeEverything() {
    try {
        console.log('🔧 Initializing spreadsheet...');

        // Open and setup spreadsheet
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
        let sheet = spreadsheet.getSheetByName(SHEET_NAME);

        if (!sheet) {
            sheet = spreadsheet.insertSheet(SHEET_NAME);
        }

        // Clear and setup headers
        sheet.clear();
        setupSheetHeaders(sheet);

        // Rename spreadsheet if needed
        if (spreadsheet.getName().includes('Untitled')) {
            spreadsheet.rename('Form Responses - Data Entry');
        }

        console.log('✅ Initialization complete!');
        console.log('📊 Spreadsheet URL:', `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);

        return {
            success: true,
            message: 'Spreadsheet initialized successfully',
            url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
        };

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        return {
            success: false,
            error: error.toString()
        };
    }
}