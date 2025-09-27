# 🔍 Debug Google Apps Script

## 🚨 Issue: Form Submits But No Data in Spreadsheet

The form is submitting and resetting, but no data appears in Google Sheets. This means:
1. **Frontend thinks submission worked** (form resets)
2. **Data isn't reaching Google Apps Script** properly
3. **Or Google Apps Script isn't saving data** to the spreadsheet

## 🧪 Debug Steps

### Step 1: Test Google Apps Script Functions Directly

1. **Go to your Google Apps Script**: https://script.google.com
2. **Open your project**
3. **In the function dropdown, select `testFormSubmission`**
4. **Click the Run button** (▶️)
5. **Check the execution log** for any errors
6. **Check your Google Spreadsheet** - should see test data

### Step 2: Check Execution Logs

1. **In Google Apps Script, click "Executions"** (left sidebar)
2. **Look for recent executions** when you submitted the form
3. **Click on any execution** to see logs
4. **Look for errors** or missing data

### Step 3: Test Direct Form Submission

1. **Open `test-direct-submission.html`** in your browser
2. **Click "Test Direct Submission"**
3. **Check your Google Spreadsheet** immediately
4. **If data appears**: Frontend issue
5. **If no data**: Google Apps Script issue

## 🔧 Possible Issues & Fixes

### Issue 1: Spreadsheet ID Wrong
**Check**: Is the spreadsheet ID `1mmDRze-8_-bdztvkVqpum6vxGPVkmYFbosIbp4mFdKo` correct?
**Fix**: Verify the ID matches your actual spreadsheet

### Issue 2: Sheet Name Wrong
**Check**: Does your spreadsheet have a sheet named "Form Responses"?
**Fix**: Either rename your sheet or update the script

### Issue 3: Permissions Issue
**Check**: Can the script access your spreadsheet?
**Fix**: Make sure you own both the script and spreadsheet

### Issue 4: Script Not Receiving Data
**Check**: Are the form field names correct?
**Fix**: Ensure field names match: fullName, email, streetAddress, city, postcode

## 🎯 Quick Test

**Run this in Google Apps Script console**:
```javascript
// Test the saveToSpreadsheet function directly
const testData = {
  fullName: 'Console Test',
  email: 'console@test.com',
  streetAddress: '123 Console St',
  city: 'Console City',
  postcode: 'CON 123',
  comments: 'Direct console test'
};

const result = saveToSpreadsheet(testData);
console.log('Result:', result);
```

**Expected**: Data should appear in your spreadsheet immediately.

---

**Follow these steps to identify where the data is getting lost! 🔍**