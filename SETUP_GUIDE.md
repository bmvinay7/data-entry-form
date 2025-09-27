# 🚀 Google Apps Script Setup Guide

Follow these steps carefully to connect your web form to your Google Sheet. This is the most common point of failure, so please read each step.

## The Problem: Why It Fails

For security, web browsers block requests from one website (like your local development server) to another (like Google). This is called **CORS**. This means **your form will NOT save data to Google Sheets when running locally**. It will only work when you deploy your website to a live server.

Our code detects this and *simulates* a successful submission during local development so you can still test the form's appearance and validation.

## Step 1: Copy the Script Code

1.  Go to [script.google.com](https://script.google.com/) and click **New project**.
2.  Delete all the default code in the editor.
3.  Copy the entire content of the `google-apps-script.js` file from this project.
4.  Paste it into the Google Apps Script editor.
5.  Give your project a name, like "Data Entry Form Handler".
6.  Click the **Save project** icon (💾).

## Step 2: Deploy the Script (The Critical Step!)

This is where most errors happen.

1.  At the top right, click the blue **Deploy** button and select **New deployment**.
2.  Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3.  Configure the settings **exactly** as follows:
    *   **Description**: `Data Entry Form Handler` (or similar)
    *   **Execute as**: `Me`
    *   **Who has access**: `Anyone` 
      *(This is essential. If you choose "Anyone with Google account" or "Only myself", it will fail.)*
4.  Click **Deploy**.

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

## Step 6: What If You Change the Script?

If you ever modify your Google Apps Script (e.g., to add a new field), you **MUST re-deploy it**.

1.  Click **Deploy** -> **Manage deployments**.
2.  Select your active deployment and click the pencil icon (✏️) to edit it.
3.  From the "Version" dropdown, select **New version**.
4.  Click **Deploy**. You do not need to copy the URL again as it stays the same.

By following these steps, your form will correctly save data to your Google Sheet when you publish your website.
