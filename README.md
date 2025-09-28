# Data Entry Form with Zapier Integration

A modern, responsive data entry form that submits data directly to Google Sheets via Zapier webhook integration.

## 🚀 Features

- ✅ Clean, modern UI with responsive design
- ✅ Real-time form validation with error handling
- ✅ Accessibility compliant (WCAG 2.1)
- ✅ Direct integration with Google Sheets via Zapier
- ✅ No complex backend setup required
- ✅ Reliable webhook-based data submission
- ✅ Development mode with demo tools

## 🎯 Live Demo

**Form**: https://dataentryform.vercel.app
**Google Spreadsheet**: https://docs.google.com/spreadsheets/d/1mmDRze-8_-bdztvkVqpum6vxGPVkmYFbosIbp4mFdKo

## 📁 Project Structure

```
├── index.html               # Main form page
├── style.css                # Styling and responsive design  
├── main.js                  # Form logic and Zapier integration
├── background.png           # Background image
├── test-zapier.html         # Webhook testing page
├── ZAPIER_SETUP_GUIDE.md    # Zapier setup instructions
├── ZAPIER_AGENT_PROMPT.md   # Detailed prompt for Zapier automation
└── README.md                # This file
```

## 🛠️ How It Works

1. **User fills out the form** with their information
2. **Form validates data** in real-time with helpful error messages
3. **Data is submitted** to Zapier webhook via secure HTTPS POST
4. **Zapier processes** the webhook data automatically
5. **Data appears** in Google Spreadsheet within seconds
6. **User gets confirmation** of successful submission

## ⚡ Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bmvinay7/data-entry-form.git
   cd data-entry-form
   ```

2. **Set up Zapier Integration**
   - Create a new Zap in Zapier
   - Use "Webhooks by Zapier" as trigger
   - Use "Google Sheets" as action
   - Follow detailed instructions in `ZAPIER_SETUP_GUIDE.md`

3. **Update webhook URL**
   - Copy your Zapier webhook URL
   - Update `webhookURL` in `main.js`
   - Update `WEBHOOK_URL` in `test-zapier.html`

4. **Deploy**
   - Upload to any web hosting service
   - Works with Vercel, Netlify, GitHub Pages, etc.

## 🧪 Testing

Use `test-zapier.html` to test your webhook integration:
- Open the file in your browser
- Click "Test Webhook" to verify connection
- Click "Submit to Zapier" to test form data submission

## 🔧 Development Features

The form includes development mode detection:
- **Auto-fill test data** button for quick testing
- **Test Zapier connection** button
- **Form validation testing** tools
- **CORS-friendly** local development

## 📊 Data Fields

The form captures:
- Full Name (required)
- Email Address (required)
- Phone Number (optional)
- Street Address (required)
- City (required)
- Postcode (required)
- Comments (optional)
- Timestamp (auto-generated)

## 🎨 Design Features

- **Responsive design** works on all devices
- **Modern glassmorphism** UI with beautiful background
- **Smooth animations** and transitions
- **Accessible** with proper ARIA labels and keyboard navigation
- **Error handling** with clear user feedback

## 🚀 Deployment

This form is ready to deploy to:
- ✅ **Vercel** (recommended)
- ✅ **Netlify**
- ✅ **GitHub Pages**
- ✅ **Any static hosting service**

No server-side code required - it's a pure frontend solution!

## 📝 License

MIT License - feel free to use this project for your own forms!