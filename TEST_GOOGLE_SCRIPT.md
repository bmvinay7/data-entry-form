# 🧪 Test Your Google Apps Script

## 🎯 **Step 1: Test the Script Function Directly**

1. **Go to Google Apps Script**: https://script.google.com
2. **Open your project**
3. **In the function dropdown at the top, select `testFormSubmission`**
4. **Click the Run button** (▶️ play button)
5. **Check the execution log** for any errors
6. **Go to your spreadsheet** and refresh - you should see test data

## 🎯 **Step 2: Initialize the Spreadsheet**

If the test function doesn't work, try this:

1. **In the function dropdown, select `initializeEverything`**
2. **Click Run** (▶️)
3. **This will set up the spreadsheet headers**
4. **Then try `testFormSubmission` again**

## 🎯 **Step 3: Check What You Should See**

After running `testFormSubmission`, your spreadsheet should have:
- **Headers**: Submission Date, Full Name, Email Address, Phone Number, Street Address, City, Postcode, Comments
- **Test Data**: Test User, test@example.com, +44 7700 900123, 123 Test Street, London, SW1A 1AA, etc.

## 🚨 **If You Get Errors**

Common errors and fixes:

### Error: "Exception: Invalid argument: spreadsheetId"
- **Problem**: Wrong spreadsheet ID
- **Fix**: Double-check the ID in your script matches your spreadsheet

### Error: "Exception: You do not have permission to call SpreadsheetApp.openById"
- **Problem**: Permission issue
- **Fix**: Make sure you own the spreadsheet

### Error: "Exception: The coordinates or dimensions of the range are invalid"
- **Problem**: Sheet structure issue
- **Fix**: Run `initializeEverything` first

## 🎯 **Expected Result**

If everything works correctly:
1. **Function runs without errors**
2. **Execution log shows "✅ Data saved to row: 2"**
3. **Your spreadsheet gets a new row with test data**
4. **Headers are properly formatted (blue background, white text)**

---

**Try running `testFormSubmission` in Google Apps Script and let me know what happens! 🚀**