// This is a Vercel Serverless Function that acts as a proxy to Google Apps Script
// It forwards requests and adds the necessary CORS headers

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxagsZQktsFRbsarrjFDnA27cDx3ak2BReFz-AVk17Y8IhMlFjiEKeALaiCp5aatXT4xA/exec';

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request for debugging
    console.log('Received request with body:', req.body);

    // Forward the request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script error:', errorText);
      return res.status(response.status).json({ 
        error: 'Error from Google Apps Script',
        details: errorText 
      });
    }

    // Get the response from Google Apps Script
    const data = await response.json();
    console.log('Response from Google Apps Script:', data);

    // Send the response back to the client
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
