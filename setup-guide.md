# Google Sheets Data Entry Form - Setup Guide

This guide will walk you through setting up a complete data entry form that integrates with Google Sheets.

## 📋 Overview

The form includes:
- Responsive, accessible design
- Real-time validation
- Integration with Google Sheets via Google Apps Script
- Error handling and user feedback
- Professional styling

## 🚀 Quick Start

### Step 1: Set Up Google Sheets

1. **Create a new Google Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Click "Blank" to create a new spreadsheet
   - Name it "Form Responses" or similar
   - Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Set Up Google Apps Script

1. **Create the Apps Script project**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Name it "Form Handler" or similar

2. **Add the script code**
   - Delete the default `myFunction()`
   - Copy and paste the entire contents of `google-apps-script.js`
   - Update the configuration variables:
     ```javascript
     const SPREADSHEET_ID = 'your-actual-spreadsheet-id-here';
     const SHEET_NAME = 'Form Responses';
     ```

3. **Set up permissions**
   - Click "Save" (💾 icon)
   - Click "Run" to test the script
   - Authorize the script when prompted
   - Grant necessary permissions for Sheets and Email

4. **Deploy as web app**
   - Click "Deploy" → "New Deployment"
   - Choose "Web app" as the type
   - Set execute as: "Me"
   - Set access to: "Anyone"
   - Click "Deploy"
   - Copy the web app URL

### Step 3: Configure the Web Form

1. **Update the form configuration**
   - Open `main.js`
   - Find this line:
     ```javascript
     this.scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
     ```
   - Replace with your actual web app URL:
     ```javascript
     this.scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
     ```

### Step 4: Test the Integration

1. **Initialize the spreadsheet**
   - In Google Apps Script, run the `initializeSpreadsheet()` function
   - This creates headers and formatting

2. **Test the form**
   - Fill out the form with test data
   - Submit and verify data appears in Google Sheets
   - Check browser console for any errors

## 🛠️ Advanced Configuration

### Email Notifications (Optional)

To receive email notifications for new submissions:

1. In `google-apps-script.js`, update:
   ```javascript
   const NOTIFICATION_EMAIL = 'your-email@example.com';
   ```

2. Redeploy the web app

### Custom Validation

To add custom validation rules, modify the `validationRules` object in `main.js`:

```javascript
this.validationRules = {
  customField: {
    required: true,
    pattern: /your-regex-pattern/,
    message: 'Your custom error message'
  }
};
```

### Styling Customisation

The form uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-colour: #2563eb;     /* Main brand colour */
  --success-colour: #10b981;     /* Success messages */
  --error-colour: #ef4444;       /* Error messages */
  /* ... more variables */
}
```

## 🔧 Troubleshooting

### Common Issues

1. **"Google Apps Script URL not configured" warning**
   - Ensure you've updated the `scriptURL` in `main.js`
   - Check that the URL is correct and accessible

2. **Form submits but data doesn't appear in sheets**
   - Check Google Apps Script execution log
   - Verify spreadsheet ID is correct
   - Ensure script has proper permissions

3. **CORS errors**
   - Make sure the Apps Script is deployed as a web app
   - Check that access is set to "Anyone"

4. **Validation not working**
   - Check browser console for JavaScript errors
   - Ensure field names match between HTML and validation rules

### Testing Tools

The form includes debugging tools when running locally:

- **Test Data Button**: Automatically fills form with sample data
- **Console Logging**: Check browser console for detailed logs
- **Global Objects**: Access `window.dataEntryForm` for debugging

## 📱 Mobile Responsiveness

The form is fully responsive and includes:
- Touch-friendly input sizes (minimum 44px)
- Proper viewport scaling
- Optimised layouts for mobile, tablet, and desktop
- Accessible form controls

## ♿ Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast colour scheme
- Screen reader friendly error messages

## 🔐 Security Considerations

- Form validation on both client and server side
- Input sanitisation in Google Apps Script
- HTTPS enforcement for production
- No sensitive data stored in client-side code

## 🚀 Deployment

### Production Checklist

- [ ] Remove test/demo buttons and console logs
- [ ] Update meta tags with proper content
- [ ] Test on multiple devices and browsers
- [ ] Verify Google Apps Script is properly deployed
- [ ] Set up proper error monitoring

### Hosting Options

This form works with any static hosting provider:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Firebase Hosting

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Review the Google Apps Script execution log
3. Verify all configuration values are correct
4. Test with a simplified version first

## 🎯 Next Steps

- Integrate with Supabase for more advanced database features
- Add file upload capabilities
- Implement multi-step form wizard
- Add analytics tracking
- Set up automated testing
