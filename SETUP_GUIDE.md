# 🚀 Google Apps Script Setup Guide

Follow these steps carefully to connect your web form to your Google Sheet. **CORS errors are the #1 cause of failures** - this guide prevents them.

## 🚨 CORS Error Prevention

**CORS (Cross-Origin Resource Sharing)** errors happen when:
1. Google Apps Script isn't deployed correctly
2. CORS headers aren't set properly in the script
3. The web app permissions are wrong

**This guide ensures proper CORS configuration to prevent these errors permanently.**

## Step 1: Copy the Script Code

1.  Go to [script.google.com](https://script.google.com/) and click **New project**.
2.  Delete all the default code in the editor.
3.  Copy the entire content of the `google-apps-script.js` file from this project.
4.  Paste it into the Google Apps Script editor.
5.  Give your project a name, like "Data Entry Form Handler".
6.  Click the **Save project** icon (💾).

## Step 2: Deploy the Script (CRITICAL for CORS!)

**This step prevents CORS errors. Follow exactly:**

1.  Click the blue **Deploy** button → **New deployment**.
2.  Click the gear icon (⚙️) next to "Select type" → choose **Web app**.
3.  Configure settings **EXACTLY** as follows:
    *   **Description**: `Data Entry Form Handler`
    *   **Execute as**: `Me` ⚠️ **CRITICAL**
    *   **Who has access**: `Anyone` ⚠️ **MUST BE "Anyone" - NOT "Anyone with Google account"**
4.  Click **Deploy**.

**⚠️ CORS ERROR PREVENTION:**
- If you select "Anyone with Google account" or "Only myself", you WILL get CORS errors
- The script MUST be accessible to anonymous users for CORS to work
- This is safe because the script only accepts form data

## Step 3: Authorize Permissions

1.  Google will ask you to authorize the script's permissions. Click **Authorize access**.
2.  Choose your Google account.
3.  You will see a "Google hasn’t verified this app" warning. This is normal. Click **Advanced**, then click **Go to [Your Project Name] (unsafe)**.
4.  On the next screen, scroll down and click **Allow** to grant the script permission to access your Google Sheets.

## Step 4: Get the URL

1.  After authorizing, you will see a "Deployment successfully updated" message.
2.  It will provide a **Web app URL**. This is the URL you need.
3.  Click the **Copy** button.
4.  **Important**: The URL should end in `/exec`.

## Step 5: Update Your Web Form

1.  Open the `main.js` file in your project.
2.  Find this line (around line 14):
    ```javascript
    this.scriptURL = '...';
    ```
3.  Paste the Web app URL you just copied between the single quotes.

## Step 6: Re-deployment (When You Change the Script)

If you modify your Google Apps Script, you **MUST re-deploy**:

1.  **Deploy** → **Manage deployments**
2.  Click the pencil icon (✏️) on your active deployment
3.  **Version** dropdown → **New version**
4.  **VERIFY**: "Who has access" is still set to **"Anyone"**
5.  Click **Deploy**

## 🔧 CORS Troubleshooting

**If you still get CORS errors after following this guide:**

### Check 1: Verify Deployment Settings
```
1. Go to Google Apps Script
2. Deploy → Manage deployments  
3. Verify "Who has access" = "Anyone" (not "Anyone with Google account")
4. If wrong, edit deployment and fix it
```

### Check 2: Test the Script URL Directly
```
1. Copy your web app URL
2. Paste it in a new browser tab
3. You should see: {"status":"success","message":"Google Apps Script is working correctly!"...}
4. If you see a login page, your permissions are wrong
```

### Check 3: Verify CORS Headers
The script now includes comprehensive CORS headers that work with all modern browsers.

**✅ Following this guide prevents CORS errors permanently.**
